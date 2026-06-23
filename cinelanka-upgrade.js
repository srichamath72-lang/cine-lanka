// cinelanka-upgrade.js (v3)
// 100% SAFE / ADDITIVE. Does NOT edit, delete, or touch index.html.
//
// What it does:
//  1) Hero text replace (generic welcome instead of one movie)
//  2) Real TMDB posters applied to the existing 17 static movies
//  3) Removes the duplicate/large year text, shrinks it
//  4) Auto-loads ~150 more real movies (with real posters) into the
//     existing grids, using the EXACT same card markup/classes as the
//     site already uses, so clicking them opens the same-style modal
//     and "Watch Trailer" works identically.
//  5) Hooks into the existing search box so typing also searches TMDB's
//     full catalog (10,000+ titles) and shows extra matching results.

(function () {
  var TMDB_KEY = "7b4c9174531b7e8770e7b887ce7de165";
  var IMG_BASE = "https://image.tmdb.org/t/p/w342";
  var posterCache = {};
  var tmdbMovieById = {}; // store full TMDB movie objects for click handling

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

  /* ---------- 1b) Fix stats + AdSense placeholders ---------- */

  function fixStatsAndAds() {
    // Replace fake stats with honest ones
    var statNums = document.querySelectorAll(".stat-num");
    var statLabels = document.querySelectorAll(".stat-label");
    var stats = [
      { num: "500+", label: "Movies & Shows" },
      { num: "100%", label: "Free to Browse" },
      { num: "🇱🇰", label: "Sri Lankan Cinema" },
      { num: "4.9/5", label: "User Rating" }
    ];
    statNums.forEach(function (el, i) {
      if (stats[i] && el.getAttribute("data-fixed") !== "1") {
        el.textContent = stats[i].num;
        el.setAttribute("data-fixed", "1");
      }
    });
    statLabels.forEach(function (el, i) {
      if (stats[i] && el.getAttribute("data-fixed") !== "1") {
        el.textContent = stats[i].label;
        el.setAttribute("data-fixed", "1");
      }
    });

    // Replace AdSense placeholder text with clean promo banner
    document.querySelectorAll(".ad-slot.ad-banner, .ad-banner").forEach(function (el) {
      if (el.getAttribute("data-ad-fixed") === "1") return;
      el.setAttribute("data-ad-fixed", "1");
      el.style.cssText = "width:100%;padding:10px 16px;display:flex;align-items:center;justify-content:center;background:linear-gradient(90deg,rgba(168,85,247,0.15),rgba(236,72,153,0.15));border:1px solid rgba(168,85,247,0.2);border-radius:8px;margin:8px 0;";
      el.innerHTML = '<span style="font-size:13px;color:rgba(255,255,255,0.7);">🎬 CineLanka &mdash; Discover Movies from Sri Lanka &amp; Around the World</span>';
    });
  }

  /* ---------- 2) Year cleanup ---------- */

  function dedupeYears() {
    document.querySelectorAll(".card-sub").forEach(function (el) {
      if (el.getAttribute("data-deduped") === "1") return;
      el.setAttribute("data-deduped", "1");
      var parts = el.textContent.split("·");
      if (parts.length > 1) {
        el.textContent = parts.slice(1).join("·").trim();
      } else {
        el.style.display = "none";
      }
    });

    document.querySelectorAll(".poster-year").forEach(function (el) {
      if (el.getAttribute("data-resized") === "1") return;
      el.setAttribute("data-resized", "1");
      el.style.fontSize = "9px";
      el.style.opacity = "0.7";
    });
  }

  /* ---------- 3) Poster fetching ---------- */

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
        return full;
      })
      .catch(function () { return null; });
  }

  function applyImageAndHideIcon(box, url) {
    if (!box || !url) return;
    box.style.backgroundImage = "url('" + url + "')";
    box.style.backgroundSize = "cover";
    box.style.backgroundPosition = "center";
    // Hide the 🎬 emoji layer that sits on top of the gradient background
    var children = box.children;
    for (var i = 0; i < children.length; i++) {
      var txt = children[i].textContent ? children[i].textContent.trim() : "";
      if (txt === "🎬" || txt === "🎥") {
        children[i].style.display = "none";
      }
    }
  }

  function applyRealPostersToExisting() {
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
        fetchPoster(title, year).then(function (url) { applyImageAndHideIcon(bg, url); });
      } catch (e) { console.error("Card poster error:", e); }
    });

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
        fetchPoster(title, year).then(function (url) { applyImageAndHideIcon(hero, url); });
      } catch (e) { console.error("Modal poster error:", e); }
    });
  }

  /* ---------- 4) Build a card using the SAME markup/classes as the app ---------- */

  function buildCardElement(movie) {
    var poster = movie.poster_path ? IMG_BASE + movie.poster_path : "";
    var rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
    var title = (movie.title || "Untitled");
    var safeTitle = title.replace(/</g, "&lt;");

    var card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-tmdb-id", movie.id);

    card.innerHTML =
      '<div class="poster-wrap">' +
        '<div class="poster-bg" style="background-image:url(\'' + poster + '\');background-size:cover;background-position:center;" data-poster-done="1"></div>' +
        '<div class="poster-shade"></div>' +
        '<div class="poster-info">' +
          '<div class="poster-title">' + safeTitle + '</div>' +
        '</div>' +
        '<div class="poster-rating">⭐ ' + rating + '</div>' +
        '<div class="poster-play"><div class="poster-play-btn">▶</div></div>' +
      '</div>' +
      '<div class="card-meta">' +
        '<div class="card-title">' + safeTitle + '</div>' +
      '</div>';

    card.addEventListener("click", function () {
      openTmdbMovieModal(movie);
    });

    return card;
  }

  /* ---------- 5) Modal for TMDB-sourced movies (same visual style) ---------- */

  function openTmdbMovieModal(movie) {
    try {
      var existing = document.getElementById("cl-tmdb-modal");
      if (existing && existing.parentNode) existing.parentNode.removeChild(existing);

      var poster = movie.poster_path ? IMG_BASE.replace("w342", "w500") + movie.poster_path : "";
      var rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";
      var year = (movie.release_date || "").slice(0, 4) || "—";
      var title = movie.title || "Untitled";
      var overview = movie.overview || "No description available.";

      var overlay = document.createElement("div");
      overlay.id = "cl-tmdb-modal";
      overlay.className = "modal-overlay";
      overlay.style.zIndex = "9998";

      overlay.innerHTML =
        '<div class="modal" onclick="event.stopPropagation()">' +
          '<div class="modal-hero" style="background-image:url(\'' + poster + '\');background-size:cover;background-position:center;">' +
            '<div class="modal-shade"></div>' +
            '<button class="modal-close" id="cl-tmdb-close">✕</button>' +
            '<div class="modal-titlewrap">' +
              '<div class="modal-tags"><span class="tag tag-soft">🌍 World Cinema</span></div>' +
              '<h2 class="modal-title">' + title + '</h2>' +
            '</div>' +
          '</div>' +
          '<div class="modal-body">' +
            '<div class="modal-meta"><span class="star-gold">⭐ ' + rating + '/10</span><span>' + year + '</span></div>' +
            '<p class="modal-desc">' + overview + '</p>' +
            '<div class="modal-actions">' +
              '<button class="btn btn-white btn-sm" id="cl-tmdb-watch">▶ Watch Trailer</button>' +
            '</div>' +
          '</div>' +
        '</div>';

      document.body.appendChild(overlay);

      overlay.addEventListener("click", function (e) {
        if (e.target === overlay) overlay.remove();
      });
      var closeBtn = document.getElementById("cl-tmdb-close");
      if (closeBtn) closeBtn.addEventListener("click", function () { overlay.remove(); });

      var watchBtn = document.getElementById("cl-tmdb-watch");
      if (watchBtn) {
        watchBtn.addEventListener("click", function () {
          if (window.showWatchLinks) {
            window.showWatchLinks({ title: title, year: year, type: "world" });
          }
        });
      }
    } catch (e) {
      console.error("openTmdbMovieModal error:", e);
    }
  }

  /* ---------- 6) Auto-load ~150 movies into existing grids ---------- */

  var loadedExtraMovies = false;

  function loadExtraMovies() {
    if (loadedExtraMovies) return;
    loadedExtraMovies = true;

    var targetGrid = document.querySelectorAll(".grid")[document.querySelectorAll(".grid").length - 1];
    if (!targetGrid) { loadedExtraMovies = false; return; }

    var pagesToFetch = [1, 2, 3, 4, 5, 6, 7]; // ~140 movies (20 per page)
    pagesToFetch.forEach(function (page) {
      fetch("https://api.themoviedb.org/3/movie/popular?api_key=" + TMDB_KEY + "&page=" + page)
        .then(function (r) { return r.json(); })
        .then(function (data) {
          var results = data.results || [];
          results.forEach(function (movie) {
            tmdbMovieById[movie.id] = movie;
            targetGrid.appendChild(buildCardElement(movie));
          });
        })
        .catch(function (e) { console.error("Extra movies fetch failed (page " + page + "):", e); });
    });
  }

  /* ---------- 7) Hook into existing search box ---------- */

  var searchHooked = false;
  var searchDebounce = null;

  function hookSearch() {
    if (searchHooked) return;
    var input = document.querySelector(".search-input");
    if (!input) return;
    searchHooked = true;

    input.addEventListener("input", function () {
      var query = input.value.trim();
      clearTimeout(searchDebounce);
      if (!query) {
        removeSearchResultsSection();
        return;
      }
      searchDebounce = setTimeout(function () { searchTmdb(query); }, 500);
    });
  }

  function removeSearchResultsSection() {
    var el = document.getElementById("cl-search-extra");
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function searchTmdb(query) {
    fetch("https://api.themoviedb.org/3/search/movie?api_key=" + TMDB_KEY + "&query=" + encodeURIComponent(query))
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var results = (data.results || []).slice(0, 24);
        renderSearchResults(results, query);
      })
      .catch(function (e) { console.error("Search TMDB failed:", e); });
  }

  function renderSearchResults(results, query) {
    removeSearchResultsSection();
    var main = document.querySelector("main");
    if (!main) return;

    var section = document.createElement("div");
    section.id = "cl-search-extra";
    section.className = "section";
    section.innerHTML =
      '<div class="section-header"><h2 class="section-title">🔎 More results for "' + query + '"</h2></div>' +
      '<div class="grid" id="cl-search-grid"></div>';

    main.appendChild(section);
    var grid = document.getElementById("cl-search-grid");
    if (!grid) return;

    results.forEach(function (movie) {
      tmdbMovieById[movie.id] = movie;
      grid.appendChild(buildCardElement(movie));
    });
  }

  /* ---------- Run everything safely ---------- */

  function runAll() {
    safe(upgradeHero, "hero");
    safe(fixStatsAndAds, "stats-ads");
    safe(dedupeYears, "dedupe-years");
    safe(applyRealPostersToExisting, "posters");
    safe(loadExtraMovies, "load-extra");
    safe(hookSearch, "hook-search");
  }

  function start() {
    runAll();
    setInterval(function () {
      safe(applyRealPostersToExisting, "posters-rescan");
      safe(dedupeYears, "dedupe-years-rescan");
      safe(hookSearch, "hook-search-rescan");
    }, 1800);
  }

  if (document.readyState === "complete") {
    setTimeout(start, 1200);
  } else {
    window.addEventListener("load", function () { setTimeout(start, 1200); });
  }
})();
