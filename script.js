/* ANVIA — interactions */
(function () {
  "use strict";

  /* ---- Sticky nav background on scroll ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add("is-stuck");
    else nav.classList.remove("is-stuck");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Reveal on scroll ---- */
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const reveals = document.querySelectorAll(".reveal");

  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );
    // light stagger for grouped siblings
    reveals.forEach((el, i) => {
      el.style.transitionDelay = (i % 4) * 90 + "ms";
      io.observe(el);
    });
  }

  /* ---- Readiness counter ---- */
  const numEl = document.querySelector(".meter__num");
  if (numEl && !reduce && "IntersectionObserver" in window) {
    const target = parseInt(numEl.getAttribute("data-count"), 10) || 0;
    const counterIO = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          obs.unobserve(entry.target);
          const start = performance.now();
          const dur = 1600;
          const tick = (now) => {
            const t = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            numEl.textContent = Math.round(eased * target);
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    counterIO.observe(numEl);
  } else if (numEl) {
    numEl.textContent = numEl.getAttribute("data-count");
  }

  /* ---- Waitlist form feedback ---- */
  const form = document.querySelector(".cta__form");
  if (form) {
    form.addEventListener("submit", () => {
      const input = form.querySelector("input");
      const btn = form.querySelector("button");
      if (input && input.value.trim()) {
        btn.textContent = "You're on the list ✓";
        btn.disabled = true;
        input.value = "";
        input.placeholder = "See you at launch";
      }
    });
  }
})();
