const carousels = document.querySelectorAll('[data-carousel]');
const scrollButtons = document.querySelectorAll('[data-scroll-left], [data-scroll-right]');

scrollButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const container = button.closest('.row, .hero-carousel');
    if (!container) return;
    const carousel = container.querySelector('[data-carousel]');
    if (!carousel) return;
    const direction = button.hasAttribute('data-scroll-left') ? -1 : 1;
    const isHeroCarousel = carousel.classList.contains('hero-strip');
    const scrollAmount = carousel.clientWidth * (isHeroCarousel ? 1 : 0.8);
    carousel.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
  });
});

const profile = document.querySelector('[data-menu]');

const highlightedRows = Array.from(document.querySelectorAll('.row')).filter((row) => row.querySelector('[data-carousel]'));

if (highlightedRows.length) {
  const setHighlightedRow = () => {
    const viewportCenter = window.innerHeight * 0.5;
    let activeRow = highlightedRows[0];
    let minDistance = Number.POSITIVE_INFINITY;

    highlightedRows.forEach((row) => {
      const rect = row.getBoundingClientRect();
      const rowCenter = rect.top + (rect.height * 0.5);
      const distance = Math.abs(rowCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        activeRow = row;
      }
    });

    highlightedRows.forEach((row) => {
      row.classList.toggle('is-active-row', row === activeRow);
    });
  };

  let scheduled = false;
  const scheduleHighlightUpdate = () => {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(() => {
      setHighlightedRow();
      scheduled = false;
    });
  };

  window.addEventListener('scroll', scheduleHighlightUpdate, { passive: true });
  window.addEventListener('resize', scheduleHighlightUpdate);
  setHighlightedRow();
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

const profilePage = document.querySelector('.profile-page');
const editProfileToggle = document.querySelector('[data-edit-profile-toggle]');
const editProfileSave = document.querySelector('[data-edit-profile-save]');
const editProfileCancel = document.querySelector('[data-edit-profile-cancel]');

if (profilePage && editProfileToggle) {
  const setEditState = (isEditing) => {
    profilePage.classList.toggle('is-editing', isEditing);
    editProfileToggle.setAttribute('aria-expanded', String(isEditing));
    if (isEditing) {
      const firstInput = profilePage.querySelector('.profile-form input, .profile-form textarea');
      if (firstInput) {
        firstInput.focus();
      }
    }
  };

  editProfileToggle.addEventListener('click', () => {
    const isEditing = !profilePage.classList.contains('is-editing');
    setEditState(isEditing);
  });

  if (editProfileSave) {
    editProfileSave.addEventListener('click', () => {
      setEditState(false);
    });
  }

  if (editProfileCancel) {
    editProfileCancel.addEventListener('click', () => {
      setEditState(false);
    });
  }
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

const publishSteps = Array.from(document.querySelectorAll('[data-publish-step]'));
const publishTabs = Array.from(document.querySelectorAll('[data-publish-tab]'));

if (publishSteps.length && publishTabs.length) {
  const nextButtons = Array.from(document.querySelectorAll('[data-publish-next]'));
  let currentStepIndex = 0;
  let maxUnlockedIndex = 0;

  const updatePublishSteps = (index) => {
    currentStepIndex = index;
    publishSteps.forEach((step, stepIndex) => {
      step.hidden = stepIndex !== index;
    });
    publishTabs.forEach((tab, tabIndex) => {
      const isActive = tabIndex === index;
      const isLocked = tabIndex > maxUnlockedIndex;
      tab.classList.toggle('active', isActive);
      tab.disabled = isLocked;
      tab.setAttribute('aria-disabled', String(isLocked));
      tab.setAttribute('aria-selected', String(isActive));
    });
  };

  const unlockStep = (index) => {
    maxUnlockedIndex = Math.max(maxUnlockedIndex, index);
  };

  updatePublishSteps(0);

  nextButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const nextIndex = Math.min(currentStepIndex + 1, publishSteps.length - 1);
      unlockStep(nextIndex);
      updatePublishSteps(nextIndex);
      publishSteps[nextIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  publishTabs.forEach((tab, tabIndex) => {
    tab.addEventListener('click', () => {
      if (tabIndex > maxUnlockedIndex) return;
      updatePublishSteps(tabIndex);
    });
  });
}
