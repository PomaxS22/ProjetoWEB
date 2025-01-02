const API_URL = 'https://restcountries.com/v3.1/all';

function getRandomCountries() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            // Shuffle array and get first 3 countries
            const randomCountries = data.sort(() => Math.random() - 0.5).slice(0, 3);
            
            // Get all cards
            const cards = document.querySelectorAll('.card');
            
            // Update each card with country data
            randomCountries.forEach((country, index) => {
                const card = cards[index];
                const cardImage = card.querySelector('.card-img-top');
                const cardBody = card.querySelector('.card-body');
                
                // Update image and alt text
                cardImage.src = country.flags.png;
                cardImage.alt = `Flag of ${country.name.common}`;
                
                // Update card body with country name
                cardBody.innerHTML = `
                    <h5 class="card-title text-center">${country.name.common}</h5>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', getRandomCountries);