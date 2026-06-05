(function () {
  function isActionTarget(target) {
    return Boolean(target.closest("a, button, input, select, textarea, summary, details"));
  }

  function initPricingFlip() {
    const cards = Array.from(document.querySelectorAll(".pricing-card-flip"));
    if (!cards.length) return;

    cards.forEach(function (card) {
      card.addEventListener("click", function (event) {
        if (isActionTarget(event.target)) return;
        card.classList.toggle("is-flipped");
      });

      card.addEventListener("keydown", function (event) {
        if (event.key !== "Enter" && event.key !== " ") return;
        if (isActionTarget(event.target)) return;
        event.preventDefault();
        card.classList.toggle("is-flipped");
      });
    });

    document.addEventListener("click", function (event) {
      cards.forEach(function (card) {
        if (!card.contains(event.target)) card.classList.remove("is-flipped");
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initPricingFlip);
})();
