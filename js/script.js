document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // GLOBAL SUPABASE DATA & STATE
  // ==========================================
  let supabaseClient = null;
  let isAdminLoggedIn = false;
  let currentGalleryData = []; // Caches current gallery list
  let visibleGalleryData = []; // Currently filtered active gallery list for lightbox

  function isVideoUrl(url) {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v', '.avi', '.quicktime'];
    const cleanUrl = url.split('?')[0].toLowerCase();
    return videoExtensions.some(ext => cleanUrl.endsWith(ext));
  }

  // Default hardcoded fallback data (shows if Supabase is unconfigured or empty)
  const DEFAULT_GALLERY_DATA = [
    {
      id: 'default_hair_1',
      title: 'Signature Balayage Wave',
      category: 'hair',
      description: 'Precision hand-painted golden highlights on waves.',
      image_url: 'assets/hair.jpg',
      isDefault: true
    },
    {
      id: 'default_video_1',
      title: 'Couture Makeup Application',
      category: 'makeup',
      description: 'Luxury eyeshadow styling session by Sarah Jenkins.',
      image_url: 'https://assets.mixkit.co/videos/preview/mixkit-makeup-brush-applying-eyeshadow-40742-large.mp4',
      media_type: 'video',
      isDefault: true
    },
    {
      id: 'default_bridal_1',
      title: 'Royal Wedding Glow',
      category: 'makeup',
      description: 'Full bridal makeover, HD airbrush, and jewelry draping.',
      image_url: 'assets/bridal.jpg',
      isDefault: true
    },
    {
      id: 'default_nails_1',
      title: 'Rose Gold Marble Gel',
      category: 'nails',
      description: 'Hand sculpted extensions with marble gel overlays.',
      image_url: 'assets/nails.jpg',
      isDefault: true
    },
    {
      id: 'default_spa_1',
      title: 'Organic Facial Aromatherapy',
      category: 'skin',
      description: 'Nourishing facial with basalt hot stones and natural oils.',
      image_url: 'assets/spa.jpg',
      isDefault: true
    },
    {
      id: 'default_hair_2',
      title: 'Couture Extension Style',
      category: 'hair',
      description: 'Full head volume extensions with glossy blowout finish.',
      image_url: 'assets/hair.jpg',
      isDefault: true
    },
    {
      id: 'default_bridal_2',
      title: 'Red Carpet Evening Glam',
      category: 'makeup',
      description: 'Contour highlight makeup with custom smokey eyes.',
      image_url: 'assets/bridal.jpg',
      isDefault: true
    }
  ];

  // Default hardcoded fallback data for opening hours
  const DEFAULT_TIMINGS_DATA = [
    { day: 'Monday', hours: '09:00 AM - 08:30 PM', is_highlighted: false, order_index: 1 },
    { day: 'Tuesday', hours: '09:00 AM - 08:30 PM', is_highlighted: false, order_index: 2 },
    { day: 'Wednesday', hours: '09:00 AM - 08:30 PM', is_highlighted: false, order_index: 3 },
    { day: 'Thursday', hours: '09:00 AM - 08:30 PM', is_highlighted: false, order_index: 4 },
    { day: 'Friday', hours: '09:00 AM - 09:30 PM', is_highlighted: false, order_index: 5 },
    { day: 'Saturday', hours: '08:00 AM - 09:30 PM', is_highlighted: true, order_index: 6 },
    { day: 'Sunday', hours: '09:00 AM - 05:00 PM', is_highlighted: true, order_index: 7 }
  ];

  let currentTimingsData = [];

  async function fetchAndRenderTimings() {
    const tbody = document.getElementById('timingsTableBody');
    if (!tbody) return;

    let items = [];
    if (supabaseClient) {
      try {
        let { data, error } = await supabaseClient
          .from('opening_hours')
          .select('*')
          .order('order_index', { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          items = data;
        }
      } catch (e) {
        console.warn("Hours Fetch failed, falling back to defaults: ", e.message);
      }
    }

    if (items.length === 0) {
      items = DEFAULT_TIMINGS_DATA;
    }

    currentTimingsData = items;
    renderTimingsTable(items);
  }

  function renderTimingsTable(items) {
    const tbody = document.getElementById('timingsTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    items.forEach(item => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="timings-day">${item.day}</td>
        <td class="timings-hours ${item.is_highlighted ? 'highlighted' : ''}">${item.hours}</td>
      `;
      tbody.appendChild(tr);
    });
  }

  function populateAdminHoursForm() {
    const rows = document.querySelectorAll('.hours-edit-row');
    rows.forEach(row => {
      const day = row.getAttribute('data-day');
      const match = currentTimingsData.find(t => t.day.toLowerCase() === day.toLowerCase());
      
      if (match) {
        const input = row.querySelector('.hours-edit-input');
        const chk = row.querySelector('.hours-edit-chk');
        
        if (input) input.value = match.hours;
        if (chk) chk.checked = match.is_highlighted;
      }
    });
  }

  function startInlineTimingsEdit() {
    if (!isAdminLoggedIn) {
      showToast("Please sign in to your Admin account to edit opening hours.", true);
      const adminDashboardModal = document.getElementById('adminDashboardModal');
      if (adminDashboardModal) {
        const tabAuthBtn = document.getElementById('tabAuthBtn');
        if (tabAuthBtn) tabAuthBtn.click();
        adminDashboardModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    const tbody = document.getElementById('timingsTableBody');
    if (!tbody) return;

    const editBtn = document.getElementById('inlineEditHoursBtn');
    const saveBtn = document.getElementById('inlineSaveHoursBtn');
    const cancelBtn = document.getElementById('inlineCancelHoursBtn');

    if (editBtn) editBtn.style.display = 'none';
    if (saveBtn) saveBtn.style.display = 'inline-flex';
    if (cancelBtn) cancelBtn.style.display = 'inline-flex';

    tbody.innerHTML = '';
    currentTimingsData.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="timings-day" style="vertical-align: middle;">${item.day}</td>
        <td>
          <div class="inline-hours-edit-cell">
            <input type="text" class="inline-hours-table-input" value="${item.hours}" data-day="${item.day}" placeholder="e.g. Closed or 09:00 AM - 08:30 PM">
            <label class="inline-hours-chk-label">
              <input type="checkbox" class="inline-hours-chk" ${item.is_highlighted ? 'checked' : ''}> Gold
            </label>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  function cancelInlineTimingsEdit() {
    const editBtn = document.getElementById('inlineEditHoursBtn');
    const saveBtn = document.getElementById('inlineSaveHoursBtn');
    const cancelBtn = document.getElementById('inlineCancelHoursBtn');

    if (editBtn) editBtn.style.display = 'inline-flex';
    if (saveBtn) saveBtn.style.display = 'none';
    if (cancelBtn) cancelBtn.style.display = 'none';

    renderTimingsTable(currentTimingsData);
  }

  async function saveInlineTimings() {
    const tbody = document.getElementById('timingsTableBody');
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    const payload = [];

    rows.forEach((tr, index) => {
      const day = tr.querySelector('.timings-day').textContent.trim();
      const input = tr.querySelector('.inline-hours-table-input');
      const chk = tr.querySelector('.inline-hours-chk');
      
      if (input) {
        payload.push({
          day: day,
          hours: input.value.trim(),
          is_highlighted: chk ? chk.checked : false,
          order_index: index + 1
        });
      }
    });

    if (!supabaseClient) {
      currentTimingsData = payload;
      cancelInlineTimingsEdit();
      showToast("Hours saved locally (Sandbox mode).");
      return;
    }

    try {
      const { error } = await supabaseClient
        .from('opening_hours')
        .upsert(payload, { onConflict: 'day' });

      if (error) throw error;

      showToast("Operational hours updated successfully!");
      currentTimingsData = payload;
      cancelInlineTimingsEdit();
      populateAdminHoursForm();
    } catch (err) {
      showToast(`Save failed: ${err.message}`, true);
    }
  }

  // Hook up event listeners for inline timings
  const inlineEditHoursBtn = document.getElementById('inlineEditHoursBtn');
  const inlineCancelHoursBtn = document.getElementById('inlineCancelHoursBtn');
  const inlineSaveHoursBtn = document.getElementById('inlineSaveHoursBtn');

  if (inlineEditHoursBtn) inlineEditHoursBtn.addEventListener('click', startInlineTimingsEdit);
  if (inlineCancelHoursBtn) inlineCancelHoursBtn.addEventListener('click', cancelInlineTimingsEdit);
  if (inlineSaveHoursBtn) inlineSaveHoursBtn.addEventListener('click', saveInlineTimings);


  // ==========================================
  // DYNAMIC IMAGE ASSETS FALLBACK ROUTER
  // Maps placeholder keys to fallback paths
  // ==========================================
  const IMAGE_FALLBACKS = {
    logo: {
      type: 'img',
      selector: '.logo-img, .footer-logo-img',
      local: 'assets/logo.png',
      fallback: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><circle cx="50" cy="50" r="46" fill="none" stroke="%23d4af37" stroke-width="2"/><text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="Georgia, serif" font-size="28" fill="%23d4af37" font-weight="bold">NL</text><text x="50%" y="70%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="8" fill="%23d4af37" letter-spacing="2">NEW LOOK</text></svg>'
    },
    hero: {
      type: 'bg',
      selector: '.hero-bg-image',
      local: 'assets/hero_bg.jpg',
      fallback: 'https://images.unsplash.com/photo-1621590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1600'
    },
    hair: {
      type: 'img',
      selector: '[data-fallback-id="hair"]',
      local: 'assets/hair.jpg',
      fallback: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&q=80&w=800'
    },
    bridal: {
      type: 'img',
      selector: '[data-fallback-id="bridal"]',
      local: 'assets/bridal.jpg',
      fallback: 'https://images.unsplash.com/photo-1484862149534-112674175e25?auto=format&fit=crop&q=80&w=800'
    },
    nails: {
      type: 'img',
      selector: '[data-fallback-id="nails"]',
      local: 'assets/nails.jpg',
      fallback: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&q=80&w=800'
    },
    spa: {
      type: 'img',
      selector: '[data-fallback-id="spa"]',
      local: 'assets/spa.jpg',
      fallback: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800'
    }
  };

  function resolveAssetFallbacks(element = document) {
    Object.keys(IMAGE_FALLBACKS).forEach(key => {
      const config = IMAGE_FALLBACKS[key];
      const elements = element.querySelectorAll(config.selector);
      
      elements.forEach(el => {
        const testImg = new Image();
        testImg.onload = () => {
          el.src = config.local;
        };
        testImg.onerror = () => {
          el.src = config.fallback;
        };
        testImg.src = config.local;
      });
    });
  }

  // Run on page load
  resolveAssetFallbacks();

  function resolveBodyBackground() {
    const testImg = new Image();
    const local = 'assets/hero_bg.jpg';
    const fallback = 'https://images.unsplash.com/photo-1621590832167-7bcbfaa6381f?auto=format&fit=crop&q=80&w=1600';
    
    testImg.onload = () => {
      document.body.style.backgroundImage = `linear-gradient(rgba(10, 10, 10, 0.45), rgba(10, 10, 10, 0.45)), url('${local}')`;
    };
    testImg.onerror = () => {
      document.body.style.backgroundImage = `linear-gradient(rgba(10, 10, 10, 0.45), rgba(10, 10, 10, 0.45)), url('${fallback}')`;
    };
    testImg.src = local;
  }
  resolveBodyBackground();

  // ==========================================
  // TOAST ALERTS NOTIFICATIONS
  // ==========================================
  function showToast(message, isError = false) {
    // Remove existing toast if visible
    const oldToast = document.querySelector('.toast-alert');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = `toast-alert ${isError ? 'toast-alert-error' : ''}`;
    
    const iconName = isError ? 'alert-triangle' : 'check-circle';
    toast.innerHTML = `
      <i data-lucide="${iconName}" style="width: 18px; height: 18px; flex-shrink: 0;"></i>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    lucide.createIcons({ attrs: { 'data-lucide': iconName } });
    
    // Auto-remove after 4.5 seconds
    setTimeout(() => {
      toast.style.animation = 'slideToastIn 0.3s ease reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }

  // ==========================================
  // SUPABASE CONFIGURATION INITIALIZATION
  // ==========================================
  function initSupabase() {
    const url = localStorage.getItem('supabase_url') || 'https://tftfjndtbuadcocfwuwn.supabase.co';
    const key = localStorage.getItem('supabase_key');
    
    if (url && key) {
      try {
        if (window.supabase) {
          supabaseClient = window.supabase.createClient(url, key);
          console.log("Supabase client initialized with URL: " + url);
          checkAuthSession();
        } else {
          console.error("Supabase CDN library not loaded yet.");
        }
      } catch (e) {
        console.error("Failed to initialize Supabase: ", e);
      }
    } else {
      console.log("Supabase credentials incomplete. Running in fallback mode.");
    }
  }

  initSupabase();

  // ==========================================
  // SECURE AUTH SESSION TRACKING
  // ==========================================
  async function checkAuthSession() {
    if (!supabaseClient) return;

    try {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (error) throw error;

      if (session) {
        setAdminLoggedIn(true);
      } else {
        setAdminLoggedIn(false);
      }
    } catch (e) {
      console.error("Session check error: ", e.message);
      setAdminLoggedIn(false);
    }
  }

  function setAdminLoggedIn(loggedIn) {
    isAdminLoggedIn = loggedIn;
    const body = document.body;
    const adminWrapper = document.getElementById('adminAddPhotoWrapper');
    const loginForm = document.getElementById('adminLoginForm');
    const actionPanel = document.getElementById('adminActionPanel');
    const tabHoursBtn = document.getElementById('tabHoursBtn');

    if (loggedIn) {
      body.classList.add('admin-active');
      if (adminWrapper) adminWrapper.style.display = 'block';
      if (loginForm) loginForm.style.display = 'none';
      if (actionPanel) actionPanel.style.display = 'block';
      if (tabHoursBtn) tabHoursBtn.style.display = 'block';
    } else {
      body.classList.remove('admin-active');
      if (adminWrapper) adminWrapper.style.display = 'none';
      if (loginForm) loginForm.style.display = 'block';
      if (actionPanel) actionPanel.style.display = 'none';
      if (tabHoursBtn) tabHoursBtn.style.display = 'none';
      cancelInlineTimingsEdit();
    }

    // Refresh display of delete buttons
    document.querySelectorAll('.gallery-item-delete-btn').forEach(btn => {
      btn.style.display = loggedIn ? 'flex' : 'none';
    });
  }

  // ==========================================
  // DYNAMIC GALLERY GENERATOR & DB SYNC
  // ==========================================
  async function fetchAndRenderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    let items = [];
    let loadedFromDb = false;

    if (supabaseClient) {
      try {
        let { data, error } = await supabaseClient
          .from('gallery_items')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        if (data && data.length > 0) {
          items = data;
          loadedFromDb = true;
          console.log(`Loaded ${items.length} items from Supabase.`);
        }
      } catch (e) {
        console.warn("DB Fetch failed, falling back to local showcase images. Error: ", e.message);
      }
    }

    if (items.length === 0) {
      items = DEFAULT_GALLERY_DATA;
      console.log("Rendering default fallback gallery items.");
    }

    currentGalleryData = items; // Cache records
    applyGalleryFilter();
  }

  function applyGalleryFilter() {
    const activeTab = document.querySelector('.gallery-tab-btn.active');
    const filter = activeTab ? activeTab.getAttribute('data-gallery-filter') : 'all';

    visibleGalleryData = currentGalleryData.filter(item => {
      const isVideo = item.media_type === 'video' || isVideoUrl(item.image_url);
      if (filter === 'all') return true;
      if (filter === 'photo') return !isVideo;
      if (filter === 'video') return isVideo;
      return true;
    });

    renderGalleryGrid(currentGalleryData);
  }

  function getCategoryLabel(cat) {
    const labels = {
      hair: 'Hair Design',
      makeup: 'Bridal Makeover',
      nails: 'Nail Art',
      skin: 'Skin Therapy'
    };
    return labels[cat.toLowerCase()] || 'Glamour Styling';
  }

  function renderGalleryGrid(items) {
    const grid = document.getElementById('galleryGrid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear container

    items.forEach((item) => {
      const isVideo = item.media_type === 'video' || isVideoUrl(item.image_url);
      const isVisible = visibleGalleryData.some(v => v.id === item.id);

      const card = document.createElement('div');
      card.className = `gallery-item ${isVisible ? '' : 'hidden'}`;
      card.setAttribute('data-category', item.category);
      card.setAttribute('data-id', item.id);

      // Resolve media tag
      let mediaTag = '';
      if (isVideo) {
        mediaTag = `<video class="gallery-img" src="${item.image_url}" autoplay loop muted playsinline onerror="this.style.display='none';"></video>`;
      } else {
        if (item.isDefault) {
          mediaTag = `<img class="gallery-img" data-fallback-id="${item.category}" src="${item.image_url}" alt="${item.title}">`;
        } else {
          mediaTag = `<img class="gallery-img" src="${item.image_url}" alt="${item.title}" onerror="this.src='assets/hair.jpg';">`;
        }
      }

      card.innerHTML = `
        <div class="gallery-image-container">
          ${mediaTag}
        </div>
        <div class="gallery-overlay">
          <i class="gallery-zoom-icon" data-lucide="maximize-2"></i>
          <span class="gallery-cat">${getCategoryLabel(item.category)}</span>
          <h3 class="gallery-title">${item.title}</h3>
        </div>
        <button class="gallery-item-delete-btn" data-id="${item.id}" style="display: ${isAdminLoggedIn ? 'flex' : 'none'};" aria-label="Delete media">
          <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
        </button>
      `;

      // Set click events on card overlay to open Lightbox
      card.querySelector('.gallery-overlay').addEventListener('click', () => {
        const visibleIndex = visibleGalleryData.findIndex(v => v.id === item.id);
        if (visibleIndex !== -1) {
          openLightbox(visibleIndex);
        }
      });

      // Hook up Delete Button click
      const deleteBtn = card.querySelector('.gallery-item-delete-btn');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to remove "${item.title}" from the public gallery?`)) {
          deleteGalleryItem(item.id, card);
        }
      });

      grid.appendChild(card);
    });

    // Reinitialize icons in grid
    lucide.createIcons({
      attrs: { 'class': 'gallery-zoom-icon' }
    });

    // Resolve fallback files inside grid (for fallback cards only)
    resolveAssetFallbacks(grid);
  }

  // Hook up gallery media tabs click listeners
  const galleryFilterBtns = document.querySelectorAll('.gallery-tab-btn');
  galleryFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galleryFilterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyGalleryFilter();
    });
  });

  // Trigger loading gallery and timings on startup
  fetchAndRenderGallery();
  fetchAndRenderTimings();

  // ==========================================
  // UPLOAD AND STORAGE ENGINE
  // ==========================================
  async function deleteGalleryItem(id, cardElement) {
    if (!supabaseClient) return;

    try {
      // 1. Fetch item to retrieve image URL (to delete from storage too)
      const { data: itemData, error: fetchError } = await supabaseClient
        .from('gallery_items')
        .select('image_url')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // 2. Delete row from Database
      const { error: dbError } = await supabaseClient
        .from('gallery_items')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // 3. Try to clean up storage asset
      if (itemData && itemData.image_url) {
        const urlParts = itemData.image_url.split('/storage/v1/object/public/gallery-images/');
        if (urlParts.length > 1) {
          const filePath = urlParts[1];
          await supabaseClient.storage.from('gallery-images').remove([filePath]);
        }
      }

      // Smooth remove animation
      cardElement.style.transform = 'scale(0.8)';
      cardElement.style.opacity = '0';
      setTimeout(() => {
        cardElement.remove();
        showToast("Image removed from gallery.");
        // Refresh local cache
        currentGalleryData = currentGalleryData.filter(item => item.id !== id);
      }, 300);

    } catch (e) {
      showToast(`Delete failed: ${e.message}`, true);
    }
  }

  // ==========================================
  // SCROLL EFFECTS & STICKY HEADER
  // ==========================================
  const header = document.querySelector('.header');
  const progressBar = document.querySelector('.scroll-progress-bar');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight > 0) {
      const scrollPercent = (window.scrollY / windowHeight) * 100;
      progressBar.style.width = scrollPercent + '%';
    }
  });

  // ==========================================
  // MOBILE NAVIGATION DRAWER
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navOverlay = document.querySelector('.nav-overlay');
  const navLinks = document.querySelectorAll('.nav-link');

  function toggleMobileMenu() {
    navToggle.classList.toggle('open');
    navMenu.classList.toggle('open');
    navOverlay.classList.toggle('open');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
  }

  if (navToggle) navToggle.addEventListener('click', toggleMobileMenu);
  if (navOverlay) navOverlay.addEventListener('click', toggleMobileMenu);

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) toggleMobileMenu();
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });

  // ==========================================
  // SERVICE CATALOG SEARCH & FILTER TABS
  // ==========================================
  const searchInput = document.querySelector('.search-input');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  let activeCategory = 'all';
  let searchQuery = '';

  function filterServices() {
    serviceCards.forEach(card => {
      const title = card.querySelector('.service-title').textContent.toLowerCase();
      const desc = card.querySelector('.service-desc').textContent.toLowerCase();
      const category = card.getAttribute('data-category');

      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-filter');
      filterServices();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterServices();
    });
  }

  // ==========================================
  // LIGHTBOX PORTFOLIO GALLERY SLIDESHOW
  // ==========================================
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-nav-prev');
  const lightboxNext = document.querySelector('.lightbox-nav-next');
  const captionCat = document.querySelector('.lightbox-caption-cat');
  const captionTitle = document.querySelector('.lightbox-caption-title');

  let currentGalleryIndex = 0;

  function openLightbox(index) {
    if (visibleGalleryData.length === 0) return;
    currentGalleryIndex = index;
    const item = visibleGalleryData[currentGalleryIndex];
    const isVideo = item.media_type === 'video' || isVideoUrl(item.image_url);
    
    let mediaSource = item.image_url;
    if (item.isDefault) {
      const element = document.querySelector(`[data-id="${item.id}"] .gallery-img`);
      if (element) mediaSource = element.src;
    }

    const wrapper = document.querySelector('.lightbox-img-wrapper');
    if (wrapper) {
      wrapper.innerHTML = '';
      if (isVideo) {
        const video = document.createElement('video');
        video.className = 'lightbox-img';
        video.src = mediaSource;
        video.controls = true;
        video.autoplay = true;
        video.style.maxWidth = '100%';
        video.style.maxHeight = '70vh';
        video.style.objectFit = 'contain';
        video.style.opacity = '0';
        video.style.transform = 'scale(0.95)';
        video.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        wrapper.appendChild(video);
        setTimeout(() => {
          video.style.opacity = '1';
          video.style.transform = 'scale(1)';
        }, 50);
      } else {
        const img = document.createElement('img');
        img.className = 'lightbox-img';
        img.src = mediaSource;
        img.alt = item.title;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '70vh';
        img.style.objectFit = 'contain';
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        wrapper.appendChild(img);
        setTimeout(() => {
          img.style.opacity = '1';
          img.style.transform = 'scale(1)';
        }, 50);
      }
    }

    if (captionCat) captionCat.textContent = getCategoryLabel(item.category);
    if (captionTitle) captionTitle.textContent = item.title;

    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    const wrapper = document.querySelector('.lightbox-img-wrapper');
    if (wrapper) {
      const video = wrapper.querySelector('video');
      if (video) video.pause();
    }
  }

  function showNext() {
    if (visibleGalleryData.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex + 1) % visibleGalleryData.length;
    openLightbox(currentGalleryIndex);
  }

  function showPrev() {
    if (visibleGalleryData.length === 0) return;
    currentGalleryIndex = (currentGalleryIndex - 1 + visibleGalleryData.length) % visibleGalleryData.length;
    openLightbox(currentGalleryIndex);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', showNext);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrev);

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-content')) {
        closeLightbox();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // ==========================================
  // TESTIMONIALS SLIDER CAROUSEL
  // ==========================================
  const testimonialSlides = document.querySelectorAll('.testimonial-slide');
  const sliderDots = document.querySelector('.slider-dots');
  let currentSlide = 0;
  let testimonialInterval;

  if (sliderDots && testimonialSlides.length > 0) {
    testimonialSlides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        goToSlide(index);
        resetAutoSlider();
      });
      sliderDots.appendChild(dot);
    });
  }

  function goToSlide(index) {
    testimonialSlides[currentSlide].classList.remove('active');
    const dots = document.querySelectorAll('.slider-dot');
    if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
    
    currentSlide = index;
    
    testimonialSlides[currentSlide].classList.add('active');
    if (dots[currentSlide]) dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    if (testimonialSlides.length === 0) return;
    const nextIndex = (currentSlide + 1) % testimonialSlides.length;
    goToSlide(nextIndex);
  }

  function startAutoSlider() {
    testimonialInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlider() {
    clearInterval(testimonialInterval);
    startAutoSlider();
  }

  if (testimonialSlides.length > 0) {
    startAutoSlider();
  }

  // ==========================================
  // APPOINTMENT SCHEDULER & BOOKING LOGIC
  // ==========================================
  const bookingForm = document.getElementById('bookingForm');
  const dateInput = document.getElementById('bookingDate');
  const slotsContainer = document.getElementById('slotsContainer');
  const serviceSelect = document.getElementById('bookingService');
  const stylistSelect = document.getElementById('bookingStylist');
  const bookingModal = document.getElementById('bookingModal');
  const closeModalBtn = document.querySelector('.ticket-close-btn');
  const bookQuickBtns = document.querySelectorAll('.service-book-btn, .featured-book-now-btn');

  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1;
    let dd = today.getDate();

    if (mm < 10) mm = '0' + mm;
    if (dd < 10) dd = '0' + dd;

    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  bookQuickBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      
      const serviceName = btn.getAttribute('data-service');
      if (serviceName && serviceSelect) {
        for (let option of serviceSelect.options) {
          if (option.value.toLowerCase() === serviceName.toLowerCase()) {
            serviceSelect.value = option.value;
            break;
          }
        }
      }

      const bookingSection = document.getElementById('booking');
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const baseSlots = ['09:00 AM', '10:30 AM', '11:00 AM', '12:30 PM', '02:00 PM', '03:30 PM', '04:00 PM', '05:30 PM', '06:00 PM', '07:30 PM'];
  
  function populateTimeSlots(dateString) {
    if (!slotsContainer) return;
    slotsContainer.innerHTML = '';
    
    const seed = dateString.split('-').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const availableSlots = baseSlots.filter((_, idx) => {
      return ((seed + idx) % 10) < 7;
    });

    if (availableSlots.length === 0) {
      slotsContainer.innerHTML = '<p style="grid-column: span 3; font-size: 0.8rem; color: var(--accent-rose); font-style: italic;">No slots available for this day. Please pick another date.</p>';
      return;
    }

    availableSlots.forEach((slot, idx) => {
      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'bookingTime';
      radio.id = `slot_${idx}`;
      radio.value = slot;
      radio.className = 'slot-radio';
      radio.required = true;

      const label = document.createElement('label');
      label.htmlFor = `slot_${idx}`;
      label.className = 'slot-btn';
      label.textContent = slot;

      slotsContainer.appendChild(radio);
      slotsContainer.appendChild(label);
    });
  }

  if (dateInput) {
    dateInput.addEventListener('change', (e) => {
      if (e.target.value) populateTimeSlots(e.target.value);
    });
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('bookingName').value;
      const phone = document.getElementById('bookingPhone').value;
      const service = serviceSelect.value;
      const stylist = stylistSelect.value || 'Any Available Expert';
      const date = dateInput.value;
      
      const selectedTimeRadio = document.querySelector('input[name="bookingTime"]:checked');
      if (!selectedTimeRadio) {
        alert('Please select a preferred time slot.');
        return;
      }
      const time = selectedTimeRadio.value;

      document.getElementById('ticketClientName').textContent = name;
      document.getElementById('ticketPhone').textContent = phone;
      document.getElementById('ticketService').textContent = service;
      document.getElementById('ticketStylist').textContent = stylist;
      document.getElementById('ticketDate').textContent = new Date(date).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
      });
      document.getElementById('ticketTime').textContent = time;

      const bookingCode = 'NL-' + Math.floor(100000 + Math.random() * 900000);
      document.getElementById('ticketCode').textContent = bookingCode;
      document.getElementById('ticketBarcodeNum').textContent = bookingCode;

      bookingModal.classList.add('open');
      document.body.style.overflow = 'hidden';

      bookingForm.reset();
      if (slotsContainer) slotsContainer.innerHTML = '<p style="grid-column: span 3; font-size: 0.8rem; color: var(--text-muted); font-style: italic;">Please select a date first</p>';
    });
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
      bookingModal.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // ==========================================
  // ENTRANCE ANIMATIONS (INTERSECTION OBSERVER)
  // ==========================================
  const fadeSections = document.querySelectorAll('.fade-in-section');
  
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    fadeSections.forEach(section => {
      sectionObserver.observe(section);
    });
  } else {
    fadeSections.forEach(section => section.classList.add('is-visible'));
  }

  // ==========================================
  // ADMIN CONTROL ACTIONS & DASHBOARDS
  // ==========================================
  const adminDashboardBtn = document.getElementById('adminDashboardBtn');
  const adminDashboardModal = document.getElementById('adminDashboardModal');
  const closeAdminBtn = document.getElementById('closeAdminBtn');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminLogoutBtn = document.getElementById('adminLogoutBtn');
  const tabAuthBtn = document.getElementById('tabAuthBtn');
  const tabConfigBtn = document.getElementById('tabConfigBtn');
  const divAuthPanel = document.getElementById('divAuthPanel');
  const divConfigPanel = document.getElementById('divConfigPanel');
  const dbConfigForm = document.getElementById('dbConfigForm');

  // Input Configuration pre-fills
  const configUrl = document.getElementById('configUrl');
  const configKey = document.getElementById('configKey');

  if (adminDashboardBtn) {
    adminDashboardBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (configUrl) configUrl.value = localStorage.getItem('supabase_url') || 'https://tftfjndtbuadcocfwuwn.supabase.co';
      if (configKey) configKey.value = localStorage.getItem('supabase_key') || '';
      
      adminDashboardModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  function closeAdminDashboard() {
    adminDashboardModal.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (closeAdminBtn) closeAdminBtn.addEventListener('click', closeAdminDashboard);

  // Tabs Switchers
  const tabHoursBtn = document.getElementById('tabHoursBtn');
  const divHoursPanel = document.getElementById('divHoursPanel');

  if (tabAuthBtn && tabConfigBtn && tabHoursBtn) {
    tabAuthBtn.addEventListener('click', () => {
      tabAuthBtn.classList.add('active');
      tabConfigBtn.classList.remove('active');
      tabHoursBtn.classList.remove('active');
      divAuthPanel.style.display = 'block';
      divConfigPanel.style.display = 'none';
      divHoursPanel.style.display = 'none';
    });

    tabConfigBtn.addEventListener('click', () => {
      tabConfigBtn.classList.add('active');
      tabAuthBtn.classList.remove('active');
      tabHoursBtn.classList.remove('active');
      divConfigPanel.style.display = 'block';
      divAuthPanel.style.display = 'none';
      divHoursPanel.style.display = 'none';
    });

    tabHoursBtn.addEventListener('click', () => {
      tabHoursBtn.classList.add('active');
      tabAuthBtn.classList.remove('active');
      tabConfigBtn.classList.remove('active');
      divHoursPanel.style.display = 'block';
      divAuthPanel.style.display = 'none';
      divConfigPanel.style.display = 'none';
      populateAdminHoursForm();
    });
  }

  // Submit Database configuration settings
  if (dbConfigForm) {
    dbConfigForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const url = configUrl.value.trim();
      const key = configKey.value.trim();

      localStorage.setItem('supabase_url', url);
      localStorage.setItem('supabase_key', key);

      showToast("Supabase credentials saved successfully.");
      
      // Re-initialize Client
      initSupabase();
      
      // Fetch dynamic gallery and timings from new DB
      fetchAndRenderGallery();
      fetchAndRenderTimings();

      // Switch back to Login Tab
      tabAuthBtn.click();
    });
  }

  // Admin Login Authentication
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!supabaseClient) {
        showToast("Supabase is not configured yet. Go to Database Configuration first.", true);
        return;
      }

      const email = document.getElementById('adminEmail').value.trim();
      const password = document.getElementById('adminPassword').value;

      try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        showToast("Administrator signed in successfully.");
        setAdminLoggedIn(true);
      } catch (err) {
        showToast(`Login failed: ${err.message}`, true);
      }
    });
  }

  // Admin Logout
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', async () => {
      if (!supabaseClient) return;

      try {
        await supabaseClient.auth.signOut();
        showToast("Logged out successfully.");
        setAdminLoggedIn(false);
        closeAdminDashboard();
      } catch (err) {
        console.error("Sign out error: ", err.message);
        setAdminLoggedIn(false);
      }
    });
  }

  // Admin Update Credentials (Email and/or Password)
  const adminUpdateCredentialsForm = document.getElementById('adminUpdateCredentialsForm');
  if (adminUpdateCredentialsForm) {
    adminUpdateCredentialsForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!supabaseClient) {
        showToast("Supabase connection is not initialized.", true);
        return;
      }

      const newEmail = document.getElementById('newEmail').value.trim();
      const newPassword = document.getElementById('newPassword').value;

      if (!newEmail && !newPassword) {
        showToast("Please enter a new email or password to update.", true);
        return;
      }

      const updateData = {};
      if (newEmail) updateData.email = newEmail;
      if (newPassword) {
        if (newPassword.length < 6) {
          showToast("Password must be at least 6 characters.", true);
          return;
        }
        updateData.password = newPassword;
      }

      try {
        const { error } = await supabaseClient.auth.updateUser(updateData);
        if (error) throw error;

        let msg = "Credentials updated successfully!";
        if (newEmail) {
          msg += " Check both your old and new email inboxes to confirm the email change.";
        }
        showToast(msg);
        adminUpdateCredentialsForm.reset();
      } catch (err) {
        showToast(`Failed to update credentials: ${err.message}`, true);
      }
    });
  }

  // Admin Hours Form Submission
  const adminHoursForm = document.getElementById('adminHoursForm');
  if (adminHoursForm) {
    adminHoursForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!supabaseClient) {
        showToast("Supabase connection is not initialized.", true);
        return;
      }

      const rows = document.querySelectorAll('.hours-edit-row');
      const payload = [];

      rows.forEach((row, idx) => {
        const day = row.getAttribute('data-day');
        const hours = row.querySelector('.hours-edit-input').value.trim();
        const is_highlighted = row.querySelector('.hours-edit-chk').checked;
        
        payload.push({
          day: day,
          hours: hours,
          is_highlighted: is_highlighted,
          order_index: idx + 1
        });
      });

      try {
        const { error } = await supabaseClient
          .from('opening_hours')
          .upsert(payload, { onConflict: 'day' });

        if (error) throw error;

        showToast("Operational hours updated successfully!");
        fetchAndRenderTimings();
        closeAdminDashboard();
      } catch (err) {
        showToast(`Save failed: ${err.message}`, true);
      }
    });
  }

  // ==========================================
  // GALLERY UPLOAD OPERATIONS MODAL
  // ==========================================
  const openAddPhotoBtn = document.getElementById('openAddPhotoBtn');
  const dashboardAddPhotoBtn = document.getElementById('dashboardAddPhotoBtn');
  const addPhotoModal = document.getElementById('addPhotoModal');
  const cancelAddPhotoBtn = document.getElementById('cancelAddPhotoBtn');
  const addPhotoForm = document.getElementById('addPhotoForm');

  const uploadProgressWrapper = document.getElementById('uploadProgressWrapper');
  const uploadProgressBar = document.getElementById('uploadProgressBar');
  const uploadProgressText = document.getElementById('uploadProgressText');
  const uploadProgressPercent = document.getElementById('uploadProgressPercent');

  function openUploadForm() {
    if (!isAdminLoggedIn) {
      showToast("Please sign in to your Admin account to upload gallery items.", true);
      const adminDashboardModal = document.getElementById('adminDashboardModal');
      if (adminDashboardModal) {
        const tabAuthBtn = document.getElementById('tabAuthBtn');
        if (tabAuthBtn) tabAuthBtn.click();
        adminDashboardModal.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
      return;
    }
    closeAdminDashboard();
    addPhotoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  if (openAddPhotoBtn) openAddPhotoBtn.addEventListener('click', openUploadForm);
  if (dashboardAddPhotoBtn) dashboardAddPhotoBtn.addEventListener('click', openUploadForm);

  function closeUploadForm() {
    addPhotoModal.classList.remove('open');
    document.body.style.overflow = '';
    if (addPhotoForm) addPhotoForm.reset();
    if (uploadProgressWrapper) uploadProgressWrapper.style.display = 'none';
  }

  if (cancelAddPhotoBtn) cancelAddPhotoBtn.addEventListener('click', closeUploadForm);

  // Submit Uploader Form
  if (addPhotoForm) {
    addPhotoForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!supabaseClient) {
        showToast("Supabase connection is not initialized.", true);
        return;
      }

      const title = document.getElementById('photoTitle').value.trim();
      const category = document.getElementById('photoCategory').value;
      const mediaType = document.getElementById('photoMediaType').value;
      const description = document.getElementById('photoDesc').value.trim();
      const fileInput = document.getElementById('photoFile');
      
      if (!fileInput.files || fileInput.files.length === 0) {
        showToast("Please choose a media file to upload.", true);
        return;
      }

      const file = fileInput.files[0];
      
      // Upload indicators show
      uploadProgressWrapper.style.display = 'block';
      uploadProgressBar.style.width = '10%';
      uploadProgressPercent.textContent = '10%';
      uploadProgressText.textContent = 'Preparing upload...';

      try {
        // 1. Upload to Supabase Storage Bucket 'gallery-images'
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `public/${fileName}`;

        uploadProgressBar.style.width = '30%';
        uploadProgressPercent.textContent = '30%';
        uploadProgressText.textContent = 'Sending file bytes to Storage...';

        const { data: uploadData, error: uploadError } = await supabaseClient.storage
          .from('gallery-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        uploadProgressBar.style.width = '70%';
        uploadProgressPercent.textContent = '70%';
        uploadProgressText.textContent = 'Fetching asset URL...';

        // 2. Fetch public URL
        const { data: publicUrlData } = supabaseClient.storage
          .from('gallery-images')
          .getPublicUrl(filePath);

        const imageUrl = publicUrlData.publicUrl;

        uploadProgressBar.style.width = '85%';
        uploadProgressPercent.textContent = '85%';
        uploadProgressText.textContent = 'Adding metadata to database...';

        // 3. Insert row to database table 'gallery_items'
        let insertPayload = {
          title: title,
          category: category,
          description: description,
          image_url: imageUrl,
          media_type: mediaType
        };

        let { data: dbData, error: dbError } = await supabaseClient
          .from('gallery_items')
          .insert([insertPayload])
          .select();

        if (dbError) {
          if (dbError.message && dbError.message.includes('media_type')) {
            console.warn("media_type column not found in database. Retrying insert without it...");
            delete insertPayload.media_type;
            const retryResult = await supabaseClient
              .from('gallery_items')
              .insert([insertPayload])
              .select();
            if (retryResult.error) throw retryResult.error;
            dbData = retryResult.data;
          } else {
            throw dbError;
          }
        }

        uploadProgressBar.style.width = '100%';
        uploadProgressPercent.textContent = '100%';
        uploadProgressText.textContent = 'Successfully published!';

        setTimeout(() => {
          showToast(`Published "${title}" successfully!`);
          closeUploadForm();
          // Reload Gallery dynamically
          fetchAndRenderGallery();
        }, 500);

      } catch (err) {
        console.error("Upload error details: ", err);
        showToast(`Upload failed: ${err.message}`, true);
        uploadProgressWrapper.style.display = 'none';
      }
    });
  }
});
