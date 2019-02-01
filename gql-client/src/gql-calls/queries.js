import { gql } from 'apollo-boost';

const getBooksQuery = gql`
  {
    books {
      name
      id
      genre
      author {
        name
      }
    }
  }
`;
// Given a book's id, return the id, name/genre
// the author's id/name & the id/name of other books by that author
const getBookQuery = gql`
  query($id: ID) {
    book(id: $id) {
      id
      name
      genre
      author {
        id
        name
        books {
          name
          id
        }
      }
    }
  }
`;
const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`;
// ACCEPTS VARIABLES FOR THE MUTATION from <NewBookForm />
// Put vars in mutation($someVariable:String)
// The name=$name thing is just convention
const addBookMutation = gql`
  mutation AddBook($name: String!, $genre: String!, $authorId: ID!) {
    addNewBook(name: $name, genre: $genre, authorId: $authorId) {
      name
      id
    }
  }
`;

const addAuthorMutation = gql`
  mutation AddAuthor($name: String!, $age: Int) {
    addNewAuthor(name: $name, age: $age) {
      name
      id
    }
  }
`;

export { getBooksQuery, getBookQuery, getAuthorsQuery, addBookMutation, addAuthorMutation };
