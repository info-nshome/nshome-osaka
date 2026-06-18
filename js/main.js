/* ========================================
   NS HOME - メインJavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================
  // 1. ハンバーガーメニュー（モバイル）
  // ========================================
  const hamburger = document.getElementById('hamburger');
  const navMobile = document.getElementById('navMobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('active');
      navMobile.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      // メニュー開閉時のbodyスクロール制御
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // モバイルナビのリンクをクリックしたらメニューを閉じる
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMobile.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================
  // 2. スクロール時のフェードインアニメーション
  // ========================================
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target); // 一度表示したら監視を解除
      }
    });
  }, observerOptions);

  fadeElements.forEach(el => fadeObserver.observe(el));

  // ========================================
  // 3. トップに戻るボタン
  // ========================================
  const backToTop = document.getElementById('backToTop');

  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }, { passive: true });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================================
  // 4. ヘッダーのスクロール時縮小
  // ========================================
  const header = document.getElementById('header');

  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
      } else {
        header.style.boxShadow = '0 1px 10px rgba(0, 0, 0, 0.06)';
      }
    }, { passive: true });
  }

  // ========================================
  // 5. スムーズスクロール（Safari対応強化）
  // ========================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // 6. お問い合わせフォームの送信処理
  // ========================================
  const contactForm = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');

  // select変更時にhiddenフィールドへ日本語テキストをセット
  const categorySelect = document.getElementById('formCategory');
  const categoryHidden = document.getElementById('formCategoryHidden');

  if (categorySelect && categoryHidden) {
    categorySelect.addEventListener('change', () => {
      categoryHidden.value = categorySelect.value ? categorySelect.options[categorySelect.selectedIndex].text : '';
    });
  }

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      // 送信直前にもhiddenフィールドを確実に更新
      if (categorySelect && categoryHidden && categorySelect.value) {
        categoryHidden.value = categorySelect.options[categorySelect.selectedIndex].text;
      }

      // 送信ボタンの二重クリック防止
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';

      // 5秒後にボタンを復元（安全策）
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> 送信する';
      }, 5000);
    });
  }

  // ========================================
  // 6-2. 送信完了後のサンクスメッセージ表示
  // ========================================
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('thanks') === '1') {
    // サンクスモーダルを表示
    const thanksModal = document.createElement('div');
    thanksModal.id = 'thanksModal';
    thanksModal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:10000;padding:20px;';
    thanksModal.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:48px 32px;max-width:500px;width:100%;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:fadeInUp 0.5s ease;">
        <div style="width:72px;height:72px;background:#3D6B35;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 24px;">
          <i class="fas fa-check" style="color:#fff;font-size:32px;"></i>
        </div>
        <h3 style="font-size:1.5rem;color:#2c2c2c;margin-bottom:12px;font-family:'Noto Serif JP',serif;">送信完了しました</h3>
        <p style="color:#666;line-height:1.8;margin-bottom:8px;">お問い合わせありがとうございます。</p>
        <p style="color:#666;line-height:1.8;margin-bottom:24px;">内容を確認の上、2営業日以内にご連絡いたします。</p>
        <button onclick="document.getElementById('thanksModal').remove();history.replaceState(null,'',window.location.pathname);" style="background:#3D6B35;color:#fff;border:none;padding:14px 40px;border-radius:8px;font-size:1rem;cursor:pointer;font-weight:600;">閉じる</button>
      </div>
    `;
    document.body.appendChild(thanksModal);
    // URLからパラメータを除去（ブラウザ履歴を汚さない）
    history.replaceState(null, '', window.location.pathname);
  }

  // ========================================
  // 7. 現在のナビゲーションハイライト
  // ========================================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-desktop .nav-list a[href^="#"]');

  function highlightNav() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.style.color = '';
      link.style.backgroundColor = '';
      if (link.getAttribute('href') === `#${current}`) {
        if (!link.classList.contains('nav-cta')) {
          link.style.color = '#3D6B35';
          link.style.backgroundColor = 'rgba(61, 107, 53, 0.06)';
        }
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav(); // 初期実行

});
