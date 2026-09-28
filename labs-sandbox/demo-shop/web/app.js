/* Demo Shop storefront — vanilla JS, zero dependencies, no CDN.
 * Loaded by all 4 pages via the absolute path /app.js (PRODUCT-SPEC §5, S13).
 *
 * Contract notes this file obeys:
 *  - §3 paths only: GET /api/products, GET /api/products/:id, POST /api/cart/total.
 *    Nothing else is ever requested, and `?limit` is NEVER sent (§7 — limit=-1
 *    silently returns a short list). Home page slices the full list in JS instead.
 *  - AC-5: no product name / price / blurb is written in this file. Every piece of
 *    product text is fetched at runtime.
 *  - AC-6: money is never computed in the browser. The only number that ever lands
 *    in #cart-total comes from the POST /api/cart/total response — including for an
 *    empty cart, which still calls the endpoint with `itemIds: []`.
 *  - AC-8: formatTHB() renders `฿1,234` — manual grouping (locale/ICU free),
 *    half-up to 0 decimals at render time only, `฿0` for zero/missing/NaN.
 *  - §2: the cart store keeps ONE ENTRY PER UNIT ([2,2,2] = three stickers),
 *    because itemIds is a multiset with no quantity field (S8).
 */

(function () {
  'use strict';

  var CART_KEY = 'demo-shop.cart';
  var LOW_STOCK_AT = 10;

  /* ------------------------------------------------------------------ *
   * money (AC-8)
   * ------------------------------------------------------------------ */

  // Deterministic, locale-free: ฿ + comma-grouped integer, half-up rounded here
  // and only here. The server value itself is never re-rounded or recomputed.
  function formatTHB(value) {
    var n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return '฿0';
    var magnitude = Math.round(Math.abs(n)); // half-up on the absolute value
    if (magnitude === 0) return '฿0'; // also collapses -0.4 and NaN-ish to ฿0
    var grouped = String(magnitude).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return (n < 0 ? '-฿' : '฿') + grouped;
  }

  /* ------------------------------------------------------------------ *
   * fetch helper — always checks res.ok and content-type (§3 / MUST-5)
   * ------------------------------------------------------------------ *
   * Thrown errors carry `.kind`:
   *   'network'   server unreachable (retry line)
   *   'notfound'  404 with a §4 envelope (friendly page-local state)
   *   'http'      any other non-2xx
   *   'format'    body was not application/json — e.g. the hello catch-all
   *               answering a page route before the static handler exists
   * `.message` is a human sentence we may show; the server's own message is
   * only ever logged, never echoed verbatim (S3 — "no product with id NaN").
   */

  function apiError(kind, message, status, envelope) {
    var err = new Error(message);
    err.kind = kind;
    err.status = status;
    err.envelope = envelope || null;
    return err;
  }

  function api(path, options) {
    return fetch(path, options).then(function (res) {
      var type = res.headers.get('content-type') || '';
      if (type.indexOf('application/json') !== 0) {
        return res.text().then(function () {
          throw apiError('format', 'The server did not answer with JSON.', res.status);
        });
      }
      return res.json().catch(function () {
        throw apiError('format', 'The server sent JSON we could not read.', res.status);
      }).then(function (data) {
        if (!res.ok) {
          var env = data && data.error ? data.error : null;
          if (env && env.message) {
            // log-only: keeps the offending id debuggable without showing demo-hostile text
            if (window.console) console.warn('[api] ' + res.status + ' ' + env.code + ': ' + env.message);
          }
          throw apiError(
            res.status === 404 ? 'notfound' : 'http',
            res.status === 404
              ? 'Not found on the server.'
              : 'The server rejected that request.',
            res.status,
            env
          );
        }
        return data;
      });
    }).catch(function (err) {
      if (err && err.name === 'AbortError') throw err; // caller owns cancellation
      if (err && err.kind) throw err;
      throw apiError('network', 'Could not reach the demo-shop server.', 0);
    });
  }

  // `limit` deliberately never passed (see header note).
  function getProducts() {
    return api('/api/products').then(function (data) {
      return data && Array.isArray(data.items) ? data.items : [];
    });
  }

  function getProduct(id, signal) {
    var opts = signal ? { signal: signal } : undefined;
    return api('/api/products/' + encodeURIComponent(id), opts);
  }

  // Single writer of every total in this app (§1 / AC-6).
  function postTotal(itemIds, discountPercent) {
    var body = { itemIds: itemIds };
    if (typeof discountPercent === 'number' && discountPercent !== 0) {
      body.discountPercent = discountPercent;
    }
    return api('/api/cart/total', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  /* ------------------------------------------------------------------ *
   * cart store — one entry per unit (§2, S8)
   * ------------------------------------------------------------------ */

  function readCart() {
    var raw = null;
    try {
      raw = window.localStorage.getItem(CART_KEY);
    } catch (e) {
      return [];
    }
    if (raw === null) return [];
    var parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      writeCart([]); // corrupt value: drop it rather than throw on every load
      return [];
    }
    if (!Array.isArray(parsed)) {
      writeCart([]);
      return [];
    }
    // keep only positive safe integer ids; anything else is discarded, not thrown on
    var clean = [];
    for (var i = 0; i < parsed.length; i++) {
      var v = parsed[i];
      if (typeof v === 'number' && Number.isSafeInteger(v) && v >= 1) clean.push(v);
    }
    return clean;
  }

  function writeCart(ids) {
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(ids));
    } catch (e) {
      /* private mode / quota — cart just will not persist */
    }
    document.dispatchEvent(new CustomEvent('cart:change'));
  }

  function cartUnits() {
    return readCart().length;
  }

  // [[id, qty], ...] in first-seen order — flattening back out only for display.
  function cartLines() {
    var ids = readCart();
    var order = [];
    var counts = Object.create(null);
    for (var i = 0; i < ids.length; i++) {
      var id = ids[i];
      if (counts[id] === undefined) {
        counts[id] = 0;
        order.push(id);
      }
      counts[id] += 1;
    }
    return order.map(function (id) {
      return [id, counts[id]];
    });
  }

  function addUnits(id, qty) {
    var ids = readCart();
    for (var i = 0; i < qty; i++) ids.push(id);
    writeCart(ids);
  }

  // Replaces the run of `id` with `qty` copies at the run's original position.
  function setLineQty(id, qty) {
    var ids = readCart();
    var out = [];
    var inserted = false;
    for (var i = 0; i < ids.length; i++) {
      if (ids[i] === id) {
        if (!inserted) {
          var n = Math.max(0, qty);
          for (var k = 0; k < n; k++) out.push(id);
          inserted = true;
        }
        continue;
      }
      out.push(ids[i]);
    }
    if (!inserted && qty > 0) {
      out.push(id);
      for (var j = 1; j < qty; j++) out.push(id);
    }
    writeCart(out);
  }

  function dropLine(id) {
    setLineQty(id, 0);
  }

  // Rebuild the store from an explicit [[id, qty]] list (used when pruning/capping).
  function rewriteCart(lines) {
    var ids = [];
    for (var i = 0; i < lines.length; i++) {
      var id = lines[i][0];
      var qty = lines[i][1];
      for (var k = 0; k < qty; k++) ids.push(id);
    }
    writeCart(ids);
  }

  /* ------------------------------------------------------------------ *
   * shared chrome: nav cart-count badge, aria-current, toast
   * ------------------------------------------------------------------ */

  function refreshNavBadge() {
    var badge = document.getElementById('nav-cart-count');
    if (!badge) return;
    var units = cartUnits();
    badge.textContent = units > 0 ? String(units) : '';
    badge.hidden = units === 0;
  }

  var toastTimer = null;
  function toast(message) {
    var el = document.getElementById('toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast';
      el.className = 'toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      document.body.appendChild(el);
    }
    el.textContent = message;
    // force a reflow so re-triggering the same message still animates
    void el.offsetWidth;
    el.classList.add('show');
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      el.classList.remove('show');
    }, 2600);
  }

  function markCurrentNavLink() {
    var page = document.body.getAttribute('data-page');
    var key = { home: '/', catalog: '/products', product: '/product', cart: '/cart' }[page];
    if (!key) return;
    var links = document.querySelectorAll('.site-nav a');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      var current = key === '/product' ? href === '/product/1' : href === key;
      if (current) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
  }

  /* ------------------------------------------------------------------ *
   * render helpers — all product content arrives from the API
   * ------------------------------------------------------------------ */

  function hueFor(id) {
    var n = Number.isFinite(Number(id)) ? Math.abs(Math.round(Number(id))) : 0;
    return (n * 47) % 360;
  }

  function initials(name) {
    var words = String(name || '').trim().split(/\s+/).filter(function (w) {
      return w.length > 0;
    });
    if (words.length === 0) return '?';
    var pick = words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0];
    return pick.toUpperCase();
  }

  // Generated, zero-byte "art": tinted initials tile derived from the API response.
  function applyArt(el, product) {
    el.style.background = 'hsl(' + hueFor(product.id) + ', 38%, 42%)';
    el.textContent = initials(product.name);
  }

  function stockBadge(product) {
    var span = document.createElement('span');
    var stock = Number(product.stock);
    var s = Number.isFinite(stock) ? stock : 0;
    if (s <= 0) {
      span.className = 'badge badge-out';
      span.textContent = 'Sold out';
    } else if (s <= LOW_STOCK_AT) {
      span.className = 'badge badge-low';
      span.textContent = 'Low stock — only ' + s + ' left';
    } else {
      span.className = 'badge badge-in';
      span.textContent = 'In stock';
    }
    return span;
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node && node.firstChild) node.removeChild(node.firstChild);
  }

  // One reusable error/empty block with a working retry affordance (§3.4).
  function stateBlock(host, opts) {
    if (!host) return;
    clear(host);
    var box = el('div', 'state');
    box.setAttribute('role', opts.role || 'status');
    box.appendChild(el('h2', null, opts.title));
    if (opts.body) box.appendChild(el('p', null, opts.body));
    if (opts.detail) box.appendChild(el('p', 'state-detail', opts.detail));
    if (typeof opts.onRetry === 'function') {
      var actions = el('div', 'state-actions');
      var retry = el('button', 'btn btn-sm', 'Retry');
      retry.type = 'button';
      retry.addEventListener('click', opts.onRetry);
      actions.appendChild(retry);
      if (opts.extraLinkHref && opts.extraLinkLabel) {
        var alt = el('a', 'btn btn-sm btn-ghost', opts.extraLinkLabel);
        alt.href = opts.extraLinkHref;
        actions.appendChild(alt);
      }
      box.appendChild(actions);
    }
    host.appendChild(box);
  }

  // Never touches host.className — callers keep their own layout class.
  function skeletons(host, count, cls) {
    if (!host) return;
    clear(host);
    for (var i = 0; i < count; i++) {
      var s = el('div', 'skeleton ' + cls);
      s.setAttribute('aria-hidden', 'true');
      host.appendChild(s);
    }
  }

  function isNetworkish(err) {
    return !!err && (err.kind === 'network' || err.kind === 'format');
  }

  function loadFailureTitle(err) {
    return isNetworkish(err) ? 'No connection to the server' : 'That did not load';
  }

  function loadFailureBody(err) {
    return isNetworkish(err)
      ? 'The demo-shop server is not answering. Start it with `node server.js`, then retry.'
      : 'The server returned something unexpected for this request.';
  }

  // Build one catalog/featured card. `showView` adds the detail-page link.
  function productCard(product, showView) {
    var card = el('article', 'card');
    card.setAttribute('data-id', String(product.id));

    var art = el('div', 'card-art');
    applyArt(art, product);
    card.appendChild(art);

    var body = el('div', 'card-body');
    var name = el('h3', 'card-name');
    var link = el('a', null, product.name);
    link.href = '/product/' + encodeURIComponent(product.id);
    name.appendChild(link);
    body.appendChild(name);

    body.appendChild(el('div', 'card-price', formatTHB(product.price)));

    var meta = el('div', 'card-meta');
    meta.appendChild(stockBadge(product));
    body.appendChild(meta);

    var actions = el('div', 'card-actions');
    if (showView) {
      var view = el('a', 'btn btn-sm btn-ghost', 'View');
      view.href = '/product/' + encodeURIComponent(product.id);
      actions.appendChild(view);
    }
    var add = el('button', 'btn btn-sm', 'Add to cart');
    add.type = 'button';
    add.dataset.addId = String(product.id);
    var stock = Number(product.stock);
    if (Number.isFinite(stock) && stock <= 0) {
      add.disabled = true;
      add.textContent = 'Sold out';
      add.title = 'Nothing left in stock';
    }
    actions.appendChild(add);
    body.appendChild(actions);

    card.appendChild(body);
    return card;
  }

  function renderGrid(host, products, showView, err, retry) {
    if (!host) return;
    if (err) {
      host.className = '';
      stateBlock(host, {
        title: loadFailureTitle(err),
        body: loadFailureBody(err),
        onRetry: retry,
      });
      return;
    }
    if (!products || products.length === 0) {
      host.className = '';
      stateBlock(host, {
        title: 'Nothing in the catalog yet',
        body: 'The server answered, but it has no products to show right now.',
        onRetry: retry,
        extraLinkHref: '/cart',
        extraLinkLabel: 'Go to cart',
      });
      return;
    }
    clear(host);
    host.className = 'grid';
    for (var i = 0; i < products.length; i++) {
      host.appendChild(productCard(products[i], showView));
    }
  }

  // delegated "Add to cart" for any grid of cards
  function bindAddToCart(grid) {
    if (!grid) return;
    grid.addEventListener('click', function (ev) {
      var btn = ev.target.closest ? ev.target.closest('[data-add-id]') : null;
      if (!btn || btn.disabled) return;
      var id = Number(btn.dataset.addId);
      if (!Number.isSafeInteger(id) || id < 1) return;
      addUnits(id, 1);
      refreshNavBadge();
      toast('Added to cart — ' + cartUnits() + ' item' + (cartUnits() === 1 ? '' : 's') + ' total');
    });
  }

  /* ------------------------------------------------------------------ *
   * page: home
   * ------------------------------------------------------------------ */

  function initHome() {
    var host = document.getElementById('featured');
    var listPromise = getProducts();

    skeletons(host, 4, 'skeleton-card'); // shimmer while the list loads

    listPromise.then(
      function (items) {
        // first 4 sliced here in JS — never via ?limit (§7)
        renderGrid(host, items.slice(0, 4), true, null, null);
        bindAddToCart(host);
      },
      function (err) {
        renderGrid(host, [], true, err, function () {
          window.location.reload();
        });
      }
    );
  }

  /* ------------------------------------------------------------------ *
   * page: catalog
   * ------------------------------------------------------------------ */

  function initCatalog() {
    var host = document.getElementById('catalog');
    var tools = document.getElementById('catalog-tools');
    var countEl = document.getElementById('catalog-count');
    var loaded = null;
    var sortKey = 'default';

    function paint() {
      var items = (loaded || []).slice();
      if (sortKey === 'price-asc' || sortKey === 'price-desc') {
        // comparison only — no price arithmetic (§ AC-6)
        items.sort(function (a, b) {
          var d = Number(a.price) - Number(b.price);
          return sortKey === 'price-asc' ? d : -d;
        });
      } else if (sortKey === 'name') {
        items.sort(function (a, b) {
          return String(a.name).localeCompare(String(b.name));
        });
      }
      if (countEl && loaded) countEl.textContent = items.length + ' products';
      renderGrid(host, items, true, null, null);
    }

    function load() {
      skeletons(host, 6, 'skeleton-card');
      getProducts().then(
        function (items) {
          loaded = items;
          paint();
        },
        function (err) {
          renderGrid(host, [], true, err, load);
        }
      );
    }

    load();
    bindAddToCart(host); // once — delegated, survives re-renders of the grid

    if (tools) {
      var select = tools.querySelector('select');
      if (select) {
        select.addEventListener('change', function () {
          sortKey = select.value;
          if (loaded) paint();
        });
      }
    }
  }

  /* ------------------------------------------------------------------ *
   * page: product detail
   * ------------------------------------------------------------------ */

  function parseDetailId() {
    // /product/:id — anything not a clean positive integer is a not-found
    // without a wasted API call (§3.3: /product/abc, /product/, /product/0, /-3)
    var m = /^\/product\/(\d+)\/?$/.exec(window.location.pathname);
    if (!m) return null;
    var id = parseInt(m[1], 10);
    if (!Number.isSafeInteger(id) || id < 1) return null;
    return id;
  }

  function initProduct() {
    var host = document.getElementById('detail');
    var id = parseDetailId();

    if (id === null) {
      host.className = '';
      stateBlock(host, {
        role: 'alert',
        title: 'We could not read that product id',
        body: 'Product links look like /product/3. The address you opened does not name a product.',
        extraLinkHref: '/products',
        extraLinkLabel: 'Browse all products',
      });
      return;
    }

    function notFound() {
      host.className = '';
      stateBlock(host, {
        role: 'alert',
        title: 'No product with that id',
        body: 'Product ' + id + ' is not in the catalog. Demo products live in memory, so anything added after a restart is gone.',
        extraLinkHref: '/products',
        extraLinkLabel: 'Browse all products',
      });
    }

    function failed(err) {
      host.className = '';
      stateBlock(host, {
        title: loadFailureTitle(err),
        body: loadFailureBody(err),
        onRetry: function () {
          load();
        },
        extraLinkHref: '/products',
        extraLinkLabel: 'Browse all products',
      });
    }

    function render(product, siblings) {
      clear(host);
      host.className = 'detail';

      var art = el('div', 'detail-art');
      applyArt(art, product);
      host.appendChild(art);

      var info = el('div', 'detail-info');
      info.appendChild(el('h1', null, product.name));
      info.appendChild(el('p', 'detail-price', formatTHB(product.price)));

      var meta = el('div', 'detail-meta');
      meta.appendChild(stockBadge(product));
      meta.appendChild(el('span', 'state-detail', 'Product id ' + product.id));
      info.appendChild(meta);

      var stock = Number(product.stock);
      var inStock = Number.isFinite(stock) && stock > 0;

      var actions = el('div', 'detail-actions');
      if (inStock) {
        var picker = el('div', 'qty-picker');
        var label = el('label', null, 'Qty');
        label.htmlFor = 'detail-qty';
        var qtyInput = el('input');
        qtyInput.type = 'number';
        qtyInput.id = 'detail-qty';
        qtyInput.min = '1';
        qtyInput.max = String(Math.floor(stock));
        qtyInput.step = '1';
        qtyInput.value = '1';
        picker.appendChild(label);
        picker.appendChild(qtyInput);
        actions.appendChild(picker);
      }

      var add = el('button', 'btn', inStock ? 'Add to cart' : 'Sold out');
      add.type = 'button';
      add.disabled = !inStock;
      add.addEventListener('click', function () {
        if (!inStock) return;
        var input = document.getElementById('detail-qty');
        var wanted = input ? parseInt(input.value, 10) : 1;
        if (!Number.isSafeInteger(wanted) || wanted < 1) wanted = 1;
        if (Number.isFinite(stock) && wanted > Math.floor(stock)) wanted = Math.floor(stock);
        addUnits(product.id, wanted);
        refreshNavBadge();
        toast('Added ' + wanted + ' to the cart');
      });
      actions.appendChild(add);

      var browse = el('a', 'btn btn-ghost', 'Keep browsing');
      browse.href = '/products';
      actions.appendChild(browse);
      info.appendChild(actions);

      info.appendChild(
        el(
          'p',
          'detail-note',
          inStock
            ? 'Prices and stock come straight from the API on every page view — nothing is cached in here.'
            : 'This item is sold out. It stays listed so the demo catalog reads honestly.'
        )
      );
      host.appendChild(info);

      // prev / next walk the order the API returned
      if (siblings && siblings.length > 1) {
        var idx = -1;
        for (var i = 0; i < siblings.length; i++) {
          if (Number(siblings[i].id) === Number(product.id)) idx = i;
        }
        if (idx >= 0) {
          var bar = el('div', 'prevnext');
          var prev = siblings[idx - 1];
          var next = siblings[idx + 1];
          bar.appendChild(
            prev
              ? (function () {
                  var a = el('a', null, '← ' + prev.name);
                  a.href = '/product/' + encodeURIComponent(prev.id);
                  return a;
                })()
              : el('span')
          );
          bar.appendChild(
            next
              ? (function () {
                  var a = el('a', null, next.name + ' →');
                  a.href = '/product/' + encodeURIComponent(next.id);
                  return a;
                })()
              : el('span')
          );
          host.appendChild(bar);
        }
      }
    }

    // Race guard: a slow response for id 1 must never overwrite id 2 (§3.4).
    var inflight = null;
    var token = 0;

    function load() {
      var myToken = ++token;
      if (inflight) inflight.abort();
      inflight = new AbortController();
      skeletons(host, 1, 'skeleton-row');
      host.className = 'grid';
      var listPromise = getProducts().catch(function () {
        return [];
      });

      getProduct(id, inflight.signal).then(
        function (product) {
          if (myToken !== token) return; // a newer navigation won
          listPromise.then(function (items) {
            if (myToken !== token) return;
            render(product, items);
          });
        },
        function (err) {
          if (myToken !== token) return;
          if (err && err.kind === 'notfound') {
            notFound();
            return;
          }
          failed(err);
        }
      ).catch(function (err) {
        if (err && err.name === 'AbortError') return; // superseded on purpose
      });
    }

    load();
  }

  /* ------------------------------------------------------------------ *
   * page: cart
   * ------------------------------------------------------------------ */

  function idFromEnvelope(err) {
    // Server message is `no product with id X` — we parse it to prune, and we
    // never print it (S3).
    if (!err || !err.envelope || !err.envelope.message) return null;
    var m = /id\s+(\d+)/i.exec(err.envelope.message);
    if (!m) return null;
    var id = parseInt(m[1], 10);
    return Number.isSafeInteger(id) ? id : null;
  }

  function initCart() {
    var linesHost = document.getElementById('cart-lines');
    var emptyHost = document.getElementById('cart-empty');
    var layout = document.getElementById('cart-layout');
    var totalHost = document.getElementById('cart-total');
    var totalNote = document.getElementById('cart-total-note');
    var unitsHost = document.getElementById('cart-units');
    var discountHost = document.getElementById('cart-discount');
    var catalog = null; // id -> product, always from the API (never localStorage)

    // The ONLY writer of #cart-total, and only ever with a server number (AC-6).
    function writeTotal(total) {
      totalHost.textContent = formatTHB(total);
      if (totalNote) {
        totalNote.textContent = '';
        totalNote.hidden = true;
      }
      var actions = document.getElementById('cart-total-retry');
      if (actions) {
        actions.hidden = true;
        clear(actions);
      }
    }

    function totalUnavailable(err) {
      if (totalNote) {
        totalNote.hidden = false;
        totalNote.textContent = isNetworkish(err)
          ? 'Total unavailable — no connection to the server.'
          : 'Total unavailable — the server rejected this cart.';
      }
      var actions = document.getElementById('cart-total-retry');
      if (actions) {
        actions.hidden = false;
        actions.innerHTML = '';
        var btn = el('button', 'btn btn-sm', 'Retry total');
        btn.type = 'button';
        btn.addEventListener('click', function () {
          refreshTotal();
        });
        actions.appendChild(btn);
      }
    }

    function discountPercent() {
      if (!discountHost) return 0;
      var v = Number(discountHost.value);
      return Number.isFinite(v) ? v : 0;
    }

    // One dead id 404s the whole total (server aborts on first miss), so on a
    // 404 we prune the id the envelope names and re-render, which re-asks once.
    function refreshTotal() {
      var ids = readCart();
      if (unitsHost) {
        unitsHost.textContent = ids.length + (ids.length === 1 ? ' unit' : ' units');
      }
      return postTotal(ids, discountPercent()).then(
        function (data) {
          writeTotal(data && typeof data.total === 'number' ? data.total : Number(data && data.total));
        },
        function (err) {
          if (err && err.kind === 'notfound') {
            var dead = idFromEnvelope(err);
            var current = readCart();
            if (dead !== null && current.indexOf(dead) !== -1) {
              dropLine(dead);
              render();
              toast('Removed an item that is no longer in the catalog');
              return;
            }
          }
          totalUnavailable(err);
        }
      );
    }

    function pruneToCatalog() {
      if (!catalog) return false;
      var kept = [];
      var lines = cartLines();
      var removedAny = false;
      for (var i = 0; i < lines.length; i++) {
        var id = lines[i][0];
        var qty = lines[i][1];
        var p = catalog[id];
        if (!p) {
          removedAny = true;
          continue;
        }
        var stock = Number(p.stock);
        var capped = Number.isFinite(stock) && stock > 0 ? Math.min(qty, Math.floor(stock)) : 0;
        if (capped !== qty) removedAny = true;
        if (capped > 0) kept.push([id, capped]);
      }
      if (removedAny) rewriteCart(kept);
      return removedAny;
    }

    function render() {
      var lines = cartLines();
      refreshNavBadge();

      if (lines.length === 0) {
        if (layout) layout.hidden = true;
        if (emptyHost) emptyHost.hidden = false;
        // empty state still asks the server for the total (AC-6 / S9)
        refreshTotal();
        return;
      }

      if (emptyHost) emptyHost.hidden = true;
      if (layout) layout.hidden = false;

      clear(linesHost);
      for (var i = 0; i < lines.length; i++) {
        linesHost.appendChild(lineRow(lines[i][0], lines[i][1]));
      }
      refreshTotal();
    }

    function lineRow(id, qty) {
      var p = catalog ? catalog[id] : null;
      var row = el('div', 'cart-line');
      row.setAttribute('data-id', String(id));

      var art = el('div', 'cart-line-art');
      if (p) applyArt(art, p);
      else art.textContent = '···';
      row.appendChild(art);

      var nameBox = el('div');
      var name = el('a', 'cart-line-name', p ? p.name : 'Loading…');
      name.href = '/product/' + encodeURIComponent(id);
      nameBox.appendChild(name);
      if (p) {
        var sub = el('div', 'state-detail');
        var stock = Number(p.stock);
        sub.appendChild(stockBadge(p));
        nameBox.appendChild(sub);
      }
      row.appendChild(nameBox);

      var unit = el('div', 'cart-line-unit', p ? formatTHB(p.price) : '');
      row.appendChild(unit);

      var controls = el('div', 'cart-line-controls');
      var minus = el('button', null, '−');
      minus.type = 'button';
      minus.setAttribute('aria-label', 'Remove one unit');
      minus.dataset.decId = String(id);
      var qtyEl = el('span', 'qty', String(qty));
      qtyEl.setAttribute('aria-label', qty + ' in cart');
      var plus = el('button', null, '+');
      plus.type = 'button';
      plus.setAttribute('aria-label', 'Add one unit');
      plus.dataset.incId = String(id);
      var remove = el('button', 'remove', 'Remove');
      remove.type = 'button';
      remove.dataset.delId = String(id);
      controls.appendChild(minus);
      controls.appendChild(qtyEl);
      controls.appendChild(plus);
      controls.appendChild(remove);
      row.appendChild(controls);

      return row;
    }

    function maxQtyFor(id) {
      var p = catalog ? catalog[id] : null;
      if (!p) return Infinity;
      var stock = Number(p.stock);
      return Number.isFinite(stock) ? Math.floor(stock) : Infinity;
    }

    linesHost.addEventListener('click', function (ev) {
      var t = ev.target;
      if (!t || !t.closest) return;
      var inc = t.closest('[data-inc-id]');
      var dec = t.closest('[data-dec-id]');
      var del = t.closest('[data-del-id]');
      if (inc) {
        var id = Number(inc.dataset.incId);
        var lines = cartLines();
        var cur = 0;
        for (var i = 0; i < lines.length; i++) if (lines[i][0] === id) cur = lines[i][1];
        if (cur + 1 > maxQtyFor(id)) {
          toast('That is all the stock the server reports');
          return;
        }
        setLineQty(id, cur + 1);
        render();
      } else if (dec) {
        var id2 = Number(dec.dataset.decId);
        var lines2 = cartLines();
        var cur2 = 0;
        for (var j = 0; j < lines2.length; j++) if (lines2[j][0] === id2) cur2 = lines2[j][1];
        setLineQty(id2, Math.max(0, cur2 - 1));
        render();
      } else if (del) {
        dropLine(Number(del.dataset.delId));
        render();
        toast('Removed from cart');
      }
    });

    if (discountHost) {
      discountHost.addEventListener('change', function () {
        refreshTotal();
      });
    }

    function start() {
      // reconcile against the live catalog first: dead ids (restart-wiped POSTs)
      // and over-sell would otherwise 404 the whole total (§3.2 stale cart)
      if (layout) layout.hidden = false;
      skeletons(linesHost, 2, 'skeleton-row');
      if (emptyHost) emptyHost.hidden = true;
      getProducts().then(
        function (items) {
          catalog = Object.create(null);
          for (var i = 0; i < items.length; i++) catalog[items[i].id] = items[i];
          if (pruneToCatalog()) {
            toast('Your cart was updated — an item is no longer available');
          }
          render();
        },
        function (err) {
          if (layout) layout.hidden = false;
          if (emptyHost) emptyHost.hidden = true;
          clear(linesHost);
          stateBlock(linesHost, {
            title: loadFailureTitle(err),
            body: loadFailureBody(err) + ' Cart contents are kept on this device, so nothing was lost.',
            onRetry: start,
          });
          refreshTotal();
        }
      );
    }

    start();

    // cross-tab drift: one tab empties the cart, this tab follows (§3.2)
    window.addEventListener('storage', function (ev) {
      if (ev.key && ev.key !== CART_KEY) return;
      render();
    });
  }

  /* ------------------------------------------------------------------ *
   * boot
   * ------------------------------------------------------------------ */

  function boot() {
    markCurrentNavLink();
    refreshNavBadge();
    document.addEventListener('cart:change', refreshNavBadge);

    var page = document.body.getAttribute('data-page');
    if (page === 'home') initHome();
    else if (page === 'catalog') initCatalog();
    else if (page === 'product') initProduct();
    else if (page === 'cart') initCart();
  }

  // exported for nothing (page-scoped only) — just keep AC-8 reachable in devtools
  window.demoShop = { formatTHB: formatTHB, cartUnits: cartUnits };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
