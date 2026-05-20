function ensureCustomer() {

const token = localStorage.getItem("token");
const role = localStorage.getItem("role");
const username = localStorage.getItem("username");

if (!token || role !== "USER") {
    window.location.replace("/login.html");
    return false;
}

const welcome = document.getElementById("welcomeText");

if (welcome) {
    welcome.innerText = `Welcome back, ${username}`;
}

return true;

}

function getToken() {
return localStorage.getItem("token");
}

function startShopping() {
loadProducts();
}

function goToCart() {
window.location.href = "/view-cart.html";
}

function goBackToShopping() {
window.location.href = "/customer-home.html";
}

/* TOAST MESSAGE */

function showToast(message, success = true) {

const toast = document.createElement("div");

toast.innerText = message;

toast.style.position = "fixed";
toast.style.top = "20px";
toast.style.right = "20px";
toast.style.padding = "14px 20px";
toast.style.borderRadius = "12px";
toast.style.color = "white";
toast.style.fontWeight = "600";
toast.style.zIndex = "9999";
toast.style.background = success ? "#16a34a" : "#dc2626";
toast.style.boxShadow = "0 10px 20px rgba(0,0,0,0.15)";

document.body.appendChild(toast);

setTimeout(() => {
    toast.remove();
}, 2500);

}

/* LOAD PRODUCTS */

async function loadProducts() {

const response = await fetch("/products", {
    headers: {
        "Authorization": "Bearer " + getToken()
    }
});

if (response.status === 401) {
    logout();
    return;
}

if (response.status === 403) {
    showToast("Access denied", false);
    return;
}

const products = await response.json();

const shoppingSection = document.getElementById("shoppingSection");
const productList = document.getElementById("productList");

shoppingSection.style.display = "block";

if (!products.length) {

    productList.innerHTML = `
        <p class="empty-state">
            No products found
        </p>
    `;

    return;
}

let html = "";

products.forEach(product => {

    html += `

    <div class="product-card">

        <img 
            src="${product.imageUrl || 'https://via.placeholder.com/300'}"
            alt="${product.name}"
        >

        <div class="product-info">

            <h3>
                ${product.name}
            </h3>

            <p class="price">
                ₹${product.price}
            </p>

            <p>
                Stock: ${product.stock}
            </p>

            <p>
                Category: ${product.category}
            </p>

            <button 
                class="btn"
                onclick="addToCart(${product.id})"
            >
                Add to Cart
            </button>

        </div>

    </div>

    `;
});

productList.innerHTML = html;

}

/* ADD TO CART */

async function addToCart(productId) {

const response = await fetch("/customer/cart", {

    method: "POST",

    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    },

    body: JSON.stringify({
        productId: productId,
        quantity: 1
    })
});

const result = await response.json().catch(() => ({}));

if (response.status === 401) {
    logout();
    return;
}

if (!response.ok) {
    showToast(result.message || "Failed to add product", false);
    return;
}

showToast(result.message || "Product added to cart");

}

/* LOAD CART */

async function loadCart() {

const response = await fetch("/customer/cart", {

    headers: {
        "Authorization": "Bearer " + getToken()
    }
});

if (response.status === 401) {
    logout();
    return;
}

const cart = await response.json();

const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

if (!cartList) return;

if (!cart.items.length) {

    cartList.innerHTML = `
        <p class="empty-state">
            Your cart is empty
        </p>
    `;

    cartTotal.innerText = "";

    if (checkoutBtn) {
        checkoutBtn.style.display = "none";
    }

    return;
}

let html = `
    <table class="product-table">

        <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th>Actions</th>
        </tr>
`;

cart.items.forEach(item => {

    html += `

    <tr>

        <td>
            <img 
                src="${item.imageUrl || 'https://via.placeholder.com/100'}" 
                alt="${item.productName}" 
                class="product-thumb"
            />
        </td>

        <td>${item.productName}</td>

        <td>₹${item.price}</td>

        <td>

            <input 
                type="number" 
                min="1" 
                value="${item.quantity}" 
                id="qty-${item.cartItemId}"
                style="width:80px;"
            />

        </td>

        <td>
            ₹${item.subtotal}
        </td>

        <td>

            <button onclick="updateCartItem(${item.cartItemId})">
                Update
            </button>

            <button 
                class="logout-btn"
                onclick="removeCartItem(${item.cartItemId})"
            >
                Remove
            </button>

        </td>

    </tr>

    `;
});

html += `</table>`;

cartList.innerHTML = html;

cartTotal.innerText = `Total: ₹${cart.totalAmount}`;

}

/* UPDATE CART */

async function updateCartItem(cartItemId) {

const quantity = document.getElementById(`qty-${cartItemId}`).value;

const response = await fetch(`/customer/cart/${cartItemId}`, {

    method: "PUT",

    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + getToken()
    },

    body: JSON.stringify({
        quantity: Number(quantity)
    })
});

const result = await response.json().catch(() => ({}));

if (!response.ok) {
    showToast(result.message || "Failed to update cart", false);
    return;
}

showToast(result.message || "Cart updated");

loadCart();

}

/* REMOVE CART ITEM */

async function removeCartItem(cartItemId) {

const response = await fetch(`/customer/cart/${cartItemId}`, {

    method: "DELETE",

    headers: {
        "Authorization": "Bearer " + getToken()
    }
});

const result = await response.json().catch(() => ({}));

if (!response.ok) {
    showToast(result.message || "Failed to remove item", false);
    return;
}

showToast(result.message || "Item removed");

loadCart();

}

/* CHECKOUT */

async function checkout() {

if (typeof Razorpay === "undefined") {
    showToast("Razorpay SDK not loaded", false);
    return;
}

const createOrderResponse = await fetch("/customer/payment/create-order", {

    method: "POST",

    headers: {
        "Authorization": "Bearer " + getToken()
    }
});

if (createOrderResponse.status === 401) {
    logout();
    return;
}

const orderData = await createOrderResponse.json().catch(() => ({}));

if (!createOrderResponse.ok) {
    showToast(orderData.message || "Failed to create order", false);
    return;
}

const username = localStorage.getItem("username") || "Customer";

const options = {

    key: orderData.keyId,

    amount: orderData.amount,

    currency: orderData.currency,

    name: "Buyzon",

    description: "Cart Payment",

    order_id: orderData.razorpayOrderId,

    handler: async function (response) {

        const verifyResponse = await fetch("/customer/payment/verify", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + getToken()
            },

            body: JSON.stringify({

                localOrderId: orderData.localOrderId,

                razorpayPaymentId: response.razorpay_payment_id,

                razorpayOrderId: response.razorpay_order_id,

                razorpaySignature: response.razorpay_signature
            })
        });

        const verifyResult = await verifyResponse.json().catch(() => ({}));

        if (!verifyResponse.ok) {
            showToast(verifyResult.message || "Payment failed", false);
            return;
        }

        showToast("Payment successful");

        window.location.href = "/customer-home.html";
    },

    prefill: {
        name: username
    },

    theme: {
        color: "#2563eb"
    }
};

const rzp = new Razorpay(options);

rzp.on("payment.failed", function () {
    showToast("Payment failed", false);
});

rzp.open();

}

/* LOGOUT */

function logout() {


localStorage.removeItem("token");
localStorage.removeItem("username");
localStorage.removeItem("role");

window.location.replace("/index.html");

}

/* PAGE LOAD */

document.addEventListener("DOMContentLoaded", () => {

if (!ensureCustomer()) return;

if (document.getElementById("cartList")) {
    loadCart();
}

});
