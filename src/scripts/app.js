// ==========================================================================
// north. — Core Client Behaviors & Microinteractions
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initProgressBar();
  initScrollReveal();
  initHeaderScroll();
  initMobileMenu();
  initFaqAccordions();
  initContactForms();
});

// 1. Reading Progress Bar
function initProgressBar() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  const updateProgress = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// 2. Editorial Scroll Reveal
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach((el) => observer.observe(el));
}

// 3. Navigation Scroll State
function initHeaderScroll() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 30) {
      nav.classList.add('nav-scrolled');
    } else {
      nav.classList.remove('nav-scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 4. Mobile Menu Navigation
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const overlay = document.getElementById('mobile-menu');
  const close = document.getElementById('menu-close');
  if (!toggle || !overlay) return;

  const openMenu = () => {
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  toggle.addEventListener('click', openMenu);
  if (close) close.addEventListener('click', closeMenu);

  overlay.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });
}

// 5. FAQ Accordions
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-question');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');
      faqItems.forEach((other) => other.classList.remove('active'));
      if (!isOpen) {
        item.classList.add('active');
      }
    });
  });
}

// 6. Contact and Diagnostic Forms
function initContactForms() {
  const forms = document.querySelectorAll('form[data-north-form]');

  forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isValid = true;
      const inputs = form.querySelectorAll('input[required], textarea[required]');

      inputs.forEach((input) => {
        const fieldWrapper = input.closest('.form-field');
        const errorSpan = fieldWrapper ? fieldWrapper.querySelector('.form-error') : null;

        if (!input.value.trim()) {
          isValid = false;
          input.classList.add('input-error');
          if (errorSpan) errorSpan.textContent = 'Este campo é necessário.';
        } else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
          isValid = false;
          input.classList.add('input-error');
          if (errorSpan) errorSpan.textContent = 'Informe um e-mail corporativo válido.';
        } else {
          input.classList.remove('input-error');
          if (errorSpan) errorSpan.textContent = '';
        }
      });

      if (!isValid) return;

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Enviar';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
      }

      // Simulate clean submission
      setTimeout(() => {
        form.reset();
        const successBox = form.parentElement.querySelector('.form-success-message');
        if (successBox) {
          form.style.display = 'none';
          successBox.removeAttribute('hidden');
          successBox.style.display = 'block';
        } else {
          alert('Recebemos sua mensagem. Um consultor da north. entrará em contato em até 24h úteis.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
          }
        }
      }, 700);
    });
  });
}
