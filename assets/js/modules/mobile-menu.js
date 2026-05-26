(function () {
  function closeMenu(header, button) {
    header.classList.remove("is-menu-open");
    button.setAttribute("aria-expanded", "false");
  }

  function initMobileMenu() {
    const header = document.querySelector(".site-header");
    const button = document.querySelector("[data-mobile-menu-toggle]");
    if (!header || !button) return;

    button.addEventListener("click", function () {
      const isOpen = header.classList.toggle("is-menu-open");
      button.setAttribute("aria-expanded", String(isOpen));
    });

    document.addEventListener("click", function (event) {
      if (!header.classList.contains("is-menu-open")) return;
      if (event.target.closest(".site-header")) return;
      closeMenu(header, button);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key !== "Escape") return;
      closeMenu(header, button);
    });

    header.querySelectorAll(".site-nav a, .header-cta").forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(header, button);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
