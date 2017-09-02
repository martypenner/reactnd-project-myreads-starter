import createClass from 'create-react-class';
import React from 'react';

const Shelf = createClass({
  render() {
    const { name, children } = this.props;

    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{name}</h2>

        <div className="bookshelf-books">
          <ol className="books-grid">{children}</ol>
        </div>
      </div>
    );
  }
});

export default Shelf;
