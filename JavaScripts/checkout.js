// Get cart from localStorage
const cart = JSON.parse(localStorage.getItem("cart")) || [];

// Check if user is logged in
document.addEventListener("DOMContentLoaded", () => {
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please login first to place an order!");
    window.location.href = "/login";
    return;
  }
  
  displayCheckoutItems();
  const viewOrderHistory = document.getElementById("viewOrderHistory");
  if (viewOrderHistory) {
    viewOrderHistory.addEventListener("click", function(e) {
      e.preventDefault();
      toggleOrderHistory();
    });
  }
});

// Show checkout items
function displayCheckoutItems() {
  const checkoutContent = document.getElementById("checkoutContent");

  if (cart.length === 0) {
    checkoutContent.innerHTML = `
      <div class="empty-cart-message">
        <i class="fas fa-shopping-cart"></i>
        <h2>Your cart is empty</h2>
        <p>Add some delicious items to your cart before proceeding to checkout.</p>
        <a href="index.html" class="btn">Back to Menu</a>
        <div class="history-toggle">
          <button class="toggle-btn" onclick="toggleOrderHistory()">View Order History</button>
        </div>
      </div>
    `;
    return;
  }

  let subtotal = 0;
  let itemsHTML = "";

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    itemsHTML += `
      <div class="checkout-item">
        <div class="item-info">
          <div class="item-image">
            <img src="${item.image}" alt="${item.name}">
          </div>
          <div class="item-details">
            <h4>${item.name}</h4>
            <p class="item-price">$${item.price.toFixed(2)}</p>
          </div>
        </div>
        <div class="item-quantity">Qty: ${item.quantity}</div>
        <div class="item-total">$${itemTotal.toFixed(2)}</div>
      </div>
    `;
  });

  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  checkoutContent.innerHTML = `
    <h1 class="checkout-title">Checkout</h1>
    <div class="checkout-container">
      <div class="checkout-items">${itemsHTML}</div>

      <div class="checkout-summary">
        <h2 class="summary-title">Delivery Information</h2>
        <form id="checkoutForm">
          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" placeholder="Full Name" required>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" placeholder="Email" required>
          </div>
          <div class="form-group">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" placeholder="Phone Number" required>
          </div>
          <div class="form-group">
            <label for="address">Delivery Address</label>
            <textarea id="address" placeholder="Delivery Address" required></textarea>
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" placeholder="City" required>
          </div>
          <div class="form-group">
            <label for="instructions">Special Instructions (Optional)</label>
            <textarea id="instructions" placeholder="Any special instructions..."></textarea>
          </div>
          <button type="submit" class="place-order-btn">Place Order</button>
        </form>
      </div>
    </div>
  `;

  document.getElementById("checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    placeOrder();
  });
}

// Place order function
function placeOrder() {
  const userId = localStorage.getItem("userId");
  if (!userId) return; // safety check

  const customer = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    instructions: document.getElementById("instructions").value || ""
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const order = { userId, customer, items: [...cart], subtotal, tax, total };

  fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  })
    .then(res => res.json())
    .then(data => {
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      window.location.href = "orders.html";
    })
    .catch(err => {
      console.error(err);
      alert("Something went wrong while placing the order.");
    });
}

// Toggle order history
function toggleOrderHistory() {
  const orderHistorySection = document.getElementById("orderHistorySection");
  const checkoutContent = document.getElementById("checkoutContent");

  if (orderHistorySection.style.display === "none") {
    orderHistorySection.style.display = "block";
    checkoutContent.style.display = "none";
    displayOrderHistory();
  } else {
    orderHistorySection.style.display = "none";
    checkoutContent.style.display = "block";
  }
}

// Display order history (optional)
function displayOrderHistory() {
  const orderHistoryContent = document.getElementById("orderHistoryContent");
  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  if (orders.length === 0) {
    orderHistoryContent.innerHTML = `
      <div class="empty-history">
        <i class="fas fa-receipt"></i>
        <h3>No Order History</h3>
        <p>You haven't placed any orders yet.</p>
      </div>
    `;
    return;
  }

  let ordersHTML = "";
  orders.forEach(order => {
    const itemsHTML = order.items.map(item => `<li>${item.name} x ${item.quantity} — $${item.price.toFixed(2)}</li>`).join("");
    ordersHTML += `
      <div class="order-card">
        <div class="order-header">Order #${order.id} - ${order.date || ""}</div>
        <div class="order-customer">
          <p><strong>Customer:</strong> ${order.customer.fullName}</p>
          <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city}</p>
          ${order.customer.instructions ? `<p><strong>Instructions:</strong> ${order.customer.instructions}</p>` : ""}
        </div>
        <ul>${itemsHTML}</ul>
        <div class="order-total">Total: $${order.total.toFixed(2)}</div>
      </div>
    `;
  });
  orderHistoryContent.innerHTML = ordersHTML;
}
