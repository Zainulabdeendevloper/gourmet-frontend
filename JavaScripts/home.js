// Menu Data
const menuItems = [
    {
        id: 1,
        name: "Truffle Arancini",
        category: "appetizers",
        price: 12.99,
        image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Crispy risotto balls with black truffle and mozzarella .",
        rating: 4.8,
        badge: "Chef's Choice"
    },
    {
        id: 2,
        name: "Beef Wellington",
        category: "mains",
        price: 34.99,
        image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Prime beef tenderloin wrapped in puff pastry with mushroom duxelles",
        rating: 4.9,
        badge: "Popular"
    },
    {
        id: 3,
        name: "Chocolate Lava Cake",
        category: "desserts",
        price: 9.99,
        image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Warm chocolate cake with a molten center, served with vanilla ice cream",
        rating: 4.7,
        badge: "Sweet"
    },
    {
        id: 4,
        name: "Craft Cocktail",
        category: "beverages",
        price: 11.99,
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Signature cocktail with premium spirits and fresh ingredients",
        rating: 4.6,
        badge: "Refreshing"
    },
    {
        id: 5,
        name: "Seafood Platter",
        category: "appetizers",
        price: 18.99,
        image: "https://images.unsplash.com/photo-1559715745-e1b33a271c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Assorted fresh seafood with dipping sauces",
        rating: 4.5,
        badge: "Fresh"
    },
    {
        id: 6,
        name: "Vegetarian Risotto",
        category: "mains",
        price: 16.99,
        image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Creamy Arborio rice with seasonal vegetables and Parmesan",
        rating: 4.4,
        badge: "Vegetarian"
    },
    {
        id: 7,
        name: "Tiramisu",
        category: "desserts",
        price: 8.99,
        image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone",
        rating: 4.8,
        badge: "Classic"
    },
    {
        id: 8,
        name: "Fresh Juice Blend",
        category: "beverages",
        price: 6.99,
        image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1950&q=80",
        description: "Seasonal fruits blended into a refreshing juice",
        rating: 4.3,
        badge: "Healthy"
    }
];

        // Function to proceed to checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Your cart is empty. Add some items before proceeding to checkout.');
        return;
    }
    
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Update the checkout button event listener in your existing code
document.querySelector('.checkout-btn').addEventListener('click', proceedToCheckout);

// Also update the updateCart function to handle empty cart state
function updateCart() {
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        // Disable checkout button when cart is empty
        document.querySelector('.checkout-btn').style.opacity = '0.5';
        document.querySelector('.checkout-btn').style.cursor = 'not-allowed';
        document.querySelector('.checkout-btn').setAttribute('disabled', 'true');
    } else {
        cart.forEach(item => {
            // ... existing cart item code ...
        });
        
        // Enable checkout button when cart has items
        document.querySelector('.checkout-btn').style.opacity = '1';
        document.querySelector('.checkout-btn').style.cursor = 'pointer';
        document.querySelector('.checkout-btn').removeAttribute('disabled');
    }
    
    // Update cart total and count
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

        // Cart functionality
        let cart = [];
        const cartIcon = document.getElementById('cartIcon');
        const cartSidebar = document.getElementById('cartSidebar');
        const closeCart = document.getElementById('closeCart');
        const overlay = document.getElementById('overlay');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.querySelector('.cart-count');
        const menuGrid = document.getElementById('menuGrid');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const mobileMenu = document.getElementById('mobileMenu');
        const mobileNav = document.getElementById('mobileNav');
        const contactForm = document.getElementById('contactForm');

        // Variable to store current product for ordering
        let currentProduct = null;

        // Initialize the menu
        function initMenu() {
            menuGrid.innerHTML = '';
            menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = `menu-item ${item.category}`;
                menuItem.setAttribute('data-id', item.id);
                menuItem.innerHTML = `
                    <div class="item-img">
                        <img src="${item.image}" alt="${item.name}">
                        <span class="item-badge">${item.badge}</span>
                    </div>
                    <div class="item-content">
                        <div class="item-header">
                            <h3 class="item-title">${item.name}</h3>
                            <span class="item-price">$${item.price.toFixed(2)}</span>
                        </div>
                        <p class="item-desc">${item.description}</p>
                        <div class="item-footer">
                            <div class="rating">
                                ${generateStars(item.rating)}
                            </div>
                            <button class="add-to-cart" data-id="${item.id}">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                `;
                menuGrid.appendChild(menuItem);
            });
            
            // Add event listeners to add-to-cart buttons
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent triggering the menu item click
                    const itemId = parseInt(this.getAttribute('data-id'));
                    addToCart(itemId);
                });
            });
            
            // Add event listeners to menu items for product details
            document.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', function() {
                    const itemId = parseInt(this.getAttribute('data-id'));
                    showProductDetails(itemId);
                });
            });
        }

        // Generate star rating
        function generateStars(rating) {
            let stars = '';
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 !== 0;
            
            for (let i = 0; i < fullStars; i++) {
                stars += '<i class="fas fa-star"></i>';
            }
            
            if (hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            }
            
            const emptyStars = 5 - Math.ceil(rating);
            for (let i = 0; i < emptyStars; i++) {
                stars += '<i class="far fa-star"></i>';
            }
            
            return stars;
        }

        // Add item to cart
        function addToCart(itemId) {
            const item = menuItems.find(i => i.id === itemId);
            const existingItem = cart.find(i => i.id === itemId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    ...item,
                    quantity: 1
                });
            }
            
            updateCart();
            showCartNotification(item.name);
        }

        // Update cart UI
        function updateCart() {
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-cart"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                cart.forEach(item => {
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <div class="cart-item-img">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-title">${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                            <div class="cart-item-controls">
                                <button class="quantity-btn decrease" data-id="${item.id}">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span class="item-quantity">${item.quantity}</span>
                                <button class="quantity-btn increase" data-id="${item.id}">
                                    <i class="fas fa-plus"></i>
                                </button>
                                <button class="remove-item" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                    cartItems.appendChild(cartItem);
                });
                
                // Add event listeners to cart controls
                document.querySelectorAll('.increase').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = parseInt(this.getAttribute('data-id'));
                        increaseQuantity(itemId);
                    });
                });
                
                document.querySelectorAll('.decrease').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = parseInt(this.getAttribute('data-id'));
                        decreaseQuantity(itemId);
                    });
                });
                
                document.querySelectorAll('.remove-item').forEach(button => {
                    button.addEventListener('click', function() {
                        const itemId = parseInt(this.getAttribute('data-id'));
                        removeFromCart(itemId);
                    });
                });
            }
            
            // Update cart total and count
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            cartTotal.textContent = `$${total.toFixed(2)}`;
            cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
        }

        // Increase item quantity
        function increaseQuantity(itemId) {
            const item = cart.find(i => i.id === itemId);
            if (item) {
                item.quantity += 1;
                updateCart();
            }
        }

        // Decrease item quantity
        function decreaseQuantity(itemId) {
            const item = cart.find(i => i.id === itemId);
            if (item) {
                if (item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    removeFromCart(itemId);
                    return;
                }
                updateCart();
            }
        }

        // Remove item from cart
        function removeFromCart(itemId) {
            cart = cart.filter(item => item.id !== itemId);
            updateCart();
        }

        // Show cart notification
        function showCartNotification(itemName) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(to right, var(--primary), var(--secondary));
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: var(--shadow);
                z-index: 3000;
                animation: slideInRight 0.5s ease, fadeOut 0.5s ease 2.5s forwards;
            `;
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i> ${itemName} added to cart!
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        // Filter menu items
        filterBtns.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterBtns.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                const menuItems = document.querySelectorAll('.menu-item');
                
                menuItems.forEach(item => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                        item.style.animation = 'fadeInUp 0.5s ease';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });

        // Toggle cart sidebar
        cartIcon.addEventListener('click', () => {
            cartSidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        closeCart.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        overlay.addEventListener('click', () => {
            cartSidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = 'auto';
            mobileNav.classList.remove('active');
        });

        // Mobile menu toggle
        mobileMenu.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
        });

        // Contact form submission
       // Contact form submission
contactForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!name || !email || !message) {
    alert("⚠️ Please fill out all fields before sending your message.");
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });

    const data = await response.json();

    if (data.success) {
      alert("✅ Message sent successfully!");
      contactForm.reset();
    } else {
      alert("⚠️ " + data.message);
    }
  } catch (err) {
    console.error("Error:", err);
    alert("❌ Server error. Please try again later.");
  }
});


        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    const mobileMenu = document.getElementById('mobileMenu');
const mobileNav = document.getElementById('mobileNav');
const overlay = document.getElementById('overlay');

mobileMenu.addEventListener('click', () => {
  mobileNav.classList.toggle('active');
  overlay.classList.toggle('active');
  document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
});

overlay.addEventListener('click', () => {
  mobileNav.classList.remove('active');
  overlay.classList.remove('active');
  document.body.style.overflow = 'auto';
});

                    mobileNav.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = 'auto';
                    
                }
            });
        });

        // NEW FUNCTIONS FOR PRODUCT DETAILS AND ORDER FORM
        
        // Show product details modal
        function showProductDetails(itemId) {
            const item = menuItems.find(i => i.id === itemId);
            if (!item) return;
            
            document.getElementById('modalProductImage').src = item.image;
            document.getElementById('modalProductName').textContent = item.name;
            document.getElementById('modalProductPrice').textContent = `$${item.price.toFixed(2)}`;
            document.getElementById('modalProductBadge').textContent = item.badge;
            document.getElementById('modalProductDescription').textContent = item.description;
            document.getElementById('modalProductRating').innerHTML = generateStars(item.rating);
            
            // Store the current product for the order form
            currentProduct = item;
            
            // Show the modal
            document.getElementById('productModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }
        
        // Close product modal
        document.getElementById('closeProductModal').addEventListener('click', function() {
            document.getElementById('productModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        document.getElementById('orderNowBtn').addEventListener('click', function() {
    addToCart(currentProduct.id); // ✅ Add the product to cart
    document.getElementById('productModal').classList.remove('active');
   
});

        
       function orderNow(item) {
  // Store selected item in localStorage (so checkout can use it)
  localStorage.setItem("orderNowItem", JSON.stringify(item));

  // Redirect to checkout page
  window.location.href = "checkout.html";
}




        
        
        // Close order modal
        document.getElementById('closeOrderModal').addEventListener('click', function() {
            document.getElementById('orderModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Order form submission
        document.getElementById('orderForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('customerName').value;
            const email = document.getElementById('customerEmail').value;
            const phone = document.getElementById('customerPhone').value;
            const address = document.getElementById('customerAddress').value;
            const city = document.getElementById('customerCity').value;
            const notes = document.getElementById('orderNotes').value;
            
            // In a real application, you would send this data to a server
            console.log('Order Details:', {
                product: currentProduct.name,
                price: currentProduct.price,
                customer: {
                    name,
                    email,
                    phone,
                    address,
                    city
                },
                notes
            });
            
            // Show confirmation
            document.getElementById('orderModal').classList.remove('active');
            document.getElementById('orderConfirmationModal').classList.add('active');
            
            // Reset form
            this.reset();
        });
        
        // Close confirmation modal
        document.getElementById('closeConfirmationModal').addEventListener('click', function() {
            document.getElementById('orderConfirmationModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        // Close modals when clicking outside
        document.querySelectorAll('.product-modal, .order-modal').forEach(modal => {
            modal.addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        });

        // Initialize the website
        document.addEventListener('DOMContentLoaded', () => {
            initMenu();
            updateCart();
            
            // Add CSS for notification animations
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                    }
                    to {
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        });
    


        function placeOrder() {
    // ✅ Check if user is logged in
    const userId = localStorage.getItem("userId");
    if (!userId) {
        alert("Please login first to place an order!");
        window.location.href = "/login"; // redirect to login page
        return;
    }

    // Then continue normally
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const instructions = document.getElementById('instructions').value;    

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;   

    const order = {
        customer: { fullName, email, phone, address, city, instructions },
        items: [...cart],
        subtotal,
        tax,
        total,
        userId // ✅ send userId to backend
    };

    // send to backend
    fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order)
    })
    .then(res => res.json())
    .then(data => {
        alert('✅ Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
    })
    .catch(err => {
        console.error('❌ Error sending order:', err);
        alert('Something went wrong while placing the order.');
    }); 
}


document.getElementById('orderNowBtn').addEventListener('click', function() {
    document.getElementById('productModal').classList.remove('active');
    showOrderForm();
});

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector(".footer-column form");

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = form.querySelector("input[type='email']").value.trim();
      if (!email) {
        alert("Please enter your email.");
        return;
      }

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
          alert("✅ Subscribed successfully!");
          form.reset();
        } else {
          alert("⚠️ " + data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("❌ Something went wrong, please try again later.");
      }
    });
  }
});




