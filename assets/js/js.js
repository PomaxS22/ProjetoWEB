const API_URL = 'https://restcountries.com/v3.1/all';

function getRandomCountries() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const randomCountries = data.sort(() => Math.random() - 0.5).slice(0, 3);
            
            const cards = document.querySelectorAll('.card');
            
            randomCountries.forEach((country, index) => {
                const card = cards[index];
                const cardImage = card.querySelector('.card-img-top');
                const cardBody = card.querySelector('.card-body');
                
                cardImage.src = country.flags.png;
                cardImage.alt = `Flag of ${country.name.common}`;
                // Fixa o tamanho das bandeiras
                cardImage.style.width = '100%';
                cardImage.style.height = '200px'; 
                cardImage.style.objectFit = 'cover';
                
                cardBody.innerHTML = `
                    <h5 class="card-title text-center">${country.name.common}</h5>
                    <a href="#" class="btn btn-primary d-flex justify-content-center">MAIS INFORMAÇÕES</a>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

//document.addEventListener('DOMContentLoaded', getRandomCountries, listAllCountries);


$(document).ready(function() {
    const API_URL = 'https://restcountries.com/v3.1/all';
    let allCountries = []; // Store all countries for filtering

    function displayCountries(countries) {
        const $countryList = $('#countryList');
        $countryList.empty(); // Clear existing cards

        countries.forEach(country => {
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
                                <strong>Region:</strong> ${country.region}<br>
                                <strong>Population:</strong> ${country.population.toLocaleString()}
                            </p>
                            <div class="text-center">
                                <a href="#" class="btn btn-primary">MAIS INFORMAÇÕES</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $countryList.append(card);
        });
    }

    // Fetch and display countries
    function loadCountries() {
        $('#loading').show();
        $('#countryList').hide();

        $.ajax({
            url: API_URL,
            method: 'GET',
            success: function(data) {
                allCountries = data.sort((a, b) => 
                    a.name.common.localeCompare(b.name.common)
                );
                displayCountries(allCountries);
                $('#loading').hide();
                $('#countryList').fadeIn();
            },
            error: function(error) {
                console.error('Error fetching countries:', error);
                $('#loading').hide();
                $('#countryList').html('<div class="col-12 text-center">Error loading countries. Please try again.</div>');
            }
        });
    }

    // Funcão de Search
    $('#searchCountry').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredCountries = allCountries.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm) ||
            country.region.toLowerCase().includes(searchTerm) ||
            (country.capital && country.capital[0].toLowerCase().includes(searchTerm))
        );
        displayCountries(filteredCountries);
    });

    // Loading
    loadCountries();
});

document.addEventListener('DOMContentLoaded', getRandomCountries, listAllCountries);