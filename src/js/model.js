import { API_URL, NUM_RESULTS_PER_PAGE, KEY } from './config';
import { getJSON, setJSON } from './helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: NUM_RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

const updateRecipeState = function (data) {
  let { recipe } = data.data;

  state.recipe = {
    id: recipe.id,
    title: recipe.title,
    cooking_time: recipe.cooking_time,
    image_url: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    source_url: recipe.source_url,
    bookmarked: false,
    ...(data.key && { key: data.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}?key=${KEY}`);

    let { recipe } = data.data;

    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      cooking_time: recipe.cooking_time,
      image_url: recipe.image_url,
      ingredients: recipe.ingredients,
      publisher: recipe.publisher,
      servings: recipe.servings,
      source_url: recipe.source_url,
      bookmarked: false,
      ...(recipe.key && { key: recipe.key }),
    };

    const isBookMarked = state.bookmarks.some(
      markedRecipe => recipe.id === markedRecipe.id
    );

    if (isBookMarked) {
      state.recipe.bookmarked = true;
    }
    // console.log(state.recipe);
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image_url: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.query = query;
    console.log(state.search.results);
  } catch (err) {
    throw err;
  }
};

export const loadPageResults = function (page = state.search.page) {
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateRecipeServings = function (newServing) {
  state.recipe.ingredients.forEach(ing => {
    const oldServing = state.recipe.servings;
    ing.quantity = ing.quantity * (newServing / oldServing);
  });

  state.recipe.servings = newServing;
};

export const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookMark = function (recipe) {
  state.bookmarks.push(recipe);

  console.log(recipe.id === state.recipe.id);
  if (recipe.id === state.recipe.id) {
    state.recipe.bookmarked = true;
  }
  persistBookmarks();
};

export const removeBookMark = function (id) {
  state.bookmarks = state.bookmarks.filter(marked => id !== marked.id);
  // console.log(state.bookmarks);
  // console.log(id);
  // console.log(state.recipe.id);

  if (id === state.recipe.id) {
    state.recipe.bookmarked = false;
  }

  persistBookmarks();
};

// The modules used in the controller are invoked first because code
// at some later point relies on these modules.
export const init = function () {
  const bookmarks = localStorage.getItem('bookmarks');
  if (bookmarks) {
    state.bookmarks = JSON.parse(bookmarks);
    // console.log(state.bookmarks);
  }
};
init();

export const uploadRecipe = async function (recipe) {
  try {
    // console.log(Object.entries(recipe));
    const ingredients = Object.entries(recipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        console.log(ingredient);
        const ingArr = ingredient[1].split(',').map(el => el.trim());

        if (ingArr.length !== 3) {
          console.log('error', ingredient);
          throw new Error(
            'Failed to upload the recipe. Please check if the recipe was formatted correctly. 😘'
          );
        }
        // array destructuring
        [quantity, unit, description] = ingArr;

        return { quantity: quantity ? quantity : null, unit, description };
      });

    const data = {
      title: recipe.title,
      cooking_time: +recipe.cookingTime,
      image_url: recipe.image,
      publisher: recipe.publisher,
      servings: +recipe.servings,
      source_url: recipe.sourceUrl,
      ingredients,
    };

    const newRecipe = await setJSON(`${API_URL}?key=${KEY}`, data);
    updateRecipeState(newRecipe);
    console.log(newRecipe.data.recipe.id, state.recipe.id);

    addBookMark(newRecipe.data.recipe);

    // console.log(state.recipe);

    // console.log(newRecipe.data.recipe);
  } catch (error) {
    console.log(error);
    console.log('error');
  }
};
