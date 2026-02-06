const carousels = document.querySelectorAll('[data-carousel]');
const scrollButtons = document.querySelectorAll('[data-scroll-left], [data-scroll-right]');

scrollButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const row = button.closest('.row');
    if (!row) return;
    const carousel = row.querySelector('[data-carousel]');
    if (!carousel) return;
    const direction = button.hasAttribute('data-scroll-left') ? -1 : 1;
    const scrollAmount = carousel.clientWidth * 0.8;
    carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  });
});

const profile = document.querySelector('[data-menu]');
if (profile) {
  const panel = profile.querySelector('[data-menu-panel]');
  profile.addEventListener('click', () => {
    profile.classList.toggle('open');
  });

  document.addEventListener('click', (event) => {
    if (!profile.contains(event.target)) {
      profile.classList.remove('open');
    }
  });

  if (panel) {
    panel.addEventListener('click', (event) => {
      event.stopPropagation();
    });
  }
}

const chatForm = document.querySelector('[data-chat-form]');
const chatFeed = document.querySelector('[data-chat]');

if (chatForm && chatFeed) {
  chatForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = chatForm.querySelector('input');
    if (!input || !input.value.trim()) return;

    const message = document.createElement('div');
    message.className = 'chat-message';
    message.innerHTML = `<strong>You</strong><p>${input.value.trim()}</p>`;
    chatFeed.appendChild(message);
    chatFeed.scrollTop = chatFeed.scrollHeight;
    input.value = '';
  });
}

const searchInput = document.querySelector('[data-search] input');
const searchStatus = document.querySelector('[data-search-status]');
const cards = Array.from(document.querySelectorAll('.card'));

if (searchInput) {
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    let matches = 0;

    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      const isMatch = !query || text.includes(query);
      card.classList.toggle('is-hidden', !isMatch);
      if (isMatch) {
        matches += 1;
      }
    });

    if (searchStatus) {
      searchStatus.hidden = query.length === 0 || matches > 0;
    }
  });
}

const fullscreenToggles = document.querySelectorAll('[data-reader-fullscreen-toggle]');
const fullscreenOverlay = document.querySelector('[data-reader-fullscreen]');
const fullscreenClose = document.querySelector('[data-reader-fullscreen-close]');

if (fullscreenToggles.length && fullscreenOverlay && fullscreenClose) {
  const setFullscreenState = (isOpen) => {
    fullscreenOverlay.hidden = !isOpen;
    fullscreenOverlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('reader-fullscreen-open', isOpen);
    fullscreenToggles.forEach((toggle) => {
      toggle.textContent = isOpen ? 'Fullscreen On' : 'Fullscreen';
    });
  };

  fullscreenToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const shouldOpen = fullscreenOverlay.hidden;
      setFullscreenState(shouldOpen);
      if (shouldOpen) {
        fullscreenOverlay.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  });

  fullscreenClose.addEventListener('click', () => {
    setFullscreenState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !fullscreenOverlay.hidden) {
      setFullscreenState(false);
    }
  });
}


const profileMenus = document.querySelectorAll('[data-menu-panel]');
profileMenus.forEach((menuPanel) => {
  const hasCreatorModeLink = Array.from(menuPanel.querySelectorAll('a')).some((link) =>
    link.getAttribute('href') === 'publish.html',
  );

  if (!hasCreatorModeLink) {
    const creatorModeLink = document.createElement('a');
    creatorModeLink.href = 'publish.html';
    creatorModeLink.textContent = 'Creator Mode';
    menuPanel.prepend(creatorModeLink);
  }
});


const creatorFullscreenToggle = document.querySelector('[data-creator-fullscreen-toggle]');
const creatorFullscreenOverlay = document.querySelector('[data-creator-fullscreen]');
const creatorFullscreenClose = document.querySelector('[data-creator-fullscreen-close]');

if (creatorFullscreenToggle && creatorFullscreenOverlay && creatorFullscreenClose) {
  const setCreatorFullscreenState = (isOpen) => {
    creatorFullscreenOverlay.hidden = !isOpen;
    creatorFullscreenOverlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('creator-fullscreen-open', isOpen);
  };

  creatorFullscreenToggle.addEventListener('click', () => {
    setCreatorFullscreenState(true);
  });

  creatorFullscreenClose.addEventListener('click', () => {
    setCreatorFullscreenState(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !creatorFullscreenOverlay.hidden) {
      setCreatorFullscreenState(false);
    }
  });
}

const carouselRows = Array.from(document.querySelectorAll('.row')).filter((row) => row.querySelector('[data-carousel]'));

if (carouselRows.length) {
  document.body.classList.add('rows-focus-enabled');
  let lastSnapTime = 0;

  const updateRowFocus = () => {
    const viewportCenter = window.innerHeight * 0.5;
    let closestRow = null;
    let closestDistance = Number.POSITIVE_INFINITY;

    carouselRows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const rowCenter = rect.top + (rect.height / 2);
      const distance = Math.abs(rowCenter - viewportCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestRow = row;
      }
    });

    carouselRows.forEach((row) => {
      row.classList.toggle('is-scroll-focus', row === closestRow);
    });
  };

  const applyScrollResistance = (event) => {
    if (!Number.isFinite(event.deltaY) || Math.abs(event.deltaY) < 14) return;

    const focusedRow = document.querySelector('.row.is-scroll-focus');
    if (!focusedRow) return;

    const now = Date.now();
    if (now - lastSnapTime < 460) {
      event.preventDefault();
      return;
    }

    const focusedIndex = carouselRows.indexOf(focusedRow);
    const direction = event.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.min(carouselRows.length - 1, Math.max(0, focusedIndex + direction));
    const nextRow = carouselRows[nextIndex];

    if (nextRow && nextRow !== focusedRow) {
      event.preventDefault();
      lastSnapTime = now;
      nextRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  updateRowFocus();
  window.addEventListener('scroll', updateRowFocus, { passive: true });
  window.addEventListener('resize', updateRowFocus);
  window.addEventListener('wheel', applyScrollResistance, { passive: false });
}
