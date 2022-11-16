import View from './View';
import icons from 'url:../../img/icons.svg';
import ingredientsView from './ingredientsView.js';
import { MIN_NUM_INGREDIENTS } from '../config';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _openBtn = document.querySelector('.nav__btn--add-recipe');
  _closeBtn = document.querySelector('.btn--close-modal');
  _display = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _message = 'Recipe has been successfully uploaded';
  _errorMessage =
    'Failed to upload the recipe. Please add the recipes in the format provided.';

  constructor() {
    super();
    this._addHandlerRecipeView();
  }

  // toggleHidden() {
  //   this._display.classList.toggle('hidden');
  //   this._overlay.classList.toggle('hidden');
  // }

  showDisplay() {
    this._display.classList.remove('hidden');
    this._overlay.classList.remove('hidden');

    ingredientsView.render({ numIngredients: MIN_NUM_INGREDIENTS });
    ingredientsView.addHandlerAddIng();
  }

  hideDisplay() {
    this._display.classList.add('hidden');
    this._overlay.classList.add('hidden');
  }

  _addHandlerRecipeView() {
    [this._closeBtn, this._overlay].forEach(el => {
      el.addEventListener('click', this.hideDisplay.bind(this));
    });

    this._openBtn.addEventListener('click', this.showDisplay.bind(this));
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // FormData takes a form element and takes all the values inside of it
      // and returns an iterable object containing the key-value pairs
      const dataArr = [...new FormData(this)];
      console.log('Why?');
      // fromEntries takes an Array of key-value tuples (name-value in input elements)
      // returns an Object with the key-value pairs as attributes
      const data = Object.fromEntries(dataArr);
      handler(data);
    });
  }

  _generateMarkup(data) {
    const markup = `<div class="upload__column">
              <h3 class="upload__heading">Recipe data</h3>
              <label>Title</label>
              <input value="TEST12" required name="title" type="text" />
              <label>URL</label>
              <input value="TEST12" required name="sourceUrl" type="text" />
              <label>Image URL</label>
              <input value="TEST12" required name="image" type="text" />
              <label>Publisher</label>
              <input value="TEST12" required name="publisher" type="text" />
              <label>Prep time</label>
              <input value="23" required name="cookingTime" type="number" />
              <label>Servings</label>
              <input value="23" required name="servings" type="number" />
            </div>

            <div class="upload__column ingredients--container" style="overflow-y: auto">
            </div>

            <button class="btn upload__btn">
              <svg>
                <use href="${icons}#icon-upload-cloud"></use>
              </svg>
              <span>Upload</span>
            </button>`;

    return markup;
  }
}

export default new AddRecipeView();
