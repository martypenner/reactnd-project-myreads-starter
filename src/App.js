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

const BooksApp = createClass({
  getInitialState() {
    return {
      books: [],
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
      .map(bookIdsByShelf => ({
        // This reduce is a bit ugly, and has the N+1 problem, but given
        // that updates happen infrequently and on very small numbers,
        // I chose to leave this as-is rather than force more frequent
        // transformation in the render method.
        books: Object.entries(bookIdsByShelf).reduce(
          (acc, [shelf, ids]) => [
            ...acc,
            ...ids.reduce(
              (acc, id) => [
                ...acc,
                { ...this.state.books.find(book => book.id === id), shelf }
              ],
              []
            )
          ],
          []
        ),
        isUpdating: false
      }))
      .startWith({ isUpdating: true })
      .subscribe(state => this.setState(state));
  },

  onSearch(searchTerm) {
    if (searchTerm.trim() === '') {
      this.setState({ searchResults: [] });
      return;
    }

    BooksAPI.search(searchTerm, 100).then(searchResults =>
      this.setState({ searchResults })
    );
  },

  render() {
    const { books, searchResults, areBooksFetched, isUpdating } = this.state;
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
              results={searchResults}
              onChange={this.onSearch}
              onBookShelfChange={this.onBookShelfChange}
            />
          )}
        />
      </div>
    );
  }
});

export default BooksApp;
