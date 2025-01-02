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
                // Set fixed dimensions for all flag images
                cardImage.style.width = '100%';
                cardImage.style.height = '200px';  // You can adjust this value
                cardImage.style.objectFit = 'cover';
                
                cardBody.innerHTML = `
                    <h5 class="card-title text-center">${country.name.common}</h5>
                    <a href="#" class="btn btn-primary d-flex justify-content-center">MAIS INFORMAÇÕES</a>
                `;
            });
        })
        .catch(error => console.error('Error:', error));
}

document.addEventListener('DOMContentLoaded', getRandomCountries);