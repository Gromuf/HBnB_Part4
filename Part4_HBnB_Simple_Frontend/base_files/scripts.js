console.log("Script loaded successfully");
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

const placeList = document.getElementById("places-list");
const priceFilter = document.getElementById("price-filter");

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

document.addEventListener("DOMContentLoaded", () => {
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
});
