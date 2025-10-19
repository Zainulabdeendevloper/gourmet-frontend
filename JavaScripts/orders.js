document.addEventListener("DOMContentLoaded", () => {
  const ordersContainer = document.getElementById("ordersContainer");
  

  // ✅ Get logged-in userId
  const userId = localStorage.getItem("userId");
  if (!userId) {
    alert("Please login first!");
    window.location.href = "/login";
    return;
  }

  // ✅ Fetch orders for this user
  fetch(`/api/user/orders/${userId}`)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        ordersContainer.innerHTML = "<p>No orders found.</p>";
        return;
      }

      ordersContainer.innerHTML = data.map(order => {
        const items = Array.isArray(order.items) ? order.items : [];
        const itemsHtml = items.map(i => `
          <li>${i.name} (x${i.quantity}) — $${parseFloat(i.price).toFixed(2)}</li>
        `).join("");

        return `
          <div class="order-card">
            <h3>Order #${order.uuid} ${order.status ? `— ${order.status}` : ''}</h3>
            <p><strong>Name:</strong> ${order.fullName || "N/A"}</p>
            <p><strong>Email:</strong> ${order.email || "N/A"}</p>
            <p><strong>Phone:</strong> ${order.phone || "N/A"}</p>
            <p><strong>Address:</strong> ${order.address || "N/A"}, ${order.city || "N/A"}</p>
            <p><strong>Instructions:</strong> ${order.instructions || "None"}</p>
            <p><strong>Subtotal:</strong> $${parseFloat(order.subtotal || 0).toFixed(2)}</p>
            <p><strong>Tax:</strong> $${parseFloat(order.tax || 0).toFixed(2)}</p>
            <p><strong>Total:</strong> $${parseFloat(order.total || 0).toFixed(2)}</p>
            <p><strong>Date:</strong> ${order.date ? new Date(order.date).toLocaleString() : "N/A"}</p>
            <p><strong>Items:</strong></p>
            <ul>${itemsHtml}</ul>
          </div>
        `;
      }).join("");
    })
    .catch(err => {
      console.error("❌ Error fetching orders:", err);
      ordersContainer.innerHTML = "<p>Error loading orders.</p>";
    });
});
