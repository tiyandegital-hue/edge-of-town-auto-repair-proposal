/* Edge of Town Auto Repair — concept proposal site
   SITE_NAME is the ONE swappable constant for the business name. */
const SITE_NAME = "Edge of Town Auto Repair";

document.documentElement.classList.add("js");

// Fill swappable name slots
document.querySelectorAll("[data-site-name]").forEach((el) => {
  el.textContent = SITE_NAME;
});

// Footer year
document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

// Mobile nav (focus-managed state machine: closed -> open)
const navToggle = document.querySelector(".nav-toggle");
const mobileNav = document.querySelector(".mobile-nav");
if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const open = mobileNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(open));
    if (open) {
      const first = mobileNav.querySelector("a");
      if (first) first.focus();
    } else {
      navToggle.focus();
    }
  });
}

// Entrance animations — IntersectionObserver drives .in; base state stays visible
const animEls = document.querySelectorAll(".anim, .hero h1, .ticket");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  animEls.forEach((el) => io.observe(el));
  // Safety net (§18: if JS partially fails, nothing may stay invisible).
  // Anything still hidden after 1.8s that sits in/near the viewport is forced in.
  setTimeout(() => {
    const vh = window.innerHeight || 800;
    animEls.forEach((el) => {
      if (el.classList.contains("in")) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh + 200 && r.bottom > -200) el.classList.add("in");
    });
  }, 1800);
} else {
  animEls.forEach((el) => el.classList.add("in"));
}

// Stagger delays for hero sequence
document.querySelectorAll(".hero [data-d]").forEach((el) => {
  el.style.setProperty("--d", el.getAttribute("data-d"));
  el.classList.add("anim", "stagger");
});

// Accordion (services) — one open at a time
document.querySelectorAll(".acc-item").forEach((item) => {
  const btn = item.querySelector(".acc-btn");
  const panel = item.querySelector(".acc-panel");
  if (!btn || !panel) return;
  btn.addEventListener("click", () => {
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".acc-item.open").forEach((other) => {
      other.classList.remove("open");
      other.querySelector(".acc-panel").style.maxHeight = null;
      other.querySelector(".acc-btn").setAttribute("aria-expanded", "false");
    });
    if (!isOpen) {
      item.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

// Concept booking form — SIMULATED. Validates, then shows a local success state.
// Sends nothing anywhere; the notice above the form says so plainly.
const form = document.querySelector("[data-concept-form]");
if (form) {
  form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    let ok = true;
    form.querySelectorAll("[required]").forEach((input) => {
      const field = input.closest(".field");
      const empty = !input.value.trim();
      const badEmail =
        input.type === "email" && input.value.trim() !== "" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      if (empty || badEmail) {
        ok = false;
        field.classList.add("invalid");
        input.setAttribute("aria-invalid", "true");
      } else {
        field.classList.remove("invalid");
        input.removeAttribute("aria-invalid");
      }
    });
    const consent = form.querySelector('input[name="consent"]');
    if (consent && !consent.checked) {
      ok = false;
      consent.closest(".consent").style.color = "#B3271E";
    } else if (consent) {
      consent.closest(".consent").style.color = "";
    }
    if (!ok) {
      const firstBad = form.querySelector(".field.invalid input, .field.invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }
    form.querySelector(".form-fields").hidden = true;
    form.querySelector(".form-ok").classList.add("show");
  });
  // Clear invalid state as the user types
  form.querySelectorAll("input, textarea, select").forEach((input) => {
    input.addEventListener("input", () => {
      const field = input.closest(".field");
      if (field) field.classList.remove("invalid");
    });
  });
}
