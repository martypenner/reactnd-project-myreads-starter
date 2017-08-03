import './App.css';

import createClass from 'create-react-class';
import React from 'react';
import { Route } from 'react-router-dom';
import { Observable } from 'rxjs/Rx';

import * as BooksAPI from './BooksAPI';
import BookList from './components/BookList';
import SearchBooks from './components/SearchBooks';
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
      .map(books => this.setState({ books }))
      .toPromise();
  },

  onBookShelfChange(book, shelf) {
    const books = this.state.books
      .reduce(
        (books, b) => [...books, b.id === book.id ? { ...book, shelf } : b],
        []
      )
      .filter(book => book.shelf !== 'none');

    this.setState(() => ({ books }));
  },

  render() {
    const { books } = this.state;

    return (
      <div className="app">
        <Route
          exact
          path={routes.ROOT}
          render={() =>
            <BookList
              books={books}
              onBookShelfChange={this.onBookShelfChange}
            />}
        />

        <Route path="/search" component={SearchBooks} />
      </div>
    );
  }
});

export default BooksApp;
