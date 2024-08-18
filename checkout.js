// Initialize Stripe.js
const stripe = Stripe('pk_live_51PT7DYP09gv5VJavLXSpBVv4cVlVFTqxTDtfrHUW6cj64RrRqJZ5p8FgUSqdu2ViSCcmvGQCGywgjM5Mc1OC080w00VFRAwP9a');
const url = new URL(window.location.href);
const session_id = url.searchParams.get("session_id");

start()

function update_payment_message(new_message) {
  document.getElementById("payment-message").textContent = new_message;
}

async function start() {
  if (session_id) {
    const response = await fetch(`https://checkout-t41o.onrender.com/session-status?session_id=${session_id}`)
    const session = await response.json()
    if (session.status == 'open') {
      update_payment_message("The payment is not successful. Please try again.")
      checkout();
    } else if (session.status == 'complete') {
      update_payment_message("The payment is successful. A receipt will be sent to " + session.customer_email + " shortly.")
    }
  } else {
    update_payment_message("Thank you for your business. We look forward to introduce more students to you in the future.")
    await checkout();
  }
}

// Fetch Checkout Session and retrieve the client secret
async function checkout() {
  const fetchClientSecret = async () => {
    const response = await fetch("https://checkout-t41o.onrender.com/create-checkout-session", {
      method: "POST"
    });
    const { clientSecret } = await response.json();
    return clientSecret;
  };

  // Initialize Checkout
  const checkout = await stripe.initEmbeddedCheckout({
    fetchClientSecret,
  });

  // Mount Checkout
  checkout.mount('#checkout');
}
