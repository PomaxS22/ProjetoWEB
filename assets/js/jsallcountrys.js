const API_URL = 'https://restcountries.com/v3.1/all';

//Funcão para definir como as Currencys aparecem
function formatCurrencies(currencies) {
    if (!currencies) return 'N/A';
    return Object.values(currencies)
        .map(currency => `${currency.name}`)
        .join(', ');
}

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
                                <strong>Sub-região:</strong> ${country.subregion}<br>
                                <strong>População:</strong> ${country.population.toLocaleString()}<br>
                                <strong>Moeda:</strong> ${formatCurrencies(country.currencies)}<br>
                            </p>
                        </div>
                    </div>
                </div
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


let myBtn = document.getElementById("myBtn");

// When user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    myBtn.classList.add("visible");
  } else {
    myBtn.classList.remove("visible");
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  // Smooth scroll to top
  window.scrollTo({
    top: 0
  });
}