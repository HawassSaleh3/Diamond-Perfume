/* ═══════════════════════════════════════════════════════════
   Diamond Perfume — App (vanilla JS, no frameworks)
   i18n (AR/EN) • currency (USD/LBP) • cart • quick view •
   checkout via WhatsApp • scroll reveals
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var C = window.DP.CONFIG;
  var D = window.DP.DATA;
  var T = window.DP.I18N;

  var AREA_OTHER = '__other__';

  /* ── State ─────────────────────────────────────────────── */
  function loadJSON(key) {
    try { return JSON.parse(localStorage.getItem(key) || null); } catch (e) { return null; }
  }

  var state = {
    lang: localStorage.getItem('dp-lang') || 'ar',
    curr: localStorage.getItem('dp-curr') || 'USD',
    cart: loadJSON('dp-cart') || [],
    sizeSel: {}, // الحجم المختار لكل منتج (فهرس داخل sizes)
    activeFilter: 'all',
    search: '',
    quickView: null, // product
    checkoutOpen: false,
    sent: null, // order number after send
    orderNo: null,
    menuOpen: false,
    form: { name: '', phone: '', city: '', area: '', areaOther: '', address: '', notes: '' },
    errors: {},
  };
  if (state.lang !== 'ar' && state.lang !== 'en') state.lang = 'ar';
  if (state.curr !== 'USD' && state.curr !== 'LBP') state.curr = 'USD';

  function t() { return T[state.lang]; }
  function isAr() { return state.lang === 'ar'; }
  function name(p) { return p[state.lang === 'ar' ? 'nameAr' : 'nameEn']; }

  function $(sel, el) { return (el || document).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || document).querySelectorAll(sel)); }
  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  /* ── Currency ─────────────────────────────────────────── */
  function lbpOf(usd) {
    return (Math.round((usd * C.usdToLbp) / 1000) * 1000).toLocaleString('en-US') + ' LBP';
  }
  function fmt(usd) {
    if (state.curr === 'USD') return '$' + Number(usd).toLocaleString('en-US');
    return (Math.round((usd * C.usdToLbp) / 1000) * 1000).toLocaleString('en-US') + ' ' + t().curLBP;
  }
  function fmtBoth(usd) {
    return '$' + Number(usd).toLocaleString('en-US') + ' (' + lbpOf(usd) + ')';
  }

  /* ── Sizes (50 ml / 100 ml) ────────────────────────────── */
  /* كل منتج إله مصفوفة sizes — آخر حجم في المصفوفة هو المختار افتراضياً */
  function sizesOf(p) {
    return (p.sizes && p.sizes.length) ? p.sizes : [{ label: '', price: 0 }];
  }
  function defaultSizeIdx(p) { return sizesOf(p).length - 1; }
  function selIdx(p) {
    var i = state.sizeSel[p.id];
    if (i == null || i < 0 || i >= sizesOf(p).length) i = defaultSizeIdx(p);
    return i;
  }
  function selSize(p) { return sizesOf(p)[selIdx(p)]; }

  /* ── Icons (inline SVG) ────────────────────────────────── */
  var I = {
    diamond: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M12 3 L20 9 L12 21 L4 9 Z"/><path d="M4 9 H20 M12 3 L8.5 9 L12 21 M12 3 L15.5 9 L12 21"/></svg>';
    },
    whatsapp: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';
    },
    instagram: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none"/></svg>';
    },
    tiktok: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .6.05.88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>';
    },
    facebook: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>';
    },
    cart: function (s, sw) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 1.7) + '" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6h15l-1.68 8.39a2 2 0 0 1-1.96 1.61H8.64a2 2 0 0 1-1.96-1.61L5 2H2"/><circle cx="9" cy="21" r="1.6"/><circle cx="17" cy="21" r="1.6"/></svg>';
    },
    phone: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>';
    },
    pin: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>';
    },
    clock: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 1.8"/></svg>';
    },
    truck: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H3V6a1 1 0 0 1 1-1h10v12m-9 0a2 2 0 0 0 4 0m-4 0a2 2 0 0 1 4 0m6 0h5v-5l-3.5-4.5H14V17m1 0a2 2 0 0 0 4 0m-4 0a2 2 0 0 1 4 0"/></svg>';
    },
    shield: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-3.6 8-10V5l-8-3-8 3v7c0 6.4 8 10 8 10z"/><path d="m9 11.5 2 2 4-4.5"/></svg>';
    },
    tag: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M20.6 12.4 12.4 20.6a2 2 0 0 1-2.83 0l-6.2-6.2a2 2 0 0 1-.58-1.5l.3-6.06A2 2 0 0 1 5.03 4.9l6.06-.3a2 2 0 0 1 1.5.58l6.2 6.2a2 2 0 0 1 0 2.83Z"/><circle cx="8.2" cy="8.2" r="1.4"/></svg>';
    },
    chevron: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
    },
    cash: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/></svg>';
    },
    search: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.35-4.35"/></svg>';
    },
    close: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    },
    menu: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
    },
    trash: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M10 11v6M14 11v6"/></svg>';
    },
    check: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
    },
    arrow: function (s) {
      return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>';
    },
  };

  function fillIcons(root) {
    $$('[data-icon]', root).forEach(function (el) {
      var fn = I[el.getAttribute('data-icon')];
      if (fn) el.innerHTML = fn(Number(el.getAttribute('data-size') || 24));
    });
  }

  /* ── Cart ──────────────────────────────────────────────── */
  function saveCart() { localStorage.setItem('dp-cart', JSON.stringify(state.cart)); }
  function byId(id) {
    for (var i = 0; i < D.PRODUCTS.length; i++) if (D.PRODUCTS[i].id === id) return D.PRODUCTS[i];
    return null;
  }
  function cartCount() { return state.cart.reduce(function (s, i) { return s + i.qty; }, 0); }
  function cartTotal() { return state.cart.reduce(function (s, i) { return s + i.qty * i.price; }, 0); }

  /* مفتاح السطر في السلة = المنتج + الحجم (كل حجم سطر مستقل) */
  function itemKey(id, sizeLabel) { return id + '|' + sizeLabel; }

  /* سعر محدّث من data.js (حتى لو تغيّرت الأسعار بعد إضافة المنتج للسلة) */
  function freshPrice(id, sizeLabel, fallback) {
    var p = byId(id);
    if (!p) return fallback;
    var list = sizesOf(p);
    for (var k = 0; k < list.length; k++) if (list[k].label === sizeLabel) return list[k].price;
    return fallback;
  }

  function addToCart(p, sizeIdx, qty) {
    qty = qty || 1;
    var s = sizesOf(p)[sizeIdx == null ? selIdx(p) : sizeIdx];
    var key = itemKey(p.id, s.label);
    var ex = state.cart.filter(function (i) { return i.key === key; })[0];
    if (ex) { ex.qty += qty; ex.price = freshPrice(p.id, ex.size, ex.price); }
    else state.cart.push({
      key: key, id: p.id, price: s.price, size: s.label,
      image: p.image, nameAr: p.nameAr, nameEn: p.nameEn, qty: qty,
    });
    saveCart();
    renderCart();
    renderModal(); // refresh summary if checkout is open
  }
  function setQty(key, qty) {
    state.cart = qty <= 0
      ? state.cart.filter(function (i) { return i.key !== key; })
      : state.cart.map(function (i) { return i.key === key ? {
          key: i.key, id: i.id, price: i.price, size: i.size,
          image: i.image, nameAr: i.nameAr, nameEn: i.nameEn, qty: qty,
        } : i; });
    saveCart();
    renderCart();
    renderModal();
  }
  function removeItem(key) {
    state.cart = state.cart.filter(function (i) { return i.key !== key; });
    saveCart();
    renderCart();
    renderModal();
  }

  /* ترحيل سلة قديمة (قبل إضافة الأحجام) — تُحدَّث الأسعار من data.js */
  function normalizeCart() {
    state.cart = (state.cart || []).map(function (i) {
      var p = byId(i.id);
      if (!p) return null;
      var list = sizesOf(p);
      var s = null;
      for (var k = 0; k < list.length; k++) if (list[k].label === i.size) s = list[k];
      if (!s) s = list[defaultSizeIdx(p)];
      return {
        key: itemKey(p.id, s.label), id: p.id, price: s.price, size: s.label,
        image: p.image, nameAr: p.nameAr, nameEn: p.nameEn,
        qty: Math.max(1, Number(i.qty) || 1),
      };
    }).filter(function (i) { return !!i; });
    saveCart();
  }
  function clearCart() {
    state.cart = [];
    saveCart();
    renderCart();
    renderModal();
  }

  /* ── Toast ─────────────────────────────────────────────── */
  var toastTimer = null;
  function showToast(msg) {
    var el = $('#toast');
    $('#toast-msg').textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, 2200);
  }

  /* ── Scroll reveals ────────────────────────────────────── */
  var revealObs = null;
  function observeReveals(root) {
    if (!('IntersectionObserver' in window)) {
      $$('.reveal', root).forEach(function (el) { el.classList.add('in'); });
      return;
    }
    if (!revealObs) {
      revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            revealObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.12 });
    }
    $$('.reveal:not(.in)', root).forEach(function (el) { revealObs.observe(el); });
  }

  /* ── Body scroll lock ──────────────────────────────────── */
  function drawerIsOpen() { return !$('#drawer-overlay').hidden; }
  function updateLock() {
    var any = drawerIsOpen() || state.checkoutOpen || state.menuOpen || !!state.quickView;
    document.body.style.overflow = any ? 'hidden' : '';
  }

  /* ── Static text / links / dir ─────────────────────────── */
  var NAV = [
    ['#home', 'navHome'],
    ['#shop', 'navShop'],
    ['#about', 'navAbout'],
    ['#location', 'navLocation'],
  ];
  function navHtml() {
    return NAV.map(function (n) { return '<a href="' + n[0] + '">' + t()[n[1]] + '</a>'; }).join('');
  }
  function waLink(msg) {
    return 'https://wa.me/' + C.whatsappNumber + '?text=' + encodeURIComponent(msg);
  }

  function applyStaticText() {
    $$('[data-i18n]').forEach(function (el) {
      var v = t()[el.getAttribute('data-i18n')];
      if (v != null) el.textContent = v;
    });

    // mixed-content titles
    var parts = t().aboutTitle.split('…');
    $('#about-title').innerHTML = parts[1]
      ? esc(parts[0]) + '… <span class="gold-text">' + esc(parts[1]) + '</span>'
      : esc(t().aboutTitle);
    $('#cta-title').innerHTML = esc(t().heroTitleA) + ' <span class="gold-text">' + esc(t().heroTitleB) + '</span>';
    $('#foot-year').innerHTML = '© 2026 <span class="gold-text">Diamond Perfume</span> — ' + esc(t().footRights);
    ['brand-sub', 'brand-sub-2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = t().brandSub;
    });
    $('#loc-landmark').textContent = t().locLandmark;
    $('#exp-span').textContent = t().expSpan;
    $('#cart-btn').title = t().cart;
    $('#cart-btn').setAttribute('aria-label', t().cart);
    $('#phone-link').title = t().callUs;
    $('#drawer-close').setAttribute('aria-label', t().close);
    $('#cart-drawer').setAttribute('aria-label', t().cartTitle);

    // config-driven values
    $('#loc-address').textContent = C.address[state.lang];
    var locAddrLink = document.getElementById('loc-address-link'); if (locAddrLink) locAddrLink.href = C.mapsShareUrl;
    $('#loc-phone').textContent = C.phoneDisplay;
    $('#loc-phone-link').href = C.phoneLink;
    $('#loc-hours-days').textContent = C.hours.weekdays[state.lang];
    $('#loc-hours-time').textContent = C.hours.time[state.lang];
    $('#maps-btn').href = C.mapsShareUrl;
    $('#hours-line').textContent = C.hours.weekdays[state.lang] + ' • ' + C.hours.time[state.lang];
    $('#cta-phone').textContent = C.phoneDisplay;
    $('#foot-address').textContent = C.address[state.lang];
    $('#foot-phone1').href = C.phoneLink;
    $('#foot-phone1').textContent = C.phoneDisplay;
    $('#foot-wa').href = 'https://wa.me/' + C.whatsappNumber;
    $('#foot-wa').textContent = C.phoneDisplay;
    $('#foot-hours-days').textContent = C.hours.weekdays[state.lang];
    $('#foot-hours-time').textContent = C.hours.time[state.lang];
    $('#soc-ig').href = C.social.instagram;
    $('#soc-tt').href = C.social.tiktok;
    $('#soc-fb').href = C.social.facebook;
    $$('.wa-link').forEach(function (a) { a.href = waLink(t().waMsg); });
    $('#phone-link').href = C.phoneLink;
    $('#wa-float').href = waLink(t().waMsg);
    $('#map-iframe').src = C.mapEmbed(state.lang);

    // social rows (mobile menu + footer handled by ids above)
    $('#foot-links').innerHTML = NAV.map(function (n) {
      return '<li><a href="' + n[0] + '">' + t()[n[1]] + '</a></li>';
    }).join('');
    $('#nav').innerHTML = navHtml();
  }

  /* ── Trust bar ─────────────────────────────────────────── */
  function renderTrust() {
    var items = [
      ['truck', t().aboutFeat2T, t().aboutFeat2D],
      ['shield', t().aboutFeat1T, t().aboutFeat1D],
      ['tag', t().aboutFeat3T, t().aboutFeat3D],
      ['cash', t().trustCodT, t().trustCodD],
    ];
    $('#trust-grid').innerHTML = items.map(function (it, i) {
      return '<div class="trust-item reveal reveal-d' + (i + 1) + '">' + I[it[0]](26) +
        '<div><b>' + esc(it[1]) + '</b><span>' + esc(it[2]) + '</span></div></div>';
    }).join('');
  }

  /* ── Categories ────────────────────────────────────────── */
  function renderCategories() {
    $('#cat-grid').innerHTML = D.CATEGORIES.map(function (c, i) {
      return '<a href="#shop" class="cat-card reveal reveal-d' + (i + 1) + '" data-cat="' + c.id + '">' +
        '<img src="' + c.image + '" alt="' + esc(c[state.lang]) + '" loading="lazy">' +
        '<div class="cat-info">' +
        '<h3>' + esc(c[state.lang]) + '</h3>' +
        '<p>' + esc(c[state.lang === 'ar' ? 'descAr' : 'descEn']) + '</p>' +
        '<span class="link">' + esc(t().catExplore) + ' ' + I.arrow(15) + '</span>' +
        '</div></a>';
    }).join('');
  }

  /* ── Products ──────────────────────────────────────────── */
  function priceHtml(p) {
    return '<div class="price" data-price-pid="' + p.id + '"><span class="now">' + fmt(selSize(p).price) + '</span></div>';
  }

  /* أزرار اختيار الحجم (50 ml / 100 ml) */
  function sizePickerHtml(p, withLabel) {
    var list = sizesOf(p), cur = selIdx(p);
    return '<div class="size-row">' +
      (withLabel ? '<span class="size-row-label">' + esc(t().sizeLabel) + '</span>' : '') +
      '<div class="size-pick">' +
      list.map(function (s, i) {
        return '<button type="button" class="size-pill' + (i === cur ? ' active' : '') +
          '" data-size-pid="' + p.id + '" data-size-idx="' + i + '" aria-pressed="' + (i === cur) + '">' +
          esc(s.label) + '</button>';
      }).join('') +
      '</div></div>';
  }

  /* تحديث الأسعار والأزرار عند تبديل الحجم (بدون إعادة رسم الكل) */
  function syncSize(p) {
    var idx = selIdx(p), s = sizesOf(p)[idx];
    $$('[data-size-pid="' + p.id + '"]').forEach(function (b) {
      var on = Number(b.getAttribute('data-size-idx')) === idx;
      b.classList.toggle('active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    $$('[data-price-pid="' + p.id + '"]').forEach(function (el) {
      el.innerHTML = '<span class="now">' + fmt(s.price) + '</span>';
    });
  }

  function productCard(p, i) {
    return '<div class="prod-card reveal reveal-d' + ((i % 4) + 1) + '">' +
      '<div class="prod-media" data-qv="' + p.id + '" role="button" tabindex="0">' +
      '<img src="' + p.image + '" alt="' + esc(name(p)) + '" loading="lazy">' +
      '<span class="quick-view">' + esc(t().quickView) + '</span>' +
      '</div>' +
      '<div class="prod-body">' +
      '<span class="prod-cat">' + esc(D.CAT_LABEL[p.cat][state.lang]) + '</span>' +
      '<h3 class="prod-name">' + esc(name(p)) + '</h3>' +
      '<p class="prod-notes">' + esc(p[state.lang === 'ar' ? 'notesAr' : 'notesEn']) + '</p>' +
      sizePickerHtml(p, false) +
      '<div class="prod-foot">' +
      priceHtml(p) +
      '<button class="add-btn" data-add="' + p.id + '">' + I.cart(16) + ' ' + esc(t().addToCart) + '</button>' +
      '</div></div></div>';
  }

  function renderFilters() {
    var filters = [
      ['all', t().filterAll],
      ['women', D.CAT_LABEL.women[state.lang]],
      ['men', D.CAT_LABEL.men[state.lang]],
      ['oriental', D.CAT_LABEL.oriental[state.lang]],
      ['niche', D.CAT_LABEL.niche[state.lang]],
    ];
    $('#filters').innerHTML = filters.map(function (f) {
      return '<button class="chip ' + (state.activeFilter === f[0] ? 'active' : '') +
        '" data-filter="' + f[0] + '">' + esc(f[1]) + '</button>';
    }).join('') +
      '<div class="search-box">' + I.search(17) +
      '<input id="search-input" placeholder="' + esc(t().searchPlaceholder) + '" value="' + esc(state.search) + '"></div>';
    var inp = $('#search-input');
    inp.addEventListener('input', function () {
      state.search = inp.value;
      renderProducts();
    });
  }

  function filteredList() {
    var l = D.PRODUCTS.slice();
    if (state.activeFilter !== 'all') l = l.filter(function (p) { return p.cat === state.activeFilter; });
    var q = state.search.trim().toLowerCase();
    if (q) l = l.filter(function (p) {
      return (p.nameAr + p.nameEn + p.notesAr + p.notesEn).toLowerCase().indexOf(q) !== -1;
    });
    return l;
  }

  function renderProducts() {
    var list = filteredList();
    $('#prod-grid').innerHTML = list.length
      ? list.map(function (p, i) { return productCard(p, i); }).join('')
      : '<p class="empty-msg">' + esc(t().noResults) + '</p>';
    observeReveals($('#prod-grid'));
  }

  function syncChips() {
    $$('#filters .chip').forEach(function (c) {
      c.classList.toggle('active', c.getAttribute('data-filter') === state.activeFilter);
    });
  }

  /* ── About features ────────────────────────────────────── */
  function renderAboutFeats() {
    var feats = [
      ['shield', t().aboutFeat1T, t().aboutFeat1D],
      ['truck', t().aboutFeat2T, t().aboutFeat2D],
      ['tag', t().aboutFeat3T, t().aboutFeat3D],
    ];
    $('#about-feats').innerHTML = feats.map(function (f) {
      return '<div class="feat">' + I[f[0]](22) + '<b>' + esc(f[1]) + '</b><span>' + esc(f[2]) + '</span></div>';
    }).join('');
  }

  /* ── Mobile menu ───────────────────────────────────────── */
  function socialRowHtml(extraStyle) {
    return '<div class="social-row"' + (extraStyle ? ' style="' + extraStyle + '"' : '') + '>' +
      '<a href="' + C.social.instagram + '" target="_blank" rel="noreferrer" aria-label="Instagram">' + I.instagram(18) + '</a>' +
      '<a href="' + C.social.tiktok + '" target="_blank" rel="noreferrer" aria-label="TikTok">' + I.tiktok(18) + '</a>' +
      '<a href="' + C.social.facebook + '" target="_blank" rel="noreferrer" aria-label="Facebook">' + I.facebook(18) + '</a>' +
      '</div>';
  }
  function openMenu() {
    state.menuOpen = true;
    var m = $('#mobile-menu');
    m.innerHTML = '<button class="icon-btn menu-close" id="menu-close" aria-label="' + esc(t().close) + '">' +
      I.close(22) + '</button>' +
      '<img class="menu-logo" src="assets/images/logo-icon.png" alt="Diamond Perfume">' +
      navHtml() + socialRowHtml('margin-top:1rem');
    m.hidden = false;
    updateLock();
  }
  function closeMenu() {
    state.menuOpen = false;
    $('#mobile-menu').hidden = true;
    updateLock();
  }

  /* ── Cart drawer ───────────────────────────────────────── */
  function openDrawer() {
    renderCart();
    $('#drawer-overlay').hidden = false;
    $('#cart-drawer').hidden = false;
    updateLock();
  }
  function closeDrawer() {
    $('#drawer-overlay').hidden = true;
    $('#cart-drawer').hidden = true;
    updateLock();
  }

  function renderCart() {
    var count = cartCount();
    var badge = $('#cart-badge');
    badge.textContent = count;
    badge.hidden = count === 0;
    var dBadge = $('#drawer-badge');
    dBadge.textContent = count;
    dBadge.hidden = count === 0;

    var body = $('#drawer-body');
    var foot = $('#drawer-foot');

    if (!state.cart.length) {
      body.innerHTML =
        '<div class="cart-empty">' + I.cart(56, 1) +
        '<b>' + esc(t().cartEmpty) + '</b>' +
        '<span>' + esc(t().cartEmptySub) + '</span>' +
        '<a href="#shop" class="btn btn-gold btn-sm" id="cart-start">' + esc(t().cartStart) + '</a>' +
        '</div>';
      foot.hidden = true;
      return;
    }

    body.innerHTML = state.cart.map(function (i) {
      return '<div class="cart-item">' +
        '<img src="' + i.image + '" alt="' + esc(name(i)) + '">' +
        '<div>' +
        '<div class="ci-name">' + esc(name(i)) + '</div>' +
        '<div class="ci-size num">' + esc(i.size) + '</div>' +
        '<div class="qty-ctrl">' +
        '<button data-qty-key="' + esc(i.key) + '" data-qty-delta="1" aria-label="+">+</button>' +
        '<span>' + i.qty + '</span>' +
        '<button data-qty-key="' + esc(i.key) + '" data-qty-delta="-1" aria-label="−">−</button>' +
        '</div></div>' +
        '<div class="ci-side">' +
        '<button class="ci-remove" data-remove="' + esc(i.key) + '" aria-label="remove">' + I.trash(17) + '</button>' +
        '<span class="ci-price">' + fmt(i.price * i.qty) + '</span>' +
        '</div></div>';
    }).join('') + '<button class="link-btn" id="cart-clear">' + esc(t().cartClear) + '</button>';

    foot.hidden = false;
    foot.innerHTML =
      '<div class="subtotal"><span>' + esc(t().cartSubtotal) + '</span><b>' + fmt(cartTotal()) + '</b></div>' +
      '<p class="delivery-note">' + I.truck(15) + ' ' + esc(t().cartDeliveryNote) + '</p>' +
      '<button class="btn btn-wa" id="cart-checkout">' + I.whatsapp(19) + ' ' + esc(t().cartCheckout) + '</button>' +
      '<button class="link-btn" id="cart-continue">' + esc(t().cartContinue) + '</button>';
  }

  /* ── Quick view / Checkout modal ───────────────────────── */
  function quickViewHtml(p) {
    return '<div class="modal" id="qv-modal">' +
      '<div class="modal-box" style="width:min(820px, 100%); overflow:hidden">' +
      '<button class="icon-btn modal-close" data-close-modal aria-label="' + esc(t().close) + '">' + I.close(20) + '</button>' +
      '<div class="qv-grid">' +
      '<div class="qv-media"><img src="' + p.image + '" alt="' + esc(name(p)) + '"></div>' +
      '<div class="qv-body">' +
      '<span class="prod-cat">' + esc(D.CAT_LABEL[p.cat][state.lang]) + '</span>' +
      '<h3 class="display">' + esc(name(p)) + '</h3>' +
      '<div class="prod-meta" style="margin-bottom:0">' +
      '<span>' + esc(p.gender[state.lang]) + '</span>' +
      '</div>' +
      '<p class="qv-desc">' + esc(p[state.lang === 'ar' ? 'descAr' : 'descEn']) + '</p>' +
      '<div class="qv-rows">' +
      '<div class="qv-row"><span>' + esc(t().notesLabel) + '</span><span>' + esc(p[state.lang === 'ar' ? 'notesAr' : 'notesEn']) + '</span></div>' +
      '<div class="qv-row"><span>' + esc(t().catLabel) + '</span><span>' + esc(D.CAT_LABEL[p.cat][state.lang]) + '</span></div>' +
      '</div>' +
      sizePickerHtml(p, true) +
      '<div class="qv-foot">' +
      '<div class="price" data-price-pid="' + p.id + '"><span class="now gold-text">' + fmt(selSize(p).price) + '</span></div>' +
      '<button class="add-btn btn" data-add="' + p.id + '">' + I.cart(16) + ' ' + esc(t().addToCart) + '</button>' +
      '</div></div></div></div></div>';
  }

  function buildWaUrl() {
    var f = state.form;
    var L = [];
    if (isAr()) {
      L.push('🛍️ *طلب جديد — Diamond Perfume*');
      L.push('━━━━━━━━━━━━━━━━━');
      L.push('👤 *الاسم الكامل:* ' + f.name);
      L.push('📱 *رقم الهاتف:* ' + f.phone);
      L.push('🏙️ *المدينة:* ' + cityName());
      L.push('📍 *المنطقة:* ' + areaValue());
      L.push('🏠 *العنوان بالتفاصيل:* ' + f.address);
      if (f.notes.trim()) L.push('📝 *ملاحظات:* ' + f.notes);
      L.push('━━━━━━━━━━━━━━━━━');
      L.push('🧾 *تفاصيل الطلب (' + cartCount() + ' منتج):*');
      state.cart.forEach(function (i, n) {
        L.push((n + 1) + ') ' + i.nameAr + ' — ' + i.size + ' × ' + i.qty + ' = $' + (i.price * i.qty).toLocaleString('en-US'));
      });
      L.push('━━━━━━━━━━━━━━━━━');
      L.push('💰 *المجموع:* ' + fmtBoth(cartTotal()));
      L.push('🚚 التوصيل: لجميع المناطق اللبنانية — الدفع عند الاستلام');
      L.push('🔖 رقم الطلب: ' + state.orderNo);
    } else {
      L.push('🛍️ *New Order — Diamond Perfume*');
      L.push('━━━━━━━━━━━━━━━━━');
      L.push('👤 *Full Name:* ' + f.name);
      L.push('📱 *Phone:* ' + f.phone);
      L.push('🏙️ *City:* ' + cityName());
      L.push('📍 *Area:* ' + areaValue());
      L.push('🏠 *Detailed Address:* ' + f.address);
      if (f.notes.trim()) L.push('📝 *Notes:* ' + f.notes);
      L.push('━━━━━━━━━━━━━━━━━');
      L.push('🧾 *Order Details (' + cartCount() + ' items):*');
      state.cart.forEach(function (i, n) {
        L.push((n + 1) + ') ' + i.nameEn + ' — ' + i.size + ' × ' + i.qty + ' = $' + (i.price * i.qty).toLocaleString('en-US'));
      });
      L.push('━━━━━━━━━━━━━━━━━');
      L.push('💰 *Total:* ' + fmtBoth(cartTotal()));
      L.push('🚚 Delivery: all Lebanese regions — Cash on delivery');
      L.push('🔖 Order No: ' + state.orderNo);
    }
    return 'https://wa.me/' + C.whatsappNumber + '?text=' + encodeURIComponent(L.join('\n'));
  }

  /* ── City / Area dependent dropdowns ───────────────────── */
  function cityById(id) {
    var l = (D.CITIES || []).filter(function (c) { return c.id === id; });
    return l.length ? l[0] : null;
  }
  function cityLabel(c) { return c[state.lang]; }
  function areaLabel(a) { return a[state.lang]; }

  function selectShell(inner, disabled) {
    return '<div class="select-wrap' + (disabled ? ' is-disabled' : '') + '">' + inner +
      '<span class="select-arrow" aria-hidden="true">' + I.chevron(17) + '</span></div>';
  }

  function cityFieldHtml() {
    var f = state.form, er = state.errors;
    var opts = '<option value="">' + esc(t().coCityPh) + '</option>' +
      (D.CITIES || []).map(function (c) {
        return '<option value="' + esc(c.id) + '"' + (f.city === c.id ? ' selected' : '') + '>' +
          esc(cityLabel(c)) + '</option>';
      }).join('');
    return '<div class="form-field ' + (er.city ? 'invalid' : '') + '">' +
      '<label>' + esc(t().coCity) + ' *</label>' +
      selectShell('<select name="city" id="co-city">' + opts + '</select>', false) +
      (er.city ? '<span class="err">' + esc(er.city) + '</span>' : '') +
      '</div>';
  }

  function areaFieldHtml() {
    var f = state.form, er = state.errors;
    var city = cityById(f.city);
    var areas = city ? city.areas : [];
    var disabled = !city;
    var ph = disabled ? t().coAreaFirst : t().coAreaPh;
    // القيمة المخزّنة = فهرس المنطقة، حتى يبقى الاختيار ثابتاً عند تبديل اللغة
    var opts = '<option value="">' + esc(ph) + '</option>' +
      areas.map(function (a, idx) {
        return '<option value="' + idx + '"' + (f.area === String(idx) ? ' selected' : '') + '>' +
          esc(areaLabel(a)) + '</option>';
      }).join('') +
      (disabled ? '' : '<option value="' + AREA_OTHER + '"' +
        (f.area === AREA_OTHER ? ' selected' : '') + '>' + esc(t().coAreaOther) + '</option>');

    return '<div class="form-field ' + (er.area ? 'invalid' : '') + '">' +
      '<label>' + esc(t().coArea) + ' *</label>' +
      selectShell('<select name="area" id="co-area"' + (disabled ? ' disabled' : '') + '>' + opts + '</select>', disabled) +
      (f.area === AREA_OTHER
        ? '<input class="area-other" name="areaOther" value="' + esc(f.areaOther || '') +
          '" placeholder="' + esc(t().coAreaOtherPh) + '">'
        : '') +
      (er.area ? '<span class="err">' + esc(er.area) + '</span>' : '') +
      '</div>';
  }

  /* اسم المدينة المعروض (وليس الـ id) */
  function cityName() {
    var c = cityById(state.form.city);
    return c ? cityLabel(c) : state.form.city;
  }

  /* الاسم النهائي للمنطقة كما يُرسل في الطلب */
  function areaValue() {
    if (state.form.area === AREA_OTHER) return (state.form.areaOther || '').trim();
    var city = cityById(state.form.city);
    if (!city || state.form.area === '') return '';
    var a = city.areas[Number(state.form.area)];
    return a ? areaLabel(a) : '';
  }

  function checkoutHtml() {
    var f = state.form;
    var er = state.errors;
    return '<div class="modal" id="co-modal">' +
      '<div class="modal-box">' +
      '<button class="icon-btn modal-close" data-close-modal aria-label="' + esc(t().close) + '">' + I.close(20) + '</button>' +
      '<div class="co-head">' +
      '<img class="co-logo" src="assets/images/logo-icon.png" alt="Diamond Perfume">' +
      '<h3 class="display"><span class="gold-text">' + esc(t().coTitle) + '</span></h3>' +
      '<p>' + esc(t().coSub) + '</p></div>' +
      '<div class="co-grid">' +
      '<form id="co-form" novalidate>' +
      '<div class="form-field ' + (er.name ? 'invalid' : '') + '">' +
      '<label>' + esc(t().coName) + ' *</label>' +
      '<input name="name" value="' + esc(f.name) + '" placeholder="' + esc(t().coNamePh) + '" autofocus>' +
      (er.name ? '<span class="err">' + esc(er.name) + '</span>' : '') +
      '</div>' +
      '<div class="form-row">' +
      '<div class="form-field ' + (er.phone ? 'invalid' : '') + '">' +
      '<label>' + esc(t().coPhone) + ' *</label>' +
      '<input name="phone" value="' + esc(f.phone) + '" placeholder="' + esc(t().coPhonePh) + '" inputmode="tel" dir="ltr" style="text-align:' + (isAr() ? 'right' : 'left') + '">' +
      (er.phone ? '<span class="err">' + esc(er.phone) + '</span>' : '') +
      '</div>' +
      cityFieldHtml() +
      '</div>' +
      '<div id="co-area-wrap">' + areaFieldHtml() + '</div>' +
      '<div class="form-field ' + (er.address ? 'invalid' : '') + '">' +
      '<label>' + esc(t().coAddress) + ' *</label>' +
      '<textarea name="address" rows="2" placeholder="' + esc(t().coAddressPh) + '">' + esc(f.address) + '</textarea>' +
      (er.address ? '<span class="err">' + esc(er.address) + '</span>' : '') +
      '</div>' +
      '<div class="form-field">' +
      '<label>' + esc(t().coNotes) + ' <small>' + esc(t().coNotesOpt) + '</small></label>' +
      '<textarea name="notes" rows="2" placeholder="' + esc(t().coNotesPh) + '">' + esc(f.notes) + '</textarea>' +
      '</div>' +
      '<div class="co-actions">' +
      '<button type="submit" class="btn btn-wa" style="width:100%">' + I.whatsapp(19) + ' ' + esc(t().coSubmit) + '</button>' +
      '<button type="button" class="link-btn" id="co-back">' + esc(t().coBack) + '</button>' +
      '</div></form>' +
      '<div class="co-summary">' +
      '<h4>' + esc(t().coSummary) + '<span>' + cartCount() + ' ' + esc(t().coItems) + '</span></h4>' +
      state.cart.map(function (i) {
        return '<div class="co-item"><img src="' + i.image + '" alt="">' +
          '<span class="n">' + esc(name(i)) + '<small>' + esc(i.size) + ' × ' + i.qty + '</small></span>' +
          '<span class="p">' + fmt(i.price * i.qty) + '</span></div>';
      }).join('') +
      '<div class="co-total-row"><span>' + esc(t().coTotal) + '</span>' +
      '<b>' + fmt(cartTotal()) + '<span class="lbp num" dir="ltr">≈ ' + esc(lbpOf(cartTotal())) + '</span></b></div>' +
      '<p class="co-delivery">' + I.truck(15) + ' ' + esc(t().coDeliveryInfo) + '</p>' +
      '</div></div></div></div>';
  }

  function successHtml() {
    return '<div class="modal" id="co-modal">' +
      '<div class="modal-box">' +
      '<button class="icon-btn modal-close" data-close-modal aria-label="' + esc(t().close) + '">' + I.close(20) + '</button>' +
      '<div class="order-success">' +
      '<div class="success-icon">' + I.check(44) + '</div>' +
      '<h3 class="display gold-text">' + esc(t().successTitle) + '</h3>' +
      '<p>' + esc(t().successSub) + '</p>' +
      '<div class="order-no">' + esc(t().successOrder) + ': <b>' + esc(state.orderNo) + '</b></div>' +
      '<div style="display:flex; gap:0.8rem; justify-content:center; flex-wrap:wrap">' +
      '<a class="btn btn-wa" href="' + esc(buildWaUrl()) + '" target="_blank" rel="noreferrer">' + I.whatsapp(18) + ' ' + esc(t().successOpen) + '</a>' +
      '<button class="btn btn-ghost" data-close-modal>' + esc(t().successAgain) + '</button>' +
      '</div></div></div></div>';
  }

  /* يعيد بناء حقل المنطقة فقط (بدون إعادة رسم النموذج كاملاً) */
  function refreshAreaField(focus) {
    var wrap = $('#co-area-wrap');
    if (!wrap) return;
    wrap.innerHTML = areaFieldHtml();
    if (focus) {
      var sel = $('#co-area');
      if (sel && !sel.disabled) sel.focus();
    }
  }

  function clearFieldError(el) {
    var k = el.name;
    if (k) state.errors[k] = undefined;
    var field = el.closest ? el.closest('.form-field') : null;
    if (field) {
      field.classList.remove('invalid');
      var err = field.querySelector('.err');
      if (err) err.remove();
    }
  }

  function bindCheckoutForm() {
    var form = $('#co-form');
    if (!form) return;

    form.addEventListener('change', function (e) {
      var k = e.target.name;
      if (k !== 'city' && k !== 'area') return;
      state.form[k] = e.target.value;
      clearFieldError(e.target);
      if (k === 'city') {
        // كل مدينة تعرض مناطقها — نصفّر المنطقة السابقة
        state.form.area = '';
        state.form.areaOther = '';
        state.errors.area = undefined;
        refreshAreaField(true);
      } else if (k === 'area') {
        if (e.target.value !== AREA_OTHER) state.form.areaOther = '';
        refreshAreaField(false);
        var other = $('.area-other');
        if (other) other.focus();
      }
    });

    form.addEventListener('input', function (e) {
      var k = e.target.name;
      if (!k || e.target.tagName === 'SELECT') return;
      // خانة الهاتف: أرقام فقط وبحد أقصى 8 أرقام (رقم لبناني)
      if (k === 'phone') {
        var digits = e.target.value.replace(/\D/g, '').slice(0, 8);
        if (e.target.value !== digits) e.target.value = digits;
        state.form.phone = digits;
      } else {
        state.form[k] = e.target.value;
      }
      if (k === 'areaOther') state.errors.area = undefined;
      state.errors[k] = undefined;
      clearFieldError(e.target);
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      submitOrder();
    });
  }

  function submitOrder() {
    var er = {};
    if (state.form.name.trim().length < 3) er.name = t().errName;
    if (state.form.phone.replace(/\D/g, '').length < 8) er.phone = t().errPhone;
    if (!state.form.city) er.city = t().errCity;
    if (!areaValue()) er.area = t().errArea;
    if (state.form.address.trim().length < 5) er.address = t().errAddress;
    state.errors = er;
    if (Object.keys(er).length) { renderModal(); return; }
    window.open(buildWaUrl(), '_blank');
    state.sent = state.orderNo;
    clearCart();
    renderModal();
  }

  function openCheckout() {
    state.checkoutOpen = true;
    state.sent = null;
    state.orderNo = 'DP-' + String(Date.now()).slice(-6);
    closeDrawer();
    renderModal();
  }

  function closeCheckout() {
    state.checkoutOpen = false;
    renderModal();
    setTimeout(function () {
      state.sent = null;
      state.form = { name: '', phone: '', city: '', area: '', areaOther: '', address: '', notes: '' };
      state.errors = {};
    }, 350);
  }

  function closeModal() {
    if (state.checkoutOpen) closeCheckout();
    else if (state.quickView) { state.quickView = null; renderModal(); }
  }

  function renderModal() {
    var root = $('#modal-root');
    if (state.checkoutOpen) {
      root.innerHTML = state.sent ? successHtml() : checkoutHtml();
      bindCheckoutForm();
    } else if (state.quickView) {
      root.innerHTML = quickViewHtml(state.quickView);
    } else {
      root.innerHTML = '';
    }
    updateLock();
  }

  /* ── Add-to-cart button feedback ───────────────────────── */
  function flashAdd(btn) {
    btn.classList.add('added');
    btn.innerHTML = I.check(16) + ' ' + esc(t().added);
    setTimeout(function () {
      btn.classList.remove('added');
      btn.innerHTML = I.cart(16) + ' ' + esc(t().addToCart);
    }, 1600);
  }

  /* ── Language / currency ───────────────────────────────── */
  function setLang(l) {
    if (state.lang === l) return;
    state.lang = l;
    localStorage.setItem('dp-lang', l);
    document.documentElement.lang = l;
    document.documentElement.dir = T[l].dir;
    document.documentElement.setAttribute('data-lang', l);
    renderAll();
  }
  function setCurr(c) {
    if (state.curr === c) return;
    state.curr = c;
    localStorage.setItem('dp-curr', c);
    $$('[data-curr]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-curr') === c);
    });
    renderProducts();
    renderCart();
    renderModal();
  }

  /* ── Render everything ─────────────────────────────────── */
  function renderAll() {
    applyStaticText();
    fillIcons(document);
    renderTrust();
    renderCategories();
    renderFilters();
    renderProducts();
    renderAboutFeats();
    renderCart();
    renderModal();
    $$('[data-curr]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-curr') === state.curr);
    });
    $$('[data-lang-btn]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-lang-btn') === state.lang);
    });
    observeReveals(document);
    updateLock();
  }

  /* ── Global click delegation ───────────────────────────── */
  document.addEventListener('click', function (e) {
    var el;

    if ((el = e.target.closest('[data-add]'))) {
      var p = byId(el.getAttribute('data-add'));
      if (p) {
        var sz = selSize(p);
        addToCart(p);
        showToast(name(p) + ' — ' + sz.label + ' — ' + t().added);
        flashAdd(el);
      }
      return;
    }
    if ((el = e.target.closest('[data-size-pid]'))) {
      var sp = byId(el.getAttribute('data-size-pid'));
      if (sp) { state.sizeSel[sp.id] = Number(el.getAttribute('data-size-idx')); syncSize(sp); }
      return;
    }
    if ((el = e.target.closest('[data-filter]'))) {
      state.activeFilter = el.getAttribute('data-filter');
      syncChips();
      renderProducts();
      return;
    }
    if ((el = e.target.closest('[data-cat]'))) {
      state.activeFilter = el.getAttribute('data-cat');
      syncChips();
      renderProducts();
      setTimeout(function () {
        var shop = document.getElementById('shop');
        if (shop) shop.scrollIntoView({ behavior: 'smooth' });
      }, 50);
      return;
    }
    if ((el = e.target.closest('[data-qv]'))) {
      var q = byId(el.getAttribute('data-qv'));
      if (q) { state.quickView = q; renderModal(); }
      return;
    }
    if ((el = e.target.closest('[data-qty-delta]'))) {
      var key = el.getAttribute('data-qty-key');
      var item = state.cart.filter(function (i) { return i.key === key; })[0];
      if (item) setQty(item.key, item.qty + Number(el.getAttribute('data-qty-delta')));
      return;
    }
    if ((el = e.target.closest('[data-remove]'))) { removeItem(el.getAttribute('data-remove')); return; }

    if (e.target.closest('#cart-btn')) { openDrawer(); return; }
    if (e.target.closest('#cart-clear')) { clearCart(); return; }
    if (e.target.closest('#cart-checkout')) { openCheckout(); return; }
    if (e.target.closest('#cart-continue')) { closeDrawer(); return; }
    if (e.target.closest('#cart-start')) { closeDrawer(); return; }
    if (e.target.closest('#drawer-overlay') || e.target.closest('#drawer-close')) { closeDrawer(); return; }
    if (e.target.closest('#menu-btn')) { openMenu(); return; }
    if (e.target.closest('#menu-close')) { closeMenu(); return; }
    if (e.target.closest('.mobile-menu a')) { closeMenu(); return; }
    if ((el = e.target.closest('[data-curr]'))) { setCurr(el.getAttribute('data-curr')); return; }
    if ((el = e.target.closest('[data-lang-btn]'))) { setLang(el.getAttribute('data-lang-btn')); return; }
    if (e.target.closest('#co-back')) {
      state.checkoutOpen = false;
      renderModal();
      openDrawer();
      return;
    }
    if (e.target.closest('[data-close-modal]')) { closeModal(); return; }
    if (e.target.classList && e.target.classList.contains('modal')) { closeModal(); return; }
  });

  /* keyboard: Enter opens quick view, Esc closes layers */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      var qv = e.target.closest ? e.target.closest('[data-qv]') : null;
      if (qv) {
        var q = byId(qv.getAttribute('data-qv'));
        if (q) { state.quickView = q; renderModal(); }
      }
      return;
    }
    if (e.key !== 'Escape') return;
    if (state.menuOpen) closeMenu();
    else if (state.checkoutOpen) closeCheckout();
    else if (state.quickView) closeModal();
    else if (drawerIsOpen()) closeDrawer();
  });

  /* ── Init ─────────────────────────────────────────────── */
  normalizeCart(); // يوافق السلال القديمة مع الأسعار/الأحجام الجديدة
  document.documentElement.lang = state.lang;
  document.documentElement.dir = T[state.lang].dir;
  document.documentElement.setAttribute('data-lang', state.lang);
  renderAll();
})();
