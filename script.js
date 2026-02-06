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

const pageSections = Array.from(document.querySelectorAll('main > section'));

if (pageSections.length > 1) {
  let isSectionScrollLocked = false;

  const getNearestSectionIndex = () => {
    const probe = window.scrollY + (window.innerHeight * 0.35);
    let nearestIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    pageSections.forEach((section, index) => {
      const distance = Math.abs(section.offsetTop - probe);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  };

  window.addEventListener('wheel', (event) => {
    if (event.ctrlKey || event.shiftKey || isSectionScrollLocked) return;

    const targetElement = event.target;
    const isInteractiveElement = targetElement instanceof Element
      && !!targetElement.closest('input, textarea, select, [contenteditable="true"]');

    if (isInteractiveElement || Math.abs(event.deltaY) < 10) return;

    const currentIndex = getNearestSectionIndex();
    const direction = event.deltaY > 0 ? 1 : -1;
    const targetIndex = Math.max(0, Math.min(pageSections.length - 1, currentIndex + direction));

    if (targetIndex === currentIndex) return;

    event.preventDefault();
    isSectionScrollLocked = true;

    pageSections[targetIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    window.setTimeout(() => {
      isSectionScrollLocked = false;
    }, 650);
  }, { passive: false });
}

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
