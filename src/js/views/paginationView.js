import icons from 'url:../../img/icons.svg';
import View from './View';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  //   _errorMessage = 'We cannot find the recipe. Please enter another one!';
  //   _message = '';

  addHandlerRender(handler) {
    const callBack = function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      const pageNum = parseInt(btn.value);
      // console.log(this);
      handler(pageNum);
    };

    this._parentElement.addEventListener('click', callBack);
  }

  _generateMarkup(data) {
    const page_count = Math.ceil(data.results.length / data.resultsPerPage);
    const cur_page = data.page;
    let markup = '';

    if (cur_page === 1 && page_count > 1) {
      markup = `
      <button class="btn--inline pagination__btn--next" value='${cur_page + 1}'>
        <span>Page ${cur_page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    } else if (cur_page === page_count && page_count > 1) {
      markup = `
      <button class="btn--inline pagination__btn--prev" value='${cur_page - 1}'>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${cur_page - 1}</span>
      </button>
      `;
    } else if (page_count > 1) {
      markup = `
        <button class="btn--inline pagination__btn--prev" value='${
          cur_page - 1
        }'>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${cur_page - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next" value='${
          cur_page + 1
        }'>
        <span>Page ${cur_page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </button>
      `;
    }

    console.log(page_count);
    return markup;
  }
}

export default new PaginationView();
