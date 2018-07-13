/////////////
//App state//
/////////////
let state = {
  recipeIsDisplayed: false,
  searchResults: [],
  currentlyDisplayedRecipe: {name: "", summary: "", directions: "", ingredients: []}
};

function setState(newState) {
  Object.assign(state, newState);
  render();
}

////////
//Data//
////////
let recipes = [
  {
    name: "Lemonade",
    summary: "A refreshing drink for those hot summer days!",
    directions: "Mix, stir and chill it!",
    ingredients: ["Water", "Lemon Juice", "Sugar"]
  },
  {
    name: "Pravda Mule",
    summary: "Donkey",
    directions: "Get out of my swamp",
    ingredients: ["Snake oil", "Whiskey", "Cilantro"]
  },
  {
    name: "Chocolate Cake",
    summary: "Decadent cocoa based dessert. Perfect for parties and weddings alike!",
    directions: "Combine ingredients in a bowl, mix, and bake at 375.",
    ingredients: ["Flour", "Eggs", "Sugar", "Water", "Nutella"]
  }
];

//Populate recipes array with data from an API
fetch("https://www.themealdb.com/api/json/v1/1/latest.php")
.then(res => res.json())
.then(data => {
  recipes = recipes.concat(
    data.meals.map(recipe => ({
      name: recipe.strMeal,
      summary: recipe.strArea,
      directions: recipe.strInstructions,
      ingredients: [
        recipe.strIngredient1,
        recipe.strIngredient2,
        recipe.strIngredient3,
        recipe.strIngredient4,
        recipe.strIngredient5
      ]
    }))
  );
});

////////////////
//Main Program//
////////////////

// Sets `state.searchResults` to an array of recipe names that match `searchText`
function searchFor(searchText){
  let results;

  if(searchText.length > 0){
    results = recipes
      .filter(recipe => recipe.name.toLowerCase().includes(searchText))
      .map(recipe => recipe.name)
      .sort()
  }else{
    results = [];
  }

  setState({searchResults: results});
}

// Sets `state.currentlyDisplayedRecipe` to a recipe object thats name matches `recipeName`
function selectRecipe(recipeName){
  setState({
    recipeIsDisplayed: true,
    currentlyDisplayedRecipe: recipes.find(recipe => recipe.name === recipeName)
  });
}

///////////////////
//DOM Interaction//
///////////////////
const $main_container = document.querySelector("main");
const $search_box = document.querySelector("#search-box");
const $search_results = document.querySelector("#search-results");
const $recipe = document.querySelector("#recipe");
const $name = document.querySelector("#name");
const $summary = document.querySelector("#summary");
const $directions = document.querySelector("#directions");
const $ingredients = document.querySelector("#ingredients");

// Call `searchFor` function when a key is pressed in the search box
$search_box.addEventListener("keyup", function(e) {
  let search_text = e.target.value.trim().toLowerCase();
  searchFor(search_text);
});

// When clicking into the search box, select all the text,
// and call `searchFor` function to show searchResults
$search_box.addEventListener("focus", function(e) {
  let search_text = e.target.value.trim().toLowerCase();
  e.target.select();
  searchFor(search_text);
});

// When clicking out of the search box, `searchFor` an empty
// string to hide the searchResults
$search_box.addEventListener("blur", function() {
  window.setTimeout(function(){
    searchFor("");
  }, 200);
});

// Call `selectRecipe` function when an <li> is clicked
$search_results.addEventListener("click", function(e) {
  if(e.target.tagName !== "LI") return;
  selectRecipe(e.target.innerText);
  $search_box.value = state.currentlyDisplayedRecipe.name;
  searchFor("");
});

// Render to DOM
function render() {
  let { recipeIsDisplayed, searchResults, currentlyDisplayedRecipe } = state;

  if(recipeIsDisplayed) $main_container.classList.add("recipe-displayed");

  $search_results.innerHTML = searchResults
    .map(result => `<li>${result}</li>`)
    .join("");

  $ingredients.innerHTML = currentlyDisplayedRecipe.ingredients
    .map(ingredient => `<li>${ingredient}</li>`)
    .join("");

  $name.innerHTML = currentlyDisplayedRecipe.name;
  $summary.innerHTML = currentlyDisplayedRecipe.summary;
  $directions.innerHTML = currentlyDisplayedRecipe.directions.replace(/\n/g, "<br>");
}