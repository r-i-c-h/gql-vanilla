import React from 'react';

const Book = ({bookData}) => {
  return (
    <li>
      <p>
      <span className="book-detail--title"> {bookData.name} </span> - by
      <span className="book-detail--author"> {bookData.author.name} </span>
      (<span className="book-detail--genre">{bookData.genre}</span>)
      </p>
    </li>
  )
}

  export default Book;