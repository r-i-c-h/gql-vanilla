import React, { Component } from 'react';
import {graphql} from 'react-apollo';
import { getBooksQuery } from '../gql-calls/queries';
import Book from './Book';

class BookList extends Component {
  renderDataFromGQL = () => {
    const data = this.props.data
    console.log(data);

    if (data.loading) {
      return (<div>Loading...</div>);
    }
    return data.books.map(x => <Book bookData={x} key={x.id} />)
  }
  render() {
    return (
      <div className="wrapper">
      <ul className="list">
        {this.renderDataFromGQL()}
      </ul>
      </div>
    );
  }
}

// Bind the gql query to the BookList component
// gql response shows up in props as an object 'data'
// {data:{abc:123}, loading:false}
export default graphql(getBooksQuery)(BookList);
