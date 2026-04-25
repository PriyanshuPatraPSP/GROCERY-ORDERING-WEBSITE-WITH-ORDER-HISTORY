// Mock Grocery Data
const products = [
    { id: 1, name: "Organic Bananas", category: "Fruits", price: 2.99, img: "https://images.unsplash.com/photo-1571501474524-18c7fd235e16?q=80&w=600&auto=format&fit=crop" },
    { id: 2, name: "Fresh Strawberries", category: "Fruits", price: 4.50, img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=600&auto=format&fit=crop" },
    { id: 3, name: "Avocado Hass", category: "Vegetables", price: 1.50, img: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=600&auto=format&fit=crop" },
    { id: 4, name: "Crispy Apples", category: "Fruits", price: 3.20, img: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6c?q=80&w=600&auto=format&fit=crop" },
    { id: 5, name: "Farm Fresh Eggs (12)", category: "Dairy", price: 5.99, img: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?q=80&w=600&auto=format&fit=crop" },
    { id: 6, name: "Organic Whole Milk", category: "Dairy", price: 4.80, img: "https://images.unsplash.com/photo-1563636619-e9143da7973b?q=80&w=600&auto=format&fit=crop" },
    { id: 7, name: "Sourdough Bread", category: "Bakery", price: 6.50, img: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?q=80&w=600&auto=format&fit=crop" },
    { id: 8, name: "French Croissants (4)", category: "Bakery", price: 5.00, img: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=600&auto=format&fit=crop" },
    { id: 9, name: "Fresh Carrots", category: "Vegetables", price: 2.10, img: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=600&auto=format&fit=crop" },
    { id: 10, name: "Cherry Tomatoes", category: "Vegetables", price: 3.49, img: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=600&auto=format&fit=crop" },
    { id: 11, name: "Cheddar Cheese Block", category: "Dairy", price: 7.20, img: "https://images.unsplash.com/photo-1618164436241-4473940d1f5c?q=80&w=600&auto=format&fit=crop" },
    { id: 12, name: "Green Bell Peppers", category: "Vegetables", price: 1.80, img: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=600&auto=format&fit=crop" }
];

// State
let cart = [];
let orderHistory = JSON.parse(localStorage.getItem('freshglass_orders')) || [];
const DELIVERY_FEE = 5.00;

// DOM Elements
const productGrid = document.getElementById('product-grid');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalPrice = document.getElementById('subtotal-price');
const grandTotalPrice = document.getElementById('grand-total-price');
const checkoutBtn = document.getElementById('checkout-btn');
const toast = document.getElementById('toast');
const catalogView = document.getElementById('catalog-view');
const ordersView = document.getElementById('orders-view');
const ordersList = document.getElementById('orders-list');
const navItems = document.querySelectorAll('.nav-menu li');

// Initialize
function init() {
    renderProducts(products);
    setupEventListeners();
}

// Render Products
function renderProducts(items) {
    productGrid.innerHTML = '';
    items.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.img}" alt="${product.name}" class="product-img" loading="lazy">
            <span class="product-cat">${product.category}</span>
            <h3 class="product-title">${product.name}</h3>
            <div class="product-bottom">
                <span class="product-price">$${product.price.toFixed(2)}</span>
                <button class="add-btn" onclick="addToCart(${product.id})">
                    <i class="ph ph-plus"></i>
                </button>
            </div>
        `;
        productGrid.appendChild(card);
    });
}

// Add to Cart
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    const existing = cart.find(item => item.id === productId);
    
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    
    updateCart();
    showToast(`Added ${product.name} to cart!`);
};

// Update Cart Quantity
window.updateQty = (productId, delta) => {
    const item = cart.find(c => c.id === productId);
    if (!item) return;
    
    item.qty += delta;
    if (item.qty <= 0) {
        cart = cart.filter(c => c.id !== productId);
    }
    updateCart();
};

// Update Cart DOM
function updateCart() {
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    let totalItems = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="ph ph-shopping-cart"></i>
                <p>Your cart is empty.</p>
            </div>
        `;
        checkoutBtn.disabled = true;
    } else {
        checkoutBtn.disabled = false;
        cart.forEach(item => {
            subtotal += item.price * item.qty;
            totalItems += item.qty;
            
            const el = document.createElement('div');
            el.className = 'cart-item';
            el.innerHTML = `
                <img src="${item.img}" alt="${item.name}">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)}</p>
                </div>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span class="qty-value">${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                </div>
            `;
            cartItemsContainer.appendChild(el);
        });
    }

    cartCount.textContent = totalItems;
    subtotalPrice.textContent = `$${subtotal.toFixed(2)}`;
    grandTotalPrice.textContent = `$${(subtotal > 0 ? subtotal + DELIVERY_FEE : 0).toFixed(2)}`;
}

// Checkout
function checkout() {
    if (cart.length === 0) return;

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const order = {
        id: 'ORD-' + Math.floor(Math.random() * 1000000),
        date: new Date().toLocaleDateString(),
        items: [...cart],
        total: subtotal + DELIVERY_FEE
    };

    orderHistory.unshift(order);
    localStorage.setItem('freshglass_orders', JSON.stringify(orderHistory));
    
    cart = [];
    updateCart();
    showToast("Checkout Successful! Order placed.");
}

// Render Orders
function renderOrders() {
    ordersList.innerHTML = '';
    
    if (orderHistory.length === 0) {
        ordersList.innerHTML = '<p>No past orders found.</p>';
        return;
    }

    orderHistory.forEach(order => {
        const itemsList = order.items.map(i => `${i.qty}x ${i.name}`).join(', ');
        
        const card = document.createElement('div');
        card.className = 'order-card';
        card.innerHTML = `
            <div class="order-header">
                <div><strong>${order.id}</strong> <br> <small>${order.date}</small></div>
                <h3>$${order.total.toFixed(2)}</h3>
            </div>
            <p style="color: var(--text-muted); font-size: 0.9rem;">${itemsList}</p>
        `;
        ordersList.appendChild(card);
    });
}

// View Toggle
function toggleView(view) {
    if (view === 'orders') {
        catalogView.style.display = 'none';
        ordersView.style.display = 'block';
        renderOrders();
        
        // Remove active from nav menu
        navItems.forEach(nav => nav.classList.remove('active'));
    } else {
        catalogView.style.display = 'block';
        ordersView.style.display = 'none';
    }
}

// Filter Products
function filterProducts(category) {
    toggleView('catalog');
    if (category === 'all') {
        renderProducts(products);
    } else {
        renderProducts(products.filter(p => p.category === category));
    }
}

// Toast
let toastTimeout;
function showToast(msg) {
    document.getElementById('toast-message').textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Event Listeners
function setupEventListeners() {
    checkoutBtn.addEventListener('click', checkout);
    
    document.getElementById('view-orders-btn').addEventListener('click', () => toggleView('orders'));
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Update active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            filterProducts(item.dataset.filter);
        });
    });

    document.getElementById('search-input').addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = products.filter(p => p.name.toLowerCase().includes(term));
        renderProducts(filtered);
    });
}

// Boot
document.addEventListener('DOMContentLoaded', init);
