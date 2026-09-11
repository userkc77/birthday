"use strict";

// ==========================================
// 🎂 BIRTHDAY WEBSITE SETTINGS
// ==========================================
// These are the ONLY two values you normally need to edit.
// Everything on the site (the opening screen, the hero heading,
// the personal message, the secret surprise, the finale, and the
// countdown) reads from these two variables automatically.

const SISTER_NAME = "Your Sister's Name";
const BIRTHDAY = "2026-09-25T00:00:00";

// ==========================================
// END OF SETTINGS — no other edits required
// ==========================================

(function () {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ------------------------------------------------------------
     0. Apply SISTER_NAME everywhere via data-sister-name hooks
  ------------------------------------------------------------ */
  function applySisterName() {
    document.querySelectorAll("[data-sister-name]").forEach((el) => {
      el.textContent = SISTER_NAME;
    });
    document.title = `Happy Birthday, ${SISTER_NAME} 🎂`;
  }
  applySisterName();

  /* ------------------------------------------------------------
     1. Opening screen sequence
  ------------------------------------------------------------ */
  function runOpeningSequence() {
    const lines = document.querySelectorAll(".opening-line");
    const openBtn = document.getElementById("open-surprise-btn");
    const delays = [200, 1400, 2700];

    lines.forEach((line, i) => {
      setTimeout(() => line.classList.add("is-visible"), delays[i] ?? i * 1200);
    });

    setTimeout(() => {
      openBtn.classList.add("is-visible");
    }, delays[delays.length - 1] + 900);
  }

  /* ------------------------------------------------------------
     2. Reveal main site when "Open Your Surprise" is clicked
  ------------------------------------------------------------ */
  function openSurprise() {
    const openingScreen = document.getElementById("opening-screen");
    const main = document.getElementById("main-experience");

    burstConfetti(70);
    burstHearts(24);
    tryPlayMusic();

    openingScreen.classList.add("is-leaving");

    const reveal = () => {
      openingScreen.setAttribute("hidden", "");
      main.hidden = false;
      window.scrollTo({ top: 0, behavior: "auto" });
      document.body.style.overflow = "";
      startHeroTyping();
      startMessageTypewriter();
    };

    if (prefersReducedMotion) {
      reveal();
    } else {
      openingScreen.addEventListener("animationend", reveal, { once: true });
      // Safety fallback in case animationend doesn't fire
      setTimeout(reveal, 1100);
    }
  }

  /* ------------------------------------------------------------
     3. Hero typing effect
  ------------------------------------------------------------ */
  function startHeroTyping() {
    const el = document.getElementById("hero-typing");
    if (!el || el.dataset.done) return;
    const phrase = `Made with love, just for ${SISTER_NAME}.`;
    el.dataset.done = "true";

    if (prefersReducedMotion) {
      el.textContent = phrase;
      return;
    }

    let i = 0;
    (function type() {
      el.textContent = phrase.slice(0, i);
      i++;
      if (i <= phrase.length) {
        setTimeout(type, 45);
      } else {
        el.style.borderRight = "none";
      }
    })();
  }

  /* ------------------------------------------------------------
     4. Typewriter for the personal message
  ------------------------------------------------------------ */
  function startMessageTypewriter() {
    const el = document.getElementById("message-text");
    if (!el || el.dataset.done) return;
    el.dataset.done = "true";

    const fullText = el.textContent.trim();

    if (prefersReducedMotion) {
      return; // keep the plain text, no animation needed
    }

    el.textContent = "";
    const cursor = document.createElement("span");
    cursor.className = "typed-cursor";
    el.appendChild(cursor);

    let i = 0;
    const speed = 14; // ms per character, fast enough not to feel slow
    (function type() {
      if (i < fullText.length) {
        cursor.insertAdjacentText("beforebegin", fullText[i]);
        i++;
        setTimeout(type, speed);
      } else {
        cursor.remove();
      }
    })();
  }

  /* ------------------------------------------------------------
     5. Scroll-reveal animations via IntersectionObserver
  ------------------------------------------------------------ */
  function setupScrollReveal() {
    const targets = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((t) => observer.observe(t));
  }

  /* ------------------------------------------------------------
     6. Photo gallery modal
  ------------------------------------------------------------ */
  function setupGalleryModal() {
    const modal = document.getElementById("photo-modal");
    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const closeBtn = document.getElementById("modal-close");

    document.querySelectorAll(".photo-card").forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        const caption = card.dataset.caption || "";
        if (img && !card.classList.contains("photo-card--placeholder")) {
          modalImg.src = img.src;
          modalImg.alt = img.alt;
          modalImg.style.display = "";
        } else {
          modalImg.removeAttribute("src");
          modalImg.style.display = "none";
        }
        modalCaption.textContent = caption;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });

    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
    }

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }

  /* ------------------------------------------------------------
     7. Countdown to BIRTHDAY (auto rolls to next year if passed)
  ------------------------------------------------------------ */
  function getNextBirthdayTimestamp() {
    const configured = new Date(BIRTHDAY);
    const now = new Date();

    // If invalid, fail safely into "arrived" state.
    if (isNaN(configured.getTime())) return null;

    const next = new Date(configured.getTime());

    // If the configured date/time has already passed, but it's not
    // "today" (the birthday itself), roll forward to next year so the
    // site stays useful year after year without editing anything else.
    const isSameCalendarDay =
      now.getFullYear() === configured.getFullYear() &&
      now.getMonth() === configured.getMonth() &&
      now.getDate() === configured.getDate();

    if (!isSameCalendarDay && configured.getTime() < now.getTime()) {
      next.setFullYear(now.getFullYear());
      if (next.getTime() < now.getTime()) {
        next.setFullYear(now.getFullYear() + 1);
      }
    }

    return { target: next, isToday: isSameCalendarDay };
  }

  function setupCountdown() {
    const daysEl = document.getElementById("cd-days");
    const hoursEl = document.getElementById("cd-hours");
    const minsEl = document.getElementById("cd-mins");
    const secsEl = document.getElementById("cd-secs");
    const countdownWrap = document.getElementById("countdown");
    const arrivedEl = document.getElementById("countdown-arrived");

    function pad(n) {
      return String(n).padStart(2, "0");
    }

    function tick() {
      const info = getNextBirthdayTimestamp();
      if (!info) return;

      const now = Date.now();
      const diff = info.target.getTime() - now;

      if (info.isToday || diff <= 0) {
        countdownWrap.hidden = true;
        arrivedEl.hidden = false;
        arrivedEl.textContent = `🎂 It's Your Birthday, ${SISTER_NAME}! 🎉❤️`;
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      daysEl.textContent = pad(days);
      hoursEl.textContent = pad(hours);
      minsEl.textContent = pad(mins);
      secsEl.textContent = pad(secs);
    }

    tick();
    const timer = setInterval(tick, 1000);
  }

  /* ------------------------------------------------------------
     8. Interactive wish cake
  ------------------------------------------------------------ */
  function setupWishCake() {
    const btn = document.getElementById("cake-btn");
    const result = document.getElementById("wish-result");

    btn.addEventListener("click", () => {
      if (btn.classList.contains("is-blown")) return;
      btn.classList.add("is-blown");
      burstConfetti(50);
      burstHearts(18);
      result.hidden = false;
      playChime();
    });
  }

  /* ------------------------------------------------------------
     9. Secret surprise unlock
  ------------------------------------------------------------ */
  function setupSecretSurprise() {
    const unlockBtn = document.getElementById("unlock-btn");
    const locked = document.getElementById("secret-locked");
    const countdownBox = document.getElementById("secret-countdown");
    const revealBox = document.getElementById("secret-reveal");

    unlockBtn.addEventListener("click", () => {
      locked.hidden = true;
      countdownBox.hidden = false;

      let count = 3;
      countdownBox.textContent = count;

      const step = () => {
        count--;
        if (count > 0) {
          countdownBox.textContent = count;
          setTimeout(step, 1000);
        } else {
          countdownBox.hidden = true;
          revealBox.hidden = false;
          burstFireworks();
          burstHearts(30);
          burstConfetti(90);
        }
      };

      setTimeout(step, prefersReducedMotion ? 200 : 1000);
    });
  }

  /* ------------------------------------------------------------
     10. Music player (never autoplays)
  ------------------------------------------------------------ */
  function setupMusic() {
    const btn = document.getElementById("music-toggle");
    const audio = document.getElementById("bg-music");
    let hasSource = true;

    audio.addEventListener("error", () => {
      hasSource = false;
    });

    btn.addEventListener("click", () => {
      if (!hasSource) {
        btn.classList.toggle("is-muted");
        return;
      }
      if (audio.paused) {
        audio.play().catch(() => {
          hasSource = false;
        });
        btn.classList.add("is-playing");
        btn.setAttribute("aria-pressed", "true");
      } else {
        audio.pause();
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-pressed", "false");
      }
    });

    window.__tryPlayMusic = () => {
      if (!hasSource) return;
      audio
        .play()
        .then(() => {
          btn.classList.add("is-playing");
          btn.setAttribute("aria-pressed", "true");
        })
        .catch(() => {
          /* Autoplay blocked or file missing — that's fine, user can tap the button */
        });
    };
  }

  function tryPlayMusic() {
    if (typeof window.__tryPlayMusic === "function") {
      window.__tryPlayMusic();
    }
  }

  /* ------------------------------------------------------------
     11. Small chime sound effect (only after user interaction),
         generated with the Web Audio API so no extra file is needed.
  ------------------------------------------------------------ */
  function playChime() {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const notes = [523.25, 659.25, 783.99];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.12);
        osc.stop(ctx.currentTime + i * 0.12 + 0.5);
      });
    } catch (e) {
      /* Audio not available — silently ignore */
    }
  }

  /* ------------------------------------------------------------
     12. Ripple effect on buttons with .ripple
  ------------------------------------------------------------ */
  function setupRipples() {
    document.querySelectorAll(".ripple").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (prefersReducedMotion) return;
        const rect = btn.getBoundingClientRect();
        const circle = document.createElement("span");
        const size = Math.max(rect.width, rect.height) * 1.6;
        circle.className = "ripple-circle";
        circle.style.width = circle.style.height = `${size}px`;
        circle.style.left = `${(e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2}px`;
        circle.style.top = `${(e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2}px`;
        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 650);
      });
    });
  }

  /* ------------------------------------------------------------
     13. Night-sky background: stars, glowing particles, shooting stars
  ------------------------------------------------------------ */
  function setupSkyCanvas() {
    const canvas = document.getElementById("sky-canvas");
    const ctx = canvas.getContext("2d");
    let w, h, stars, particles, shootingStars;
    let running = true;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function init() {
      resize();
      const starCount = Math.min(140, Math.floor((w * h) / 9000));
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
      }));

      const particleCount = prefersReducedMotion ? 0 : Math.min(30, Math.floor(w / 40));
      particles = Array.from({ length: particleCount }, () => spawnParticle());

      shootingStars = [];
    }

    function spawnParticle() {
      const colors = ["255,79,154", "199,125,255", "255,209,102"];
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 0.8,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: -(Math.random() * 0.25 + 0.08),
        vx: (Math.random() - 0.5) * 0.15,
        alpha: Math.random() * 0.5 + 0.2,
      };
    }

    function maybeSpawnShootingStar() {
      if (prefersReducedMotion) return;
      if (Math.random() < 0.004 && shootingStars.length < 2) {
        shootingStars.push({
          x: Math.random() * w * 0.6,
          y: Math.random() * h * 0.3,
          len: 90 + Math.random() * 60,
          speed: 9 + Math.random() * 4,
          angle: Math.PI / 5,
          life: 1,
        });
      }
    }

    function draw() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);

      // Twinkling stars
      const t = Date.now();
      stars.forEach((s) => {
        const twinkle = Math.sin(t * s.twinkleSpeed + s.phase) * 0.4 + 0.6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${0.5 * twinkle})`;
        ctx.fill();
      });

      // Rising glowing particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < -10) Object.assign(p, spawnParticle(), { y: h + 10 });
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.shadowColor = `rgba(${p.color},0.8)`;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Shooting stars
      maybeSpawnShootingStar();
      shootingStars.forEach((s) => {
        const dx = Math.cos(s.angle) * s.speed;
        const dy = Math.sin(s.angle) * s.speed;
        s.x += dx;
        s.y += dy;
        s.life -= 0.02;

        const grad = ctx.createLinearGradient(
          s.x, s.y,
          s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len
        );
        grad.addColorStop(0, `rgba(255,255,255,${s.life})`);
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
        ctx.stroke();
      });
      shootingStars = shootingStars.filter((s) => s.life > 0 && s.y < h + 100);

      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", () => {
      running = document.visibilityState === "visible";
      if (running) requestAnimationFrame(draw);
    });

    init();
    requestAnimationFrame(draw);
  }

  /* ------------------------------------------------------------
     14. FX canvas: confetti / hearts / fireworks bursts
  ------------------------------------------------------------ */
  let fxCtx, fxW, fxH, fxParticles = [];

  function setupFxCanvas() {
    const canvas = document.getElementById("fx-canvas");
    fxCtx = canvas.getContext("2d");

    function resize() {
      fxW = canvas.width = window.innerWidth;
      fxH = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resize);
    resize();

    function loop() {
      fxCtx.clearRect(0, 0, fxW, fxH);
      fxParticles.forEach((p) => p.update());
      fxParticles = fxParticles.filter((p) => p.life > 0);
      fxParticles.forEach((p) => p.draw(fxCtx));
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  function randomBetween(a, b) {
    return a + Math.random() * (b - a);
  }

  function burstConfetti(count) {
    if (prefersReducedMotion) return;
    const colors = ["#FF4F9A", "#C77DFF", "#FFD166", "#FFFFFF"];
    for (let i = 0; i < count; i++) {
      const x = randomBetween(0, fxW);
      fxParticles.push({
        x,
        y: -10,
        vx: randomBetween(-1.2, 1.2),
        vy: randomBetween(2, 4.5),
        size: randomBetween(5, 9),
        rotation: randomBetween(0, Math.PI * 2),
        rotSpeed: randomBetween(-0.15, 0.15),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.vy += 0.02;
          this.rotation += this.rotSpeed;
          this.life -= 0.006;
        },
        draw(ctx) {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.rotation);
          ctx.globalAlpha = Math.max(this.life, 0);
          ctx.fillStyle = this.color;
          ctx.fillRect(-this.size / 2, -this.size / 3, this.size, this.size * 0.6);
          ctx.restore();
        },
      });
    }
  }

  function burstHearts(count) {
    if (prefersReducedMotion) return;
    const colors = ["#FF4F9A", "#C77DFF", "#FFD166"];
    for (let i = 0; i < count; i++) {
      fxParticles.push({
        x: randomBetween(fxW * 0.15, fxW * 0.85),
        y: fxH + 20,
        vx: randomBetween(-0.4, 0.4),
        vy: randomBetween(-2.6, -1.6),
        size: randomBetween(12, 22),
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
        update() {
          this.x += this.vx;
          this.y += this.vy;
          this.life -= 0.008;
        },
        draw(ctx) {
          ctx.save();
          ctx.globalAlpha = Math.max(this.life, 0);
          ctx.font = `${this.size}px sans-serif`;
          ctx.fillText("❤", this.x, this.y);
          ctx.restore();
        },
      });
    }
  }

  function burstFireworks() {
    if (prefersReducedMotion) return;
    const colors = ["#FF4F9A", "#C77DFF", "#FFD166", "#FFFFFF"];
    const bursts = 4;
    for (let b = 0; b < bursts; b++) {
      setTimeout(() => {
        const cx = randomBetween(fxW * 0.2, fxW * 0.8);
        const cy = randomBetween(fxH * 0.15, fxH * 0.5);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const sparks = 36;
        for (let i = 0; i < sparks; i++) {
          const angle = (Math.PI * 2 * i) / sparks;
          const speed = randomBetween(2, 5);
          fxParticles.push({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: randomBetween(2, 3.5),
            color,
            life: 1,
            update() {
              this.x += this.vx;
              this.y += this.vy;
              this.vy += 0.035;
              this.vx *= 0.98;
              this.life -= 0.012;
            },
            draw(ctx) {
              ctx.save();
              ctx.globalAlpha = Math.max(this.life, 0);
              ctx.fillStyle = this.color;
              ctx.shadowColor = this.color;
              ctx.shadowBlur = 8;
              ctx.beginPath();
              ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            },
          });
        }
      }, b * 380);
    }
  }

  /* ------------------------------------------------------------
     15. Init
  ------------------------------------------------------------ */
  function init() {
    document.body.style.overflow = "hidden"; // locked until surprise opens

    setupFxCanvas();
    setupSkyCanvas();
    setupMusic();
    setupRipples();
    setupCountdown();
    setupWishCake();
    setupSecretSurprise();
    setupGalleryModal();
    setupScrollReveal();

    runOpeningSequence();

    document
      .getElementById("open-surprise-btn")
      .addEventListener("click", openSurprise);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
