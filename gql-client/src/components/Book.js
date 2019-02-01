import React from 'react';

const Book = ({bookData, selectBook}) => {
  const handleClick = () =>{
    selectBook(bookData.id);
  }

  return (
    <li onClick={handleClick}>
      <span className="book-list__list--title"> {bookData.name} </span> -
      (<span className="book-list__list--genre">{bookData.genre}</span>)
    </li>
  )
}

export default Book;