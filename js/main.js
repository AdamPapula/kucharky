const dataName = "data-name";
const dataSynonyms = "data-synonyms";
const dataMainIngredients = "data-main-ingredients";
const dataId = "data-id";
const dataFavorite = "data-favorite"

function loadRecipesFromLocalStorage() {
  const recipes = document.getElementById("recipes");
  let recipesTotal = 0;
  let loaded = localStorage.getItem("recipes");
  if(!recipes) {
    return;
  }

  if (loaded) {
    loaded = JSON.parse(loaded);
    recipes.innerHTML = "";

    loaded.forEach((recipe) => {
      const recipeContainer = document.createElement("div");
      recipeContainer.classList.add("recipe-container");
      recipeContainer.setAttribute(dataSynonyms, recipe.synonyms);
      recipeContainer.setAttribute(dataFavorite, recipe.favorite);

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
      recipeDiv.setAttribute(dataId, recipe.id);


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

      const sourceElement = document.createElement("p");
      sourceElement.classList.add("source");
      sourceElement.textContent = `${recipe.source}`;
      recipeDiv.appendChild(sourceElement);

      // Vytvoření elementu pro potřebný čas (součet preparation a cooking)
      
      const detailsElement = document.createElement("div");
      detailsElement.classList.add("details");
      if(recipe.page) {
        const pageElement = document.createElement("p");
        pageElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M249.6 471.5c10.8 3.8 22.4-4.1 22.4-15.5V78.6c0-4.2-1.6-8.4-5-11C247.4 52 202.4 32 144 32C93.5 32 46.3 45.3 18.1 56.1C6.8 60.5 0 71.7 0 83.8V454.1c0 11.9 12.8 20.2 24.1 16.5C55.6 460.1 105.5 448 144 448c33.9 0 79 14 105.6 23.5zm76.8 0C353 462 398.1 448 432 448c38.5 0 88.4 12.1 119.9 22.6c11.3 3.8 24.1-4.6 24.1-16.5V83.8c0-12.1-6.8-23.3-18.1-27.6C529.7 45.3 482.5 32 432 32c-58.4 0-103.4 20-123 35.6c-3.3 2.6-5 6.8-5 11V456c0 11.4 11.7 19.3 22.4 15.5z"/></svg> str. ${recipe.page}`;
        detailsElement.appendChild(pageElement);
      }

      if(recipe.time) {
        const timeElement = document.createElement("p");
        timeElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24"><path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z"/></svg> ${recipe.time} minut`;
        detailsElement.appendChild(timeElement);
      }
      
      recipeDiv.appendChild(detailsElement);
      
      // const heartElement = document.createElement("div");
      // heartElement.classList.add("favorite");
      // heartElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>`;
      // recipeDiv.appendChild(heartElement);



      // Vytvoření elementu pro stranu receptu


      recipeContainer.appendChild(recipeDiv);

      // Přidání receptu do hlavního divu
      recipes.appendChild(recipeContainer);
      recipesTotal++;
    });
    updateTotalRecipes(recipesTotal);
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
  totalCount.setAttribute("data-count", count);
  totalCount.innerText = `${totalCount.getAttribute("data-text")} ${count}`;
}

function search(string, onlyFavorite) {
  const searchValue = normalizeString(string);
  const recipes = document.querySelectorAll(".recipe");
  let visibleTotal = 0;

  recipes.forEach((recipe) => {
    recipe = recipe.parentElement;
    let name = normalizeString(recipe.getAttribute(dataName) || "");
    let synonyms = normalizeString(recipe.getAttribute(dataSynonyms) || "");
    let mainIngredients = normalizeString(recipe.getAttribute(dataMainIngredients) || "");    
    const matchesSearch = [name, synonyms, mainIngredients].some((text) =>
      text.includes(searchValue)
    );
    if(onlyFavorite) {
      if (recipe.getAttribute(dataFavorite) !== "true") {
        recipe.style.display = "none";
        return;
      }
    }
    recipe.style.display = (matchesSearch && (visibleTotal++, "block")) || "none";
  });

  updateTotalRecipes(visibleTotal);
}

function deleteRecipe(id) {
  let recipes = localStorage.getItem("recipes");
  let deleted = localStorage.getItem("deleted");

  if (recipes) {
    recipes = JSON.parse(recipes);
    const index = recipes.findIndex((obj) => obj.id === id);

    if (index !== -1) {
      const recipe = recipes[index];
      recipes.splice(index, 1);
      localStorage.setItem("recipes", JSON.stringify(recipes));
      if (deleted) {
        deleted = JSON.parse(deleted);
        deleted.push(recipe);
      } else {
        deleted = [recipe];
      }
      localStorage.setItem("deleted", JSON.stringify(deleted));

      //update počtu receptů
      const totalCount = document.getElementById("count");
      const count = parseInt(totalCount.getAttribute("data-count")) - 1;
      totalCount.setAttribute("data-count", count);
      totalCount.innerText = `${totalCount.getAttribute("data-text")} ${count}`;
      return true;
    }
  }
  return false;
}

function editRecipe(id) {
  window.location.href = `edit?id=${id}`;
}

function openRecipe(id) {
  window.location.href = `recipe?id=${id}`;
}

function favoriteRecipe(id, element) {
  let recipes = localStorage.getItem("recipes");

  if (recipes) {
    recipes = JSON.parse(recipes);
    const index = recipes.findIndex((obj) => obj.id === id);

    if (index !== -1) {
      recipes[index].favorite = !recipes[index].favorite;
      localStorage.setItem("recipes", JSON.stringify(recipes));

      const parentElement = element.parentElement;
      parentElement.setAttribute(dataFavorite, recipes[index].favorite);
      parentElement.classList.toggle("favorite", recipes[index].favorite);
      parentElement.classList.toggle("not-favorite", !recipes[index].favorite);
    }
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  //načtu recepty
  loadRecipesFromLocalStorage();

  //vyhledávání
  const searchInput = document.getElementById("search");
  const favoriteInput = document.getElementById("select-favorite");

  const updateSearch = () => {
    search(searchInput.value, favoriteInput.checked);
    const url = new URL(window.location.href);
    url.searchParams.set("search", searchInput.value);
    url.searchParams.set("favorite", favoriteInput.checked);
    window.history.replaceState(null, "", url);
  };

  if (searchInput && favoriteInput) {
    searchInput.addEventListener("input", updateSearch);
    favoriteInput.addEventListener("change", updateSearch);
  }

  // vyhledávání na základě url
  let searchParams = new URLSearchParams(window.location.search);
  let searchParam = searchParams.get("search");
  if (searchParam) {
    searchInput.value = searchParam;
    search(searchParam);
  }

  //button na přesměrování
  let links = document.querySelectorAll("button[type=button]");
  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      let action = this.getAttribute("data-action");
      let id = this.getAttribute("data-id");

      window.location.href = id ? `${action}?id=${id}` : action;
    });
  });

  //posuv receptů
  document.querySelectorAll(".recipe").forEach((recipeElement) => {
    const xwiper = new Xwiper(recipeElement);
    const recipeId = recipeElement.getAttribute(dataId);
    
    xwiper.onTap(() => {openRecipe(recipeId);});
    xwiper.onSwipeLeft(() => {editRecipe(recipeId);});
    xwiper.onSwipeRight(() => {favoriteRecipe(recipeId, recipeElement)});
  });
});




//Xwiper
const defaults = {
  threshold: 50,
  passive: false,
};

class Xwiper {
  constructor(element, options = {}) {
    this.options = { ...defaults, ...options };
    
    this.dragging = false;
    this.element = null;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.onSwipeLeftAgent = null;
    this.onSwipeRightAgent = null;
    this.onTapAgent = null;

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onSwipeLeft = this.onSwipeLeft.bind(this);
    this.onSwipeRight = this.onSwipeRight.bind(this);
    this.onTap = this.onTap.bind(this);

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
      let favoriteClass = "not-favorite";
      if(parent.getAttribute(dataFavorite) === "true") {
        favoriteClass = "favorite";
      }
      let addClass = deltaX > 0 ? favoriteClass : "edit";
      let removeClass = deltaX > 0 ? "edit" : favoriteClass;

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
      parent.classList.remove("edit", "favorite", "not-favorite");
      this.element.classList.remove("drag");
    });
    
    if (Math.abs(parseInt(window.getComputedStyle(this.element).left, 10)) > window.screen.width/3) {
      this.handleGesture();
    } 

    if (this.touchEndY === this.touchStartY) {
      this.onTapAgent && this.onTapAgent();
      return "tap";
    }
  }

  onSwipeLeft(func) {
    this.onSwipeLeftAgent = func;
  }
  onSwipeRight(func) {
    this.onSwipeRightAgent = func;
  }
  onTap(func) {
    this.onTapAgent = func;
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

