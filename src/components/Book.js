import createClass from 'create-react-class';
import React from 'react';

const Book = createClass({
  render() {
    const { book, shelves, onBookShelfChange } = this.props;

    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                backgroundImage: `url("${book.imageLinks.smallThumbnail}")`
              }}
            />

            <div className="book-shelf-changer">
              <select
                value={book.shelf}
                onChange={e => onBookShelfChange(book, e.target.value)}>
                <option value="none" disabled>
                  Move to...
                </option>

                {shelves.map(shelf => (
                  <option key={shelf} value={shelf}>
                    {shelf}
                  </option>
                ))}

                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="book-title">{book.title}</div>

          <div className="book-authors">
            {book.authors.map(
              (author, i) => author + (i < book.authors.length - 1 ? ', ' : '')
            )}
          </div>
        </div>
      </li>
    );
  }
});

export default Book;
