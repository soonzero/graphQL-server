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
  """
  User의 대략적인 정보를 의미한다.
  """
  type User {
    """
    해당 User의 고유 인덱스를 의미한다
    """
    id: ID!
    """
    해당 User의 username을 의미한다. 
    """
    username: String!
    """
    해당 User의 이름을 의미한다.
    """
    firstName: String!
    """
    해당 User의 성을 의미한다.
    """
    lastName: String!
    """
    User의 이름과 성을 결합한 것을 의미한다. 
    """
    fullName: String!
  }
  """
  Tweet의 리소스를 나타낸다. 
  """
  type Tweet {
    """
    해당 Tweet의 고유 인덱스를 나타낸다.
    """
    id: ID!
    """
    해당 Tweet의 내용을 나타낸다.
    """
    text: String!
    """
    해당 Tweet을 작성한 User를 나타낸다.
    """
    author: User
  }
  type Query {
    """
    모든 User의 리스트를 나타낸다.
    """
    allUsers: [User!]!
    """
    모든 Tweet의 리스트를 나타낸다.
    """
    allTweets: [Tweet!]!
    """
    특정 인덱스에 해당하는 Tweet을 나타낸다.
    """
    tweet(id: ID!): Tweet
  }
  type Mutation {
    """
    Tweet을 작성하고, 성공 시 해당 Tweet을 반환한다.
    """
    postTweet(text: String!, userId: ID!): Tweet
    """
    특정 인덱스에 해당하는 Tweet을 찾아서, 있으면 삭제하고 true를 반환하며, 없으면 false를 반환한다.
    """
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