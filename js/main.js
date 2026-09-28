(function () {
  const header = document.querySelector("[data-header]");
  const menuButton = document.querySelector("[data-menu]");
  const mobileNav = document.querySelector("[data-mobile-nav]");

  function setScrolled() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  setScrolled();
  window.addEventListener("scroll", setScrolled, { passive: true });

  function closeMenu() {
    if (!mobileNav || !menuButton) return;
    mobileNav.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open menu");
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const open = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  document.querySelectorAll("[data-tabs]").forEach(function (group) {
    const tabs = group.querySelectorAll("[data-tab]");
    const panels = group.querySelectorAll("[data-panel]");

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        const id = tab.getAttribute("data-tab");
        tabs.forEach(function (item) {
          const active = item === tab;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-selected", String(active));
        });
        panels.forEach(function (panel) {
          panel.classList.toggle("is-active", panel.getAttribute("data-panel") === id);
        });
      });
    });
  });

  const lightbox = document.querySelector("[data-lightbox]");
  if (lightbox) {
    const image = lightbox.querySelector("img");
    const title = lightbox.querySelector("[data-lightbox-title]");
    const description = lightbox.querySelector("[data-lightbox-description]");

    function closeLightbox() {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    }

    document.querySelectorAll("[data-shot]").forEach(function (shot) {
      shot.addEventListener("click", function () {
        image.src = shot.getAttribute("data-src");
        image.alt = shot.getAttribute("data-title") || "";
        title.textContent = shot.getAttribute("data-title") || "";
        description.textContent = shot.getAttribute("data-description") || "";
        lightbox.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });
    });

    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
    });
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const node = entry.target;
          const end = Number(node.getAttribute("data-count"));
          const suffix = node.getAttribute("data-suffix") || "";
          const start = performance.now();
          const duration = 1400;

          function tick(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            node.textContent = Math.round(end * eased) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
          observer.unobserve(node);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (node) {
      observer.observe(node);
    });
  }

  const params = new URLSearchParams(window.location.search);
  const sent = params.get("sent");
  const failed = params.get("error");

  if (sent === "admission") {
    const formWrap = document.querySelector("[data-admission-form]");
    const thanks = document.querySelector("[data-admission-thanks]");
    if (formWrap) formWrap.hidden = true;
    if (thanks) thanks.hidden = false;
  }

  if (sent === "contact") {
    const notice = document.querySelector("[data-contact-success]");
    if (notice) notice.classList.add("is-visible");
  }

  if (failed) {
    document.querySelectorAll("[data-form-error]").forEach(function (notice) {
      notice.classList.add("is-visible");
    });
  }

  document.querySelectorAll("form").forEach(function (form) {
    form.addEventListener("submit", function () {
      const button = form.querySelector("[type='submit']");
      if (!button) return;
      button.disabled = true;
      button.textContent = button.getAttribute("data-loading") || "Sending...";
    });
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
