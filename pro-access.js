(function () {
  const premiumPages = [
    "scientific-calculator.html",
    "compound-interest-calculator.html",
    "emi-calculator.html",
    "gpa-calculator.html"
  ];

  const currentPage = window.location.pathname.split("/").pop();

  // Temporary frontend access flag.
  // This will later be replaced with secure server-side subscription verification.
  const isPro = localStorage.getItem("studyforge_pro") === "true";

  if (!premiumPages.includes(currentPage) || isPro) return;

  document.addEventListener("DOMContentLoaded", function () {
    const overlay = document.createElement("div");
    overlay.className = "pro-lock-overlay";

    overlay.innerHTML = `
      <div class="pro-lock-card">
        <div class="pro-lock-badge">✦ STUDYFORGE PRO</div>
        <h2>This is a Premium Tool</h2>
        <p>
          Subscribe to StudyForge Pro to unlock this calculator and other
          premium study tools.
        </p>
        <a class="primary pro-unlock-btn" href="pricing.html">
          Unlock StudyForge Pro →
        </a>
        <a class="secondary pro-back-btn" href="index.html">
          Back to Free Tools
        </a>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.classList.add("pro-locked");
  });
})();