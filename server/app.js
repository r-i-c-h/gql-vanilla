const express = require('express');
const graphqlHTTP = require('express-graphql'); // No, it doesn't match the package name...
const schema = require('./schema/schema');

const PORT = 7777;

const app = express();
/*eslint-disable*/
// bind express with graphql
app.use(
  '/graphql',
  // Respond to requests to localhost:PORT/graphql
  graphqlHTTP({
    schema,
    graphiql: true
  })
);

app.listen(PORT, () => {
  console.log(`Server up listening for requests on port http://localhost:${PORT}`);
});