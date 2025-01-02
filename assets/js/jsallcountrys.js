const API_URL = 'https://restcountries.com/v3.1/all';

$(document).ready(function() {
    let allCountries = []; // Armazena todos os paises

    function displayCountries(countries) {
        const $countryList = $('#countryList');
        $countryList.empty(); // Limpa os cards todos

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
                                <strong>Continente:</strong> ${country.region}<br>
                                <strong>População:</strong> ${country.population.toLocaleString()}
                            </p>
                            <div class="text-center">
                                <a href="#" class="btn btn-primary">Mais Informação</a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            $countryList.append(card);
        });
    }

    // Procura e lista todos os paises
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
                console.error('Erro', error);
                $('#loading').hide();
            }
        });
    }

    // Funcão de Search
    $('#searchCountry').on('input', function() {
        const searchTerm = $(this).val().toLowerCase();
        const filteredCountries = allCountries.filter(country => 
            country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
    });

    // Loading
    loadCountries();
});

document.addEventListener('DOMContentLoaded', listAllCountries);