import icons from 'url:../../img/icons.svg';
import { MIN_NUM_INGREDIENTS } from '../config';
import View from './View';

class IngredientView extends View {
  _parentElement = document.querySelector('.ingredients--container');
  _errorMessage =
    'Failed to add the ingredient. Please follow the specified format for ingredients. Thanks! ❤';
  _message = '';

  addHandlerAddIng() {
    const callBack = function (e) {
      const btn = e.target.closest('.btn--increase-ingredients');
      if (!btn) return;
      //   console.log(btn.dataset.updateTo);
      if (+btn.dataset.updateTo >= MIN_NUM_INGREDIENTS) {
        this.render({ numIngredients: +btn.dataset.updateTo });
      }
    };
    this._parentElement.addEventListener('click', callBack.bind(this));
  }

  _generateMarkup(data) {
    this._parentElement = document.querySelector('.ingredients--container');
    let markupArr = [
      `<div class="upload__heading">
            <h3 style="display: inline-block">Ingredients</h3>
            <div class="recipe__info-buttons" style="display: inline-block">
                <button type="button" class="btn--tiny btn--increase-ingredients" data-update-to=${
                  data.numIngredients - 1
                }>
                    <svg>
                        <use href="${icons}#icon-minus-circle"></use>
                    </svg>
                </button>
                <button type="button" class="btn--tiny btn--increase-ingredients" data-update-to=${
                  data.numIngredients + 1
                }>
                    <svg>
                        <use href="${icons}#icon-plus-circle"></use>
                    </svg>
                </button>
            </div>
        </div>`,
    ];

    for (let i = 0; i < data.numIngredients; i++) {
      markupArr.push(`<label>Ingredient ${i + 1}</label>
                    <input
                    type="text"
                    name="ingredient-${i + 1}"
                    placeholder="Format: 'Quantity,Unit,Description'"
                    />`);
    }

    // console.log(markupArr.join(''));
    return markupArr.join('');
  }
}

export default new IngredientView();
