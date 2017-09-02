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
    return { books: [] };
  },

  componentDidMount() {
    Observable.defer(() => BooksAPI.getAll())
      .do(books => this.setState({ books }))
      .toPromise();
  },

  onBookShelfChange(book, shelf) {
    // Note: I'm treating the server as the source of truth for book order.
    // Initially, I was optimistically updating state, and updating again
    // when the server responded. However, this caused books to flicker
    // to a different order. I haven't determined what criteria the server
    // is sorting by, so I've left out optimistic updates.

    Observable.defer(() => BooksAPI.update(book, shelf))
      .map(bookIdsByShelf =>
        // This reduce is a bit ugly, and has the N+1 problem, but given
        // that updates happen infrequently and on very small numbers,
        // I chose to leave this as-is rather than force more frequent
        // transformation in the render method.
        Object.entries(bookIdsByShelf).reduce(
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
        )
      )
      .do(books => this.setState({ books }))
      .toPromise();
  },

  render() {
    const { books } = this.state;
    const booksByShelf = books.reduce(
      (booksByShelf, book) => ({
        ...booksByShelf,
        [book.shelf]: [...(booksByShelf[book.shelf] || []), book]
      }),
      {}
    );

    return (
      <div className="app">
        <Route
          exact
          path={routes.ROOT}
          render={() =>
            books.length === 0 ? (
              <Spinner />
            ) : (
              <BookList
                booksByShelf={booksByShelf}
                onBookShelfChange={this.onBookShelfChange}
              />
            )}
        />

        <Route path="/search" component={SearchBooks} />
      </div>
    );
  }
});

export default BooksApp;
