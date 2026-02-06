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

const fullscreenToggle = document.querySelector('[data-reader-fullscreen-toggle]');
const fullscreenOverlay = document.querySelector('[data-reader-fullscreen]');
const fullscreenClose = document.querySelector('[data-reader-fullscreen-close]');

if (fullscreenToggle && fullscreenOverlay && fullscreenClose) {
  const setFullscreenState = (isOpen) => {
    fullscreenOverlay.hidden = !isOpen;
    fullscreenOverlay.setAttribute('aria-hidden', String(!isOpen));
    document.body.classList.toggle('reader-fullscreen-open', isOpen);
    fullscreenToggle.textContent = isOpen ? 'Fullscreen On' : 'Fullscreen';
  };

  fullscreenToggle.addEventListener('click', () => {
    const shouldOpen = fullscreenOverlay.hidden;
    setFullscreenState(shouldOpen);
    if (shouldOpen) {
      fullscreenOverlay.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
