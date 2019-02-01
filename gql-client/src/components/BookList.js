import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import { getBooksQuery } from '../gql-calls/queries';
import Book from './Book';
import BookDetails from './BookDetails';

class BookList extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      selected: null
    }
  }

  getBookDetails = (id) => {
    this.setState({selected:id});
  }

  displayBooks = () => {
    const data = this.props.data
    if (!data || data.loading) {
      return (<div>Loading...</div>);
    }
    if (!data.books){ return <div className="error-message">I'm Sorry Dave. Something is wrong.</div> }
    return data.books
      .sort((a,b) => {
        const aGenre = a.genre;
        const bGenre = b.genre;
        if (aGenre === bGenre){
          const aTitle = a.name;
          return aTitle.localeCompare(b.name);
        }
        return aGenre.localeCompare(b.genre)
      })
      .map(x =>
        <Book bookData={x} key={x.id} selectBook={this.getBookDetails}/>
    )
  }
  render() {
    return (
      <div className="wrapper">
        <div className="book-list">
          <p>Click a title for details</p>
          <ul className="book-list__list">
            {this.displayBooks()}
          </ul>
        </div>
        {this.state.selected && <BookDetails bookId={this.state.selected}/>}
      </div>
    );
  }
}

// Bind the gql query to the BookList component
// gql response shows up in props as an object 'data'
// {data:{abc:123}, loading:false}
export default graphql(getBooksQuery)(BookList);
