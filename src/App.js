import './App.css';

import React from 'react';
import { Route } from 'react-router-dom';

import BookList from './components/BookList';
import SearchBooks from './components/SearchBooks';
import routes from './constants/routes';

// import * as BooksAPI from './BooksAPI';

class BooksApp extends React.Component {
  state = {};

  render() {
    return (
      <div className="app">
        <Route exact path={routes.ROOT} component={BookList} />

        <Route path="/search" component={SearchBooks} />
      </div>
    );
  }
}

export default BooksApp;
