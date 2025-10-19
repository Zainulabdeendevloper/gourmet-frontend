// ===========================
// 🔐 Secure Admin Token (must match backend middleware)
// ===========================
const ADMIN_TOKEN = "myStrongAdminKey123";

// ===========================
// DOM Elements
// ===========================
const menuItems = document.querySelectorAll(".menu-item");
const pageSections = document.querySelectorAll(".page-section");
const pageTitle = document.getElementById("page-title");
const productModal = document.getElementById("product-modal");
const productForm = document.getElementById("product-form");
const addProductBtn = document.getElementById("add-product-btn");
const closeModalBtns = document.querySelectorAll(".close-modal");

// Order Modal Elements
const orderModal = document.getElementById("order-modal");
const modalOrderId = document.getElementById("modal-order-id");
const modalCustomer = document.getElementById("modal-customer");
const modalEmail = document.getElementById("modal-email");
const modalPhone = document.getElementById("modal-phone");
const modalAddress = document.getElementById("modal-address");
const modalCity = document.getElementById("modal-city");
const modalInstructions = document.getElementById("modal-instructions");
const modalItemsTable = document.getElementById("modal-items-table")?.querySelector("tbody");
const modalSubtotal = document.getElementById("modal-subtotal");
const modalTax = document.getElementById("modal-tax");
const modalTotal = document.getElementById("modal-total");
const modalAcceptBtn = document.getElementById("modal-accept-btn");
const modalRejectBtn = document.getElementById("modal-reject-btn");
const messagesTableBody = document.querySelector("#messages-table tbody");
const messageModal = document.getElementById("messageModal");
const closeMessageModal = document.getElementById("closeMessageModal");
const modalName = document.getElementById("modalName");
const modalMessage = document.getElementById("modalMessage");
const subscribersTableBody = document.querySelector("#subscribed-table tbody");
const ordersTableBody = document.querySelector("#ordersTable tbody");
const historyTableBody = document.querySelector("#orderHistoryTable tbody");

let currentOrderId = null;

// Local Products
let products = JSON.parse(localStorage.getItem("admin-products")) || [];

// ===========================
// Navigation
// ===========================
menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    const page = item.getAttribute("data-page");

    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");

    pageSections.forEach((section) => section.classList.remove("active"));
    document.getElementById(page).classList.add("active");

    pageTitle.textContent = item.querySelector("span").textContent;

    // Load content only for the active page
    if (page === "dashboard" || page === "orders") {
      fetchOrders();
    } else if (page === "products") {
      loadProductsTable();
    } else if (page === "customers") {
      loadCustomersTable();
    } else if (page === "messages") {
      loadMessages();
    } else if (page === "subscribers") {
      loadSubscribers();
    } else if (page === "order-history") {
      loadOrderHistory();
    }
  });
});

// ===========================
// Modal Controls
// ===========================
if (addProductBtn) {
  addProductBtn.addEventListener("click", () => {
    document.getElementById("product-modal-title").textContent = "Add Product";
    productForm.reset();
    document.getElementById("product-id").value = "";
    productModal.style.display = "flex";
  });
}

if (closeModalBtns) {
  closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (productModal) productModal.style.display = "none";
      if (orderModal) orderModal.style.display = "none";
      if (messageModal) messageModal.classList.remove("active");
      document.body.style.overflow = "auto";
    });
  });
}

if (modalAcceptBtn) {
  modalAcceptBtn.addEventListener("click", () => updateOrderStatusModal("Accepted"));
}

if (modalRejectBtn) {
  modalRejectBtn.addEventListener("click", () => updateOrderStatusModal("Rejected"));
}

window.addEventListener("click", (e) => {
  if (productModal && e.target === productModal) {
    productModal.style.display = "none";
  }
  if (orderModal && e.target === orderModal) {
    orderModal.style.display = "none";
  }
});

// ===========================
// Product Form Submit
// ===========================
if (productForm) {
  productForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const productId = document.getElementById("product-id").value;
    const productData = {
      name: document.getElementById("product-name").value,
      price: parseFloat(document.getElementById("product-price").value),
      category: document.getElementById("product-category").value,
      description: document.getElementById("product-description").value,
      image: document.getElementById("product-image").value,
      available: document.getElementById("product-available").value === "true",
    };

    if (productId) {
      const index = products.findIndex((p) => p.id == productId);
      if (index !== -1) products[index] = { ...products[index], ...productData };
    } else {
      productData.id = Date.now();
      products.push(productData);
    }

    localStorage.setItem("admin-products", JSON.stringify(products));
    productModal.style.display = "none";
    loadProductsTable();
  });
}

// ===========================
// Fetch & Display Orders
// ===========================
window.ordersData = [];

async function fetchOrders() {
  try {
    const res = await fetch("http://localhost:3000/api/admin/orders", {
      headers: { "x-admin-token": ADMIN_TOKEN },
    });
    if (!res.ok) throw new Error("Failed to fetch orders");

    const orders = await res.json();
    window.ordersData = orders;

    const ordersTable = document.querySelector("#orders-table tbody");
    const recentOrdersTable = document.querySelector("#recent-orders-table tbody");
    
    if (ordersTable) ordersTable.innerHTML = "";
    if (recentOrdersTable) recentOrdersTable.innerHTML = "";

    let totalRevenue = 0;

    orders.forEach((order, index) => {
      totalRevenue += parseFloat(order.total || 0);

      const customerCell = `${order.fullName || "—"}<br><small>${order.phone || "No Number"}</small>`;
      const itemsHtml = (order.items || []).map(i => `${i.name} (x${i.quantity})`).join("<br>");
      const rowHtml = `
        <tr>
          <td>#${order.id}</td>
          <td>${customerCell}</td>
          <td>${itemsHtml}</td>
          <td>$${Number(order.total || 0).toFixed(2)}</td>
          <td>${new Date(order.date).toLocaleString()}</td>
          <td class="action-buttons">
            <button class="btn btn-view" onclick="viewOrder(${order.id})">View</button>
          </td>
        </tr>
      `;

      if (ordersTable) ordersTable.insertAdjacentHTML("beforeend", rowHtml);
      if (recentOrdersTable && index < 5) recentOrdersTable.insertAdjacentHTML("beforeend", rowHtml);
    });

    // Dashboard Stats
    const totalOrdersEl = document.getElementById("total-orders");
    const totalRevenueEl = document.getElementById("total-revenue");
    const pendingOrdersEl = document.getElementById("pending-orders");
    const totalCustomersEl = document.getElementById("total-customers");

    if (totalOrdersEl) totalOrdersEl.textContent = orders.length;
    if (totalRevenueEl) totalRevenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
    if (pendingOrdersEl) pendingOrdersEl.textContent = orders.filter(o => (o.status || "Pending") === "Pending").length;
    if (totalCustomersEl) totalCustomersEl.textContent = new Set(orders.map(o => o.phone)).size;

  } catch (err) {
    console.error("❌ Failed to load orders:", err);
  }
}

// ===========================
// View Order Modal
// ===========================
window.viewOrder = function (orderId) {
  const order = window.ordersData.find(o => o.id === orderId);
  if (!order || !orderModal) return;

  currentOrderId = order.id;

  modalOrderId.textContent = order.id;
  modalCustomer.textContent = order.fullName + " (" + order.phone + ")";
  modalEmail.textContent = order.email || "—";
  modalPhone.textContent = order.phone || "—";
  modalAddress.textContent = order.address || "—";
  modalCity.textContent = order.city || "—";
  modalInstructions.textContent = order.instructions || "";

  if (modalItemsTable) {
    modalItemsTable.innerHTML = "";
    (order.items || []).forEach(i => {
      const row = `<tr>
        <td>${i.name}</td>
        <td>${i.quantity}</td>
        <td>$${i.price}</td>
        <td>${i.image ? `<img src="${i.image}" width="50">` : "-"}</td>
      </tr>`;
      modalItemsTable.insertAdjacentHTML("beforeend", row);
    });
  }

  modalSubtotal.textContent = (order.subtotal || 0).toFixed(2);
  modalTax.textContent = (order.tax || 0).toFixed(2);
  modalTotal.textContent = (order.total || 0).toFixed(2);

  orderModal.style.display = "flex";
};

// ===========================
// Accept / Reject Order
// ===========================
async function updateOrderStatusModal(status) {
  if (!currentOrderId) return;

  try {
    const res = await fetch(`http://localhost:3000/api/admin/orders/${currentOrderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-admin-token": ADMIN_TOKEN
      },
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error("Failed to update status");

    alert(`Order ${status}`);
    orderModal.style.display = "none";
    fetchOrders();
  } catch (err) {
    console.error(err);
    alert("Error updating order status");
  }
}

// ===========================
// Products Table
// ===========================
function loadProductsTable() {
  const table = document.querySelector("#products-table tbody");
  if (!table) return;

  table.innerHTML = "";

  products.forEach((product) => {
    const row = `
      <tr>
        <td>${product.name}</td>
        <td>$${product.price.toFixed(2)}</td>
        <td>${product.category}</td>
        <td>${product.available ? "Available" : "Not Available"}</td>
        <td>
          <button class="btn btn-edit" onclick="editProduct(${product.id})">Edit</button>
          <button class="btn btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      </tr>
    `;
    table.insertAdjacentHTML("beforeend", row);
  });
}

// ===========================
// Customers Table
// ===========================
function loadCustomersTable() {
  const table = document.querySelector("#customers-table tbody");
  if (!table) return;
  
  table.innerHTML = "<tr><td colspan='5'>Customer management not implemented yet</td></tr>";
}

// ===========================
// Edit / Delete Products
// ===========================
window.editProduct = function (id) {
  const p = products.find((x) => x.id === id);
  if (!p) {
    alert("Product not found!");
    return;
  }
  document.getElementById("product-modal-title").textContent = "Edit Product";
  document.getElementById("product-id").value = p.id;
  document.getElementById("product-name").value = p.name;
  document.getElementById("product-price").value = p.price;
  document.getElementById("product-category").value = p.category;
  document.getElementById("product-description").value = p.description || "";
  document.getElementById("product-image").value = p.image || "";
  document.getElementById("product-available").value = p.available.toString();
  productModal.style.display = "flex";
};

window.deleteProduct = function (id) {
  if (confirm("Are you sure you want to delete this product?")) {
    products = products.filter((p) => p.id !== id);
    localStorage.setItem("admin-products", JSON.stringify(products));
    loadProductsTable();
  }
};

// ===========================
// Messages Management
// ===========================
function loadMessages() {
  if (!messagesTableBody) return;

  fetch("http://localhost:3000/api/messages", {
    headers: { "x-admin-token": ADMIN_TOKEN }
  })
    .then(res => res.json())
    .then(data => {
      messagesTableBody.innerHTML = "";
      if (data.success) {
        data.messages.forEach(msg => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${msg.id}</td>
            <td>${msg.name}</td>
            <td>${msg.email}</td>
            <td>${new Date(msg.date).toLocaleString()}</td>
            <td>
              <button class="read-btn" data-id="${msg.id}">Read</button>
              <button class="delete-btn" data-id="${msg.id}" style="background:red; color:white;">Delete</button>
            </td>
          `;
          messagesTableBody.appendChild(row);
        });

        // Read button event listeners
        document.querySelectorAll(".read-btn").forEach(btn => {
          btn.addEventListener("click", function () {
            const id = parseInt(this.getAttribute("data-id"));
            const message = data.messages.find(m => m.id === id);
            if (message && modalName && modalEmail && modalMessage && messageModal) {
              modalName.textContent = message.name;
              modalEmail.textContent = message.email;
              modalMessage.textContent = message.message;
              messageModal.classList.add("active");
              document.body.style.overflow = "hidden";
              
              // Mark as read
              fetch(`http://localhost:3000/api/messages/read/${id}`, {
                method: "POST",
                headers: { "x-admin-token": ADMIN_TOKEN }
              });
            }
          });
        });

        // Delete button event listeners
        document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            if (confirm("Are you sure you want to delete this message?")) {
              fetch(`http://localhost:3000/api/messages/${id}`, {
                method: "DELETE",
                headers: { "x-admin-token": ADMIN_TOKEN }
              })
                .then(res => {
                  if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                  return res.json();
                })
                .then(resp => {
                  if (resp.success) {
                    alert("Message deleted successfully.");
                    loadMessages();
                  } else {
                    alert("Failed to delete message.");
                  }
                })
                .catch(err => {
                  console.error("Delete error:", err);
                  alert("Error deleting message. Check server logs.");
                });
            }
          });
        });
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error while fetching messages.");
    });
}

// ===========================
// Subscribers Management
// ===========================
function loadSubscribers() {
  if (!subscribersTableBody) return;

  fetch("http://localhost:3000/api/subscribers", {
    headers: { "x-admin-token": ADMIN_TOKEN }
  })
    .then(res => res.json())
    .then(data => {
      subscribersTableBody.innerHTML = "";
      if (data.success) {
        data.subscribers.forEach(sub => {
          const row = document.createElement("tr");
          row.innerHTML = `
            <td>${sub.id}</td>
            <td>${sub.email}</td>
            <td>${new Date(sub.date).toLocaleString()}</td>
            <td>
              <button class="delete-sub" data-id="${sub.id}" style="background:red; color:white;">Delete</button>
            </td>
          `;
          subscribersTableBody.appendChild(row);
        });

        // Delete subscriber event listeners
        document.querySelectorAll(".delete-sub").forEach(btn => {
          btn.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            if (confirm("Delete this subscriber?")) {
              fetch(`http://localhost:3000/api/subscribers/${id}`, {
                method: "DELETE",
                headers: { "x-admin-token": ADMIN_TOKEN }
              })
                .then(res => res.json())
                .then(resp => {
                  if (resp.success) {
                    alert("Subscriber deleted successfully.");
                    loadSubscribers();
                  } else {
                    alert("Failed to delete subscriber.");
                  }
                })
                .catch(err => {
                  console.error(err);
                  alert("Server error while deleting subscriber.");
                });
            }
          });
        });
      }
    })
    .catch(err => {
      console.error(err);
      alert("Server error while fetching subscribers.");
    });
}

// ===========================
// Active Orders Management
// ===========================
// ===========================
// Active Orders Management
// ===========================
function loadActiveOrders() {
  if (!ordersTableBody) {
    console.log("❌ ordersTableBody not found");
    return;
  }

  console.log("🔄 Loading active orders...");

  fetch("http://localhost:3000/api/admin/orders", {
    headers: { "x-admin-token": ADMIN_TOKEN }
  })
    .then(res => {
      console.log("📡 Active orders response status:", res.status);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      return res.json();
    })
    .then(orders => {
      console.log("✅ Active orders loaded:", orders.length, "orders");
      ordersTableBody.innerHTML = "";

      if (!orders || orders.length === 0) {
        ordersTableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 20px;">
              No active orders
            </td>
          </tr>
        `;
        return;
      }

      orders.forEach(order => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>#${order.id}</td>
          <td>${order.fullName || 'N/A'}</td>
          <td>${order.email || 'N/A'}</td>
          <td>${order.phone || 'N/A'}</td>
          <td>${order.city || 'N/A'}</td>
          <td>$${order.total || '0.00'}</td>
          <td>${new Date(order.date).toLocaleString()}</td>
          <td>
            <button class="btn-accept" data-id="${order.id}">Accept</button>
            <button class="btn-reject" data-id="${order.id}" style="background:red;color:white;">Reject</button>
          </td>
        `;
        ordersTableBody.appendChild(row);
      });

      // Attach button actions
      document.querySelectorAll(".btn-accept").forEach(btn => {
        btn.addEventListener("click", function() {
          const orderId = this.getAttribute("data-id");
          console.log("🟢 Accept button clicked for order:", orderId);
          handleOrderAction(orderId, "accept");
        });
      });

      document.querySelectorAll(".btn-reject").forEach(btn => {
        btn.addEventListener("click", function() {
          const orderId = this.getAttribute("data-id");
          console.log("🔴 Reject button clicked for order:", orderId);
          handleOrderAction(orderId, "reject");
        });
      });

      console.log("✅ Button listeners attached");
    })
    .catch(err => {
      console.error("❌ Error loading orders:", err);
      ordersTableBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; padding: 20px; color: red;">
            Error loading orders: ${err.message}
          </td>
        </tr>
      `;
    });
}

// ===========================
// Handle Order Actions (Accept/Reject)
// ===========================
function handleOrderAction(orderId, action) {
  const actionText = action === "accept" ? "accept" : "reject";
  
  if (!confirm(`Are you sure you want to ${actionText} order #${orderId}?`)) {
    console.log("❌ Action cancelled by user");
    return;
  }

  console.log(`🔄 Processing ${action} for order ${orderId}`);

  fetch(`http://localhost:3000/api/admin/orders/${orderId}/action`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-token": ADMIN_TOKEN
    },
    body: JSON.stringify({ action })
  })
    .then(async res => {
      const text = await res.text();
      console.log("📡 Server response status:", res.status);
      console.log("📡 Server response body:", text);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      
      return JSON.parse(text);
    })
    .then(resp => {
      console.log("✅ Server response parsed:", resp);
      
      if (resp.success) {
        alert(`✅ Order #${orderId} ${actionText}ed successfully!`);
        console.log("🔄 Refreshing tables...");
        // Refresh both tables
        loadActiveOrders();
        loadOrderHistory();
      } else {
        alert(`❌ Failed to ${actionText} order: ${resp.message}`);
      }
    })
    .catch(err => {
      console.error("❌ Error updating order:", err);
      alert(`❌ Server error: ${err.message}\nCheck console for details.`);
    });
}

// ===========================
// Order History Management
// ===========================
function loadOrderHistory() {
  if (!historyTableBody) {
    console.log("❌ historyTableBody not found");
    return;
  }

  console.log("🔄 Loading order history...");

  fetch("http://localhost:3000/api/admin/order-history", {
    headers: { "x-admin-token": ADMIN_TOKEN }
  })
    .then(async res => {
      const text = await res.text();
      console.log("📡 History response status:", res.status);
      console.log("📡 History response body:", text);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      
      return JSON.parse(text);
    })
    .then(data => {
      console.log("✅ Order history data:", data);
      
      historyTableBody.innerHTML = "";

      if (!data.success || !data.history || data.history.length === 0) {
        historyTableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 20px;">
              No orders in history yet
            </td>
          </tr>
        `;
        return;
      }

      console.log(`✅ Displaying ${data.history.length} orders in history`);

      data.history.forEach(order => {
        const row = document.createElement("tr");
        const status = order.status || 'Pending';
        row.innerHTML = `
          <td>#${order.order_id || order.id}</td>
          <td>${order.fullName || 'N/A'}</td>
          <td>${order.email || 'N/A'}</td>
          <td>${order.phone || 'N/A'}</td>
          <td>${order.city || 'N/A'}</td>
          <td>$${order.total || '0.00'}</td>
          <td>${new Date(order.created_at || order.date).toLocaleString()}</td>
          <td>
            <span class="status-badge status-${status.toLowerCase()}">
              ${status}
            </span>
          </td>
          <td>
            <button class="btn-delete-history" data-id="${order.id}" 
                    style="background: #dc3545; color: white; padding: 5px 10px; border: none; border-radius: 4px; cursor: pointer;">
              Delete
            </button>
          </td>
        `;
        historyTableBody.appendChild(row);
      });

      // Attach delete event listeners
      document.querySelectorAll(".btn-delete-history").forEach(btn => {
        btn.addEventListener("click", function() {
          const historyId = this.getAttribute("data-id");
          console.log("🗑️ Delete history button clicked for ID:", historyId);
          deleteFromHistory(historyId);
        });
      });
    })
    .catch(err => {
      console.error("❌ Error loading order history:", err);
      historyTableBody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; padding: 20px; color: red;">
            Error loading order history: ${err.message}
          </td>
        </tr>
      `;
    });
}

// ===========================
// Delete from Order History
// ===========================
function deleteFromHistory(historyId) {
  if (!confirm("Are you sure you want to permanently delete this order from history?")) {
    return;
  }

  console.log(`🗑️ Deleting history ID: ${historyId}`);

  fetch(`http://localhost:3000/api/admin/order-history/${historyId}`, {
    method: "DELETE",
    headers: { "x-admin-token": ADMIN_TOKEN }
  })
    .then(async res => {
      const text = await res.text();
      console.log("📡 Delete response:", res.status, text);
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${text}`);
      }
      
      return JSON.parse(text);
    })
    .then(resp => {
      if (resp.success) {
        alert("✅ Order deleted from history successfully!");
        loadOrderHistory();
      } else {
        alert("❌ Failed to delete order from history: " + resp.message);
      }
    })
    .catch(err => {
      console.error("❌ Error deleting from history:", err);
      alert("❌ Server error while deleting order from history.");
    });
}