const API_URL = "https://restcountries.com/v3.1/all";

// Function to get favorites from localStorage
function getFavorites() {
  return JSON.parse(localStorage.getItem("favoriteCountries")) || [];
}

// Function to save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem("favoriteCountries", JSON.stringify(favorites));
}

// Function to toggle favorite status
function toggleFavorite(countryName) {
  let favorites = getFavorites();
  const index = favorites.indexOf(countryName);

  if (index === -1) {
    favorites.push(countryName);
  } else {
    favorites.splice(index, 1);
  }

  saveFavorites(favorites);
  return favorites;
}

function formatCurrencies(currencies) {
  if (!currencies) return "N/A";
  return Object.values(currencies)
    .map((currency) => `${currency.name}`)
    .join(", ");
}

$(document).ready(function () {
  let allCountries = [];
  let showingFavoritesOnly = false;

  function displayCountries(countries) {
    const $countryList = $("#countryList");
    $countryList.empty();
    const favorites = getFavorites();

    countries.forEach((country) => {
      const isFavorite = favorites.includes(country.name.common);
      const favoriteClass = isFavorite ? "fas" : "far";

      const card = `
    <div class="col-md-4 mb-4 country-card">
        <div class="card h-100">
            <img src="${country.flags.png}" 
                 class="card-img-top" 
                 alt="Flag of ${country.name.common}"
                 style="height: 200px; object-fit: cover;">
            <div class="card-body">
                <h5 class="card-title text-center">${country.name.common}</h5>
                <p class="card-text">
                    <strong>Capital:</strong> ${
                      country.capital ? country.capital[0] : "N/A"
                    }<br>
                    <strong>Continente:</strong> ${country.region}<br>
                    <strong>Sub-região:</strong> ${country.subregion}<br>
                    <strong>População:</strong> ${country.population.toLocaleString()}<br>
                    <strong>Moeda:</strong> ${formatCurrencies(
                      country.currencies
                    )}<br>
                </p>
            </div>
            <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
                <button class="favorite-btn btn btn-light rounded-circle"
                        onclick="handleFavoriteClick('${country.name.common.replace(
                          /'/g,
                          "\\'"
                        )}')">
                    <i class="${favoriteClass} fa-heart"></i>
                </button>
            </div>
        </div>
    </div>
`;
      $countryList.append(card);
    });
  }

  // Add this function to handle favorite button clicks
  window.handleFavoriteClick = function (countryName) {
    const favorites = toggleFavorite(countryName);
    if (showingFavoritesOnly) {
      const filteredCountries = allCountries.filter((country) =>
        favorites.includes(country.name.common)
      );
      displayCountries(filteredCountries);
    } else {
      displayCountries(allCountries);
    }
  };

  // Add toggle for favorites filter
  $("#toggleFavorites").on("click", function () {
    showingFavoritesOnly = !showingFavoritesOnly;
    $(this).text(showingFavoritesOnly ? "Show All" : "Show Favorites");

    if (showingFavoritesOnly) {
      const favorites = getFavorites();
      const filteredCountries = allCountries.filter((country) =>
        favorites.includes(country.name.common)
      );
      displayCountries(filteredCountries);
    } else {
      displayCountries(allCountries);
    }
  });

  function loadCountries() {
    $("#loading").show();
    $("#countryList").hide();

    $.ajax({
      url: API_URL,
      method: "GET",
      success: function (data) {
        allCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        displayCountries(allCountries);
        $("#loading").hide();
        $("#countryList").fadeIn();
      },
      error: function (error) {
        console.error("Erro", error);
        $("#loading").hide();
      },
    });
  }

  $("#searchCountry").on("input", function () {
    const searchTerm = $(this).val().toLowerCase();
    const favorites = getFavorites();
    let filteredCountries = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(searchTerm)
    );

    if (showingFavoritesOnly) {
      filteredCountries = filteredCountries.filter((country) =>
        favorites.includes(country.name.common)
      );
    }

    displayCountries(filteredCountries);
  });

  loadCountries();
});
