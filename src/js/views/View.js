import icons from 'url:../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    try {
      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error();
      }

      this._data = data;
      const markup = this._generateMarkup(data);

      this._clear();
      this._parentElement.insertAdjacentHTML('afterbegin', markup);
    } catch (error) {
      console.log(error);
      this.renderError();
    }
  }

  update(data) {
    this._data = data;
    const markup = this._generateMarkup(data);

    // creates a DOM (DocumentFragment) from a text
    const newDom = document.createRange().createContextualFragment(markup);
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // console.log(curEl, newEl.isEqualNode(curEl));
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('👏' + newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
        // console.log();
      }

      // Alternative 1
      // if (
      //   !newEl.isEqualNode(curEl) &&
      //   curEl.classList.contains('btn--increase-servings')
      // ) {
      //   console.log('❤🚴‍♀️🚶‍♂️❤🚴‍♀️' + curEl.dataset.updateTo);
      //   curEl.dataset.updateTo = newEl.dataset.updateTo;
      // }

      if (!newEl.isEqualNode(curEl)) {
        // console.log(Array.from(newEl.attributes));
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  renderError(errMsg = this._errorMessage) {
    const markup = `<div class="error">
                        <div>
                            <svg>
                                <use href="${icons}_icon-alert-triangle"></use>
                            </svg>
                        </div>
                        <p>${errMsg}</p>
                    </div>`;

    this._clear();
    // this._parentElement.innerHTML = markup;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(msg = this._message) {
    const markup = `<div class="message">
                <div>
                  <svg>
                    <use href="${icons}#icon-smile"></use>
                  </svg>
                </div>
                <p>${msg}</p>
              </div>`;

    this._clear();
    // this._parentElement.innerHTML = markup;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  removeMessage() {
    const message = this._parentElement.firstElementChild;
    if (message) {
      message.remove();
    }

    //
  }
  renderSpinner = function () {
    const spinner = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>`;

    this._parentElement.innerHTML = spinner;
  };

  _clear() {
    this._parentElement.innerHTML = '';
  }
}
