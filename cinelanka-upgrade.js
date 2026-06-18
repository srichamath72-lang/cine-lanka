// cinelanka-upgrade.js (v2)
// 100% SAFE / ADDITIVE. Does NOT edit, delete, or touch index.html.
// Fixes from v1:
//  - More reliable poster matching (logs failures to console for debugging)
//  - Removes the duplicate year (only shows it once per card)
//  - Hero section text replaced safely

(function () {
  var TMDB_KEY = "7b4c9174531b7e8770e7b887ce7de165";
  var IMG_BASE = "https://image.tmdb.org/t/p/w342";
  var posterCache = {};

  function safe(fn, label) {
    try { fn(); } catch (e) { console.error("cinelanka-upgrade [" + label + "]:", e); }
  }

  /* ---------- 1) Hero text replace ---------- */

  function upgradeHero() {
    var heroTitle = document.querySelector(".hero-title");
    var heroDesc = document.querySelector(".hero-desc");
    if (!heroTitle || !heroDesc) return;
    if (heroTitle.getAttribute("data-upgraded") === "1") return;

    heroTitle.textContent = "Discover Your Next Favorite Film";
    heroDesc.textContent = "Browse thousands of movies from Sri Lanka and around the world - real posters, real ratings, updated live.";
    heroTitle.setAttribute("data-upgraded", "1");

    var heroTags = document.querySelector(".hero-tags");
    var heroMeta = document.querySelector(".hero-meta");
    var heroBtns = document.querySelector(".hero-btns");
    if (heroTags) heroTags.style.display = "none";
    if (heroMeta) heroMeta.style.display = "none";
    if (heroBtns) heroBtns.style.display = "none";
  }

  /* ---------- 2) Remove duplicate year on cards ---------- */

  function dedupeYears() {
    document.querySelectorAll(".card-sub").forEach(function (el) {
      if (el.getAttribute("data-deduped") === "1") return;
      el.setAttribute("data-deduped", "1");
      // card-sub originally shows "YEAR · GENRE" - keep only the genre part
      var parts = el.textContent.split("·");
      if (parts.length > 1) {
        el.textContent = parts.slice(1).join("·").trim();
      } else {
        el.style.display = "none";
      }
    });

    // Shrink the year text shown on the poster itself (top corner / overlay)
    document.querySelectorAll(".poster-year").forEach(function (el) {
      if (el.getAttribute("data-resized") === "1") return;
      el.setAttribute("data-resized", "1");
      el.style.fontSize = "9px";
      el.style.opacity = "0.7";
    });
  }

  /* ---------- 3) Fetch + apply real posters ---------- */

  function fetchPoster(title, year) {
    var key = (title + "_" + (year || "")).toLowerCase();
    if (posterCache[key] !== undefined) return Promise.resolve(posterCache[key]);

    var url = "https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_KEY +
      "&query=" + encodeURIComponent(title) + (year ? "&year=" + year : "");

    return fetch(url)
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var first = data.results && data.results[0];
        var full = first && first.poster_path ? IMG_BASE + first.poster_path : null;
        posterCache[key] = full;
        if (!full) console.warn("No TMDB poster found for:", title, year);
        return full;
      })
      .catch(function (e) {
        console.error("TMDB fetch failed for:", title, e);
        return null;
      });
  }

  function applyImage(box, url) {
    if (!box || !url) return;
    box.style.backgroundImage = "url('" + url + "')";
    box.style.backgroundSize = "cover";
    box.style.backgroundPosition = "center";
    // Fade out the emoji/icon layer if present (first child div with text)
    var children = box.children;
    for (var i = 0; i < children.length; i++) {
      if (children[i].textContent && children[i].textContent.trim() === "🎬") {
        children[i].style.opacity = "0";
      }
    }
  }

  function applyRealPosters() {
    // Card posters (grid view)
    document.querySelectorAll(".poster-wrap").forEach(function (wrap) {
      try {
        var bg = wrap.querySelector(".poster-bg");
        if (!bg || bg.getAttribute("data-poster-done") === "1") return;

        var titleEl = wrap.querySelector(".poster-title");
        if (!titleEl) return;
        var title = titleEl.textContent.trim();
        if (!title) return;

        var yearEl = wrap.querySelector(".poster-year");
        var year = yearEl ? (yearEl.textContent.match(/\d{4}/) || [])[0] : null;

        bg.setAttribute("data-poster-done", "1");
        fetchPoster(title, year).then(function (url) { applyImage(bg, url); });
      } catch (e) { console.error("Card poster error:", e); }
    });

    // Modal poster (when a movie detail popup is open)
    document.querySelectorAll(".modal-hero").forEach(function (hero) {
      try {
        if (hero.getAttribute("data-poster-done") === "1") return;
        var titleEl = hero.querySelector(".modal-title");
        if (!titleEl) return;
        var title = titleEl.textContent.trim();
        if (!title) return;

        var metaEl = hero.parentElement ? hero.parentElement.querySelector(".modal-meta") : null;
        var year = metaEl ? (metaEl.textContent.match(/\d{4}/) || [])[0] : null;

        hero.setAttribute("data-poster-done", "1");
        fetchPoster(title, year).then(function (url) { applyImage(hero, url); });
      } catch (e) { console.error("Modal poster error:", e); }
    });
  }

  /* ---------- Run safely, repeatedly (for re-renders) ---------- */

  function runAll() {
    safe(upgradeHero, "hero");
    safe(dedupeYears, "dedupe-years");
    safe(applyRealPosters, "posters");
  }

  function start() {
    runAll();
    setInterval(runAll, 1500);
  }

  if (document.readyState === "complete") {
    setTimeout(start, 1200);
  } else {
    window.addEventListener("load", function () { setTimeout(start, 1200); });
  }
})();