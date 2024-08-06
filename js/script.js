// Selecting elements from the DOM
const searchBox = document.querySelector(".searchBox");
const searchBtn = document.querySelector(".searchbtn");
const recipeContainer = document.querySelector(".recipe-container");
const recipeDetailsContent = document.querySelector(".recipe-details-content");
const recipeCloseBtn = document.querySelector(".recipe-close-btn");

// Function to fetch recipes from the API
const fetchAPI = async (query) => {
    recipeContainer.innerHTML = "<h2>Fetching Recipe....</h2>";
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();

        recipeContainer.innerHTML = "";
        if (data.meals) {
            data.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add("recipe");
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                    <h3>${meal.strMeal}</h3>
                    <p><span>${meal.strArea}</span> Dish</p>
                    <p>Belongs to <span>${meal.strCategory}</span> Category</p>
                `;
                const button = document.createElement('button');
                button.textContent = 'View Recipe';
                button.addEventListener('click', () => openRecipe(meal));
                recipeDiv.appendChild(button);
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            recipeContainer.innerHTML = "<h2>No recipes found.</h2>";
        }
    } catch (error) {
        recipeContainer.innerHTML = "<h2>Error in fetching....</h2>";
        console.error(error);
    }
};

// Function to fetch ingredients of a meal
const fetchIngredients = (meal) => {
    let ingredientList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientList;
};

// Function to open and display the recipe details
const openRecipe = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredientList">${fetchIngredients(meal)}</ul>
        <div class="recipeInstructions">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
    `;
    recipeDetailsContent.parentElement.style.display = "block";
};

// Event listener for closing the recipe details
recipeCloseBtn.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Event listener for the search button
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        recipeContainer.innerHTML = "<h2>Type the meal you want to search in the search box.</h2>";
        return;
    }
    fetchAPI(searchInput);
});
