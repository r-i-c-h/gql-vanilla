/*eslint-disable*/
require('dotenv').config({ path: '../.env' });
const express = require('express');
const graphqlHTTP = require('express-graphql'); // No, it doesn't match the package name...
const mongoose = require('mongoose');
const cors = require('cors');

const schema = require('./schema/schema');
const PORT = process.env.PORT;
const mongoUser = process.env.MLAB_USER;
const mongoPass = process.env.MLAB_PASS;

const app = express();
app.use(cors());
mongoose.connect(`mongodb://${mongoUser}:${mongoPass}@ds161074.mlab.com:61074/gql-data-src`,  {useNewUrlParser: true});
mongoose.connection.once('open', ()=> { // on success callback func()
  console.log('Connected to mLab Database');
})

app.use( '/graphql', // Respond to requests to localhost:PORT/graphql
  graphqlHTTP({
    schema, //  This schema defines the graph and obj types on the graph - Not the Mongo schema
    graphiql: true // allow/activate graphiql interface
  })
);

app.listen(PORT, () => {
  console.log(`Server up listening for requests on http://localhost:${PORT}`);
});