const dataName = "data-name";
const dataSynonyms = "data-synonyms";
const dataMainIngredients = "data-main-ingredients";

function loadRecipesFromLocalStorage() {
  const recipes = document.getElementById("recipes");
  let recipesTotal = 0;
  let loaded = localStorage.getItem("recepty");

  if (loaded) {
    loaded = JSON.parse(loaded);
    recipes.innerHTML = "";

    loaded.forEach((recipe) => {
      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");
      recipeDiv.setAttribute(dataSynonyms, recipe.synonyms);

      //vygeneruju hlavní ingredience
      let mainIngredients = [];
      if (recipe.components) {
        recipe.components.forEach((component) => {
          component.ingredients.forEach((ingredient) => {
            if (ingredient.isMain) {
              mainIngredients.push(ingredient.name);
            }
          });
        });
      } else if (recipe.ingredients) {
        recipe.ingredients.forEach((ingredient) => {
          if (ingredient.isMain) {
            mainIngredients.push(ingredient.name);
          }
        });
      }

      recipeDiv.setAttribute(dataMainIngredients, mainIngredients.toString());
      recipeDiv.setAttribute(dataName, recipe.name);

      // Vytvoření nadpisu pro název receptu
      const recipeName = document.createElement("h3");
      recipeName.textContent = recipe.name;
      recipeDiv.appendChild(recipeName);

      // Vytvoření odkazu s ID receptu
      const detailLink = document.createElement("a");
      detailLink.textContent = "Detail";
      detailLink.href="#";
      detailLink.setAttribute("data-action", "view")
      detailLink.setAttribute("data-id", recipe.id);
      recipeDiv.appendChild(detailLink);

      const editLink = document.createElement("a");
      editLink.textContent = "Upravit";
            editLink.href="#";
      editLink.setAttribute("data-action", "edit")
      editLink.setAttribute("data-id", recipe.id); 
      recipeDiv.appendChild(editLink);

      // Vytvoření elementu pro potřebný čas (součet preparation a cooking)
      const timeElement = document.createElement("p");
      timeElement.textContent = `Potřebný čas: ${recipe.time} minut`;
      recipeDiv.appendChild(timeElement);

      const sourceElement = document.createElement("p");
      sourceElement.textContent = `Zdroj: ${recipe.source}`;
      recipeDiv.appendChild(sourceElement);

      // Vytvoření elementu pro stranu receptu
      const pageElement = document.createElement("p");
      pageElement.textContent = `Strana: ${recipe.page}`;
      recipeDiv.appendChild(pageElement);

      // Přidání receptu do hlavního divu
      recipes.appendChild(recipeDiv);
      recipesTotal++;
    });
    updateTotalRecipes(recipesTotal);
  } else {
    console.log('Objekt "recepty" v local storage nenalezen.');
  }
}

function normalizeString(input) {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function updateTotalRecipes(count) {
  const totalCount = document.getElementById("count");
  totalCount.innerText = `${totalCount.getAttribute("data-text")} ${count}`;
}

function search(string) {
  const searchValue = normalizeString(string);
  const recipes = document.querySelectorAll(".recipe");
  let visibleTotal = 0;

  recipes.forEach((recipe) => {
    let name = normalizeString(recipe.getAttribute(dataName));
    let synonyms = normalizeString(recipe.getAttribute(dataSynonyms));
    let mainIngredients = normalizeString(
      recipe.getAttribute(dataMainIngredients)
    );

    const matchesSearch = [name, synonyms, mainIngredients].some((text) =>
      text.includes(searchValue.toLowerCase())
    );

    recipe.style.display =
      (matchesSearch && (visibleTotal++, "block")) || "none";
  });

  updateTotalRecipes(visibleTotal);
}

document.addEventListener("DOMContentLoaded", (event) => {
  loadRecipesFromLocalStorage();

  const searchInput = document.getElementById("search");
  searchInput.addEventListener("input", function () {
    search(this.value);
    let url = new URL(window.location.href);
    url.searchParams.set("search", this.value);
    // Nastavení nové URL do prohlížeče
    window.history.replaceState(null, "", url);
  });

  // Získání celého vyhledávacího řetězce z aktuální URL
  let searchParams = new URLSearchParams(window.location.search);
  let searchParam = searchParams.get("search");
  console.log(searchParam);
  if (searchParam) {
    searchInput.value = searchParam;
    search(searchParam);
  }

  //blokace odkazů
  let links = document.querySelectorAll("a");
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      let action = this.getAttribute("data-action");
      let id = this.getAttribute("data-id");

      console.log("Navigace na:", action);
      console.log("ID na:", id);
      // Například:
      // loadPage(targetPage);
      // search(targetPage);
      // atd.
    });
  });
});
