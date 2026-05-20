function getToken() {
return localStorage.getItem("token");
}

function ensureAdminAccess() {

const token = localStorage.getItem("token");

const role = localStorage.getItem("role");

if (!token || role !== "ADMIN") {


window.location.replace("/admin-login.html");

return false;


}

return true;
}

function getProductIdFromUrl() {

const params = new URLSearchParams(window.location.search);

return params.get("id");
}

/* ADD PRODUCT */

async function addProduct(event) {

event.preventDefault();

const data = {


name: document.getElementById("name").value,

description: document.getElementById("description").value,

price: document.getElementById("price").value,

stock: document.getElementById("stock").value,

category: document.getElementById("category").value,

imageUrl: document.getElementById("imageUrl").value


};

try {


const response = await fetch("/admin/products", {

  method: "POST",

  headers: {

    "Content-Type": "application/json",

    "Authorization": "Bearer " + getToken()
  },

  body: JSON.stringify(data)
});

if (!response.ok) {

  document.getElementById("message").innerText =
    "Failed to add product";

  return;
}

document.getElementById("message").innerText =
  "Product added successfully";

setTimeout(() => {

  window.location.href = "/all-products-admin.html";

}, 1200);


} catch (error) {


console.error(error);

document.getElementById("message").innerText =
  "Something went wrong";


}
}

/* LOAD ALL PRODUCTS */

async function loadAllProducts() {

const response = await fetch("/admin/products", {


headers: {
  "Authorization": "Bearer " + getToken()
}


});

if (response.status === 401 || response.status === 403) {

window.location.replace("/admin-login.html");

return;


}

const products = await response.json();

const productList = document.getElementById("productList");

if (!products.length) {


productList.innerHTML = `
  <div class="feature-card">
    <h2>No Products Found</h2>
  </div>
`;

return;

}

let html = `

<div class="admin-products-grid">


`;

products.forEach(product => {

html += `

  <div class="admin-product-card">

    <img
      src="${product.imageUrl || 'https://via.placeholder.com/300'}"
      class="admin-product-image"
      alt="${product.name}"
    />

    <div class="admin-product-content">

      <h2>
        ${product.name}
      </h2>

      <p class="product-category">
        ${product.category}
      </p>

      <p class="product-description">
        ${product.description}
      </p>

      <h3 class="product-price">
        ₹${product.price}
      </h3>

      <p>
        Stock: ${product.stock}
      </p>

      <div class="admin-product-buttons">

        <a
          href="/view-product-admin.html?id=${product.id}"
          class="btn"
        >
          View
        </a>

        <a
          href="/edit-product.html?id=${product.id}"
          class="btn"
        >
          Edit
        </a>

        <button
          class="btn delete-btn"
          onclick="deleteProduct(${product.id})"
        >
          Delete
        </button>

      </div>

    </div>

  </div>

`;

});

html += `</div>`;

productList.innerHTML = html;
}

/* LOAD PRODUCT DETAILS */

async function loadProductDetails() {

const id = getProductIdFromUrl();

if (!id) return;

const response = await fetch(`/admin/products/${id}`, {


headers: {
  "Authorization": "Bearer " + getToken()
}


});

if (response.status === 401 || response.status === 403) {


window.location.replace("/admin-login.html");

return;


}

const product = await response.json();

const detailsDiv = document.getElementById("productDetails");

detailsDiv.innerHTML = `


<div class="admin-product-card">

  <img
    src="${product.imageUrl || 'https://via.placeholder.com/300'}"
    class="admin-product-image"
    alt="${product.name}"
  />

  <div class="admin-product-content">

    <h2>${product.name}</h2>

    <p class="product-category">
      ${product.category}
    </p>

    <p class="product-description">
      ${product.description}
    </p>

    <h3 class="product-price">
      ₹${product.price}
    </h3>

    <p>
      Available Stock: ${product.stock}
    </p>

  </div>

</div>

`;
}

/* PREFILL EDIT FORM */

async function prefillEditForm() {

const id = getProductIdFromUrl();

if (!id) return;

const response = await fetch(`/admin/products/${id}`, {


headers: {
  "Authorization": "Bearer " + getToken()
}

});

if (response.status === 401 || response.status === 403) {

window.location.replace("/admin-login.html");

return;

}

const product = await response.json();

document.getElementById("name").value = product.name;

document.getElementById("description").value =
product.description;

document.getElementById("price").value =
product.price;

document.getElementById("stock").value =
product.stock;

document.getElementById("category").value =
product.category;

document.getElementById("imageUrl").value =
product.imageUrl || "";
}

/* UPDATE PRODUCT */

async function updateProduct(event) {

event.preventDefault();

const id = getProductIdFromUrl();

const data = {

name: document.getElementById("name").value,

description: document.getElementById("description").value,

price: document.getElementById("price").value,

stock: document.getElementById("stock").value,

category: document.getElementById("category").value,

imageUrl: document.getElementById("imageUrl").value


};

const response = await fetch(`/admin/products/${id}`, {

method: "PUT",

headers: {

  "Content-Type": "application/json",

  "Authorization": "Bearer " + getToken()
},

body: JSON.stringify(data)

});

if (!response.ok) {

document.getElementById("message").innerText =
  "Failed to update product";

return;

}

document.getElementById("message").innerText =
"Product updated successfully";

setTimeout(() => {

window.location.href = "/all-products-admin.html";

}, 1200);
}

/* DELETE PRODUCT */

async function deleteProduct(id) {

const confirmed = confirm(
"Are you sure you want to delete this product?"
);

if (!confirmed) return;

const response = await fetch(`/admin/products/${id}`, {

method: "DELETE",

headers: {
  "Authorization": "Bearer " + getToken()
}


});

if (!response.ok) {

alert("Failed to delete product");

return;

}

alert("Product deleted successfully");

loadAllProducts();
}

/* PAGE LOAD */

document.addEventListener("DOMContentLoaded", () => {

if (!ensureAdminAccess()) return;

const addProductForm =
document.getElementById("addProductForm");

const editProductForm =
document.getElementById("editProductForm");

const productList =
document.getElementById("productList");

const productDetails =
document.getElementById("productDetails");

if (addProductForm) {

addProductForm.addEventListener(
  "submit",
  addProduct
);

}

if (editProductForm) {

prefillEditForm();

editProductForm.addEventListener(
  "submit",
  updateProduct
);

}

if (productList) {


loadAllProducts();

}

if (productDetails) {

loadProductDetails();

}
});
