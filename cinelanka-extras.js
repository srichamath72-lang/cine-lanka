// cinelanka-extras.js
// Safe, minimal version: only adds the "Watch Trailer" -> streaming links popup.
// No DOM scanning, no automatic patching - just exposes one global function
// that index.html's button can call. This cannot crash the page on load.

window.showWatchLinks = function (movie) {
  try {
    var q = encodeURIComponent(movie.title + ' ' + movie.year);
    var links = [];

    if (movie.type === 'srilanka') {
      links = [
        { name: 'Search on YouTube', icon: '▶️', url: 'https://www.youtube.com/results?search_query=' + q + ' full movie' },
        { name: 'Search on PEOTV', icon: '📺', url: 'https://www.google.com/search?q=' + q + ' site:peotv.com' },
        { name: 'Find Cinema Tickets', icon: '🎟️', url: 'https://www.google.com/search?q=' + q + ' cinema tickets sri lanka' }
      ];
    } else {
      links = [
        { name: 'Watch on Netflix', icon: '🔴', url: 'https://www.netflix.com/search?q=' + q },
        { name: 'Watch on Prime Video', icon: '🔵', url: 'https://www.amazon.com/s?k=' + q + '&i=instant-video' },
        { name: 'Watch on Disney+', icon: '⭐', url: 'https://www.disneyplus.com/search?q=' + q },
        { name: 'Search YouTube Trailer', icon: '▶️', url: 'https://www.youtube.com/results?search_query=' + q + ' trailer' }
      ];
    }

    var overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;z-index:999;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(0,0,0,0.85);';

    var box = document.createElement('div');
    box.style.cssText = 'background:#18181b;border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:28px;width:100%;max-width:340px;font-family:sans-serif;color:#fff;';

    var html = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px;">' +
      '<div style="font-size:20px;font-weight:800;">Where to Watch</div>' +
      '<button id="cl-close-btn" style="background:none;border:none;color:#999;font-size:18px;cursor:pointer;">&times;</button>' +
      '</div><div style="display:flex;flex-direction:column;gap:8px;">';

    for (var i = 0; i < links.length; i++) {
      html += '<a href="' + links[i].url + '" target="_blank" rel="noopener noreferrer" ' +
        'style="display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);color:#fff;text-decoration:none;font-size:13px;font-weight:600;">' +
        links[i].icon + ' ' + links[i].name + '</a>';
    }

    html += '</div><p style="font-size:11px;color:#777;margin-top:14px;">You will be redirected to the streaming platform. Availability depends on your region and subscription.</p>';

    box.innerHTML = html;
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    function closeOverlay() {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    }

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay();
    });

    var closeBtn = document.getElementById('cl-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);

  } catch (err) {
    console.error('CineLanka watch links error:', err);
  }
};
