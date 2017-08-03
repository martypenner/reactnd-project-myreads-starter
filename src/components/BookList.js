import createClass from 'create-react-class';
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../constants/routes';
import Spinner from './Spinner';

const shelfToTitleMap = {
  currentlyReading: 'Currently Reading',
  wantToRead: 'Want to Read',
  read: 'Read'
};

const BookList = createClass({
  render() {
    const { books } = this.props;
    const booksByShelf = books.reduce(
      (booksByShelf, book) => ({
        ...booksByShelf,
        [book.shelf]: [...(booksByShelf[book.shelf] || []), book]
      }),
      {}
    );

    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>

          {books.length === 0 && <Spinner />}
        </div>

        <div className="list-books-content">
          <div>
            {Object.keys(booksByShelf).map(shelf =>
              <div className="bookshelf">
                <h2 className="bookshelf-title">
                  {shelfToTitleMap[shelf]}
                </h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {booksByShelf[shelf].map(book =>
                      <li>
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
                              <select>
                                <option value="none" disabled>
                                  Move to...
                                </option>
                                <option value="currentlyReading">
                                  Currently Reading
                                </option>
                                <option value="wantToRead">Want to Read</option>
                                <option value="read">Read</option>
                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>
                          <div className="book-title">
                            {book.title}
                          </div>
                          <div className="book-authors">
                            {book.authors.map(
                              (author, i) =>
                                author +
                                (i < book.authors.length - 1 ? ', ' : '')
                            )}
                          </div>
                        </div>
                      </li>
                    )}
                  </ol>
                </div>
              </div>
            )}
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
