import { ApolloServer, gql } from "apollo-server";

let tweets = [
  {
    id: "1",
    text: "first",
    userId: "2"
  },
  {
    id: "2",
    text: "second",
    userId: "1"
  }
]

let users = [
  {
    id: "1",
    firstName: "zero",
    lastName: "soon",
  },
  {
    id: "2",
    firstName: "one",
    lastName: "soon",
  },
  {
    id: "3",
    firstName: "two",
    lastName: "soon"
  }
]

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    firstName: String!
    lastName: String!
    fullName: String!
  }
  type Tweet {
    id: ID!
    text: String!
    author: User
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }
  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    deleteTweet(id: ID!): Boolean!
  }
`

const resolvers = { 
  Query: {
    allUsers() {
      return users;
    },
    allTweets() {
      return tweets
    },
    tweet(_, { id }) {
      return tweets.find(i => i.id === id);
    }
  },
  Mutation: {
    postTweet(_, { text, userId }) {
      const existence = users.find(user => user.id === userId)
      if (!existence) return null;
      const newTweet = {
        id: tweets.length + 1,
        text,
        userId
      }
      tweets.push(newTweet)
      return newTweet;
    },
    deleteTweet(_, { id }) {
      const tweet = tweets.find(tweet => tweet.id === id)
      if (!tweet) return false;
      tweets = tweets.filter(tweet => tweet.id !== id)
      return true;
    }
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${lastName}${firstName}`
    }
  },
  Tweet: {
    author({ userId }) {
      return users.find(user => user.id === userId)
    }
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({url}) => {
  console.log(`Running on ${url}`)
})