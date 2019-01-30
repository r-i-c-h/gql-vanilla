import {gql} from 'apollo-boost';

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
`

const getAuthorsQuery = gql`
  {
    authors {
      name
      id
    }
  }
`

// ACCEPTS VARIABLES FOR THE MUTATION from <NewBookForm />
// Put vars in mutation($someVariable:String)
// The name=$name thing is just convention
const addBookMutation = gql`
    mutation AddBook($name: String!, $genre: String!, $authorId: ID!){
        addNewBook(name: $name, genre: $genre, authorId: $authorId){
            name
            id
        }
    }
`;

export { getBooksQuery, getAuthorsQuery, addBookMutation };