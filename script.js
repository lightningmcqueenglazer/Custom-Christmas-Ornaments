
const products = [
  { id: 1, name: "Top Hat Ornament", price: 14, emoji: "🎩" },
  { id: 2, name: "Sword Ornament", price: 16, emoji: "⚔️" },
  { id: 3, name: "Skateboard Ornament", price: 15, emoji: "🛹" },
  { id: 4, name: "Guitar Ornament", price: 17, emoji: "🎸" }
];

const colors = [
  { name: "Blue", value: "#168de0" },
  { name: "Red", value: "#e53945" },
  { name: "Green", value: "#18864b" },
  { name: "Ivory", value: "#f4f0df" },
  { name: "Gold", value: "#e7b83f" },
  { name: "Purple", value: "#a66bca" }
];

let cart = [];
let currentProduct = null;
let selectedColor = colors[0].value;
let selectedRating = 0;

const pageIds = [
  "homePage",
  "productPage",
  "cartPage",
  "checkoutPage",
  "reviewsPage",
  "successPage"
];

function showPage(id) {
  pageIds.forEach(page => {
    document.getElementById(page).classList.add("hidden");
  });

  document.getElementById(id).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goHome() {
  showPage("homePage");
  history.replaceState(null, "", "#home");
}

function scrollToShop() {
  document.getElementById("shop").scrollIntoView({
    behavior: "smooth"
  });
}

function renderProducts() {
  const grid = document.getElementById("productGrid");

  grid.innerHTML = products.map(product => `
    <div class="product-card">
      <div class="product-image">${product.emoji}</div>
      <h3>${product.name}</h3>
      <p>Customize with your own name and color.</p>
      <p class="price">$${product.price.toFixed(2)}</p>
      <button class="primary full"
        onclick="openProduct(${product.id})">
        Customize
      </button>
    </div>
  `).join("");
}

function openProduct(id) {
  currentProduct = products.find(p => p.id === id);

  document.getElementById("detailTitle").textContent =
    currentProduct.name;

  document.getElementById("detailPrice").textContent =
    "$" + currentProduct.price.toFixed(2);

  document.getElementById("previewEmoji").textContent =
    currentProduct.emoji;

  document.getElementById("customName").value = "";

  document.getElementById("quantity").value = 1;

  selectedColor = colors[0].value;

  renderSwatches();
  updatePreview();
  showPage("productPage");
}

function renderSwatches() {
  const container = document.getElementById("colorSwatches");

  container.innerHTML = colors.map(color => `
    <button
      class="swatch ${selectedColor === color.value ? "selected" : ""}"
      style="background:${color.value}"
      title="${color.name}"
      aria-label="${color.name}"
      onclick="pickColor('${color.value}')">
    </button>
  `).join("");
}

function pickColor(value) {
  selectedColor = value;
  renderSwatches();
  updatePreview();
}

function updatePreview() {
  const name = document.getElementById("customName").value.trim();

  document.getElementById("previewName").textContent =
    name || "Your Name";

  document.getElementById("ornamentPreview").style.color =
    selectedColor;

  const font = document.getElementById("fontChoice").value;

  document.getElementById("previewName").className =
    "font-" + font;
}

function addDetailToCart() {
  if (!currentProduct) return;

  const name = document.getElementById("customName").value.trim();

  const quantity = Number(document.getElementById("quantity").value);

  if (quantity < 1 || quantity > 20 || !Number.isInteger(quantity)) {
    toast("Please choose a quantity from 1 to 20.");
    return;
  }

  cart.push({
    productId: currentProduct.id,
    name: currentProduct.name,
    price: currentProduct.price,
    emoji: currentProduct.emoji,
    customName: name || "No name",
    color: selectedColor,
    font: document.getElementById("fontChoice").value,
    quantity: quantity
  });

  refreshCount();
  toast("Added to cart!");
  openCart();
}

function refreshCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function cartSum() {
  return cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function openCart() {
  if (cart.length === 0) {
    toast("Your cart is empty.");
    goHome();
    return;
  }

  renderCart();
  showPage("cartPage");
}

function renderCart() {
  const container = document.getElementById("cartItems");

  container.innerHTML = cart.map((item, index) => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.emoji}</div>

      <div class="cart-item-info">
        <h3>${safe(item.name)}</h3>
        <p>Name: ${safe(item.customName)}</p>
        <p>Color:
          <span style="display:inline-block;width:15px;height:15px;
          border-radius:50%;background:${item.color};
          vertical-align:middle"></span>
        </p>
        <p>Quantity: ${item.quantity}</p>
        <p>$${(item.price * item.quantity).toFixed(2)}</p>
      </div>

      <button class="remove-button"
        onclick="removeItem(${index})">
        Remove
      </button>
    </div>
  `).join("");

  document.getElementById("cartTotal").textContent =
    "Total: $" + cartSum().toFixed(2);
}

function removeItem(index) {
  cart.splice(index, 1);
  refreshCount();

  if (cart.length === 0) {
    goHome();
    toast("Cart is now empty.");
  } else {
    renderCart();
  }
}

function goCheckout() {
  if (!cart.length) {
    toast("Your cart is empty.");
    goHome();
    return;
  }

  renderCheckout();
  showPage("checkoutPage");
}

function renderCheckout() {
  const container = document.getElementById("checkoutItems");

  container.innerHTML = cart.map(item => `
    <div class="summary-item">
      <span>${safe(item.name)} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join("");

  document.getElementById("checkoutTotal").textContent =
    "Total: $" + cartSum().toFixed(2);
}

document.getElementById("checkoutForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    if (!cart.length) {
      toast("Your cart is empty.");
      goHome();
      return;
    }

    cart = [];
    refreshCount();

    this.reset();

    showPage("successPage");
  }
);

// REVIEWS

function openReviews() {
  renderReviews();
  showPage("reviewsPage");
  history.replaceState(null, "", "#reviews");
}

function setRating(rating) {
  selectedRating = rating;

  const buttons = document.querySelectorAll("#ratingStars button");

  buttons.forEach((button, index) => {
    button.textContent = index < rating ? "★" : "☆";
  });
}

document.getElementById("reviewForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const name = document.getElementById("reviewName").value.trim();
    const text = document.getElementById("reviewText").value.trim();

    if (!name || !text) {
      toast("Please fill in all the review fields.");
      return;
    }

    if (selectedRating === 0) {
      toast("Please choose a star rating.");
      return;
    }

    const review = {
      name: name,
      rating: selectedRating,
      text: text,
      date: new Date().toLocaleDateString()
    };

    let reviews = getReviews();

    reviews.unshift(review);

    try {
      localStorage.setItem("ornamentLabReviews", JSON.stringify(reviews));
    } catch (error) {
      toast("Unable to save review in this browser.");
      return;
    }

    this.reset();
    setRating(0);
    renderReviews();
    toast("Your review was submitted!");
  }
);

function getReviews() {
  try {
    return JSON.parse(localStorage.getItem("ornamentLabReviews")) || [];
  } catch (error) {
    return [];
  }
}

function renderReviews() {
  const container = document.getElementById("reviewsList");
  const reviews = getReviews();

  if (reviews.length === 0) {
    container.innerHTML = `
      <div class="empty-reviews">
        <h3>No reviews yet!</h3>
        <p>Be the first to leave a review.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = reviews.map(review => `
    <div class="review-card">
      <h3>${safe(review.name)}</h3>

      <div class="review-stars" aria-label="${review.rating} out of 5 stars">
        ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
      </div>

      <p>${safe(review.text)}</p>

      <span class="review-date">${safe(review.date)}</span>
    </div>
  `).join("");
}

// HELPERS

function safe(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[char]));
}

function toast(message) {
  const box = document.getElementById("toast");

  box.textContent = message;
  box.style.display = "block";

  clearTimeout(window.toastTimeout);

  window.toastTimeout = setTimeout(() => {
    box.style.display = "none";
  }, 2500);
}

// INITIALIZE

renderProducts();
renderReviews();
refreshCount();
