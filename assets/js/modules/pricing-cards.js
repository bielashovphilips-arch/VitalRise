(function () {
  "use strict";

  function init() {
    document.querySelectorAll("#pricing .pricing-card-flip").forEach(function (card) {
      var front = card.querySelector(".pricing-card-front");
      var back = card.querySelector(".pricing-card-back");
      if (!front || !back) return;

      function syncFaces() {
        var flipped = card.classList.contains("is-flipped");
        var hiddenFace = flipped ? front : back;
        // Keep keyboard focus on the visible face when the original module flips.
        if (hiddenFace.contains(document.activeElement)) card.focus({ preventScroll: true });
        front.inert = flipped;
        back.inert = !flipped;
      }

      syncFaces();
      new MutationObserver(syncFaces).observe(card, { attributes: true, attributeFilter: ["class"] });
      card.addEventListener("keydown", function (event) {
        if (event.key !== "Escape" || !card.classList.contains("is-flipped")) return;
        event.preventDefault();
        card.classList.remove("is-flipped");
        card.focus({ preventScroll: true });
      });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
