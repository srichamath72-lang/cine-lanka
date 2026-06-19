// cinelanka-bg-video.js
// 100% SAFE / ADDITIVE. Does NOT touch, edit, or delete index.html.
// Adds a cinematic film-reel-style background video, fixed behind all
// page content, with balanced overlay so movies stay clearly visible.

(function () {
  function safe(fn, label) {
    try { fn(); } catch (e) { console.error("cinelanka-bg-video [" + label + "]:", e); }
  }

  // YouTube Shorts එකේ විදිහටම ලස්සනට ගැලපෙන 3D Film Reel Background Video එකක්
  var YOUTUBE_VIDEO_ID = "f_7JcXeQOdM"; 

  function injectBackgroundVideo() {
    if (document.getElementById("cl-bg-video-wrap")) return;

    // 🚨 FORCE FIX: සයිට් එකේ පරණ කළු පසුබිම් නිසා වීඩියෝ එක වැහෙන එක 100%ක්ම වැළැක්වීමට CSS Styles ඇතුල් කිරීම
    var style = document.createElement('style');
    style.textContent = `
      html, body {
        background: transparent !important;
        background-color: transparent !important;
      }
      /* සයිට් එකේ ප්‍රධාන containers විනිවිද පෙනෙන (Transparent) කිරීම */
      #app, main, section, .hero, .movies-container, .container, .wrapper {
        background: transparent !important;
        background-color: transparent !important;
      }
      /* මූවි කාඩ්ස් ලස්සනට මතු වෙන්න ඒවාට පොඩි Dark Background එකක් දීම */
      .movie-card, .card, .trending-now, .top-rated {
        background-color: rgba(15, 15, 20, 0.5) !important;
        backdrop-filter: blur(8px);
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.id = "cl-bg-video-wrap";
    wrap.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100vh;" +
      "z-index:-9999 !important;overflow:hidden;pointer-events:none;background:#060608;"; // z-index එක -9999 කර පසුබිමටම තල්ලු කලා

    var clipper = document.createElement("div");
    clipper.style.cssText = "position:absolute;inset:0;overflow:hidden;pointer-events:none;";

    var iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube.com/embed/" + YOUTUBE_VIDEO_ID +
      "?autoplay=1&mute=1&loop=1&playlist=" + YOUTUBE_VIDEO_ID +
      "&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&playsinline=1";
    iframe.title = "Background";
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.setAttribute("tabindex", "-1");
    iframe.style.cssText =
      "position:absolute;top:50%;left:50%;" +
      "width:100vw;height:177.78vw;min-height:100vh;min-width:177.78vh;" +
      "transform:translate(-50%,-50%) scale(1.4);border:none;pointer-events:none;opacity:0.25;"; // වීඩියෝ එක ලස්සනට පේන්න opacity එක 0.25 කලා

    // YouTube Shorts එකේ තිබුණු Dark Red/Black Vibe එක දීමට Overlay එක සැකසීම
    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:absolute;inset:0;" +
      "background:radial-gradient(circle at center, rgba(61, 20, 29, 0.45) 0%, rgba(6, 6, 8, 0.93) 80%);z-index:2;";

    var clickBlocker = document.createElement("div");
    clickBlocker.style.cssText = "position:absolute;inset:0;z-index:5;background:transparent;";

    clipper.appendChild(iframe);
    wrap.appendChild(clipper);
    wrap.appendChild(overlay);
    wrap.appendChild(clickBlocker);
    document.body.appendChild(wrap);

    document.body.style.background = "transparent";
  }

  function makeMainBgTransparent() {
    var bgEl = document.querySelector(".navbar");
    if (bgEl && bgEl.getAttribute("data-bg-tweaked") !== "1") {
      bgEl.setAttribute("data-bg-tweaked", "1");
      bgEl.style.background = "rgba(6, 6, 8, 0.7)";
      bgEl.style.backdropFilter = "blur(10px)";
    }
  }

  function start() {
    safe(injectBackgroundVideo, "inject-video");
    setInterval(function () { safe(makeMainBgTransparent, "navbar-bg"); }, 1500);
  }

  if (document.readyState === "complete") {
    setTimeout(start, 800);
  } else {
    window.addEventListener("load", function () { setTimeout(start, 800); });
  }
})();