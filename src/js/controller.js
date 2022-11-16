import * as model from './model.js';
import recipeView from './views/recipeView';
import searchView from './views/searchView';
import resultView from './views/resultView.js';
import paginationView from './views/paginationView.js';
import bookmarkedView from './views/bookMarkedView.js';
import addRecipeView from './views/addRecipeView.js';
import ingredientsView from './views/ingredientsView.js';
import { MODAL_CLOSE_SEC, MIN_NUM_INGREDIENTS } from './config';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import bookMarkedView from './views/bookMarkedView.js';

// To keep the state as before
// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();

    // 0.) Mark selected search result
    resultView.update(model.loadPageResults());
    bookMarkedView.update(model.state.bookmarks);

    //  1.) Load the data
    await model.loadRecipe(id);
    const { recipe } = model.state;
    // 2.) Render the recipe

    recipeView.render(recipe);
  } catch (error) {
    // Error that is not related to data problems
    recipeView.renderError();
  }
};

const controlPageResults = function (pageNum = 1) {
  // Render the results for one page in the search-results
  resultView.render(model.loadPageResults(pageNum));
  model.state.search.page = pageNum;
  paginationView.render(model.state.search);
};

const controlSearchResults = async function () {
  try {
    // 1.) Get the query from user
    const query = searchView.getQuery();
    if (!query) return;

    // 2.) Load the results from search query
    resultView.renderSpinner();
    await model.loadSearchResults(query);

    // 3.) Render the results for one page in the search-results
    controlPageResults();
  } catch (err) {
    console.log(err);
    resultView.renderError();
  }
};

function controlBookmark(recipe) {
  if (!recipe.bookmarked) model.addBookMark(recipe);
  else {
    model.removeBookMark(recipe.id);
  }
  // console.log(recipe);
  bookmarkedView.render(model.state.bookmarks);
  recipeView.update(recipe);
}

function controlRecipeServings(newServings) {
  model.updateRecipeServings(newServings);
  recipeView.update(model.state.recipe);
}

function controlStoredBookmarks() {
  bookMarkedView.render(model.state.bookmarks);
  // console.log(model.state.bookmarks);
}

async function controlUploadRecipe(recipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uploadRecipe(recipe);

    recipeView.render(model.state.recipe);
    // console.log(model.state.bookmarks);
    bookMarkedView.render(model.state.bookmarks);

    addRecipeView.renderMessage();
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(function () {
      addRecipeView.hideDisplay();
      setTimeout(function () {
        addRecipeView.render({ placeholder: '' });
        ingredientsView.render({ numIngredients: MIN_NUM_INGREDIENTS });
      }, 350);
    }, MODAL_CLOSE_SEC * 1000);
  } catch (error) {
    console.error(error);
    addRecipeView.renderError();
  }
}

function init() {
  bookMarkedView.addHandlerStoredBookmarks(controlStoredBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServing(controlRecipeServings);
  recipeView.addHandlerBookmark(controlBookmark);
  searchView.addHandlerRender(controlSearchResults);
  paginationView.addHandlerRender(controlPageResults);
  addRecipeView.addHandlerUpload(controlUploadRecipe);
}

init();

function clearStorage() {
  localStorage.clear('bookmarks');
}
clearStorage();
