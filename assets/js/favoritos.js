const API_URL = 'https://restcountries.com/v3.1/all';

function formatCurrencies(currencies) {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
        .map(currency => `${currency.name}`)
        .join(', ');
}

function getFavorites() {
    return JSON.parse(localStorage.getItem('favoriteCountries')) || [];
}

function saveFavorites(favorites) {
    localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
}

function toggleFavorite(countryName) {
    let favorites = getFavorites();
    const index = favorites.indexOf(countryName);
    
    if (index === -1) {
        favorites.push(countryName);
    } else {
        favorites.splice(index, 1);
    }
    
    saveFavorites(favorites);
    displayFavoriteCountries(); // Refresh the display after toggling
}

function displayFavoriteCountries() {
    const favorites = getFavorites();
    const $favoritesList = $('#favoritesList');
    const $noFavorites = $('#noFavorites');
    
    if (favorites.length === 0) {
        $favoritesList.hide();
        $noFavorites.removeClass('d-none');
        return;
    }
    
    $favoritesList.empty();
    $noFavorites.addClass('d-none');
    $favoritesList.show();

    $.ajax({
        url: API_URL,
        method: 'GET',
        success: function(allCountries) {
            const favoriteCountries = allCountries.filter(country => 
                favorites.includes(country.name.common)
            );

            favoriteCountries.forEach(country => {
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
                                    <strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}<br>
                                    <strong>Continente:</strong> ${country.region}<br>
                                    <strong>Sub-região:</strong> ${country.subregion}<br>
                                    <strong>População:</strong> ${country.population.toLocaleString()}<br>
                                    <strong>Moeda:</strong> ${formatCurrencies(country.currencies)}<br>
                                </p>
                            </div>
                            <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
                                <button class="favorite-btn btn btn-light rounded-circle"
                                        onclick="toggleFavorite('${country.name.common.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                $favoritesList.append(card);
            });
        },
        error: function(error) {
            console.error('Error:', error);
            $favoritesList.html('<p class="text-center">Erro ao carregar países favoritos.</p>');
        }
    });
}

$(document).ready(function() {
    displayFavoriteCountries();
});

// Add the scroll-to-top functionality
let myBtn = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        myBtn.classList.add("visible");
    } else {
        myBtn.classList.remove("visible");
    }
}

function topFunction() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}