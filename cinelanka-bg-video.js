// cinelanka-bg-video.js
// 100% LIGHTWEIGHT & MOBILE-PROOF ANIMATION BACKGROUND.
// Creates a live cinematic moving particle field & smooth projector glow.

(function () {
  function safe(fn, label) {
    try { fn(); } catch (e) { console.error("cinelanka-bg-animation [" + label + "]:", e); }
  }

  function injectCinematicAnimation() {
    if (document.getElementById("cl-bg-video-wrap")) return;

    // සයිට් එකේ තියෙන කළු පසුබිම් බලෙන්ම අයින් කර විනිවිද පෙනෙන්න සලස්වන CSS
    var style = document.createElement('style');
    style.textContent = `
      html, body, #root, #app, #__next, main, .min-h-screen, 
      [class*="bg-background"], [class*="bg-neutral"], [class*="bg-black"] {
        background: transparent !important;
        background-color: transparent !important;
      }
      html {
        background-color: #050507 !important;
      }
      /* මූවි කාඩ්ස් වල පෙනුම සුපිරියටම මතු කර පෙන්වීම */
      .movie-card, .card {
        background-color: rgba(15, 15, 22, 0.65) !important;
        backdrop-filter: blur(12px) !important;
        border: 1px solid rgba(255, 255, 255, 0.04) !important;
        box-shadow: 0 15px 35px rgba(0,0,0,0.7) !important;
      }
      h1, h2, h3, h4, p, span, a, .trending-now {
        text-shadow: 0 2px 10px rgba(0, 0, 0, 0.95) !important;
      }
    `;
    document.head.appendChild(style);

    var wrap = document.createElement("div");
    wrap.id = "cl-bg-video-wrap";
    wrap.style.cssText = "position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-9999 !important;overflow:hidden;pointer-events:none;background:#050507;";

    // 🎨 CANVAS ANIMATION LAYER: සජීවීව ඇනිමේෂන් එක රෙන්ඩර් වන කැන්වසය
    var canvas = document.createElement("canvas");
    canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;opacity:0.35;";
    wrap.appendChild(canvas);

    // 🛠️ CINEMATIC RADIAL OVERLAY: මැදින් තද රතු සහ වටේට කළු සිනමා Vignette එක
    var overlay = document.createElement("div");
    overlay.style.cssText = "position:absolute;inset:0;background:radial-gradient(circle at center, rgba(40, 6, 12, 0.4) 0%, rgba(5, 5, 7, 0.96) 85%) !important;z-index:2;";
    wrap.appendChild(overlay);
    document.body.appendChild(wrap);

    // --- ANIMATION ENGINE ---
    var ctx = canvas.getContext("2d");
    var particles = [];
    var particleCount = 45; // ඇනිමේෂන් එක ස්මූත් වෙන්න අංශු ගණන

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    // අංශු (Particles) මුලින්ම ජනනය කිරීම
    for (var i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.5 + 0.5,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: (Math.random() * 0.5 + 0.1) * -1, // ඉහළට පාවීම සදහා
        opacity: Math.random() * 0.5 + 0.2
      });
    }

    // සජීවීව ඇනිමේට් වන Loop එක
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // ප්‍රොජෙක්ටර් එකකින් එන සියුම් ආලෝක ධාරා (Light Beams Effect)
      ctx.fillStyle = "rgba(255, 235, 205, 0.015)";
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width * 0.2, canvas.height);
      ctx.lineTo(canvas.width * 0.8, canvas.height);
      ctx.closePath();
      ctx.fill();

      // සිනමා ඩස්ට් අංශු ඇඳීම සහ චලනය කිරීම
      for (var i = 0; i < particleCount; i++) {
        var p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 255, 255, " + p.opacity + ")";
        ctx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        // ස්ක්‍රීන් එකෙන් උඩට ගියපුවාම නැවත යටින් මතුවීම
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
      }
      requestAnimationFrame(animate);
    }
    animate();
  }

  function makeMainBgTransparent() {
    var bgEl = document.querySelector(".navbar") || document.querySelector("header");
    if (bgEl && bgEl.getAttribute("data-bg-tweaked") !== "1") {
      bgEl.setAttribute("data-bg-tweaked", "1");
      bgEl.style.setProperty("background", "rgba(5, 5, 7, 0.8)", "important");
      bgEl.style.setProperty("backdrop-filter", "blur(12px)", "important");
    }
  }

  function start() {
    safe(injectCinematicAnimation, "inject-animation");
    setInterval(function () { safe(makeMainBgTransparent, "navbar-bg"); }, 1000);
  }

  if (document.readyState === "complete") {
    setTimeout(start, 200);
  } else {
    window.addEventListener("load", function () { setTimeout(start, 200); });
  }
})();