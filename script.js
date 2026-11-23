
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

  container.innerHTML = reviews.map((review, index) => `
    <div class="review-card">
      <h3>${safe(review.name)}</h3>

      <div class="review-stars" aria-label="${review.rating} out of 5 stars">
        ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
      </div>

      <p>${safe(review.text)}</p>

      <span class="review-date">${safe(review.date)}</span>

      <button class="delete-review" onclick="deleteReview(${index})">
        Delete Review
      </button>
    </div>
  `).join("");
}

function deleteReview(index) {
  const password = prompt("Enter the administrator password to delete this review:");

  if (password === null) return;

  if (password !== "PINEAPPLE") {
    toast("Incorrect password.");
    return;
  }

  const reviews = getReviews();

  if (index < 0 || index >= reviews.length) return;

  reviews.splice(index, 1);

  localStorage.setItem("ornamentLabReviews", JSON.stringify(reviews));

  renderReviews();
  toast("Review deleted.");
}
