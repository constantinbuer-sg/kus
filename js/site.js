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

  // Pressebereich: fehlende Downloads werden zu „Folgt in Kürze“, vorhandene zeigen ihre Größe
  document.querySelectorAll("[data-download]").forEach(function (link) {
    var meta = link.closest(".download, .hero-actions").querySelector("[data-size]");
    fetch(link.getAttribute("href"), { method: "HEAD", cache: "no-store" })
      .then(function (res) {
        if (!res.ok) throw new Error("missing");
        var bytes = Number(res.headers.get("content-length"));
        if (bytes && meta) {
          var mb = bytes / 1048576;
          meta.textContent += " · " + (mb >= 1 ? mb.toLocaleString("de-DE", { maximumFractionDigits: 1 }) + " MB" : Math.max(1, Math.round(bytes / 1024)) + " KB");
        }
      })
      .catch(function () {
        var pending = document.createElement("span");
        pending.className = link.className + " button-pending";
        pending.setAttribute("aria-disabled", "true");
        pending.textContent = link.dataset.pending || "Folgt in Kürze";
        link.replaceWith(pending);
        if (meta && meta.parentElement.classList.contains("hero-actions")) meta.hidden = true;
      });
  });

  // Werbeformular
  var form = document.querySelector("[data-contact-form]");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var submit = form.querySelector("button[type=submit]");
  var messages = {
    name: "Bitte gib deinen Namen an.",
    company: "Bitte gib deine Firma an.",
    email: "Bitte gib eine gültige E-Mail-Adresse an.",
    message: "Bitte schreib uns kurz, worum es geht.",
  };

  function showSuccess() {
    var done = document.createElement("p");
    done.className = "form-success";
    done.setAttribute("tabindex", "-1");
    done.textContent = "Danke! Wir melden uns bei dir.";
    var intro = form.parentElement.querySelector(".form-intro");
    if (intro) intro.remove();
    form.replaceWith(done);
    done.focus();
  }

  function validate() {
    var firstInvalid = null;
    Object.keys(messages).forEach(function (name) {
      var field = form.elements[name];
      var error = document.getElementById("err-" + name);
      var ok = field.checkValidity() && field.value.trim() !== "";
      field.setAttribute("aria-invalid", ok ? "false" : "true");
      error.textContent = ok ? "" : messages[name];
      if (!ok && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) firstInvalid.focus();
    return !firstInvalid;
  }

  form.querySelectorAll("input, textarea").forEach(function (field) {
    field.addEventListener("input", function () {
      if (field.getAttribute("aria-invalid") === "true" && field.checkValidity()) {
        field.setAttribute("aria-invalid", "false");
        document.getElementById("err-" + field.name).textContent = "";
      }
    });
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    status.textContent = "";
    status.classList.remove("is-error");
    if (!validate()) return;

    var data = {};
    new FormData(form).forEach(function (value, key) { data[key] = value; });
    submit.disabled = true;
    submit.textContent = "Wird gesendet …";

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    })
      .then(function (res) { if (!res.ok) throw new Error("send failed"); showSuccess(); })
      .catch(function () {
        submit.disabled = false;
        submit.textContent = "Abschicken";
        status.classList.add("is-error");
        status.textContent = "Das hat leider nicht geklappt. Bitte versuch es gleich noch einmal.";
      });
  });

  // Rückmeldung nach Versand ohne JavaScript (Weiterleitung vom Server)
  var params = new URLSearchParams(window.location.search);
  if (params.get("anfrage") === "gesendet") showSuccess();
  if (params.get("anfrage") === "fehler") {
    status.classList.add("is-error");
    status.textContent = "Das hat leider nicht geklappt. Bitte versuch es gleich noch einmal.";
  }
})();
