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

const profileForm = document.querySelector('[data-profile-form]');
const profileStatus = document.querySelector('[data-profile-status]');
const profileAvatarButton = document.querySelector('[data-profile-avatar]');
const profileAvatarImage = document.querySelector('[data-profile-avatar-image]');
const profileHeroCard = document.querySelector('[data-profile-hero]');
const profileEditButton = document.querySelector('[data-profile-edit]');
const profileCancelButton = document.querySelector('[data-profile-cancel]');
const authOverlay = document.querySelector('[data-auth-overlay]');
const authStatus = document.querySelector('[data-auth-status]');
const authForms = document.querySelectorAll('[data-auth-form]');
const authPanels = document.querySelectorAll('[data-auth-panel]');
const authToggles = document.querySelectorAll('[data-auth-toggle]');
const storageKey = 'pensupProfile';
const accountKey = 'pensupAccount';
const signedInKey = 'pensupSignedIn';
const defaults = {
  name: '',
  tags: 'nothing · here · yet',
  bio: 'nothing here yet',
  avatar: '',
};

const setAvatar = (avatar) => {
  if (!profileAvatarImage) return;
  if (avatar) {
    profileAvatarImage.src = avatar;
    profileAvatarImage.hidden = false;
  } else {
    profileAvatarImage.removeAttribute('src');
    profileAvatarImage.hidden = true;
  }
};

const applyProfile = (profile) => {
  const displayName = document.querySelector('[data-profile-display="name"]');
  const displayTags = document.querySelector('[data-profile-display="tags"]');
  const displayBio = document.querySelector('[data-profile-display="bio"]');
  const safeName = profile.name?.trim() || 'Username';
  const safeTags = profile.tags?.trim() || 'anything · you · want';
  const safeBio = profile.bio?.trim() || 'empty for now';

  if (profileForm) {
    const nameInput = profileForm.querySelector('[data-profile-input="name"]');
    const tagsInput = profileForm.querySelector('[data-profile-input="tags"]');
    const bioInput = profileForm.querySelector('[data-profile-input="bio"]');
    if (nameInput) nameInput.value = profile.name || '';
    if (tagsInput) tagsInput.value = profile.tags || '';
    if (bioInput) bioInput.value = profile.bio || '';
  }
  if (displayName) displayName.textContent = safeName;
  if (displayTags) displayTags.textContent = safeTags;
  if (displayBio) displayBio.textContent = safeBio;
  setAvatar(profile.avatar);
};

const updateStatus = (message) => {
  if (profileStatus) {
    profileStatus.textContent = message || '';
  }
};

const updateAuthStatus = (message) => {
  if (authStatus) {
    authStatus.textContent = message || '';
  }
};

const setAuthPanel = (panel) => {
  authPanels.forEach((authPanel) => {
    authPanel.hidden = authPanel.getAttribute('data-auth-panel') !== panel;
  });
};

const loadAccount = () => {
  const stored = localStorage.getItem(accountKey);
  if (!stored) return null;
  try {
    const parsed = JSON.parse(stored);
    if (!parsed.username || !parsed.password) return null;
    return parsed;
  } catch (error) {
    return null;
  }
};

const isSignedIn = () => Boolean(localStorage.getItem(signedInKey));

const setSignedIn = (username) => {
  if (username) {
    localStorage.setItem(signedInKey, username);
  } else {
    localStorage.removeItem(signedInKey);
  }
};

const loadProfile = () => {
  const stored = localStorage.getItem(storageKey);
  if (!stored) return { profile: { ...defaults }, isStored: false };
  try {
    const parsed = JSON.parse(stored);
    return {
      profile: {
        name: parsed.name || defaults.name,
        tags: parsed.tags || defaults.tags,
        bio: parsed.bio || defaults.bio,
        avatar: parsed.avatar || defaults.avatar,
      },
      isStored: true,
    };
  } catch (error) {
    return { profile: { ...defaults }, isStored: false };
  }
};

const setBlankState = (profile, isStored, signedIn) => {
  if (!profileHeroCard) return;
  const isBlank = !signedIn || (!isStored && !profile.name && !profile.tags && !profile.bio);
  profileHeroCard.classList.toggle('is-blank', isBlank);
};

const updateAuthUI = (signedIn) => {
  if (authOverlay) {
    authOverlay.hidden = signedIn;
  }
  if (profileForm) {
    const editableFields = profileForm.querySelectorAll('input, textarea');
    editableFields.forEach((field) => {
      field.disabled = !signedIn;
    });
  }
  if (profileHeroCard) {
    profileHeroCard.classList.toggle('is-locked', !signedIn);
  }
  if (profileAvatarButton) {
    profileAvatarButton.classList.toggle('is-editable', signedIn);
  }
};

const setEditState = (isEditing) => {
  if (!profileHeroCard) return;
  profileHeroCard.classList.toggle('is-editing', isEditing);
  if (profileEditButton) {
    profileEditButton.textContent = isEditing ? 'Close editor' : 'Edit profile';
  }
};

const { profile: initialProfile, isStored } = loadProfile();
applyProfile(initialProfile);
const signedIn = isSignedIn();
setBlankState(initialProfile, isStored, signedIn);
updateAuthUI(signedIn);
setEditState(false);
if (authPanels.length) {
  setAuthPanel('signin');
}

if (profileForm) {
  const nameInput = profileForm.querySelector('[data-profile-input="name"]');
  const tagsInput = profileForm.querySelector('[data-profile-input="tags"]');
  const bioInput = profileForm.querySelector('[data-profile-input="bio"]');
  const avatarInput = profileForm.querySelector('[data-profile-input="avatar"]');
  const resetButton = profileForm.querySelector('[data-profile-reset]');
  let avatarData = initialProfile.avatar || defaults.avatar;

  const setInputs = (profile) => {
    if (nameInput) nameInput.value = profile.name;
    if (tagsInput) tagsInput.value = profile.tags;
    if (bioInput) bioInput.value = profile.bio;
    if (avatarInput) avatarInput.value = '';
    avatarData = profile.avatar || defaults.avatar;
    setAvatar(avatarData);
  };

  setInputs(initialProfile);
  if (profileAvatarButton && avatarInput) {
    profileAvatarButton.addEventListener('click', () => {
      if (!isSignedIn()) {
        updateStatus('Sign in to edit your profile.');
        return;
      }
      avatarInput.click();
    });
  }

  if (avatarInput) {
    avatarInput.addEventListener('change', () => {
      const file = avatarInput.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        avatarData = result;
        setAvatar(avatarData);
      });
      reader.readAsDataURL(file);
    });
  }

  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const profile = {
      name: nameInput?.value.trim() || defaults.name,
      tags: tagsInput?.value.trim() || defaults.tags,
      bio: bioInput?.value.trim() || defaults.bio,
      avatar: avatarData || defaults.avatar,
    };
    localStorage.setItem(storageKey, JSON.stringify(profile));
    applyProfile(profile);
    setInputs(profile);
    updateStatus('Profile saved locally on this device.');
    setBlankState(profile, true, true);
    setEditState(false);
  });

  if (resetButton) {
    resetButton.addEventListener('click', () => {
      localStorage.removeItem(storageKey);
      applyProfile(defaults);
      setInputs(defaults);
      updateStatus('');
      setBlankState(defaults, false, isSignedIn());
      setEditState(false);
    });
  }
}

if (profileEditButton) {
  profileEditButton.addEventListener('click', () => {
    if (!isSignedIn()) {
      updateStatus('Sign in to edit your profile.');
      return;
    }
    setEditState(!profileHeroCard?.classList.contains('is-editing'));
  });
}

if (profileCancelButton) {
  profileCancelButton.addEventListener('click', () => {
    setEditState(false);
  });
}

const completeAuth = (message, username) => {
  setSignedIn(username);
  updateAuthStatus(message);
  updateStatus(message);
  setAuthPanel('signin');
  updateAuthUI(true);
  setBlankState(loadProfile().profile, true, true);
};

authForms.forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const type = form.getAttribute('data-auth-form');
    const usernameInput = form.querySelector('input[type="text"]');
    const passwordInput = form.querySelector('input[type="password"]');
    const username = usernameInput?.value.trim();
    const password = passwordInput?.value.trim();

    if (!username || !password) {
      updateAuthStatus('Please enter a username and password.');
      return;
    }

    if (type === 'signup') {
      localStorage.setItem(accountKey, JSON.stringify({ username, password }));
      const profile = {
        name: username,
        tags: defaults.tags,
        bio: defaults.bio,
        avatar: defaults.avatar,
      };
      localStorage.setItem(storageKey, JSON.stringify(profile));
      applyProfile(profile);
      completeAuth('Account created successfully.', username);
    } else {
      const account = loadAccount();
      if (!account || account.username !== username || account.password !== password) {
        updateAuthStatus('Cannot find that account. Please create one first.');
        return;
      }
      completeAuth('Signed in successfully.', username);
    }

    const { profile: currentProfile } = loadProfile();
    if (!currentProfile.name && username) {
      const profile = {
        name: username,
        tags: currentProfile.tags || defaults.tags,
        bio: currentProfile.bio || defaults.bio,
        avatar: currentProfile.avatar || defaults.avatar,
      };
      localStorage.setItem(storageKey, JSON.stringify(profile));
      applyProfile(profile);
    }

    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
  });
});

authToggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const target = toggle.getAttribute('data-auth-toggle');
    if (!target) return;
    updateAuthStatus('');
    setAuthPanel(target);
  });
});

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
