console.log("Script loaded successfully");

// ---------------------------------------------
// Variables
// ---------------------------------------------
let places = []; // Liste des places récupérées via l'API
const placeList = document.getElementById("places-list");
const priceFilter = document.getElementById("price-filter");

// ---------------------------------------------
// Helper Functions
// ---------------------------------------------

// Fonction pour remplir le filtre de prix avec les prix uniques
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

// Fonction pour récupérer les données des places depuis l'API
async function fetchPlaces() {
  try {
    const authToken = getCookie("authToken"); // Token d'authentification

    if (!authToken) {
      alert("You are not logged in!");
      window.location.href = "login.html";
      return;
    }

    const response = await fetch("http://127.0.0.1:5000/api/v1/places/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data); // Vérifie que toutes les informations des places sont bien là
      places = data; // On stocke les places dans la variable globale
      renderPlaces(); // On appelle renderPlaces pour afficher les données
      populatePriceFilter(); // Appel à populatePriceFilter après récupération des places
    } else {
      alert("Failed to fetch places. Please try again.");
    }
  } catch (error) {
    console.error("Error fetching places:", error);
    alert("An error occurred while fetching places.");
  }
}

// Fonction pour afficher les places
function renderPlaces(filterPrice = null) {
  placeList.innerHTML = ""; // On vide la liste avant de la remplir

  const filteredPlaces = filterPrice
    ? places.filter((place) => place.price <= filterPrice)
    : places;

  const sortedPlaces = filteredPlaces.sort((a, b) => a.price - b.price);

  sortedPlaces.forEach((place) => {
    const card = document.createElement("div");
    card.classList.add("place-card");

    const title = document.createElement("h3");
    title.textContent = place.title || "No title available"; // Si title est manquant, affiche un message par défaut

    const price = document.createElement("p");
    price.textContent = place.price
      ? `Price per night: $${place.price}`
      : "Price not available"; // Si price est manquant, affiche un message par défaut

    const description = document.createElement("p");
    description.textContent = place.description || "No description available"; // Si description est manquant, affiche un message par défaut

    const detailsButton = document.createElement("button");
    detailsButton.classList.add("details-button");
    detailsButton.textContent = "View Details";
    detailsButton.onclick = () => {
      if (!place.id) {
        console.error("Missing place ID for View Details button.");
        return;
      }
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

// Fonction pour afficher les détails d'une place
async function renderPlaceDetails(placeId) {
  if (!placeId) {
    console.error("Invalid place ID.");
    alert("Invalid place ID.");
    return;
  }

  try {
    const authToken = getCookie("authToken");
    const response = await fetch(
      `http://127.0.0.1:5000/api/v1/places/${placeId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const place = await response.json();
      console.log(place); // Vérifie que les données sont bien récupérées

      const placeDetails = document.getElementById("place-details");

      placeDetails.innerHTML = `
        <h2>${place.title || "No title available"}</h2>
        <p><strong>Price per night:</strong> $${place.price || "N/A"}</p>
        <p><strong>Latitude:</strong> ${place.latitude || "N/A"}</p>
        <p><strong>Longitude:</strong> ${place.longitude || "N/A"}</p>
        <p><strong>Description:</strong> ${
          place.description || "No description available"
        }</p>
      `;
    } else {
      console.error("Failed to fetch place details");
      alert("Place details could not be fetched.");
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    alert("An error occurred while fetching place details.");
  }
}

// Fonction pour récupérer un cookie
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// ---------------------------------------------
// Event Listeners
// ---------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  if (!getCookie("authToken")) {
    alert("You must be logged in to view this page.");
    window.location.href = "login.html";
    return;
  }

  if (window.location.pathname.includes("index.html")) {
    fetchPlaces(); // Appel à l'API pour récupérer les places

    priceFilter.addEventListener("change", () => {
      const selectedPrice = priceFilter.value
        ? parseInt(priceFilter.value)
        : null;
      renderPlaces(selectedPrice);
    });
  }

  if (window.location.pathname.includes("place.html")) {
    const urlParams = new URLSearchParams(window.location.search);
    const placeId = urlParams.get("id");

    if (!placeId) {
      console.error("Invalid or missing place ID in URL.");
      alert("Invalid place ID. Redirecting to the homepage.");
      window.location.href = "index.html";
      return;
    }

    renderPlaceDetails(placeId); // Appel de renderPlaceDetails pour afficher les détails
  }
});
