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
  defaultOption.textContent = "All prices";
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

  filteredPlaces.forEach((place) => {
    const card = document.createElement("div");
    card.classList.add("place-card");

    const title = document.createElement("h3");
    title.textContent = place.name;

    const price = document.createElement("p");
    price.textContent = `$${place.price} per night`;

    const description = document.createElement("p");
    description.textContent = place.description;

    const detailsButton = document.createElement("button");
    detailsButton.classList.add("details-button");
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

priceFilter.addEventListener("change", () => {
  const selectedPrice = priceFilter.value ? parseInt(priceFilter.value) : null;
  renderPlaces(selectedPrice);
});

document.addEventListener("DOMContentLoaded", () => {
  populatePriceFilter();
  renderPlaces();
});
