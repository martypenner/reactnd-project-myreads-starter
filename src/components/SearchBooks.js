import createClass from 'create-react-class';
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../constants/routes';

const SearchBooks = createClass({
  onChange(searchTerm) {
    this.setState({ value: searchTerm });
    this.props.onChange(searchTerm);
  },

  render() {
    const { results, onBookShelfChange } = this.props;

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
              onChange={e => this.onChange(e.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {results.map(book => (
              <li key={book.id}>
                <div className="book">
                  <div className="book-top">
                    <div
                      className="book-cover"
                      style={{
                        width: 128,
                        height: 193,
                        backgroundImage: `url("${book.imageLinks
                          .smallThumbnail}")`
                      }}
                    />

                    <div className="book-shelf-changer">
                      <select
                        value={book.shelf}
                        onChange={e => onBookShelfChange(book, e.target.value)}>
                        <option value="none" disabled>
                          Move to...
                        </option>

                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>

                  <div className="book-title">{book.title}</div>

                  <div className="book-authors">
                    {book.authors && book.authors.map(
                      (author, i) =>
                        author + (i < book.authors.length - 1 ? ', ' : '')
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    );
  }
});

export default SearchBooks;
