(function () {
  "use strict";

  const PRODUCTS = Array.isArray(window.PRODUCTS) ? window.PRODUCTS : [];
  const WHATSAPP_NUMBER = "8619947626109";
  const PAGE_SIZE = 12;

  const pageName = document.body.dataset.page || "";

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function whatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  function injectShell() {
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");
    const navItems = [
      ["home", "index.html", "Home"],
      ["products", "products.html", "Products"],
      ["manufacturing", "manufacturing.html", "Manufacturing"],
      ["about", "about.html", "About"],
      ["contact", "contact.html", "Contact"],
    ];

    if (header) {
      header.innerHTML = `
        <a class="skip-link" href="#main-content">Skip to content</a>
        <div class="utility-bar">
          <div class="wide-container utility-inner">
            <p>Factory-direct small household appliances for wholesale buyers</p>
            <a class="utility-link" href="${whatsAppUrl("Hello, I would like to discuss a wholesale inquiry.")}" target="_blank" rel="noopener">WhatsApp +86 199 4762 6109</a>
          </div>
        </div>
        <header class="site-header">
          <div class="wide-container header-inner">
            <a class="brand" href="index.html" aria-label="Yiwu Global Trade home">
              <span class="brand-mark" aria-hidden="true">YG</span>
              <span>
                <span class="brand-name">Yiwu Global Trade</span>
                <span class="brand-subtitle">Small Appliance Manufacturing</span>
              </span>
            </a>
            <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav">
              <span></span><span></span><span></span>
            </button>
            <nav class="main-nav" id="main-nav" aria-label="Main navigation">
              ${navItems
                .map(
                  ([key, href, label]) =>
                    `<a class="nav-link${pageName === key || (pageName === "product" && key === "products") ? " is-active" : ""}" href="${href}">${label}</a>`,
                )
                .join("")}
              <a class="button button-primary nav-cta" href="contact.html">Request a Quote</a>
            </nav>
          </div>
        </header>`;
    }

    if (footer) {
      footer.innerHTML = `
        <footer class="site-footer">
          <div class="container footer-main">
            <div class="footer-brand">
              <a class="brand" href="index.html">
                <span class="brand-mark" aria-hidden="true">YG</span>
                <span>
                  <span class="brand-name">Yiwu Global Trade</span>
                  <span class="brand-subtitle">Small Appliance Manufacturing</span>
                </span>
              </a>
              <p class="footer-copy">A factory-direct catalog of small household appliances for importers, distributors, and wholesale buyers.</p>
            </div>
            <div class="footer-column">
              <h2>Products</h2>
              <a href="products.html?category=Cooking%20Appliances">Cooking Appliances</a>
              <a href="products.html?category=Juicers%20%26%20Blenders">Juicers &amp; Blenders</a>
              <a href="products.html?category=Food%20Preparation">Food Preparation</a>
              <a href="products.html?category=Vacuum%20%26%20Steam%20Cleaning">Home Care</a>
            </div>
            <div class="footer-column">
              <h2>Company</h2>
              <a href="manufacturing.html">Manufacturing</a>
              <a href="about.html">About</a>
              <a href="contact.html">Contact</a>
              <a href="products.html">All Products</a>
            </div>
            <div class="footer-column">
              <h2>Wholesale Inquiries</h2>
              <p>WhatsApp</p>
              <a href="${whatsAppUrl("Hello, I would like to discuss a wholesale inquiry.")}" target="_blank" rel="noopener">+86 199 4762 6109</a>
              <a class="button button-light" href="contact.html">Send Requirements</a>
            </div>
          </div>
          <div class="container footer-bottom">
            <span>&copy; <span id="current-year"></span> Yiwu Global Trade Co., Ltd.</span>
            <span>Product specifications are subject to order confirmation.</span>
          </div>
        </footer>`;
    }

    const floatingLink = document.createElement("a");
    floatingLink.className = "whatsapp-float";
    floatingLink.href = whatsAppUrl("Hello, I would like to discuss a wholesale inquiry.");
    floatingLink.target = "_blank";
    floatingLink.rel = "noopener";
    floatingLink.textContent = "WhatsApp";
    document.body.appendChild(floatingLink);

    const year = document.getElementById("current-year");
    if (year) year.textContent = new Date().getFullYear();

    const menuButton = document.querySelector(".menu-toggle");
    const nav = document.getElementById("main-nav");
    if (menuButton && nav) {
      menuButton.addEventListener("click", function () {
        const isOpen = nav.classList.toggle("is-open");
        document.body.classList.toggle("menu-open", isOpen);
        menuButton.setAttribute("aria-expanded", String(isOpen));
        menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      });
    }
  }

  function productCard(product) {
    return `
      <article class="product-card">
        <a href="product.html?id=${encodeURIComponent(product.external_id)}" aria-label="View ${escapeHtml(product.title_en)}">
          <span class="product-media">
            <img src="${escapeHtml(product.main_image)}" alt="${escapeHtml(product.alt_text)}" loading="lazy" width="640" height="480">
          </span>
          <span class="product-body">
            <span class="product-category">${escapeHtml(product.category)}</span>
            <h3>${escapeHtml(product.title_en)}</h3>
            <span class="product-model">Model ${escapeHtml(product.model)}</span>
          </span>
        </a>
      </article>`;
  }

  function categoryCounts() {
    return PRODUCTS.reduce(function (counts, product) {
      counts[product.category] = (counts[product.category] || 0) + 1;
      return counts;
    }, {});
  }

  function initHome() {
    const categoryRoot = document.getElementById("category-list");
    const featuredRoot = document.getElementById("featured-products");
    const counts = categoryCounts();

    if (categoryRoot) {
      categoryRoot.innerHTML = Object.entries(counts)
        .map(
          ([category, count]) => `
            <a class="category-link" href="products.html?category=${encodeURIComponent(category)}">
              <span><strong>${escapeHtml(category)}</strong><small>${count} product models</small></span>
              <span class="category-arrow" aria-hidden="true">&rarr;</span>
            </a>`,
        )
        .join("");
    }

    if (featuredRoot) {
      const seen = new Set();
      const featured = [];
      for (const product of PRODUCTS) {
        if (!seen.has(product.category)) {
          seen.add(product.category);
          featured.push(product);
        }
        if (featured.length === 8) break;
      }
      featuredRoot.innerHTML = featured.map(productCard).join("");
    }
  }

  function pageRange(current, total) {
    if (total <= 5) return Array.from({ length: total }, (_, index) => index + 1);
    const start = Math.max(1, Math.min(current - 2, total - 4));
    return Array.from({ length: 5 }, (_, index) => start + index);
  }

  function initCatalog() {
    const grid = document.getElementById("catalog-grid");
    const filterRoot = document.getElementById("filter-tabs");
    const search = document.getElementById("catalog-search");
    const count = document.getElementById("results-count");
    const pagination = document.getElementById("pagination");
    if (!grid || !filterRoot || !search || !count || !pagination) return;

    const params = new URLSearchParams(window.location.search);
    const categories = Object.keys(categoryCounts());
    let activeCategory = categories.includes(params.get("category")) ? params.get("category") : "All";
    let query = "";
    let currentPage = 1;

    function filteredProducts() {
      const normalizedQuery = query.trim().toLowerCase();
      return PRODUCTS.filter(function (product) {
        const matchesCategory = activeCategory === "All" || product.category === activeCategory;
        const haystack = `${product.title_en} ${product.model} ${product.category}`.toLowerCase();
        return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
      });
    }

    function renderFilters() {
      filterRoot.innerHTML = ["All", ...categories]
        .map(
          (category) =>
            `<button class="filter-tab${category === activeCategory ? " is-active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`,
        )
        .join("");
    }

    function render() {
      const matches = filteredProducts();
      const totalPages = Math.max(1, Math.ceil(matches.length / PAGE_SIZE));
      currentPage = Math.min(currentPage, totalPages);
      const start = (currentPage - 1) * PAGE_SIZE;
      const pageItems = matches.slice(start, start + PAGE_SIZE);
      count.textContent = `${matches.length} product${matches.length === 1 ? "" : "s"}`;
      grid.innerHTML = pageItems.length
        ? pageItems.map(productCard).join("")
        : `<div class="empty-state"><h2>No matching products</h2><p>Try another model, product name, or category.</p></div>`;

      pagination.innerHTML = "";
      if (totalPages > 1) {
        const buttons = [];
        if (currentPage > 1) buttons.push(`<button class="page-button" type="button" data-page="${currentPage - 1}">Previous</button>`);
        for (const page of pageRange(currentPage, totalPages)) {
          buttons.push(`<button class="page-button${page === currentPage ? " is-active" : ""}" type="button" data-page="${page}" aria-label="Page ${page}">${page}</button>`);
        }
        if (currentPage < totalPages) buttons.push(`<button class="page-button" type="button" data-page="${currentPage + 1}">Next</button>`);
        pagination.innerHTML = buttons.join("");
      }
    }

    filterRoot.addEventListener("click", function (event) {
      const button = event.target.closest("[data-category]");
      if (!button) return;
      activeCategory = button.dataset.category;
      currentPage = 1;
      renderFilters();
      render();
    });

    search.addEventListener("input", function () {
      query = search.value;
      currentPage = 1;
      render();
    });

    pagination.addEventListener("click", function (event) {
      const button = event.target.closest("[data-page]");
      if (!button) return;
      currentPage = Number(button.dataset.page);
      render();
      document.getElementById("catalog-results").scrollIntoView({ behavior: "smooth", block: "start" });
    });

    renderFilters();
    render();
  }

  function initProduct() {
    const root = document.getElementById("product-detail");
    const relatedRoot = document.getElementById("related-products");
    const breadcrumbName = document.getElementById("breadcrumb-product");
    if (!root) return;

    const id = new URLSearchParams(window.location.search).get("id");
    const product = PRODUCTS.find((item) => item.external_id === id) || PRODUCTS[0];
    if (!product) {
      root.innerHTML = `<div class="empty-state"><h1>Product not found</h1><a class="button button-secondary" href="products.html">Browse products</a></div>`;
      return;
    }

    document.title = `${product.title_en} | Yiwu Global Trade`;
    if (breadcrumbName) breadcrumbName.textContent = product.title_en;
    const inquiryMessage = `Hello, I am interested in ${product.title_en} (${product.model}). Please share wholesale order details.`;
    const specs = [
      ["Model", product.model],
      ["Category", product.category],
      ["Wattage", product.wattage],
      ["Voltage", product.voltage],
      ["Dimensions", product.dimensions],
      ["Packaging", product.packaging],
      ["Customization", product.customization],
    ].filter(([, value]) => value);

    root.innerHTML = `
      <div class="detail-media">
        <img src="${escapeHtml(product.main_image)}" alt="${escapeHtml(product.alt_text)}" width="640" height="480">
      </div>
      <div class="detail-copy">
        <p class="eyebrow">${escapeHtml(product.category)}</p>
        <h1>${escapeHtml(product.title_en)}</h1>
        <p class="detail-lead">${escapeHtml(product.description)}</p>
        <div class="detail-actions">
          <a class="button button-primary" href="${whatsAppUrl(inquiryMessage)}" target="_blank" rel="noopener">Ask on WhatsApp</a>
          <a class="button button-outline" href="contact.html?product=${encodeURIComponent(product.external_id)}">Request a Quote</a>
        </div>
        <dl class="spec-list">
          ${specs.map(([label, value]) => `<div class="spec-row"><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}
        </dl>
      </div>`;

    if (relatedRoot) {
      relatedRoot.innerHTML = PRODUCTS.filter(
        (item) => item.category === product.category && item.external_id !== product.external_id,
      )
        .slice(0, 4)
        .map(productCard)
        .join("");
    }
  }

  function initContact() {
    const form = document.getElementById("inquiry-form");
    const productField = document.getElementById("product-interest");
    if (!form) return;

    const productId = new URLSearchParams(window.location.search).get("product");
    const selectedProduct = PRODUCTS.find((product) => product.external_id === productId);
    if (productField && selectedProduct) productField.value = `${selectedProduct.title_en} (${selectedProduct.model})`;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = new FormData(form);
      const lines = [
        "Hello, I would like to request a wholesale quote.",
        `Name: ${data.get("name") || ""}`,
        `Company: ${data.get("company") || ""}`,
        `Email: ${data.get("email") || ""}`,
        `Product: ${data.get("product") || "General inquiry"}`,
        `Requirements: ${data.get("message") || ""}`,
      ];
      window.location.href = whatsAppUrl(lines.join("\n"));
    });
  }

  injectShell();
  if (pageName === "home") initHome();
  if (pageName === "products") initCatalog();
  if (pageName === "product") initProduct();
  if (pageName === "contact") initContact();
})();
