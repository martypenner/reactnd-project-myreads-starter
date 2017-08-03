import './App.css';

import React from 'react';
import { Route } from 'react-router-dom';

import * as BooksAPI from './BooksAPI';
import BookList from './components/BookList';
import SearchBooks from './components/SearchBooks';
import routes from './constants/routes';

if (process.env.NODE_ENV === 'development') {
  BooksAPI.getAll().then(books =>
    console.info('initial books from API', books)
  );
}

class BooksApp extends React.Component {
  state = { books: [] };

  componentDidMount() {
    BooksAPI.getAll().then(books => this.setState({ books }));
  }

  render() {
    const { books } = this.state;

    return (
      <div className="app">
        <Route
          exact
          path={routes.ROOT}
          render={() => <BookList books={books} />}
        />

        <Route path="/search" component={SearchBooks} />
      </div>
    );
  }
}

export default BooksApp;
