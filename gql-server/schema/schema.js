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
  GraphQLString,
  GraphQLNonNull
} = graphql;
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*** Describe Object Types & Relationships ***/
// Kinda like Models, but technically not db-models, just gQL stuff...
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID }, // gQL ID is essentially type:any - really cast to String
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    author: {
      // We want to use the related authorId to look up the actual Author
      // So we build a resolve() into the Type description that will get that &
      // extend the BookType
      type: AuthorType,
      resolve(parent, args) { // `parent` is the Book
        return Author.findById(parent.authorId);
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
        return Book.find({authorId: parent.id});
      }
    }
  })
});
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*** QUERY DEFs: Define All Queries Within RootQuery ***/
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: { // "book" = Name of query
      type: BookType, // Expected return type as defined above
      args: { id: { type: GraphQLID } }, // Expected Arguments
      resolve(parent, args) {
/*** HOW to Get the Data ***/
        return Book.findById(args.id);
      }
    },
    author: { // "author" query
      type: AuthorType, // return an AuthorType as defined above
      args: { id: { type: GraphQLID } }, // Expected Arguments
      resolve(parent, args) {
        return Author.findById(args.id);
      }
    },
    books: { // SELECT ALL
      type: new GraphQLList(BookType),
      resolve(parent,args){
        return Book.find({}); // Mongoose .find w/out args (empty obj{}) matches all.
      }
    },
    authors: { // SELECT ALL
      type: new GraphQLList(AuthorType),
      resolve(parent,args){
        return Author.find({});
      }
    }
  }
});
/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
/*** MUTATION Add\Del DEFs ***/
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addNewBook: {
      type: BookType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        genre: { type: GraphQLString },
        authorId: { type: new GraphQLNonNull(GraphQLID) }
      },
      resolve(parent, args){
        let newBookInstance = new Book({ // Book() is from the mongoose-model
          name: args.name,
          genre: args.genre,
          authorId: args.authorId
        });
        return newBookInstance.save(); // MongoDB's .save() returns whatever was saved
      }
    },
    addNewAuthor: {
      type: AuthorType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
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