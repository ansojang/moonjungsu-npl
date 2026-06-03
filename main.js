// ===== 문정수 교수 NPL 사이트 - Main JS =====

// ===== 히어로 타이핑 효과 =====
(function heroTyping() {
  const el = document.getElementById('hero-typing');
  if (!el) return;

  const lines = [
    '사옥 없는 사장님이 건물주가 되는 법',
    '매달 나가는 임대료를 자산으로 바꾸는 법',
    '본인 매장을 NPL 경매로 직접 취득하는 법',
    '소액으로 부실채권 투자를 시작하는 법',
    '일반 경매보다 더 저렴하게 건물 사는 법',
  ];

  let lineIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const TYPING_SPEED = 55;
  const DELETE_SPEED = 28;
  const PAUSE_AFTER = 2400;
  const PAUSE_BEFORE = 400;

  function type() {
    const current = lines[lineIdx];

    if (!isDeleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, PAUSE_AFTER);
        return;
      }
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        lineIdx = (lineIdx + 1) % lines.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
    }

    setTimeout(type, isDeleting ? DELETE_SPEED : TYPING_SPEED);
  }

  setTimeout(type, 800);
})();

// ===== 소셜 프루프 — 실시간 신청 알림 효과 =====
(function liveProof() {
  const el = document.getElementById('proof-live');
  if (!el) return;

  const messages = [
    '· 방금 전 1명이 신청했습니다',
    '· 3분 전 신청이 접수됐습니다',
    '· 오늘 총 7명이 신청했습니다',
    '· 방금 전 1명이 신청했습니다',
    '· 1시간 전 2명이 신청했습니다',
  ];

  let idx = 0;

  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => {
      idx = (idx + 1) % messages.length;
      el.textContent = messages[idx];
      el.style.opacity = '1';
    }, 400);
  }, 5000);

  el.style.transition = 'opacity 0.4s ease';
})();

// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const mainNav = document.getElementById('main-nav');

if (hamburger && mainNav) {
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    const isOpen = mainNav.classList.contains('open');
    hamburger.setAttribute('aria-expanded', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mainNav.contains(e.target)) {
      mainNav.classList.remove('open');
    }
  });

  // Close menu on nav link click (mobile)
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
    });
  });
}

// Mark active nav link
(function markActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(link => {
    const linkPath = link.getAttribute('href').split('/').pop();
    if (linkPath === currentPath || (currentPath === '' && linkPath === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// FAQ toggle (simple show/hide)
document.querySelectorAll('.faq-q').forEach(q => {
  q.addEventListener('click', () => {
    const item = q.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = answer.style.display === 'block';

    // Close all
    document.querySelectorAll('.faq-a').forEach(a => a.style.display = 'none');
    document.querySelectorAll('.faq-q').forEach(q2 => {
      q2.style.color = '';
      q2.style.setProperty('--after-content', '"+"');
    });

    // Toggle current
    if (!isOpen) {
      answer.style.display = 'block';
      q.style.color = 'var(--accent)';
    }
  });
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.keyword-card, .target-card, .review-card, .article-item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});
