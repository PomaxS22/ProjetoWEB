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
                    <a href="listapaises.html" class="btn btn-primary d-flex justify-content-center">Mais Informações</a>
                `;
            });
        })
        .catch(error => console.error('Erro', error));
}

document.addEventListener('DOMContentLoaded', getRandomCountries);

