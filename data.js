const countryInput = document.getElementById("country");
document.querySelector("button").addEventListener("click", function () {
  document.querySelector("input").value = "";
});

countryInput.addEventListener("keypress", function (event) {
  //
  if (event.key === "Enter") {
    event.preventDefault();
    handleSearch();
    document.querySelector("input").value = "";

    countryInput.blur();
  }
});

async function fetchFullCountryName(code) {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    const country = data.find((c) => c.cca3 === code);
    return country ? country.name.common : code;
  } catch (error) {
    return code;
  }
}

async function getStates(countryName) {
  try {
    const response = await fetch(
      "https://countriesnow.space/api/v0.1/countries/states"
    );
    const data = await response.json();
    const countryData = data.data.find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    return countryData ? countryData.states.map((s) => s.name) : [];
  } catch (error) {
    return [];
  }
}

async function handleSearch() {
  const countryInput = document.getElementById("country");
  const country = countryInput.value.trim();
  const loading = document.getElementById("loading");
  const errorMessage = document.getElementById("error-message");
  const detailsContainer = document.getElementById("details-container");

  detailsContainer.scrollTop = "0";

  errorMessage.style.display = "none";
  detailsContainer.style.display = "none";
  loading.style.display = "block";

  try {
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${country}`
    );
    if (!response.ok) throw new Error("Country not found");

    const data = await response.json();
    const countryDetails = data[0];

    console.log(countryDetails);

    let borders = [];
    if (countryDetails.borders) {
      borders = await Promise.all(
        countryDetails.borders.map(
          async (code) => await fetchFullCountryName(code)
        )
      );
    }

    const states = await getStates(countryDetails.name.common);

    const languagesList = countryDetails.languages
      ? Object.values(countryDetails.languages).join(", ")
      : "N/A"; // Display the languages as a list

    detailsContainer.innerHTML = `
      <h2>${countryDetails.name.common}</h2>
      <p><strong>Capital:</strong> ${
        countryDetails.capital ? countryDetails.capital[0] : "N/A"
      }</p>
      <img src="${countryDetails.flags.svg}" alt="Flag of ${
      countryDetails.name.common
    }" width="150">
      <p><strong>Population:</strong> ${
        countryDetails.population / 10000000
      } CR</p>
      <p><strong>Region:</strong> ${countryDetails.region}</p>
      <p><strong>Area:</strong> ${countryDetails.area} KM² </p>
      <p><strong>Latitude:</strong> ${countryDetails.latlng[0]}</p>
      <p><strong>Longitude:</strong> ${countryDetails.latlng[1]}</p>
      <p><strong>Continent:</strong> ${countryDetails.continents}</p>
      <p><strong>Currency:</strong> ${
        Object.values(countryDetails.currencies)[0].name
      } (${Object.values(countryDetails.currencies)[0].symbol})</p>
      <p><strong>States:</strong></p>
      <ul>${
        states.length > 0
          ? states.map((s) => `<li>${s}</li>`).join("")
          : "<li>N/A</li>"
      }</ul>
      <p><strong>Borders:</strong></p>
      <ul>${
        borders.length > 0
          ? borders.map((b) => `<li>${b}</li>`).join("")
          : "<li>None</li>"
      }</ul>
      <p><strong>Languages:</strong></p>
      <ul>${
        languagesList.length > 0
          ? languagesList
              .split(", ")
              .map((l) => `<li>${l}</li>`)
              .join("")
          : "<li>N/A</li>"
      }</ul>
      <p><strong>Maps:</strong></p>
      <div style="text-decoration:none; overflow:hidden;max-width:100%;width:500px;height:500px;">
          <div id="embed-map-canvas" style="height:100%; width:100%;max-width:100%;">
              <iframe style="height:100%;width:100%;border:0;" frameborder="0" src="https://www.google.com/maps/embed/v1/place?q=${
                countryDetails.name.common
              }&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8">
              </iframe>
          </div>
      </div>
      `;

    detailsContainer.style.display = "block";
  } catch (error) {
    errorMessage.style.display = "block";
  } finally {
    loading.style.display = "none";
  }
}
/*
// For smaller screens (tablets) 
@media screen and (max-width: 1024px) {
  .container {
    width: 90%;
  }
}

// For mobile screens 
@media screen and (max-width: 768px) {
  .container {
    width: 95%;
    padding: 10px;
  }
}

// For very small screens 
@media screen and (max-width: 480px) {
  .container {
    width: 100%;
    padding: 5px;
  }
}

*/