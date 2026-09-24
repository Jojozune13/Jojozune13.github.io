(function () {
  'use strict';

  const canvas = document.getElementById('starfield');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (canvas && !reducedMotion) {
    const context = canvas.getContext('2d');
    let stars = [];
    let width = 0;
    let height = 0;
    let devicePixelRatio = 1;

    function resize() {
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.width = window.innerWidth * devicePixelRatio;
      height = canvas.height = window.innerHeight * devicePixelRatio;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      stars = Array.from({ length: Math.min(220, Math.floor(window.innerWidth * window.innerHeight / 9000)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: (Math.random() * 1.1 + .2) * devicePixelRatio,
        alpha: Math.random() * .5 + .15,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * .012 + .003,
        fall: (Math.random() * .05 + .012) * devicePixelRatio,
        gold: Math.random() < .14
      }));
    }

    function frame() {
      context.clearRect(0, 0, width, height);
      stars.forEach((star) => {
        star.phase += star.speed;
        star.y += star.fall;
        if (star.y > height + 4) star.y = -4;
        const alpha = star.alpha * (.55 + .45 * Math.sin(star.phase));
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        context.fillStyle = star.gold ? `rgba(226, 190, 96, ${alpha})` : `rgba(233, 237, 248, ${alpha * .85})`;
        context.fill();
      });
      window.requestAnimationFrame(frame);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();
    frame();
  }

  const header = document.getElementById('hdr');
  if (header) {
    const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
  }

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = `${Number(entry.target.dataset.d || 0) * 90}ms`;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px -8% 0px' });
    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('is-in'));
  }

  const projectGrid = document.querySelector('#worlds .cols-2');
  if (projectGrid && !projectGrid.querySelector('[data-project="tidal-hunters"]')) {
    projectGrid.insertAdjacentHTML('beforeend', `
      <article class="card reveal is-in" data-project="tidal-hunters">
        <p class="tag">Multiplayer co-op FPS · Prototype</p>
        <h3>Tidal Hunters</h3>
        <p>A dystopian multiplayer co-op FPS about hunters who fight giant fifth-dimensional beasts emerging from void ponds. Players squad up, customize gear, travel through Nazeda's underground Mole network, fish beasts from higher dimensions, and build fame, money, and community status.</p>
        <p>The prototype includes multiplayer joining, friends and invitations, account creation, a money system, a shop, scene changes, a flexible weapon and attachment system, and a flag creator. Its worldbuilding centers on B-Megs, Nazeda, hunter squads, betting drones, and the culture surrounding beast fighting.</p>
        <ul class="meta"><li>Unity prototype</li><li>Multiplayer systems</li><li>Worldbuilding</li></ul>
        <a class="text-link" href="Media%20Folder/GamePlayDemo.mp4" target="_blank">Watch the gameplay demo <span>↗</span></a>
        <a class="text-link" href="Media%20Folder/Copy%20of%20Tidal%20Hunters.pptx" download>Download the project document <span>↓</span></a>
      </article>`);
  }

  const gameplaySource = document.querySelector('source[src*="GamePlayDemo.mp4"]');
  const gameplayCard = gameplaySource ? gameplaySource.closest('.media-card') : null;
  if (gameplayCard) {
    const tag = gameplayCard.querySelector('.tag');
    const title = gameplayCard.querySelector('h3');
    const description = gameplayCard.querySelector('.media-card-body p:not(.tag)');
    if (tag) tag.textContent = 'Tidal Hunters · Gameplay prototype';
    if (title) title.textContent = 'Tidal Hunters';
    if (description) description.textContent = 'Multiplayer co-op FPS prototype: hunter squads, void ponds, beast fishing, and Nazeda-built Mole transport.';
  }

  const showreelSource = document.querySelector('source[src*="Noyes.mp4"]');
  const showreelCard = showreelSource ? showreelSource.closest('.media-card') : null;
  if (showreelCard) {
    const tag = showreelCard.querySelector('.tag');
    const title = showreelCard.querySelector('h3');
    const description = showreelCard.querySelector('.media-card-body p:not(.tag)');
    if (tag) tag.textContent = 'Tidal Hunters · Showreel';
    if (title) title.textContent = 'Tidal Hunters Showreel';
    if (description) description.textContent = 'A showreel for the Tidal Hunters project, separate from the gameplay prototype demo.';
  }

  const mediaGrid = document.querySelector('#media .media-grid');
  if (mediaGrid && !mediaGrid.querySelector('[data-media="youtube-archive"]')) {
    mediaGrid.insertAdjacentHTML('beforeend', `
      <article class="media-card reveal is-in" data-media="youtube-archive">
        <div class="media-video"><iframe src="https://www.youtube.com/embed/xebSsUXjtmE" title="The Bi-Directional Flow of Time" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
        <div class="media-card-body"><p class="tag">YouTube · Game development</p><h3>The Bi-Directional Flow of Time</h3><p>Archived game development showcase from the original portfolio.</p></div>
      </article>
      <article class="media-card reveal is-in" data-media="youtube-archive">
        <div class="media-video"><iframe src="https://www.youtube.com/embed/q4W_JWGr3F8" title="SSBAR" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>
        <div class="media-card-body"><p class="tag">YouTube · Game development</p><h3>SSBAR</h3><p>Archived game development showcase from the original portfolio.</p></div>
      </article>`);
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}());
