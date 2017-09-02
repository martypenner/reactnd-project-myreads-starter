import createClass from 'create-react-class';
import React from 'react';
import { Link } from 'react-router-dom';

import routes from '../constants/routes';

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

const EmptyShelf = () => (
  <div style={{ color: '#999' }}>You don't have any books on this shelf</div>
);

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
              <div key={shelf} className="bookshelf">
                <h2 className="bookshelf-title">{shelfToTitleMap[shelf]}</h2>

                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {booksByShelf[shelf].length === 0 && <EmptyShelf />}

                    {booksByShelf[shelf].map(book => (
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
                                onChange={e =>
                                  onBookShelfChange(book, e.target.value)}>
                                <option value="none" disabled>
                                  Move to...
                                </option>

                                {shelves.map(shelf => (
                                  <option key={shelf} value={shelf}>
                                    {shelfToTitleMap[shelf]}
                                  </option>
                                ))}

                                <option value="none">None</option>
                              </select>
                            </div>
                          </div>

                          <div className="book-title">{book.title}</div>

                          <div className="book-authors">
                            {book.authors.map(
                              (author, i) =>
                                author +
                                (i < book.authors.length - 1 ? ', ' : '')
                            )}
                          </div>
                        </div>
                      </li>
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
