import './App.css';

import createClass from 'create-react-class';
import React from 'react';
import { Route } from 'react-router-dom';
import { Observable } from 'rxjs/Rx';

import * as BooksAPI from './BooksAPI';
import BookList from './components/BookList';
import SearchBooks from './components/SearchBooks';
import Spinner from './components/Spinner';
import routes from './constants/routes';

if (process.env.NODE_ENV === 'development') {
  BooksAPI.getAll().then(books =>
    console.info('initial books from API', books)
  );
}

const shelfSortOrder = {
  currentlyReading: 0,
  wantToRead: 1,
  read: 2
};
const shelfToTitleMap = {
  currentlyReading: 'Currently Reading',
  wantToRead: 'Want to Read',
  read: 'Read'
};

const sortShelves = shelves =>
  shelves.sort((a, b) => shelfSortOrder[a] - shelfSortOrder[b]);

const BooksApp = createClass({
  getInitialState() {
    return {
      books: [],
      searchText: '',
      searchResults: [],
      areBooksFetched: false,
      isUpdating: false
    };
  },

  componentDidMount() {
    BooksAPI.getAll().then(books =>
      this.setState({ books, areBooksFetched: true })
    );
  },

  onBookShelfChange(book, shelf) {
    // Note: I'm treating the server as the source of truth for book order.
    // Initially, I was optimistically updating state, and updating again
    // when the server responded. However, this caused books to flicker
    // to a different order. I ran out of time to find a way to avoid
    // this.

    Observable.defer(() => BooksAPI.update(book, shelf))
      .switchMap(() => BooksAPI.getAll())
      .map(books => ({ books, isUpdating: false }))
      .startWith({ isUpdating: true })
      .subscribe(state => this.setState(state));
  },

  onSearch(searchText) {
    this.setState({ searchText });

    if (searchText.trim() === '') {
      this.setState({ searchResults: [] });
      return;
    }

    BooksAPI.search(searchText)
      .then(searchResults => (searchResults.error == null ? searchResults : []))
      .then(searchResults => this.setState({ searchResults }));
  },

  render() {
    const {
      books,
      searchText,
      searchResults,
      areBooksFetched,
      isUpdating
    } = this.state;
    const booksByShelf = books.reduce(
      (booksByShelf, book) => ({
        ...booksByShelf,
        [book.shelf]: [...(booksByShelf[book.shelf] || []), book]
      }),
      {
        currentlyReading: [],
        wantToRead: [],
        read: []
      }
    );
    // Build a list of tuples of `["shelfName", "humanShelfName"]`
    const shelves = sortShelves(Object.keys(booksByShelf)).map(shelf => [
      shelf,
      shelfToTitleMap[shelf]
    ]);

    return (
      <div className="app">
        {isUpdating && <Spinner />}

        <Route
          exact
          path={routes.ROOT}
          render={() =>
            areBooksFetched ? (
              <BookList
                booksByShelf={booksByShelf}
                shelves={shelves}
                onBookShelfChange={this.onBookShelfChange}
              />
            ) : (
              <Spinner />
            )}
        />

        <Route
          path="/search"
          render={() => (
            <SearchBooks
              searchText={searchText}
              results={searchResults}
              shelves={shelves}
              onSearchTextChange={this.onSearch}
              onBookShelfChange={this.onBookShelfChange}
            />
          )}
        />
      </div>
    );
  }
});

export default BooksApp;
