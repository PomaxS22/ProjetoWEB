const API_URL = 'https://restcountries.com/v3.1/all';

// Formata a "currency" para aparecer corretamente
function formatMoedas(currencies) {
    if (!currencies) return "N/A";
    return Object.values(currencies)
      .map((currency) => `${currency.name}`)
  }
  

// Obtém a lista de países favoritos do localStorage se estiver vazio retorna um array vazio
function obterFav() {
    return JSON.parse(localStorage.getItem('favoriteCountries')) || [];
}

// Salva a lista de países favoritos no localStorage
function salvarFav(favorites) {
    localStorage.setItem('favoriteCountries', JSON.stringify(favorites));
}

// Adiciona ou remove um país da lista de favoritos
function alternarFavorito(countryName) {
    let favoritos = obterFav();
    const index = favoritos.indexOf(countryName);
    
    if (index === -1) {
        favoritos.push(countryName);
    } else {
        favoritos.splice(index, 1);
    }
    
    salvarFav(favoritos);
    exibirPaisesFavoritos(); // Atualiza a exibição após a alteração
}

// Funcao que mostra os paises
function exibirPaisesFavoritos() {
    const favoritos = obterFav();
    const $listaFavoritos = $('#favoritesList');
    const $semFavoritos = $('#noFavorites');
    
    // Se não há favoritos, e mostra botao para ver todos os paises "Class d-none no HTML"
    if (favoritos.length === 0) {
        $listaFavoritos.hide();
        $semFavoritos.removeClass('d-none');
        return;
    }
    
    // Limpa a lista atual e prepara para mostrar os favoritos
    $listaFavoritos.empty();
    $semFavoritos.addClass('d-none');
    $listaFavoritos.show();

    // Busca os dados de todos os países e filtra os favoritos
    $.ajax({
        url: API_URL,
        method: 'GET',
        success: function(todosPaises) {
            // Filtra os países favoritos
            const paisesFavoritos = todosPaises.filter(pais => 
                favoritos.includes(pais.name.common)
            );

            // Card de cada pais favorito
            paisesFavoritos.forEach(pais => {
                const card = `
                    <div class="col-md-4 mb-4 country-card">
                        <div class="card h-100">
                            <img src="${pais.flags.png}" 
                                 class="card-img-top" 
                                 alt="Bandeira de ${pais.name.common}"
                                 style="height: 200px; object-fit: cover;">
                            <div class="card-body">
                                <h5 class="card-title text-center">${pais.name.common}</h5>
                                <p class="card-text">
                                    <strong>Capital:</strong> ${pais.capital ? pais.capital[0] : 'N/A'}<br>
                                    <strong>Continente:</strong> ${pais.region}<br>
                                    <strong>Sub-região:</strong> ${pais.subregion}<br>
                                    <strong>População:</strong> ${pais.population.toLocaleString()}<br>
                                    <strong>Moeda:</strong> ${formatMoedas(pais.currencies)}<br>
                                </p>
                            </div>
                            <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
                                <button class="favorite-btn btn btn-light rounded-circle"
                                        onclick="alternarFavorito('${pais.name.common.replace(/'/g, "\\'")}')">
                                    <i class="fas fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                $listaFavoritos.append(card);
            });
        },
        error: function(erro) {
            console.error('Algo está mal', erro);
        }
    });
}

// Vai buscar o botao ao HTML
let meuBotao = document.getElementById("myBtn");

// Mostra o botao de scroll quando se desce 20px para baixo da parte superior da pagina 
window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        meuBotao.classList.add("visible");
    } else {
        meuBotao.classList.remove("visible");  
    }
}

// Mostra os paises favoritos quando a pagina carrega
$(document).ready(function() {
    exibirPaisesFavoritos();
});