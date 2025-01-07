const API_URL = 'https://restcountries.com/v3.1/all';

// Busca e exibe 3 países aleatórios na página inicial
function obterPaisesAleatorios() {
    // Busca todos os países da API
    $.ajax({
        url: API_URL,
        method: 'GET',
        success: function(dados) {
            // Seleciona 3 países aleatoriamente
            const paisesAleatorios = dados.sort(() => Math.random() - 0.5).slice(0, 3);
            
            // Seleciona todos os cards da página
            const cards = document.querySelectorAll('.card');
            
            // Para cada país selecionado, atualiza um card
            paisesAleatorios.forEach((pais, index) => {
                const card = cards[index];
                const imagemCard = card.querySelector('.card-img-top');
                const corpoCard = card.querySelector('.card-body');
                
                // Atualiza a imagem da bandeira
                imagemCard.src = pais.flags.png;
                imagemCard.alt = `Bandeira de ${pais.name.common}`;
                // Tamnho das bandeiras dos países fixo
                imagemCard.style.width = '100%';
                imagemCard.style.height = '200px'; 
                imagemCard.style.objectFit = 'cover';
                
                // Atualiza o card com o nome do país e um botão
                corpoCard.innerHTML = `
                    <h5 class="card-title text-center">${pais.name.common}</h5>
                    <a href="listapaises.html" class="btn btn-primary d-flex justify-content-center">Mais Informações</a>
                `;
            });
        },
        error: function(erro) {
            console.error('Algo está errado:', erro);
        }
    });
}

$(document).ready(function() {
    obterPaisesAleatorios();
});
