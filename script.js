let cart = [];
let selectedColor = "#168de0";
let currentProduct = "";
let currentPrice = 0;

// CUSTOMIZER

function customize(name, price) {
  currentProduct = name;
  currentPrice = price;

  document.getElementById("customTitle").textContent =
    "Customize " + name;

  document.getElementById("customName").value = "";
  document.getElementById("quantity").value = 1;

  selectedColor = "#168de0";

  document.getElementById("customizer").style.display = "flex";
}

function closeCustomizer() {
  document.getElementById("customizer").style.display = "none";
}

function selectColor(color) {
  selectedColor = color;
}

// ADD TO CART

function addToCart() {
  const name = document.getElementById("customName").value;
  const style = document.getElementById("letterStyle").value;
  const quantity = parseInt(document.getElementById("quantity").value);

  if (!quantity || quantity < 1) {
    alert("Please enter a valid quantity.");
    return;
  }

  cart.push({
    product: currentProduct,
    price: currentPrice,
    name: name,
    color: selectedColor,
    style: style,
    quantity: quantity
  });

  updateCart();

  closeCustomizer();

  alert("Added to cart!");
}

// UPDATE CART

function updateCart() {
  let totalItems = 0;

  cart.forEach(item => {
    totalItems += item.quantity;
  });

  document.getElementById("cartCount").textContent = totalItems;
}

// OPEN CART

function toggleCart() {
  const modal = document.getElementById("cartModal");

  if (modal.style.display === "flex") {
    modal.style.display = "none";
  } else {
    renderCart();
    modal.style.display = "flex";
  }
}

// DISPLAY CART

function renderCart() {
  const cartItems = document.getElementById("cartItems");

  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <strong>${item.product}</strong>
      <p>Name: ${escapeHTML(item.name || "None")}</p>
      <p>Color: ${item.color}</p>
      <p>Lettering: ${item.style}</p>
      <p>Quantity: ${item.quantity}</p>
      <p>$${(item.price * item.quantity).toFixed(2)}</p>
      <button onclick="removeItem(${index})">Remove</button>
    `;

    cartItems.appendChild(div);
  });

  document.getElementById("cartTotal").textContent =
    "Total: $" + total.toFixed(2);
}

function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
  renderCart();
}

// CHECKOUT

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  document.getElementById("cartModal").style.display = "none";
  document.getElementById("checkoutModal").style.display = "flex";
}

function closeCheckout() {
  document.getElementById("checkoutModal").style.display = "none";
}

// DEMO ORDER

function placeOrder() {
  const email = document.getElementById("checkoutEmail").value;
  const name = document.getElementById("checkoutName").value;
  const address = document.getElementById("checkoutAddress").value;
  const city = document.getElementById("checkoutCity").value;
  const zip = document.getElementById("checkoutZip").value;

  if (!email || !name || !address || !city || !zip) {
    alert("Please fill out all checkout fields.");
    return;
  }

  alert("Demo checkout complete! This website does not yet process payments or submit orders.");

  cart = [];
  updateCart();

  closeCheckout();

  document.getElementById("checkoutEmail").value = "";
  document.getElementById("checkoutName").value = "";
  document.getElementById("checkoutAddress").value = "";
  document.getElementById("checkoutCity").value = "";
  document.getElementById("checkoutZip").value = "";
}

// HTML SAFETY

function escapeHTML(text) {
  return String(text).replace(/[&<>"']/g, character => {
    const replacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return replacements[character];
  });
}

// CLOSE MODALS BY CLICKING OUTSIDE

window.addEventListener("click", function(event) {
  const modals = ["customizer", "cartModal", "checkoutModal"];

  modals.forEach(id => {
    const modal = document.getElementById(id);

    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
});
