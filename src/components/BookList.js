import createClass from 'create-react-class';
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../constants/routes';
import Book from './Book';
import Shelf from './Shelf';

const shelfToTitleMap = {
  currentlyReading: 'Currently Reading',
  wantToRead: 'Want to Read',
  read: 'Read'
};
const shelfSortOrder = {
  currentlyReading: 0,
  wantToRead: 1,
  read: 2
};

const sortShelves = shelves =>
  shelves.sort((a, b) => shelfSortOrder[a] - shelfSortOrder[b]);

const BookList = createClass({
  render() {
    const { booksByShelf, onBookShelfChange } = this.props;
    const shelves = sortShelves(Object.keys(booksByShelf));

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>

        <div className="list-books-content">
          <div>
            {shelves.map(shelf => (
              <Shelf key={shelf} name={shelfToTitleMap[shelf]}>
                {booksByShelf[shelf].map(book => (
                  <Book
                    key={book.id}
                    book={book}
                    shelves={shelves}
                    onBookShelfChange={onBookShelfChange}
                  />
                ))}
              </Shelf>
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
