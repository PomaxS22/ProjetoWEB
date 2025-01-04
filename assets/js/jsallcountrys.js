// URL da API que fornece dados de todos os países
const API_URL = "https://restcountries.com/v3.1/all";

// Formata a "currency" para aparecer corretamente
function formatarMoedas(currencies) {
  if (!currencies) return "N/A";
  return Object.values(currencies)
    .map((currency) => `${currency.name}`)
    .join(", ");
}

// Le o local storage para ver o paises favoritos
function obterFavoritos() {
  return JSON.parse(localStorage.getItem("favoriteCountries")) || [];
}

// Guarda os paises favoritos no local storage
function salvarFavoritos(favoritos) {
  localStorage.setItem("favoriteCountries", JSON.stringify(favoritos));
}

// Adiciona ou remove um país da lista de favoritos
function alternarFavorito(countryName) {
  let favoritos = obterFavoritos();
  const index = favoritos.indexOf(countryName);

  if (index === -1) {
    favoritos.push(countryName);
  } else {
    favoritos.splice(index, 1);
  }

  salvarFavoritos(favoritos);
  return favoritos;
}

$(document).ready(function () {
  let todosPaises = [];  // Guarda todos todos os paises da API
  let mostrandoApenasFavoritos = false;  // Controla se está mostrando apenas favoritos

  // Mostra os paises
  function exibirPaises(paises) {
    const $listaPaises = $("#countryList");
    $listaPaises.empty();
    const favoritos = obterFavoritos();

    // Cria um card para cada país
    paises.forEach((pais) => {
      const ehFavorito = favoritos.includes(pais.name.common);
      const classFavorito = ehFavorito ? "fas" : "far";

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
                        <strong>Capital:</strong> ${pais.capital ? pais.capital[0] : "N/A"}<br>
                        <strong>Continente:</strong> ${pais.region}<br>
                        <strong>Sub-região:</strong> ${pais.subregion}<br>
                        <strong>População:</strong> ${pais.population.toLocaleString()}<br>
                        <strong>Moeda:</strong> ${formatarMoedas(pais.currencies)}<br>
                    </p>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
                    <button class="favorite-btn btn btn-light rounded-circle"
                            onclick="manipularCliqueFavorito('${pais.name.common.replace(/'/g, "\\'")}')">
                        <i class="${classFavorito} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>`;
      $listaPaises.append(card);
    });
  }

  // Função global para lidar com cliques no botão de favorito
  window.manipularCliqueFavorito = function(nomeDoPais) {
    const favoritos = alternarFavorito(nomeDoPais);
    if (mostrandoApenasFavoritos) {
      const paisesFiltrados = todosPaises.filter((pais) =>
        favoritos.includes(pais.name.common)
      );
      exibirPaises(paisesFiltrados);
    } else {
      exibirPaises(todosPaises);
    }
  };

  // Configura o botão de alternar entre todos os países e apenas favoritos
  $("#toggleFavorites").on("click", function () {
    mostrandoApenasFavoritos = !mostrandoApenasFavoritos;
    $(this).text(mostrandoApenasFavoritos ? "Mostrar Todos" : "Mostrar Favoritos");

    if (mostrandoApenasFavoritos) {
      const favoritos = obterFavoritos();
      const paisesFiltrados = todosPaises.filter((pais) =>
        favoritos.includes(pais.name.common)
      );
      exibirPaises(paisesFiltrados);
    } else {
      exibirPaises(todosPaises);
    }
  });

  // Função que carrega todos os países da API
  function carregarPaises() {
    $("#loading").show();
    $("#countryList").hide();

    $.ajax({
      url: API_URL,
      method: "GET",
      success: function(dados) {
        // Ordena os países alfabeticamente
        todosPaises = dados.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        exibirPaises(todosPaises);
        $("#loading").hide();
        $("#countryList").fadeIn();
      },
      error: function(erro) {
        console.error("Erro", erro);
        $("#loading").hide();
      },
    });
  }

  // Configura a funcionalidade de busca
  $("#searchCountry").on("input", function () {
    const termoBusca = $(this).val().toLowerCase();
    const favoritos = obterFavoritos();
    // Filtra países baseado no termo de busca
    let paisesFiltrados = todosPaises.filter((pais) =>
      pais.name.common.toLowerCase().includes(termoBusca)
    );

    // Aplica filtro de favoritos se necessário
    if (mostrandoApenasFavoritos) {
      paisesFiltrados = paisesFiltrados.filter((pais) =>
        favoritos.includes(pais.name.common)
      );
    }

    exibirPaises(paisesFiltrados);
  });

  // Carrega os países quando a página inicializa
  carregarPaises();
});