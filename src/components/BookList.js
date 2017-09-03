import createClass from 'create-react-class';
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../constants/routes';
import Book from './Book';

const EmptyShelf = () => (
  <div style={{ color: '#999' }}>You don't have any books on this shelf</div>
);

const BookList = createClass({
  render() {
    const { booksByShelf, shelves, onBookShelfChange } = this.props;

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="list-books-content">
          <div>
            {shelves.map(([shelf, humanShelfName]) => (
              <div key={shelf} className="bookshelf">
                <h2 className="bookshelf-title">{humanShelfName}</h2>

                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {booksByShelf[shelf].length === 0 && <EmptyShelf />}

                    {booksByShelf[shelf].map(book => (
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
            ))}
          </div>
        </div>

        <div className="open-search">
          <Link to={routes.SEARCH}>Add a book</Link>
        </div>
      </div>
    );
  }
});

export default BookList;
