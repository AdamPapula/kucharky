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
      const recipeContainer = document.createElement("div");
      recipeContainer.classList.add("recipe-container");
      recipeContainer.setAttribute(dataSynonyms, recipe.synonyms);

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

      recipeContainer.setAttribute(dataMainIngredients, mainIngredients.toString());
      recipeContainer.setAttribute(dataName, recipe.name);

      const recipeDiv = document.createElement("div");
      recipeDiv.classList.add("recipe");


      // Vytvoření nadpisu pro název receptu
      const recipeName = document.createElement("h2");
      recipeName.textContent = recipe.name;
      recipeDiv.appendChild(recipeName);

      // const detailLink = document.createElement("button");
      // detailLink.textContent = "Detail";
      // detailLink.type = "button";
      // detailLink.setAttribute("data-action", "view")
      // detailLink.setAttribute("data-id", recipe.id);
      // recipeDiv.appendChild(detailLink);

      // const editLink = document.createElement("button");
      // editLink.textContent = "Upravit";
      // editLink.type = "button";
      // editLink.setAttribute("data-action", "edit")
      // editLink.setAttribute("data-id", recipe.id);
      // recipeDiv.appendChild(editLink);

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

      recipeContainer.appendChild(recipeDiv);

      // Přidání receptu do hlavního divu
      recipes.appendChild(recipeContainer);
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
  let links = document.querySelectorAll("button[type=button]");
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


  document.querySelectorAll(".recipe").forEach((recipeElement) => {
    const xwiper = new Xwiper(recipeElement);
    xwiper.onSwipeLeft(() => {console.log("swipe left");});
    xwiper.onSwipeRight(() => console.log("swipe right"));
  });





});













const defaults = {
  threshold: 50,
  passive: false,
};

class Xwiper {
  constructor(element, options = {}) {
    this.options = { ...defaults, ...options };

    this.element = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.onSwipeLeftAgent = null;
    this.onSwipeRightAgent = null;
    this.dragging = false;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.destroy = this.destroy.bind(this);
    this.handleGesture = this.handleGesture.bind(this);

    let eventOptions = this.options.passive ? { passive: true } : false;

    this.element =
      element instanceof EventTarget
        ? element
        : document.querySelector(element);

    this.element.addEventListener("touchstart",this.onTouchStart,eventOptions);
    this.element.addEventListener("touchmove", this.onTouchMove, eventOptions);
    this.element.addEventListener("touchend", this.onTouchEnd, eventOptions);
  }

  onTouchStart(event) {
    this.touchStartX = event.changedTouches[0].screenX;
    this.touchStartY = event.changedTouches[0].screenY;
  }
  
  onTouchMove(event) {
    const touch = event.changedTouches[0];
    const deltaX = touch.screenX - this.touchStartX;
    const deltaY = touch.screenY - this.touchStartY;

    // Check if the movement is predominantly horizontal or vertical
    if (Math.abs(deltaX) > 2 * Math.abs(deltaY) && !this.dragging) {
      this.dragging = true;
    }
    if(this.dragging) {
      this.element.classList.add("drag");

      this.element.style.top = "0";
      this.element.style.left = `${deltaX}px`;

      let parent = this.element.parentElement;
      let addClass = deltaX > 0 ? "delete" : "edit";
      let removeClass = deltaX > 0 ? "edit" : "delete";
      parent.classList.add(addClass);
      parent.classList.remove(removeClass);
    }
  }
  
  onTouchEnd(event) {
    this.dragging = false;
    let parent = this.element.parentElement;
    this.touchEndX = event.changedTouches[0].screenX;
    this.touchEndY = event.changedTouches[0].screenY;
    this.moveToOriginalPosition(() => {
      parent.classList.remove("edit", "delete");
      this.element.classList.remove("drag");
    });
    if (Math.abs(parseInt(window.getComputedStyle(this.element).left, 10)) > window.screen.width/3) {
      this.handleGesture();
    } 
  }

  onSwipeLeft(func) {
    this.onSwipeLeftAgent = func;
  }
  onSwipeRight(func) {
    this.onSwipeRightAgent = func;
  }

  destroy() {
    this.element.removeEventListener("touchstart", this.onTouchStart);
    this.element.removeEventListener("touchend", this.onTouchEnd);
  }

  handleGesture() {
    /**
     * swiped left
     */
    if (this.touchEndX + this.options.threshold <= this.touchStartX) {
      this.onSwipeLeftAgent && this.onSwipeLeftAgent();
      return "swiped left";
    }

    /**
     * swiped right
     */
    if (this.touchEndX - this.options.threshold >= this.touchStartX) {
      this.onSwipeRightAgent && this.onSwipeRightAgent();
      return "swiped right";
    }
  }

  moveToOriginalPosition(callback) {
    const currentLeft = parseInt(window.getComputedStyle(this.element).left, 10);
    const distance = currentLeft;
    const duration = Math.abs(distance) * 0.5;
    
    let object = this.element;
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const progressRatio = Math.min(progress / duration, 1);

        object.style.left = currentLeft - distance * progressRatio + "px";

        if (progress < duration) {
          requestAnimationFrame(step);
        } else if (callback && typeof callback === "function") {
          callback();
        }
    }

    requestAnimationFrame(step);
}

}

