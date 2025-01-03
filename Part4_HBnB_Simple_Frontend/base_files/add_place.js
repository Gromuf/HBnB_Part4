document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-place-form");
  const ownerIdInput = document.getElementById("owner_id");

  // Fonction pour récupérer la valeur d'un cookie par son nom
  function getCookie(name) {
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="));
    return value ? value.split("=")[1] : null;
  }

  // Récupérer le userId depuis les cookies
  const userId = getCookie("userId");

  if (userId) {
    // Si l'ID de l'utilisateur existe dans les cookies, on le met dans le champ owner_id
    ownerIdInput.value = userId;
    ownerIdInput.disabled = true; // Désactiver le champ pour éviter la modification
  } else {
    alert("User ID not found in cookies. Please log in.");
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupérer les données du formulaire
    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const latitude = parseFloat(document.getElementById("latitude").value);
    const longitude = parseFloat(document.getElementById("longitude").value);
    const amenities = document
      .getElementById("amenities")
      .value.split(",")
      .map((item) => item.trim());

    // Préparer les données à envoyer
    const placeData = {
      title,
      description,
      price,
      latitude,
      longitude,
      owner_id: ownerIdInput.value, // Utiliser l'ID de l'utilisateur depuis les cookies
      amenities,
    };

    try {
      // Envoyer une requête POST à l'API
      const authToken = getCookie("authToken"); // Récupérer le token d'authentification

      if (!authToken) {
        alert("Authentication token not found. Please log in.");
        return;
      }

      const response = await fetch("http://127.0.0.1:5000/api/v1/places/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(placeData),
      });

      if (response.ok) {
        alert("Place added successfully!");
        window.location.href = "index.html"; // Redirige vers la page principale
      } else {
        const errorData = await response.json();
        alert("Failed to add place: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error while adding place:", error);
      alert("An error occurred. Please try again.");
    }
  });
});
