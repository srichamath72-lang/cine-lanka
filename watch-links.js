// watch-links.js
// Adds a "Watch Trailer" -> streaming platform redirect feature to CineLanka.
// This file is loaded separately and patches the existing app after it renders.

(function () {
  function getWatchLinks(movie) {
    var q = encodeURIComponent(movie.title + ' ' + movie.year);
    if (movie.type === 'srilanka') {
      return [
        { name: 'Search on YouTube', icon: '▶️', url: 'https://www.youtube.com/results?search_query=' + q + ' full movie' },
        { name: 'Search on PEOTV', icon: '📺', url: 'https://www.google.com/search?q=' + q + ' site:peotv.com' },
        { name: 'Find Cinema Tickets', icon: '🎟️', url: 'https://www.google.com/search?q=' + q + ' cinema tickets sri lanka' }
      ];
    }
    return [
      { name: 'Watch on Netflix', icon: '🔴', url: 'https://www.netflix.com/search?q=' + q },
      { name: 'Watch on Prime Video', icon: '🔵', url: 'https://www.amazon.com/s?k=' + q + '&i=instant-video' },
      { name: 'Watch on Disney+', icon: '⭐', url: 'https://www.disneyplus.com/search?q=' + q },
      { name: 'Search YouTube Trailer', icon: '▶️', url: 'https://www.youtube.com/results?search_query=' + q + ' trailer' }
    ];
  }

  function buildOverlay(movie) {
    var overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.zIndex = '999';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.padding = '16px';
    overlay.style.background = 'rgba(0,0,0,0.85)';
    overlay.style.backdropFilter = 'blur(6px)';

    var box = document.createElement('div');
    box.style.background = '#18181b';
    box.style.border = '1px solid rgba(255,255,255,0.1)';
    box.style.borderRadius = '16px';
    box.style.padding = '28px';
    box.style.width = '100%';
    box.style.maxWidth = '340px';
    box.style.fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif';
    box.style.color = '#fff';

    var closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.style.float = 'right';
    closeBtn.style.color = '#71717a';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.cursor = 'pointer';
    closeBtn.onclick = function () { document.body.removeChild(overlay); };

    var title = document.createElement('div');
    title.textContent = 'Where to Watch';
    title.style.fontSize = '20px';
    title.style.fontWeight = '800';
    title.style.marginBottom = '14px';
    title.style.clear = 'both';
    title.style.paddingTop = '4px';

    box.appendChild(closeBtn);
    box.appendChild(title);

    var linksWrap = document.createElement('div');
    linksWrap.style.display = 'flex';
    linksWrap.style.flexDirection = 'column';
    linksWrap.style.gap = '8px';

    getWatchLinks(movie).forEach(function (link) {
    var a = document.createElement('a');
    a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = l.icon + '  ' + l.name;
      a.style.display = 'flex';
      a.style.alignItems = 'center';
      a.style.gap = '8px';
      a.style.padding = '10px 16px';
      a.style.borderRadius = '8px';
      a.style.border = '1px solid rgba(255,255,255,0.1)';
      a.style.color = '#fff';
      a.style.textDecoration = 'none';
      a.style.fontSize = '13px';
      a.style.fontWeight = '600';
      linksWrap.appendChild(a);
    });

    box.appendChild(linksWrap);

    var note = document.createElement('p');
    note.textContent = "You'll be redirected to the streaming platform. Availability depends on your region and subscription.";
    note.style.fontSize = '11px';
    note.style.color = '#71717a';
    note.style.marginTop = '14px';
    box.appendChild(note);

    overlay.appendChild(box);
    overlay.onclick = function (e) { if (e.target === overlay) document.body.removeChild(overlay); };
    document.body.appendChild(overlay);
  }

  // Expose a global function the main app's "Watch Trailer" button can call.
  window.showWatchLinks = function (movie) {
    buildOverlay(movie);
  };
})();
