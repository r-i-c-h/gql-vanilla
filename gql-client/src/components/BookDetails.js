import React, {Component} from 'react';
import { graphql } from 'react-apollo'
import { getBookQuery } from '../gql-calls/queries';

class BookDetails extends Component {
  renderOtherBooks = (detailedAuthor, list) => {
    if (list.length > 1) {
      return (
        <div className="book-details--author__otherBooks">
        Other books by {detailedAuthor.name} include:

          <ul>
            {list.map( x => { return <li key={x.name}>{x.name}</li> })}
          </ul>
        </div>
      );
    }
  }

  render() {
    if (this.props.data.loading) {
      return (<div id="book-details">One Moment...</div>);
    }
    const detailedBook = this.props.data.book;
    const detailedAuthor = detailedBook.author;
    return (
      <div className="book-details">
        <div className="book-details--block__first-line">
          <span className="book-details--title">{detailedBook.name}</span> (<span className="book-details--genre">{detailedBook.genre})</span>
        </div>
        <div className="book-details--block__second-line">
          by <span className="book-details--author"> {detailedAuthor.name}</span>
            { this.renderOtherBooks(detailedAuthor, detailedAuthor.books) }
        </div>
      </div>
    );
  }
}

// Query with ARGUMENTS
// single binding = data returns as props.data. So a book is props.data
export default graphql(getBookQuery,{
  options: (props) => {
    return {
      variables:{
        id: props.bookId
      }
    }
  }
})(BookDetails);