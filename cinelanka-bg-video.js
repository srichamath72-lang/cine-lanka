// cinelanka-bg-video.js
// 100% SAFE / ADDITIVE. Does NOT touch, edit, or delete index.html.
//
// Adds a looping background video (muted, autoplay) fixed behind all
// page content, with a dark overlay so existing text stays readable.
// Pure CSS/DOM insertion - never modifies any existing element.

(function () {
  function safe(fn, label) {
    try { fn(); } catch (e) { console.error("cinelanka-bg-video [" + label + "]:", e); }
  }

  var YOUTUBE_VIDEO_ID = "sYGsqFtojDc";

  function injectBackgroundVideo() {
    if (document.getElementById("cl-bg-video-wrap")) return; // already added

    var wrap = document.createElement("div");
    wrap.id = "cl-bg-video-wrap";
    wrap.style.cssText =
      "position:fixed;" +
      "top:0;left:0;width:100vw;height:100vh;" +
      "z-index:-1;" +              // sits behind everything
      "overflow:hidden;" +
      "pointer-events:none;";       // never blocks clicks on real content

    var iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube.com/embed/" + YOUTUBE_VIDEO_ID +
      "?autoplay=1&mute=1&loop=1&playlist=" + YOUTUBE_VIDEO_ID +
      "&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1";
    iframe.title = "Background video";
    iframe.setAttribute("allow", "autoplay; encrypted-media");
    iframe.style.cssText =
      "position:absolute;" +
      "top:50%;left:50%;" +
      "width:100vw;height:177.78vw;" +   // ensures full coverage on portrait screens
      "min-height:100vh;min-width:177.78vh;" +
      "transform:translate(-50%,-50%);" +
      "border:none;";

    var overlay = document.createElement("div");
    overlay.style.cssText =
      "position:absolute;inset:0;" +
      "background:rgba(9,9,11,0.82);"; // dark overlay so existing text stays readable

    wrap.appendChild(iframe);
    wrap.appendChild(overlay);
    document.body.appendChild(wrap);

    // Make sure the page's own background is transparent enough to show
    // the video through, without touching any class or existing element -
    // we only adjust the <body> tag's own background, which index.html
    // already sets to a solid color; this just makes it see-through.
    document.body.style.background = "transparent";
  }

  function start() {
    safe(injectBackgroundVideo, "inject-video");
  }

  if (document.readyState === "complete") {
    setTimeout(start, 800);
  } else {
    window.addEventListener("load", function () { setTimeout(start, 800); });
  }
})();
