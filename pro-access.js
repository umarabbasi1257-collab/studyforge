(function () {
  'use strict';

  const premiumPages = new Set([
    'age-calculator.html',
    'compound-interest-calculator.html',
    'currency-converter-live.html',
    'currency-converter.html',
    'discount-calculator.html',
    'emi-calculator.html',
    'gpa-calculator.html',
    'grade-calculator.html',
    'loan-calculator.html',
    'percentage-calculator.html',
    'scientific-calculator.html',
    'time-calculator.html',
    'unit-converter.html'
  ]);

  const currentPage = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();

  // Temporary client-side gate until Paddle subscription verification is connected.
  // Do NOT treat this as payment security; the server/webhook will be the source of truth later.
  const isPro = localStorage.getItem('studyforge_pro') === 'true';

  if (!premiumPages.has(currentPage) || isPro) return;

  function showLock() {
    if (document.getElementById('sfProLock')) return;

    const overlay = document.createElement('div');
    overlay.id = 'sfProLock';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.innerHTML = `
      <div class="sf-pro-backdrop"></div>
      <div class="sf-pro-modal">
        <div class="badge">✦ STUDYFORGE PRO</div>
        <h2>This is a Premium Tool</h2>
        <p>
          This dedicated calculator is part of StudyForge Pro.
          Subscribe to unlock all premium tools.
        </p>
        <div class="sf-pro-actions">
          <a class="primary" href="pricing.html">Unlock StudyForge Pro →</a>
          <a class="secondary" href="index.html">Back to Free Tools</a>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', showLock, { once: true });
  } else {
    showLock();
  }
})();
