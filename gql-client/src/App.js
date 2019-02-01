import React, { Component } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

import BookList from './components/BookList';
import NewBookForm from './components/NewBookForm';

const SERVER = `http://localhost:7777/graphql` // *****

const client =  new ApolloClient({
  uri: SERVER
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div id="main">
          <h1>Books in a Graphql Database</h1>
          <BookList />
        </div>
        <div className="new-book-input">
          <NewBookForm />
        </div>
      </ApolloProvider>
    );
  }
}

  export default App;
