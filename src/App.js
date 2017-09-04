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

const addShelvesToSearchResults = (searchResults, books) =>
  searchResults.map(result => ({
    ...result,
    shelf: (books.find(book => book.id === result.id) || {
      shelf: 'none'
    }).shelf
  }));

const BooksApp = createClass({
  getInitialState() {
    return {
      books: [],
      searchText: '',
      searchResults: [],
      areBooksFetched: false
    };
  },

  componentDidMount() {
    BooksAPI.getAll().then(books =>
      this.setState({ books, areBooksFetched: true })
    );
  },

  onBookShelfChange(book, shelf) {
    let oldBooks;
    let oldResults;

    this.setState(({ books, searchResults }) => {
      oldBooks = books;
      oldResults = searchResults;

      const updatedBook = { ...book, shelf };
      const updatedBooks = books
        .reduce(
          (acc, current) => (current.id === book.id ? acc : [...acc, current]),
          []
        )
        .concat(updatedBook)
        .filter(book => book.shelf !== 'none');

      return {
        books: updatedBooks,
        searchResults: addShelvesToSearchResults(searchResults, updatedBooks)
      };
    });

    // Note: possible race condition if this completes before the previous setState call finishes
    BooksAPI.update(book, shelf).catch(() =>
      this.setState({ books: oldBooks, searchResults: oldResults })
    );
  },

  onSearch(searchText) {
    this.setState({ searchText });

    if (searchText.trim() === '') {
      this.setState({ searchResults: [] });
      return;
    }

    // Search for books, returning an empty list for errors.
    // Then find the the shelf that book is on by searching our existing
    // list. This feels a bit non-performant, as it exhibits N+1, but is
    // not likely to be a real problem until the books number in the
    // thousands.
    Observable.defer(() => BooksAPI.search(searchText))
      .map(searchResults => (searchResults.error == null ? searchResults : []))
      .map(results => addShelvesToSearchResults(results, this.state.books))
      .subscribe(searchResults => this.setState({ searchResults }));
  },

  render() {
    const { books, searchText, searchResults, areBooksFetched } = this.state;
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
