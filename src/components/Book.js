import createClass from 'create-react-class';
import React from 'react';

const Book = createClass({
  render() {
    const { book, shelves, onBookShelfChange } = this.props;
    const backgroundImageStyle =
      book.imageLinks && book.imageLinks.smallThumbnail
        ? { backgroundImage: `url("${book.imageLinks.smallThumbnail}")` }
        : null;

    return (
      <li key={book.id}>
        <div className="book">
          <div className="book-top">
            <div
              className="book-cover"
              style={{
                width: 128,
                height: 193,
                ...backgroundImageStyle
              }}
            />

            <div className="book-shelf-changer">
              <select
                value={book.shelf}
                onChange={e => onBookShelfChange(book, e.target.value)}>
                <option value="none" disabled>
                  Move to...
                </option>

                {shelves.map(([shelf, humanShelfName]) => (
                  <option key={shelf} value={shelf}>
                    {humanShelfName}
                  </option>
                ))}

                <option value="none">None</option>
              </select>
            </div>
          </div>

          <div className="book-title">{book.title}</div>

          <div className="book-authors">
            {book.authors &&
              book.authors.map(
                (author, i) =>
                  author + (i < book.authors.length - 1 ? ', ' : '')
              )}
          </div>
        </div>
      </li>
    );
  }
});

export default Book;
