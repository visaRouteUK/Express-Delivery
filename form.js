let formData = {};

document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("myForm")) {
    const form = document.getElementById("myForm");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const country = document.getElementById("country").value;
      const favoriteColor = document.getElementById("favorite-color").value;
      formData = { name, email, country, favoriteColor };
      localStorage.setItem("formData", JSON.stringify(formData));
      window.location.href = "display.html";
    });
  } else if (document.getElementById("displayName")) {
    const storedData = localStorage.getItem("formData");
    if (storedData) {
      formData = JSON.parse(storedData);
      document.getElementById("displayName").textContent = `Name: ${formData.name}`;
      document.getElementById("displayEmail").textContent = `Email: ${formData.email}`;
      document.getElementById("displayCountry").textContent = `Country: ${formData.country}`;
      document.getElementById("displayFavoriteColor").textContent = `Favorite Color: ${formData.favoriteColor}`;
    }
  }
});

