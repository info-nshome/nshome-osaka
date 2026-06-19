document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.getElementById("header");
  const hamburger = document.getElementById("hamburger");
  const navMobile = document.getElementById("navMobile");

  if (hamburger && navMobile) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.classList.toggle("active");
      navMobile.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      body.style.overflow = isOpen ? "hidden" : "";
    });

    navMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMobile.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        body.style.overflow = "";
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      event.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  const fadeElements = document.querySelectorAll(".fade-in");
  if ("IntersectionObserver" in window && fadeElements.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -60px 0px", threshold: 0.12 });
    fadeElements.forEach((element) => fadeObserver.observe(element));
  } else {
    fadeElements.forEach((element) => element.classList.add("visible"));
  }

  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 420);
    }, { passive: true });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prev = document.querySelector(".hero-arrow.prev");
  const next = document.querySelector(".hero-arrow.next");
  let slideIndex = 0;
  let slideTimer;

  function showSlide(index) {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, idx) => slide.classList.toggle("is-active", idx === slideIndex));
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === slideIndex);
      dot.setAttribute("aria-current", idx === slideIndex ? "true" : "false");
    });
  }

  function queueSlide() {
    window.clearInterval(slideTimer);
    if (slides.length > 1) {
      slideTimer = window.setInterval(() => showSlide(slideIndex + 1), 5200);
    }
  }

  if (slides.length) {
    showSlide(0);
    queueSlide();
    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        showSlide(idx);
        queueSlide();
      });
    });
    prev?.addEventListener("click", () => {
      showSlide(slideIndex - 1);
      queueSlide();
    });
    next?.addEventListener("click", () => {
      showSlide(slideIndex + 1);
      queueSlide();
    });
  }

  document.querySelectorAll(".js-fallback-img").forEach((img) => {
    const markMissing = () => {
      const imageFrame = img.closest(".image-frame");
      if (imageFrame) {
        imageFrame.classList.add("is-missing");
        return;
      }
      img.closest(".hero-slide")?.classList.add("is-missing");
    };
    if (img.complete && img.naturalWidth === 0) {
      markMissing();
    }
    img.addEventListener("error", () => {
      markMissing();
    });
  });

  document.querySelectorAll(".faq-question").forEach((button) => {
    button.addEventListener("click", () => {
      const answerId = button.getAttribute("aria-controls");
      const answer = answerId ? document.getElementById(answerId) : null;
      const isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      answer?.classList.toggle("open", !isOpen);
    });
  });

  const filterButtons = document.querySelectorAll(".filter-btn");
  const worksCards = document.querySelectorAll(".works-card");
  const worksEmpty = document.getElementById("worksEmpty");

  if (filterButtons.length && worksCards.length) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        const filter = button.dataset.filter || "all";
        let visibleCount = 0;

        worksCards.forEach((card) => {
          const categories = (card.dataset.category || "").split(",").map((item) => item.trim());
          const visible = filter === "all" || categories.includes(filter);
          card.classList.toggle("hidden", !visible);
          if (visible) visibleCount += 1;
        });

        worksEmpty?.classList.toggle("visible", visibleCount === 0);
      });
    });
  }

  const categorySelect = document.getElementById("formCategory");
  const categoryHidden = document.getElementById("formCategoryHidden");
  if (categorySelect && categoryHidden) {
    const setCategoryText = () => {
      categoryHidden.value = categorySelect.value ? categorySelect.options[categorySelect.selectedIndex].text : "";
    };
    categorySelect.addEventListener("change", setCategoryText);
    setCategoryText();
  }

  const contactForm = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  if (contactForm && submitBtn) {
    contactForm.addEventListener("submit", () => {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> 送信中...';
      window.setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane" aria-hidden="true"></i> 送信する';
      }, 5000);
    });
  }

  const thanksParams = new URLSearchParams(window.location.search);
  if (thanksParams.get("thanks") === "1") {
    const modal = document.createElement("div");
    modal.style.cssText = "position:fixed;inset:0;z-index:2000;display:grid;place-items:center;padding:20px;background:rgba(0,0,0,.52);";
    modal.innerHTML = `
      <div style="width:min(460px,100%);padding:34px;border-radius:8px;background:#fff;text-align:center;box-shadow:0 22px 70px rgba(0,0,0,.22);">
        <p style="margin:0 0 8px;color:#2D5A27;font-family:'Noto Serif JP',serif;font-size:1.35rem;font-weight:700;">送信完了しました</p>
        <p style="margin:0 0 22px;color:#66706A;line-height:1.8;">お問い合わせありがとうございます。内容を確認の上、2営業日以内にご連絡いたします。</p>
        <button type="button" class="btn btn-primary" id="thanksClose">閉じる</button>
      </div>
    `;
    document.body.appendChild(modal);
    history.replaceState(null, "", window.location.pathname);
    document.getElementById("thanksClose")?.addEventListener("click", () => modal.remove());
  }
});
