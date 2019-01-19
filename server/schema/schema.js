/* eslint-disable */
// Define Relationships Between Types
const graphql = require('graphql');
const Book = require('../mongo-models/book');
const Author = require('../mongo-models/author');

const {
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = graphql;
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
      resolve(parent, args) { // `parent` is the Book
        // const ans = authorz.filter(x => x.id === parent.authorId);
        // return ans[0];
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
        // return bookz.filter(book => {
        //   if (book.authorId === parent.id) return book;
        // });
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
        // const ans = bookz.filter(x => x.id === args.id);
        // return ans[0]; // gQL wants an Obj{} response, not Arr[]
      }
    },
    author: { // "author" query
      type: AuthorType, // return an AuthorType as defined above
      args: { id: { type: GraphQLID } }, // Expected Arguments
      resolve(parent, args) {
        // const ans = authorz.filter(writer => writer.id === args.id);
        // return ans[0];
      }
    },
    books: { // SELECT ALL
      type: new GraphQLList(BookType),
      resolve(parent,args){
        // return bookz;
      }
    },
    authors: { // SELECT ALL
      type: new GraphQLList(AuthorType),
      resolve(parent,args){
        // return authorz;
      }
    }
  }
});

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNewBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID }
      },
      resolve(parent, args){
        let newBookInstance = new Book({ // Book() is from the mongoose-model
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return newBookInstance.save(); // Part of MongoDB is that it will return whatever was .saved()
      }
    },
    addNewAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve(parent, args){
        let newAuthorInstance = new Author({ // Author() from mongoose-model
          name: args.name,
          age: args.age
        });
        return newAuthorInstance.save();
      }
    }
  }
})

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
module.exports = new GraphQLSchema({ query: RootQuery, mutation: Mutation });
