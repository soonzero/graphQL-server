import { ApolloServer } from "apollo-server";

const server = new ApolloServer({typeDefs});

server.listen().then(({url}) => {
  console.log(`Running on ${url}`)
})