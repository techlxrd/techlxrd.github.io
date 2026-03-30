var app = new Framework7({
    el: "#app",
    name: "techlxrd",
    theme: "ios"
});

var mainView = app.views.create(".view-main", {
    main: true,
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".ptr-tab").forEach((element) => {
        element.addEventListener("ptr:refresh", () => {
            window.location.reload();
        });
    });
});

function toggleDarkMode() {
  document.querySelector("html").classList.toggle("dark");
}

function applyDarkModeSetting() {
  const htmlElement = document.querySelector("html");
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const applyDarkMode = e => {
    if (e.matches) {
      htmlElement.classList.add("dark");
    } else {
      htmlElement.classList.remove("dark");
    }
  };
  darkModeQuery.addListener(applyDarkMode);
  applyDarkMode(darkModeQuery);
}
applyDarkModeSetting();
function createSnowflake() {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.innerHTML = "❄";
    snowflake.style.fontSize = Math.random() * 20 + "px";
    snowflake.style.left = Math.random() * innerWidth + "px";
    snowflake.style.animationDuration = Math.random() * 3 + 2 + "s";
    document.body.appendChild(snowflake);

    snowflake.addEventListener("animationend", () => {
        snowflake.remove();
    });
}

function isWinter() {
    const month = new Date().getMonth() + 1;
    return month === 12 || month === 1 || month === 2;
}

if (isWinter()) {
    setInterval(createSnowflake, 500);

    const snowflakeStyle = document.createElement("style");
    snowflakeStyle.innerHTML = `
        .snowflake {
            position: fixed;
            top: -10px;
            user-select: none;
            pointer-events: none;
            color: #fff;
            z-index: 9999;
            animation: snowfall linear infinite;
        }
        @keyframes snowfall {
            to {
                transform: translateY(${innerHeight}px);
            }
        }
    `;
    document.head.appendChild(snowflakeStyle);
}

document.addEventListener('click', function (e) {
  const clickedLink = e.target.closest('.sidebar-list .item-link');
  if (!clickedLink) return;

  app.popup.close();
  app.dialog.close();
  const currentPage = document.querySelector('.page-current[data-name="repo-detail"]');
  
  if (currentPage) {  
    app.views.main.router.back();     
  }
  const allLinks = document.querySelectorAll('.sidebar-list .item-link');
  allLinks.forEach(link => {
    link.classList.remove('tab-link-active');
  });
  clickedLink.classList.add('tab-link-active');
});
window.addEventListener('error', function (event) {
    const img = event.target;

    if (!(img instanceof HTMLImageElement)) return;

    if (img.closest('.screenshots')) return;

    if (img.dataset.fallbackApplied) return;

    img.dataset.fallbackApplied = 'true';
    img.src = './assets/default.png';
}, true);

document.addEventListener('DOMContentLoaded', () => {
app.on('tabShow', (tabEl) => {
  const tabId = `#${tabEl.id}`;
  if (!tabEl.id) return;

  const tabLink = document.querySelector(
    `.tab-link[href="${tabId}"]`
  );
  if (!tabLink) return;

  const title = tabLink.dataset.tabTitle;
  if (!title) return;

  const navbar = document.querySelector(
    '.navbar.navbar-large'
  );
  if (!navbar) return;

  const titleEl = navbar.querySelector('.title');
  const largeTitleEl = navbar.querySelector('.title-large-text');

  if (titleEl) titleEl.textContent = title;
  if (largeTitleEl) largeTitleEl.textContent = title;
});
  window.goToTab = function (tabId) {
    app.popup.close();
    app.tab.show(tabId);
    
  };

});
(() => {
  const PRODUCTS_URL = 'shop.json';
  const GRID_SELECTOR = '#shop-grid';
  const SHOP_PTR_SELECTOR = '.ptr-shop';
  const REFRESH_DELAY = 2000;
  const INITIAL_SKELETON_COUNT = 6;
  const CHUNK_SIZE = 12;

  const state = {
    grid: null,
    loading: false,
    initialized: false,
    products: []
  };

  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const escapeAttr = (value) => escapeHtml(value);

  const normalizeBadgeColor = (color) => {
    const allowed = new Set([
      'green',
      'orange',
      'red',
      'blue',
      'pink',
      'yellow',
      'purple',
      'gray',
      'black'
    ]);

    const cleaned = String(color ?? 'green')
      .trim()
      .replace(/^color-/, '');

    return allowed.has(cleaned) ? `color-${cleaned}` : 'color-green';
  };

  const normalizeTags = (tags) => (Array.isArray(tags) ? tags : []);

  function getGrid() {
    return document.querySelector(GRID_SELECTOR);
  }

  function skeletonCardHTML() {
    return `
      <div class="col-50 tablet-33 skeleton-effect-fade">
        <div class="shop-card">
          <div class="shop-card-glass"></div>
          <div class="shop-card-media skeleton-block" style="height:150px;"></div>
          <div class="shop-card-content">
            <div class="shop-card-top">
              <div class="shop-card-text" style="flex:1; min-width:0;">
                <div class="skeleton-text">Loading product name</div>
                <div class="skeleton-text">Loading product description</div>
              </div>
            </div>
            <div class="shop-card-tags">
              <span class="chip chip-outline skeleton-text">Loading tag</span>
              <span class="chip chip-outline skeleton-text">Loading tag</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderSkeletons(count = INITIAL_SKELETON_COUNT) {
    if (!state.grid) return;
    state.grid.innerHTML = Array.from({ length: count }, skeletonCardHTML).join('');
  }

  function productCardHTML(product) {
    const tags = normalizeTags(product.tags)
      .map((tag) => `<span class="chip chip-outline">${escapeHtml(tag)}</span>`)
      .join('');

    const badgeColor = normalizeBadgeColor(product.badgeColor ?? product.priceColor);
    const isIcon = Boolean(product.icon);

    return `
      <div class="col-50 tablet-33">
        <a href="${escapeAttr(product.url)}" class="external shop-card">
          <div class="shop-card-glass"></div>

          <div class="shop-card-media ${isIcon ? 'shop-card-media-icon' : ''}">
            <img
              src="${escapeAttr(product.image)}"
              alt="${escapeAttr(product.title)}"
              loading="lazy"
              decoding="async"
            >
            <div class="shop-card-badge badge ${badgeColor}">${escapeHtml(product.price ?? '')}</div>
          </div>

          <div class="shop-card-content">
            <div class="shop-card-top">
              <div class="shop-card-text">
                <div class="shop-card-title">${escapeHtml(product.title)}</div>
                <div class="shop-card-subtitle">${escapeHtml(product.subtitle ?? '')}</div>
              </div>
            </div>

            <div class="shop-card-tags">
              ${tags}
            </div>
          </div>
        </a>
      </div>
    `;
  }

  async function loadProducts() {
    if (Array.isArray(window.SHOP_PRODUCTS)) {
      return window.SHOP_PRODUCTS;
    }

    const res = await fetch(PRODUCTS_URL, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to load ${PRODUCTS_URL}: ${res.status}`);
    }

    return await res.json();
  }

  async function renderProductsChunked(products) {
    if (!state.grid) return;

    state.grid.innerHTML = '';

    let index = 0;
    while (index < products.length) {
      const chunk = products.slice(index, index + CHUNK_SIZE);
      state.grid.insertAdjacentHTML('beforeend', chunk.map(productCardHTML).join(''));
      index += CHUNK_SIZE;

      if (index < products.length) {
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
    }
  }

  async function loadAndRender() {
    if (!state.grid) return;

    const products = await loadProducts();
    state.products = Array.isArray(products) ? products : [];
    await renderProductsChunked(state.products);
  }

  async function initialLoad() {
    if (state.initialized) return;
    state.initialized = true;

    renderSkeletons();

    try {
      await loadAndRender();
    } catch (error) {
      console.error('[Shop] initial load failed:', error);
      state.grid.innerHTML = `
        <div class="col-100">
          <div class="block block-strong inset">
            <p>Could not load products.</p>
          </div>
        </div>
      `;
    }
  }

  async function refreshShop(done) {
    if (state.loading) {
      if (typeof done === 'function') done();
      return;
    }

    state.loading = true;

    try {
      renderSkeletons();
      await wait(REFRESH_DELAY);
      await loadAndRender();
    } catch (error) {
      console.error('[Shop] refresh failed:', error);
      state.grid.innerHTML = `
        <div class="col-100">
          <div class="block block-strong inset">
            <p>Could not load products.</p>
          </div>
        </div>
      `;
    } finally {
      state.loading = false;
      if (typeof done === 'function') done();
    }
  }

  function boot() {
    state.grid = getGrid();
    if (!state.grid) return;

    initialLoad();

    if (window.app && typeof app.on === 'function') {
      app.on('ptrRefresh', async (el, done) => {
        if (!el || !el.closest(SHOP_PTR_SELECTOR)) {
          if (typeof done === 'function') done();
          return;
        }

        await refreshShop(done);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
function isSafariOrAppleDevice() {
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) && !window.MSStream;
    const isSafariBrowser = /Safari/.test(ua) && !/Chrome|CriOS|Edg/.test(ua);
    return isIOS || isSafariBrowser;
}

function isWeakDevice() {
    
    if (isSafariOrAppleDevice()) return true;

   
    const memory = navigator.deviceMemory;
    if (memory !== undefined && memory < 6) return true; 


    const cores = navigator.hardwareConcurrency;
    if (cores !== undefined && cores <= 4) return true;

   
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) {

        const androidVersion = parseFloat(ua.match(/Android\s([0-9\.]+)/)?.[1] || '0');
        if (androidVersion > 0 && androidVersion < 10) return true;
    }
    
    return false;
}

(function initLiquidGlass() {
    const TARGET_CLASS_SELECTOR = '.liquid-glass';

    const useBlurFallback = isWeakDevice();

    const elements = document.querySelectorAll(TARGET_CLASS_SELECTOR);

    if (useBlurFallback) {
        console.log("Liquid Glass: Using blur fallback (weak device or WebKit compatibility).");

        elements.forEach(el => {
            const blurStyles = `
                background: rgba(255, 255, 255, 0.13) !important;
                backdrop-filter: blur(7px) saturate(180%)!important;
                -webkit-backdrop-filter: blur(7px) saturate(180%)!important;
                border: 1px solid rgba(255, 255, 255, 0.25)!important;
                box-shadow:
                    0px 0px 0px 2px rgba(255, 255, 255, 0.05) inset,
                    0px 0px 100px 10px rgba(255, 255, 255, 0.05) inset,
                    0 0.5px 0px rgba(255, 255, 255, 0.525) inset !important;
                filter: none !important;
            `;
            el.style.cssText += blurStyles.trim();
        });
        return;
    }
    
    const SVG_FILTER_ID = 'liquid-filter';
    if (document.getElementById(SVG_FILTER_ID)) return;

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");

    svg.style.position = "absolute";
    svg.style.top = "-10000px";
    svg.style.left = "-10000px";
    svg.style.width = "1px";
    svg.style.height = "1px";
    svg.style.overflow = "hidden";

    svg.innerHTML = `
      <filter id="${SVG_FILTER_ID}" x="-50%" y="-50%" width="200%" height="200%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB">

        <feTurbulence type="turbulence" baseFrequency="0.01 0.02" numOctaves="2" seed="2" result="turbulence" stitchTiles="noStitch" />

        <feGaussianBlur stdDeviation="2" in="SourceGraphic" result="blur" />

        <feDisplacementMap in="blur" in2="turbulence" scale="20" xChannelSelector="R" yChannelSelector="G" result="final" />

      </filter>
    `;

    document.body.appendChild(svg);
})();const form = document.getElementById('contact-form');
const submitBtn = document.getElementById('submit-btn');
const requestType = document.getElementById('request-type');
const extraFields = document.querySelectorAll('.extra-field');
const messageField = document.getElementById('message-field');

const messageHints = {
  general: 'Write your message...',
  icon: 'Describe the icon style, colors, references...',
  video: 'Describe the trailer, length, vibe...',
  f7: 'Describe the app, screens, features...',
  web: 'Describe pages, sections, features...',
  uiux: 'Describe UI/UX improvements needed...',
  other: 'Describe your request...'
};

function updateFields() {
  const type = requestType.value;

 
  const isGeneralOrEmpty = !type || type === 'general';

  extraFields.forEach(el => {
    el.classList.toggle('show', !isGeneralOrEmpty);
  });

  messageField.placeholder =
    messageHints[type] || 'Write your message...';
}

function syncSmartSelectText(selectEl) {
  const item = selectEl.closest('.item-link');
  if (!item) return;

  const after = item.querySelector('.item-after');
  if (!after) return;

  const selected = selectEl.options[selectEl.selectedIndex];
  after.textContent = selected && selected.value
    ? selected.text
    : 'Select';
}

requestType.addEventListener('change', () => {
  updateFields();
  syncSmartSelectText(requestType);
});


document.querySelectorAll('.smart-select select').forEach(select => {
  syncSmartSelectText(select);

  select.addEventListener('change', () => {
    syncSmartSelectText(select);
  });
});


updateFields();


form.addEventListener('submit', function (e) {
  e.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  app.dialog.confirm('Send this message?', 'Confirm', () => {
    submitBtn.classList.add('button-loading');
    submitBtn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form)
    })
    .then(res => {
      if (!res.ok) throw new Error();

      app.dialog.alert('I will contact you as soon as possible.', 'Sent');

      form.reset();
      updateFields();

      document.querySelectorAll('.smart-select select').forEach(select => {
        syncSmartSelectText(select);
      });
    })
    .catch(() => {
      app.dialog.alert('Something went wrong. Try again.', 'Error');
    })
    .finally(() => {
      submitBtn.classList.remove('button-loading');
      submitBtn.disabled = false;
    });
  });
});