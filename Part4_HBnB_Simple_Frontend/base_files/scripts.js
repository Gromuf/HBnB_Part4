console.log("Script loaded successfully");

// ---------------------------------------------
// Data Initialization
// ---------------------------------------------

const places = [
  {
    id: 1,
    name: "Beachfront Villa",
    price: 250,
    description: "A beautiful villa by the sea.",
  },
  {
    id: 2,
    name: "Mountain Cabin",
    price: 150,
    description: "Cozy cabin with stunning mountain views.",
  },
  {
    id: 3,
    name: "City Apartment",
    price: 120,
    description: "Modern apartment in the city center.",
  },
  {
    id: 4,
    name: "Luxury Resort",
    price: 500,
    description: "5-star luxury resort with all amenities.",
  },
  {
    id: 5,
    name: "Eco Lodge",
    price: 100,
    description: "Eco-friendly lodge in the jungle.",
  },
];

const reviews = {
  1: [
    {
      username: "Alice",
      rating: 5,
      comment: "Amazing place! The view was breathtaking.",
    },
    { username: "Bob", rating: 4, comment: "Great stay, but a little pricey." },
  ],
  2: [
    {
      username: "Charlie",
      rating: 3,
      comment: "Nice cabin but lacked some modern amenities.",
    },
  ],
  3: [
    {
      username: "David",
      rating: 5,
      comment: "Perfect apartment for city living!",
    },
  ],
  4: [
    {
      username: "Eva",
      rating: 5,
      comment: "Luxury at its finest, absolutely loved it!",
    },
  ],
  5: [
    {
      username: "Frank",
      rating: 4,
      comment: "Great eco-lodge, but a bit remote.",
    },
  ],
};

const placeList = document.getElementById("places-list");
const priceFilter = document.getElementById("price-filter");

// ---------------------------------------------
// Helper Functions
// ---------------------------------------------

function populatePriceFilter() {
  const uniquePrices = [...new Set(places.map((place) => place.price))].sort(
    (a, b) => a - b
  );

  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "All";
  priceFilter.appendChild(defaultOption);

  uniquePrices.forEach((price) => {
    const option = document.createElement("option");
    option.value = price;
    option.textContent = `$${price}`;
    priceFilter.appendChild(option);
  });
}

function renderPlaces(filterPrice = null) {
  placeList.innerHTML = "";

  const filteredPlaces = filterPrice
    ? places.filter((place) => place.price <= filterPrice)
    : places;

  const sortedPlaces = filteredPlaces.sort((a, b) => a.price - b.price);

  sortedPlaces.forEach((place) => {
    const card = document.createElement("div");
    card.classList.add("place-card");

    const title = document.createElement("h3");
    title.textContent = place.name;

    const price = document.createElement("p");
    price.textContent = `Price per night: $${place.price}`;

    const description = document.createElement("p");
    description.textContent = place.description;

    const detailsButton = document.createElement("button");
    detailsButton.classList.add("details-button");
    detailsButton.textContent = "View Details";
    detailsButton.onclick = () => {
      window.location.href = `place.html?id=${place.id}`;
    };

    card.appendChild(title);
    card.appendChild(price);
    card.appendChild(description);
    card.appendChild(detailsButton);

    placeList.appendChild(card);
  });

  if (filteredPlaces.length === 0) {
    const noResultMessage = document.createElement("p");
    noResultMessage.textContent = "No places match your filter.";
    placeList.appendChild(noResultMessage);
  }
}

function renderPlaceDetails(placeId) {
  const place = places.find((p) => p.id === placeId);
  const placeDetailsSection = document.getElementById("place-details");

  if (place) {
    document.title = place.name;

    const pageTitle = document.createElement("h1");
    pageTitle.textContent = place.name;

    const placeCard = document.createElement("div");
    placeCard.classList.add("place-card");

    const price = document.createElement("p");
    price.textContent = `Price per night: $${place.price}`;

    const description = document.createElement("p");
    description.textContent = place.description;

    placeCard.appendChild(price);
    placeCard.appendChild(description);

    placeDetailsSection.innerHTML = "";
    placeDetailsSection.appendChild(pageTitle);
    placeDetailsSection.appendChild(placeCard);

    renderReviews(placeId);
  }
}

function renderReviews(placeId) {
  const reviewSection = document.getElementById("reviews");
  reviewSection.innerHTML = "";

  const reviewTitle = document.createElement("h3");
  reviewTitle.textContent = "Reviews";
  reviewSection.appendChild(reviewTitle);

  const placeReviews = reviews[placeId] || [];
  placeReviews.forEach((review) => {
    const reviewCard = document.createElement("div");
    reviewCard.classList.add("review-card");

    const usernameElement = document.createElement("h4");
    usernameElement.textContent = review.username;

    const ratingElement = document.createElement("p");
    ratingElement.textContent = `Rating: ${review.rating}/5`;

    const commentElement = document.createElement("p");
    commentElement.textContent = review.comment;

    reviewCard.appendChild(usernameElement);
    reviewCard.appendChild(ratingElement);
    reviewCard.appendChild(commentElement);

    reviewSection.appendChild(reviewCard);
  });

  const addReviewForm = document.getElementById("add-review");
  addReviewForm.style.display = "block";
  addReviewForm.querySelector("form").onsubmit = (event) => {
    event.preventDefault();

    const reviewText = document.getElementById("review-text").value.trim();
    if (reviewText) {
      const newReview = {
        username: "Anonymous",
        rating: 5,
        comment: reviewText,
      };
      if (!reviews[placeId]) reviews[placeId] = [];
      reviews[placeId].push(newReview);

      renderReviews(placeId);
      document.getElementById("review-text").value = "";
    }
  };
}

// ---------------------------------------------
// Event Listeners
// ---------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  // Index Page
  if (window.location.pathname.includes("index.html")) {
    populatePriceFilter();
    renderPlaces();

    priceFilter.addEventListener("change", () => {
      const selectedPrice = priceFilter.value
        ? parseInt(priceFilter.value)
        : null;
      renderPlaces(selectedPrice);
    });
  }

  // Place Details Page
  if (window.location.pathname.includes("place.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = parseInt(urlParams.get("id"));
    renderPlaceDetails(placeId);
  }

  // Login Page
  if (window.location.pathname.includes("login.html")) {
    loginForm = document.getElementById("login-form");
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!email || !password) {
          alert("Please fill in all fields.");
          return;
        }

        alert("Login successful!");
        window.location.href = "index.html";
      });
    } else {
      console.error("Login form not found.");
    }

    const togglePassword = document.getElementById("toggle-password");
    if (togglePassword) {
      togglePassword.addEventListener("click", () => {
        const passwordField = document.getElementById("password");
        const type = passwordField.type === "password" ? "text" : "password";
        passwordField.type = type;
      });
    } else {
      console.error("Toggle password button not found.");
    }
  }

  // Register Page
  if (window.location.pathname.includes("register.html")) {
    const registerForm = document.getElementById("register-form");
    if (registerForm) {
      registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        // Collect form inputs
        const firstName = document.getElementById("first-name").value.trim();
        const lastName = document.getElementById("last-name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        // Basic validation
        if (!firstName || !lastName || !email || !password) {
          alert("Please fill in all fields.");
          return;
        }

        const userData = {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: password,
          is_admin: true,
        };

        try {
          // Send POST request to the API
          const response = await fetch(
            "http://127.0.0.1:5000/api/v1/users/users/",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );

          if (response.ok) {
            const result = await response.json();
            console.log("Registration successful:", result);
            window.location.href = "login.html";
          } else {
            const errorData = await response.json();
            alert(
              "Registration failed: " + (errorData.message || "Unknown error")
            );
          }
        } catch (error) {
          console.error("Error during registration:", error);
          alert("An error occurred. Please try again later.");
        }
      });
    }
  }
});
