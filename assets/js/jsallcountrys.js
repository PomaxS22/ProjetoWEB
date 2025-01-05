const API_URL = "https://restcountries.com/v3.1/all";

// Formata a "currency" para aparecer corretamente
function formatMoedas(currencies) {
  if (!currencies) return "N/A";
  return Object.values(currencies)
    .map((currency) => `${currency.name}`)
    .join(", ");  // Adiciona a junção das moedas com vírgula
}

// Le o local storage para ver o paises favoritos
function obterFavoritos() {
  try {  // Adiciona tratamento de erro
    return JSON.parse(localStorage.getItem("favoriteCountries")) || [];
  } catch (error) {
    console.error("Erro ao ler favoritos:", error);
    return [];
  }
}

// Guarda os paises favoritos no local storage
function salvarFavoritos(favoritos) {
  try {  // Adiciona tratamento de erro
    localStorage.setItem("favoriteCountries", JSON.stringify(favoritos));
  } catch (error) {
    console.error("Erro ao salvar favoritos:", error);
  }
}

// Adiciona ou remove um país da lista de favoritos
function alternarFav(countryName) {
  if (!countryName) return obterFavoritos();
  
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

// Mostra apenas os países favoritos
function exibirPaisesFavoritos() {
  const favoritos = obterFavoritos();
  const paisesFiltrados = todosPaises.filter((pais) =>
    favoritos.includes(pais.name.common)
  );
  exibirPaises(paisesFiltrados);
  mostrandoApenasFavoritos = true;
}

$(document).ready(function () {
  let todosPaises = [];  // Guarda todos todos os paises da API
  let mostrandoApenasFavoritos = false;  // Ve se esta a mostrar apenas os favoritos

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
                        <strong>Continente:</strong> ${pais.region || "N/A"}<br>
                        <strong>Sub-região:</strong> ${pais.subregion || "N/A"}<br>
                        <strong>População:</strong> ${pais.population.toLocaleString()}<br>
                        <strong>Moeda:</strong> ${formatMoedas(pais.currencies)}<br>
                    </p>
                </div>
                <div class="card-footer bg-transparent border-0 d-flex justify-content-end">
                    <button class="favorite-btn btn btn-light rounded-circle"
                            onclick="CliqueFav('${pais.name.common.replace(/'/g, "\\'")}')">
                        <i class="${classFavorito} fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>`;
      $listaPaises.append(card);
    });
  }

  // Função global para lidar com cliques no botão de favorito
  window.CliqueFav = function(nomeDoPais) {
    const favoritos = alternarFav(nomeDoPais);
    if (mostrandoApenasFavoritos) {
      const paisesFiltrados = todosPaises.filter((pais) =>
        favoritos.includes(pais.name.common)
      );
      exibirPaises(paisesFiltrados);
    } else {
      exibirPaises(todosPaises);
    }
  };

  // Função que carrega todos os países da API
  function carregarPaises() {
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
        $("#countryList").show();  // Corrige a operação de mostrar
      },
      error: function(erro) {
        console.error("Erro ao carregar países:", erro);
        $("#countryList")
          .html('<div class="alert alert-danger">Erro ao carregar países. Por favor, tente novamente mais tarde.</div>')
          .show();
      },
    });
  }

  // Barra de pesquisa para filtrar países
  $("#searchCountry").on("input", function () {
    const termoBusca = $(this).val().toLowerCase();
    let paisesFiltrados = todosPaises.filter((pais) =>
      pais.name.common.toLowerCase().includes(termoBusca)
    );
    exibirPaises(paisesFiltrados);
  });

  // Carrega os países quando a página inicializa
  carregarPaises();
});

// Vai buscar o botao ao HTML
let meuBotao = document.getElementById("myBtn");

window.onscroll = function() {scrollFunction()};
function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        meuBotao.classList.add("visible");
    } else {
        meuBotao.classList.remove("visible");  
    }
}

function voltarAoTopo() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}