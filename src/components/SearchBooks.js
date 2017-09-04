import createClass from 'create-react-class';
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../constants/routes';
import Book from './Book';

const SearchBooks = createClass({
  componentDidMount() {
    this.props.onSearchTextChange(this.props.searchText);
  },

  render() {
    const {
      searchText,
      results,
      shelves,
      onBookShelfChange,
      onSearchTextChange
    } = this.props;

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link to={routes.ROOT} className="close-search">
            Close
          </Link>

          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={searchText}
              onChange={e => onSearchTextChange(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {results.map(book => (
              <Book
                key={book.id}
                book={book}
                shelves={shelves}
                onBookShelfChange={onBookShelfChange}
              />
            ))}
          </ol>
        </div>
      </div>
    );
  }
});

export default SearchBooks;
