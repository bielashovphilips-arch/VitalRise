(function () {
  const system = window.VitalRiseSystem || {};

  function initReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    function revealOnScroll() {
      const windowHeight = window.innerHeight;

      revealElements.forEach(function (element) {
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
          element.classList.add("active");
        }
      });
    }

    window.addEventListener("scroll", revealOnScroll);
    window.addEventListener("load", revealOnScroll);
    revealOnScroll();
  }

  system.initReveal = initReveal;
  window.VitalRiseSystem = system;

  document.addEventListener("DOMContentLoaded", initReveal);
})();
