/* eslint-disable */
// Define Relationships Between Types
const graphql = require('graphql');
const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql;
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//Dummy Data
var bookz = [
  { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
  { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
  { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
  { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
  { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
  { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' }
];

var authorz = [
  { name: 'Patrick Rothfuss', age: 44, id: '1' },
  { name: 'Brandon Sanderson', age: 42, id: '2' },
  { name: 'Terry Pratchett', age: 66, id: '3' }
];
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*** Describe Object Types & Relationships ***/
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    // A func because we want a returned object
    // Only funcs can describe Type-Relations
    id: { type: GraphQLID }, // gQL ID is essentially type:any - really cast to String
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      // We want to use the related authorId to look up the actual Author
      // So we build a resolve() into the Type description that will get that &
      // extend the BookType
      type: AuthorType,
      resolve(parent, args) {
        // `parent` is the Book
        const ans = authorz.filter(x => x.id === parent.authorId);
        return ans[0];
      }
    }
  })
});

const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType), /** Many to One Relationship **/
      resolve(parent, args) {
        return bookz.filter(book => {
          if (book.authorId === parent.id) return book;
        });
      }
    }
  })
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*** Define All Queries Within RootQuery ***/
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: { // "book" = Name of query
      // expect request to be `book(id:'123'){ /*....*/ }
      type: BookType, // Expected return type
      args: { id: { type: GraphQLID } }, // Expected Arguments
  /*** HOW to Get the Data from the 'book' query ***/
      resolve(parent, args) {
        const ans = bookz.filter(x => x.id === args.id);
        return ans[0]; // gQL wants an Obj{} response, not Arr[]
      }
    },
    author: { // "author" query
      type: AuthorType, // return an AuthorType as defined above
      args: { id: { type: GraphQLID } }, // Expected Arguments
      resolve(parent, args) {
        const ans = authorz.filter(writer => writer.id === args.id);
        return ans[0];
      }
    },
    books: { // SELECT ALL
      type: new GraphQLList(BookType),
      resolve(parent,args){
        return bookz;
      }
    },
    authors: { // SELECT ALL
      type: new GraphQLList(AuthorType),
      resolve(parent,args){
        return authorz;
      }
    }
  }
});

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
module.exports = new GraphQLSchema({ query: RootQuery });
