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
  if (projectGrid && !projectGrid.querySelector('[data-project="jackal"]')) {
    projectGrid.insertAdjacentHTML('beforeend', `
      <article class="card reveal" data-project="jackal">
        <p class="tag">Short fiction · Superhero fantasy</p>
        <h3>Jackal</h3>
        <p>A student caught between his mother’s expectations and his own uncertain future awakens a dangerous power during combat training.</p>
        <p class="content-warning"><strong>Content warnings:</strong> body horror, graphic injury, blood, violence, physical abuse, and implied death.</p>
        <ul class="meta"><li>Short story</li><li>PDF available</li></ul>
        <a class="text-link" href="Media%20Folder/Jackal.pdf" target="_blank">Read the project <span>↗</span></a>
      </article>`);
    const jackalCard = projectGrid.querySelector('[data-project="jackal"]');
    if (jackalCard) requestAnimationFrame(() => jackalCard.classList.add('is-in'));
  }

  const projectCards = document.querySelectorAll('#worlds .card');
  projectCards.forEach((card) => {
    const title = card.querySelector('h3');
    if (!title) return;

    const contentWarnings = {
      Yumi: 'blood, kidnapping, child exploitation, gang violence, death.',
      Zephyrus: 'blood, death, graphic descriptions.'
    };
    const warning = contentWarnings[title.textContent.trim()];
    if (warning && !card.querySelector('.content-warning')) {
      const projectLink = card.querySelector('.text-link');
      const warningMarkup = `<p class="content-warning"><strong>Content warnings:</strong> ${warning}</p>`;
      if (projectLink) projectLink.insertAdjacentHTML('beforebegin', warningMarkup);
      else card.insertAdjacentHTML('beforeend', warningMarkup);
    }

    if (title.textContent.trim() === 'Zephyrus' && !card.querySelector('[href*="ZephyrusSnippet.pdf"]')) {
      card.insertAdjacentHTML('beforeend', '<a class="text-link" href="Media%20Folder/ZephyrusSnippet.pdf" target="_blank">Read the project <span>↗</span></a>');
    }
  });

  const currentProjects = ['Parallax', 'FoxTooth Backend', 'Duck Valley Language Preservation', 'Ghibli Game'];
  const worldbuildingProjects = ['Yocrestif', 'Yumi', 'Zephyrus', 'Jackal'];
  const backendProjects = [];
  const sectionOrder = document.querySelector('main');
  const worldsSection = document.getElementById('worlds');
  const leadershipSection = document.getElementById('leadership');
  const rainfallSection = document.getElementById('rainfall');
  const mediaSection = document.getElementById('media');
  const contactSection = document.getElementById('contact');

  if (contactSection) {
    const mailLink = contactSection.querySelector('.mail');
    if (mailLink) {
      mailLink.href = 'mailto:Jojozune13@gmail.com';
      mailLink.textContent = 'Jojozune13@gmail.com';
    }
    contactSection.querySelectorAll('a').forEach((link) => {
      if (link.textContent.trim() === 'Website ↗') link.closest('li')?.remove();
    });
  }

  function updateSectionHeader(section, number, title, lede) {
    if (!section) return;
    const numberElement = section.querySelector('.sec-num');
    const titleElement = section.querySelector('.sec-title');
    const ledeElement = section.querySelector('.sec-lede');
    if (numberElement) numberElement.textContent = number;
    if (titleElement) titleElement.textContent = title;
    if (ledeElement) ledeElement.textContent = lede;
  }

  function makeProjectSection(id, number, title, lede, tint) {
    const section = document.createElement('section');
    section.className = `section${tint ? ' section-tint' : ''}`;
    section.id = id;
    section.innerHTML = `<div class="wrap"><header class="sec-head"><span class="sec-num">${number}</span><h2 class="sec-title">${title}</h2><p class="sec-lede">${lede}</p></header><div class="cols-2"></div></div>`;
    return section;
  }

  if (worldsSection && leadershipSection && mediaSection && contactSection) {
    updateSectionHeader(leadershipSection, '02', 'Leadership', 'The people and studio work I help lead, shape, and grow.');
    updateSectionHeader(worldsSection, '03', 'Current and completed projects', 'Projects across games, client work, community preservation, and active development.');
    updateSectionHeader(mediaSection, '07', 'The media room', 'The supporting work behind the worlds: demos, motion, music, visual studies, logos, and documents.');
    updateSectionHeader(contactSection, '08', 'Let’s make something creative.', 'For conversations about game design, narrative, RainFall, leadership, language preservation, or a project that needs a world around it.');

    const projectCardByTitle = new Map(Array.from(document.querySelectorAll('#worlds .card')).map((card) => [card.querySelector('h3')?.textContent.trim(), card]));
    const currentGrid = worldsSection.querySelector('.cols-2');
    const technicalArtSection = makeProjectSection('technical-art', '04', 'Technical Art', 'Models, rigs, shaders, and tools that turn technical understanding into visual possibility.', false);
    const worldbuildingSection = makeProjectSection('worldbuilding', '05', 'Worldbuilding and writing', 'Settings, characters, and stories built from history, systems, and a strong point of view.', true);
    const backendSection = makeProjectSection('backend', '06', 'Backend', 'Web services, databases, and technical systems behind the work.', false);
    Array.from(currentGrid.children).forEach((card) => card.remove());

    currentProjects.forEach((title) => {
      const card = projectCardByTitle.get(title);
      if (card) currentGrid.append(card);
    });
    currentGrid.insertAdjacentHTML('beforeend', `
      <article class="card reveal" data-project="tidal-hunters-technical">
        <p class="tag">Multiplayer co-op FPS · Prototype</p>
        <h3>Tidal Hunters: Technical</h3>
        <p>A dystopian multiplayer co-op FPS about hunters who fight giant fifth-dimensional beasts emerging from void ponds. Players squad up, customize gear, travel through Nazeda's underground Mole network, and build fame, money, and community status.</p>
        <p>The prototype includes multiplayer joining, friends and invitations, account creation, a money system, a shop, scene changes, a flexible weapon and attachment system, and a flag creator.</p>
        <ul class="meta"><li>Unity prototype</li><li>Multiplayer systems</li><li>Gameplay systems</li></ul>
        <div class="project-embeds"><div class="media-video"><iframe src="https://www.youtube.com/embed/5JlCmQfE0qU" title="Tidal Hunters models and assets showreel" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div><div class="media-video"><iframe src="https://www.youtube.com/embed/7DhHocx0OsQ" title="Tidal Hunters login and flag creation test" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>
      </article>`);
    const technicalCard = currentGrid.querySelector('[data-project="tidal-hunters-technical"]');
    if (technicalCard) requestAnimationFrame(() => technicalCard.classList.add('is-in'));
    currentGrid.insertAdjacentHTML('beforeend', `
      <article class="card reveal" data-project="gimm-flock">
        <p class="tag">Swift app · Peer mentoring</p>
        <h3>GIMM Flock</h3>
        <p>A Swift app developed to improve informal peer mentoring by helping students connect, share support, and build stronger learning communities.</p>
        <ul class="meta"><li>Swift</li><li>Peer mentoring</li><li>Mobile app</li></ul>
        <div class="project-embeds"><div class="media-video"><iframe src="https://www.youtube.com/embed/6w0K31xvkls" title="GIMM Flock app presentation" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div></div>
      </article>`);
    const gimmFlockCard = currentGrid.querySelector('[data-project="gimm-flock"]');
    const ghibliCard = projectCardByTitle.get('Ghibli Game');
    if (gimmFlockCard) {
      if (ghibliCard) currentGrid.insertBefore(gimmFlockCard, ghibliCard);
      requestAnimationFrame(() => gimmFlockCard.classList.add('is-in'));
    }
    if (technicalCard && ghibliCard) ghibliCard.after(technicalCard);
    worldbuildingProjects.forEach((title) => {
      const card = projectCardByTitle.get(title);
      if (card) {
        worldbuildingSection.querySelector('.cols-2').append(card);
        if (title === 'Yocrestif' && !card.querySelector('[href*="Yocrestif%20GDD.pdf"]')) {
          card.insertAdjacentHTML('beforeend', '<a class="text-link" href="Media%20Folder/Yocrestif%20GDD.pdf" target="_blank">Open the Yocrestif GDD <span>↗</span></a>');
        }
      }
    });
    backendProjects.forEach((title) => {
      const card = projectCardByTitle.get(title);
      if (card) backendSection.querySelector('.cols-2').append(card);
    });
    if (!backendSection.querySelector('.card')) backendSection.remove();

    worldbuildingSection.querySelector('.cols-2').insertAdjacentHTML('beforeend', `
      <article class="card reveal" data-project="tidal-hunters-writing">
        <p class="tag">Tidal Hunters · Worldbuilding and writing</p>
        <h3>Tidal Hunters: World Building</h3>
        <p>The setting, factions, hunter culture, fifth-dimensional beasts, Nazeda, and the systems of a world built to support the game’s multiplayer experience.</p>
        <ul class="meta"><li>Worldbuilding</li><li>Writing</li><li>Project document</li></ul>
        <a class="text-link" href="Media%20Folder/TidalHuntersLoreBible(incomplete).pdf" download>Download Tidal Hunters Lore Bible (Incomplete) <span>↓</span></a>
        <a class="text-link" href="Media%20Folder/Copy%20of%20Tidal%20Hunters.pptx" download>Download the project document <span>↓</span></a>
      </article>`);
    const writingCard = worldbuildingSection.querySelector('[data-project="tidal-hunters-writing"]');
    if (writingCard) requestAnimationFrame(() => writingCard.classList.add('is-in'));

    technicalArtSection.querySelector('.cols-2').insertAdjacentHTML('beforeend', `
      <article class="card reveal technical-art-card" data-project="trex-model-rig">
        <p class="tag">Character art · Modeling and rigging</p>
        <h3>T-Rex Model and Rig</h3>
        <p>A character-art study focused on sculpting a T-Rex, building a deformation-ready rig, and connecting the model to readable movement and performance.</p>
        <ul class="meta"><li>3D modeling</li><li>Rigging</li><li>Deformation</li></ul>
        <div class="media-video"><video controls preload="auto" playsinline><source src="Media%20Folder/TrexModelAndRig.mp4" type="video/mp4" /></video></div>
      </article>
      <article class="card reveal technical-art-card" data-project="render-grass-system">
        <p class="tag">Rendering systems · GPU instancing</p>
        <h3>Render Grass System</h3>
        <p>A GPU-driven grass system designed to replace the old approach of spawning hundreds of cube objects and colliders. The new system tracks grass through arrays, uses GPU buffers for rendering, and separates the math from the visual work so large patches stay performant.</p>
        <p>Where a small-to-medium patch could cost almost 250 frames while simply looking at it, the new system renders thousands of grass blades comfortably and still supports mowing like the original system.</p>
        <ul class="meta"><li>GPU buffers</li><li>Array-based tracking</li><li>Grass shader</li><li>Performance optimization</li></ul>
        <div class="media-video"><video controls preload="auto" playsinline><source src="Media%20Folder/P%26R_RenderGrassSystem.mp4" type="video/mp4" /></video></div>
        <details class="technical-art-scripts"><summary>View Render Grass System scripts</summary><div class="technical-art-gallery"><a class="technical-art-image-link" href="Media%20Folder/GrassCubeHLSL.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/GrassCubeHLSL.png" alt="Render Grass System shader code" /></a><a class="technical-art-image-link" href="Media%20Folder/RenderGrassSystemManager.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/RenderGrassSystemManager.png" alt="Render Grass System manager and array tracking" /></a><a class="technical-art-image-link" href="Media%20Folder/RenderGrassSystemREnder.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/RenderGrassSystemREnder.png" alt="Render Grass System GPU render result" /></a></div></details>
      </article>
      <article class="card reveal technical-art-card" data-project="hlsl-shaders">
        <p class="tag">Rendering · HLSL</p>
        <h3>HLSL Shader Examples</h3>
        <p>A collection of shader experiments exploring material response, lighting, surface detail, and the control that comes from writing the rendering logic directly.</p>
        <ul class="meta"><li>HLSL</li><li>Rendering</li><li>Material studies</li></ul>
        <a class="technical-art-image-link" href="Media%20Folder/JitterBulletHLSL.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/JitterBulletHLSL.png" alt="JitterBullet HLSL shader example" /></a>
      </article>
      <article class="card reveal technical-art-card" data-project="node-shaders">
        <p class="tag">Procedural art · Node shaders</p>
        <h3>Node Shader Screenshots</h3>
        <p>Visual breakdowns of node-based shader graphs, showing how layered values, masks, textures, and math become a finished surface.</p>
        <ul class="meta"><li>Shader graphs</li><li>Procedural materials</li><li>Technical breakdowns</li></ul>
        <div class="technical-art-gallery"><a class="technical-art-image-link" href="Media%20Folder/DirtLitShaderGraph.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/DirtLitShaderGraph.png" alt="Lit dirt shader graph" /></a><a class="technical-art-image-link" href="Media%20Folder/VoidPondShaderGraph.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/VoidPondShaderGraph.png" alt="Void pond shader graph" /></a><div class="media-video"><video controls preload="auto" playsinline><source src="Media%20Folder/litDirtScrollVid.mp4" type="video/mp4" /></video></div><div class="media-video"><video controls preload="auto" playsinline><source src="Media%20Folder/dotsShader.mp4" type="video/mp4" /></video></div></div>
      </article>
      <article class="card reveal technical-art-card" data-project="tidal-hunters-environment">
        <p class="tag">Tidal Hunters · Environment art</p>
        <h3>Mole and Environment Art</h3>
        <p>Environment work for Tidal Hunters, including the Mole and visual studies of the spaces, materials, and atmosphere surrounding the game world.</p>
        <ul class="meta"><li>Environment art</li><li>Worldbuilding</li><li>Tidal Hunters</li></ul>
        <div class="technical-art-gallery"><a class="technical-art-image-link" href="Media%20Folder/Mole.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/Mole.png" alt="Tidal Hunters Mole environment art" /></a><a class="technical-art-image-link" href="Media%20Folder/TidalEnviornmentArt.png" target="_blank" rel="noopener"><img class="technical-art-media" src="Media%20Folder/TidalEnviornmentArt.png" alt="Tidal Hunters environment art" /></a></div>
      </article>
      <article class="card reveal technical-art-card" data-project="tidal-hunters-flag-creator">
        <p class="tag">Tools · Tidal Hunters</p>
        <h3>Tidal Hunters Flag Creator</h3>
        <p>A technical-art highlight from Tidal Hunters: a player-facing creation tool that turns layered visual choices into a personal flag for the hunter community.</p>
        <ul class="meta"><li>Unity tool</li><li>Customization</li><li>Player expression</li></ul>
        <div class="media-video"><video controls preload="auto" playsinline><source src="Media%20Folder/FlagCreatorShowcase.mp4" type="video/mp4" /></video></div>
      </article>`);
    const technicalCardOrder = ['trex-model-rig', 'tidal-hunters-flag-creator', 'render-grass-system', 'tidal-hunters-environment', 'node-shaders', 'hlsl-shaders'];
    technicalCardOrder.forEach((projectId) => {
      const card = technicalArtSection.querySelector(`[data-project="${projectId}"]`);
      if (card) technicalArtSection.querySelector('.cols-2').append(card);
    });
    technicalArtSection.querySelectorAll('.technical-art-card').forEach((card) => {
      card.classList.add('is-in');
      card.style.opacity = '1';
    });

    const rainfallFeature = rainfallSection?.querySelector('.studio-feature');
    if (rainfallFeature) {
      const parksButton = rainfallFeature.querySelector('a[href*="IMG_0626.png"]');
      if (parksButton) {
        parksButton.outerHTML = '<img class="parks-logo" src="Media%20Folder/IMG_0626.png" alt="Parks and Rec logo" /><p class="parks-description-placeholder">A RainFall game project developed by a nine-person studio, combining thoughtful branding, collaborative design, and an evolving playable experience.</p>';
      }
      leadershipSection.querySelector('.wrap').append(rainfallFeature);
    }
    if (rainfallSection) rainfallSection.remove();
    sectionOrder.insertBefore(technicalArtSection, mediaSection);
    sectionOrder.insertBefore(worldbuildingSection, mediaSection);
    if (backendSection.isConnected) sectionOrder.insertBefore(backendSection, mediaSection);
    leadershipSection.parentNode.insertBefore(leadershipSection, worldsSection);
  }

  if (mediaSection) {
    const mediaWrap = mediaSection.querySelector('.wrap');
    mediaWrap.innerHTML = `
      <header class="sec-head reveal"><span class="sec-num">07</span><h2 class="sec-title">Media Hall</h2><p class="sec-lede">Embedded stories, documents, images, logos, videos, audio, and project material from the archive.</p></header>
      <div class="media-subsection">
        <header class="sub-head"><p class="tag">Stories and documents</p><h3>Embedded writing archive</h3></header>
        <div class="media-grid media-grid-documents"><article class="media-card reveal"><iframe class="document-embed" src="Media%20Folder/Jackal.pdf" title="Jackal story"></iframe><div class="media-card-body"><p class="tag">Short story</p><h3>Jackal</h3></div></article><article class="media-card reveal"><iframe class="document-embed" src="Media%20Folder/Yumi%20(1).pdf" title="Yumi story"></iframe><div class="media-card-body"><p class="tag">Short story</p><h3>Yumi</h3></div></article><article class="media-card reveal"><iframe class="document-embed" src="Media%20Folder/ZephyrusSnippet.pdf" title="Zephyrus story snippet"></iframe><div class="media-card-body"><p class="tag">Story snippet</p><h3>Zephyrus</h3></div></article><article class="media-card reveal"><iframe class="document-embed" src="Media%20Folder/Ghibli.pdf" title="Ghibli project document"></iframe><div class="media-card-body"><p class="tag">Project document</p><h3>Ghibli</h3></div></article><article class="media-card reveal"><iframe class="document-embed" src="Media%20Folder/short-story.pdf" title="Short story archive"></iframe><div class="media-card-body"><p class="tag">Writing archive</p><h3>Short story</h3></div></article><article class="media-card reveal"><iframe class="document-embed" src="Media%20Folder/Yocrestif%20GDD.pdf" title="Yocrestif game design document"></iframe><div class="media-card-body"><p class="tag">Game design document</p><h3>Yocrestif GDD</h3></div></article><article class="media-card reveal"><iframe class="document-embed" src="Media%20Folder/TidalHuntersLoreBible(incomplete).pdf" title="Tidal Hunters Lore Bible (Incomplete)"></iframe><div class="media-card-body"><p class="tag">Lore bible</p><h3>Tidal Hunters Lore Bible (Incomplete)</h3></div></article></div>
      </div>
      <div class="media-subsection">
        <header class="sub-head"><p class="tag">Images, logos, and sound</p><h3>Embedded visual archive</h3></header>
        <div class="media-grid"><article class="media-card reveal"><img src="Media%20Folder/planet.png" alt="Gold planet visualization" /><div class="media-card-body"><p class="tag">3D · Blender</p><h3>Planet visualization</h3></div></article><article class="media-card reveal"><img src="Media%20Folder/IMG_0626.png" alt="Parks and Rec logo" /><div class="media-card-body"><p class="tag">RainFall · Parks and Rec</p><h3>Parks and Rec logo</h3></div></article><article class="media-card reveal"><img src="Media%20Folder/RainfallLogo.jpg" alt="RainFall studio logo" /><div class="media-card-body"><p class="tag">Studio identity</p><h3>RainFall logo</h3></div></article></div>
        <div class="media-lower"><div class="audio-room reveal"><p class="tag">Soundtrack · Yocrestif</p><h3>Original compositions</h3><audio controls preload="metadata"><source src="Media%20Folder/Plernat2.mp3" type="audio/mpeg" /></audio><audio controls preload="metadata"><source src="Media%20Folder/Judgement%20Day.mp3" type="audio/mpeg" /></audio></div><div class="download-room reveal"><p class="tag">Project document</p><h3>Tidal Hunters writing archive</h3><p>Keep the full project document available here for download.</p><a class="download-link" href="Media%20Folder/Copy%20of%20Tidal%20Hunters.pptx" download><span>Tidal Hunters document</span><span>PPTX ↓</span></a></div></div>
      </div>`;
    mediaWrap.querySelectorAll('.media-subsection').forEach((subsection) => {
      if (subsection.querySelector('.tag')?.textContent.includes('Tidal Hunters')) subsection.remove();
    });
    requestAnimationFrame(() => mediaWrap.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-in')));
  }

  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}());
