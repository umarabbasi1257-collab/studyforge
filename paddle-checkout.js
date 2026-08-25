/* StudyForge Paddle Checkout
   Client-side token is safe to expose in frontend code.
   Do NOT place Paddle API keys or webhook secrets here.
*/
(function () {
  const PADDLE_CLIENT_TOKEN = "live_3be92980d1afcab046c575cdf54";
  const STUDYFORGE_PRO_PRICE_ID = "pri_01m0t8pjac7wy2k8m1y44h41v6";

  function initPaddle() {
    if (!window.Paddle) {
      console.error("Paddle.js is not loaded.");
      return;
    }

    if (window.__studyforgePaddleInitialized) return;
    window.__studyforgePaddleInitialized = true;

    Paddle.Initialize({
      token: PADDLE_CLIENT_TOKEN,
      eventCallback: function (event) {
        if (event && event.name === "checkout.completed") {
          const transactionId =
            event.data && (event.data.transaction_id || event.data.id);

          const target = new URL("subscription-success.html", window.location.href);
          if (transactionId) target.searchParams.set("transaction_id", transactionId);
          window.location.href = target.toString();
        }
      }
    });
  }

  window.openStudyForgeProCheckout = function () {
    if (!window.Paddle) {
      alert("Payment checkout is still loading. Please try again in a moment.");
      return;
    }

    Paddle.Checkout.open({
      items: [
        {
          priceId: STUDYFORGE_PRO_PRICE_ID,
          quantity: 1
        }
      ],
      settings: {
        displayMode: "overlay",
        theme: "light",
        locale: "en"
      }
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPaddle);
  } else {
    initPaddle();
  }
})();
