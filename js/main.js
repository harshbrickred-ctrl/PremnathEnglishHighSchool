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
    document.body.classList.remove("nav-open");
  }

  if (menuButton && mobileNav) {
    menuButton.addEventListener("click", function () {
      const open = mobileNav.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", open);
    });

    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
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

  const spyLinks = Array.from(document.querySelectorAll("[data-spy]"));
  const sections = spyLinks
    .map(function (link) {
      return document.getElementById((link.getAttribute("href") || "").replace("#", ""));
    })
    .filter(Boolean);

  function markCurrent() {
    if (!sections.length) return;
    const line = window.scrollY + 140;
    let current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= line) current = section;
    });
    spyLinks.forEach(function (link) {
      link.classList.toggle("is-current", link.getAttribute("href") === "#" + current.id);
    });
  }

  if (sections.length) {
    markCurrent();
    window.addEventListener("scroll", markCurrent, { passive: true });
  }

  const gallery = document.querySelector("[data-gallery]");
  const galleryCount = document.querySelector("[data-gallery-count]");
  const filters = document.querySelectorAll("[data-filter]");

  function galleryShots() {
    if (!gallery) return [];
    return Array.from(gallery.querySelectorAll("[data-shot]"));
  }

  function applyFilter(name) {
    galleryShots().forEach(function (shot) {
      const show = name === "all" || shot.getAttribute("data-group") === name;
      shot.hidden = !show;
    });
    if (gallery) gallery.classList.toggle("is-mixed", name === "all");
    const visible = galleryShots().filter(function (shot) { return !shot.hidden; }).length;
    if (galleryCount) {
      galleryCount.textContent = visible === 1 ? "1 photograph" : visible + " photographs";
    }
  }

  if (filters.length) {
    applyFilter("all");
    filters.forEach(function (filter) {
      filter.addEventListener("click", function () {
        const name = filter.getAttribute("data-filter");
        filters.forEach(function (item) {
          const active = item === filter;
          item.classList.toggle("is-active", active);
          item.setAttribute("aria-pressed", String(active));
        });
        applyFilter(name);
      });
    });
  }

  const lightbox = document.querySelector("[data-lightbox]");
  let lightboxShots = [];
  let lightboxIndex = 0;
  let lightboxReturn = null;

  function visibleShots(scope) {
    return Array.from(scope.querySelectorAll("[data-shot]")).filter(function (shot) {
      return !shot.hidden && shot.getClientRects().length > 0;
    });
  }

  function shotGroup(shot) {
    return shot.closest("[data-gallery]") || shot.closest(".stage-grid") || shot.parentElement;
  }

  function renderLightbox() {
    const shot = lightboxShots[lightboxIndex];
    if (!lightbox || !shot) return;
    const image = lightbox.querySelector("img");
    image.src = shot.getAttribute("data-src");
    image.alt = shot.getAttribute("data-title") || "";
    lightbox.querySelector("[data-lightbox-title]").textContent = shot.getAttribute("data-title") || "";
    lightbox.querySelector("[data-lightbox-description]").textContent = shot.getAttribute("data-description") || "";
    lightbox.querySelector("[data-lightbox-count]").textContent = (lightboxIndex + 1) + " of " + lightboxShots.length;
    const single = lightboxShots.length < 2;
    lightbox.querySelector("[data-lightbox-prev]").hidden = single;
    lightbox.querySelector("[data-lightbox-next]").hidden = single;
  }

  function openLightbox(shot) {
    lightboxShots = visibleShots(shotGroup(shot));
    lightboxIndex = Math.max(0, lightboxShots.indexOf(shot));
    lightboxReturn = shot;
    renderLightbox();
    lightbox.hidden = false;
    lightbox.classList.add("is-open");
    document.body.style.overflow = "hidden";
    const closeButton = lightbox.querySelector("[data-lightbox-close]");
    if (closeButton) closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;
    lightbox.classList.remove("is-open");
    lightbox.hidden = true;
    document.body.style.overflow = "";
    if (lightboxReturn) lightboxReturn.focus();
  }

  function stepLightbox(direction) {
    if (!lightboxShots.length) return;
    lightboxIndex = (lightboxIndex + direction + lightboxShots.length) % lightboxShots.length;
    renderLightbox();
  }

  document.querySelectorAll("[data-shot]").forEach(function (shot) {
    shot.addEventListener("click", function () {
      openLightbox(shot);
    });
  });

  if (lightbox) {
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox || event.target.closest("[data-lightbox-close]")) closeLightbox();
    });
    lightbox.querySelector("[data-lightbox-prev]").addEventListener("click", function () {
      stepLightbox(-1);
    });
    lightbox.querySelector("[data-lightbox-next]").addEventListener("click", function () {
      stepLightbox(1);
    });
  }

  document.addEventListener("keydown", function (event) {
    const lightboxOpen = lightbox && lightbox.classList.contains("is-open");
    if (event.key === "Escape") {
      if (lightboxOpen) closeLightbox();
      else closeMenu();
      return;
    }
    if (!lightboxOpen) return;
    if (event.key === "ArrowRight") stepLightbox(1);
    if (event.key === "ArrowLeft") stepLightbox(-1);
  });
})();
