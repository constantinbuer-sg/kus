/* Kühnert & Schroeder – kleines gemeinsames Script für alle Seiten. */
(function () {
  document.documentElement.classList.add("js");

  // Header bekommt beim Scrollen eine feine Linie
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  // Von einer anderen Seite kommend (z. B. „Werbung“ im Impressum): sicher zum Abschnitt springen
  var target = location.hash && document.getElementById(location.hash.slice(1));
  if (target) {
    window.addEventListener("load", function () { target.scrollIntoView({ behavior: "auto" }); });
  }

  // Dezentes Einblenden von Sektionen
  var reveal = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    reveal.forEach(function (el) { io.observe(el); });
  } else {
    reveal.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Plattform-Links aus js/config.js
  if (typeof podcastLinks !== "undefined") {
    document.querySelectorAll("[data-platform]").forEach(function (el) {
      var url = podcastLinks[el.dataset.platform];
      el.dataset.track = "hoeren_" + el.dataset.platform;
      var go = el.querySelector(".platform-go");
      if (url && url !== "#") {
        el.setAttribute("href", url);
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
        el.removeAttribute("aria-disabled");
        el.classList.remove("is-pending");
        if (go) go.textContent = "›";
      }
    });
  }

  // Klicks auf markierte Links an Simple Analytics melden (Name steht in data-track)
  document.addEventListener("click", function (event) {
    var el = event.target.closest("[data-track]");
    if (el && el.getAttribute("href") && typeof window.sa_event === "function") window.sa_event(el.dataset.track);
  });
})();
