document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");
  const submitButton = document.querySelector(".submit-button");

  submitButton.addEventListener("click", (event) => {
    console.log("Bouton Register cliqué");

    // Empêcher le rechargement automatique
    event.preventDefault();

    // Récupérer les valeurs des champs du formulaire
    const firstName = document.getElementById("first-name").value.trim();
    const lastName = document.getElementById("last-name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    console.log("Données utilisateur préparées", {
      firstName,
      lastName,
      email,
      password,
    });

    // Validation des données
    if (!firstName || !lastName || !email || !password) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const userData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      is_admin: true,
    };

    // Envoi des données à l'API
    console.log("Envoi des données à l'API...");
    fetch("http://127.0.0.1:5000/api/v1/users/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(
              `Erreur HTTP ${response.status}: ${
                errorData.message || "Erreur inconnue"
              }`
            );
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Utilisateur créé :", data);
        // Traitement en cas de succès
        alert(
          "Inscription réussie ! Cliquez sur le bouton Login en bas de la page pour vous connecter."
        );
      })
      .catch((error) => {
        console.error("Erreur lors de l'inscription :", error);
        alert("Une erreur s'est produite. Détails : " + error.message);
      });

    console.log("Fin du traitement du formulaire");
  });
});
