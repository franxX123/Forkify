import PreviewView from './previewView.js';

class BookmarkedView extends PreviewView {
  _parentElement = document.querySelector('.bookmarks');
  _errorMessage =
    'There are no bookmarks just yet. Try bookmarking some recipes!';
  _message = '';

  addHandlerStoredBookmarks(handler) {
    window.addEventListener('load', handler);
  }
}

export default new BookmarkedView();
