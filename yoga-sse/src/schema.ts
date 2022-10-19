import { makeExecutableSchema } from '@graphql-tools/schema'

const typeDefinitions = /* GraphQL */ `
  type Query {
    hello: String!
  }
  type Subscription {
    countdown(from: Int!): Int!
  }
`

const resolvers = {
  Query: {
    hello: () => "World",
  },
  Subscription: {
    countdown: {
        subscribe: async function* (_: any, { from }: any) {
            for (let i = from; i >= 0; i--) {
                await new Promise((resolve) => setTimeout(resolve, 1000))
                yield { countdown: i }
            }
        }
    }
  }
}

export const schema = makeExecutableSchema({
  resolvers: [resolvers],
  typeDefs: [typeDefinitions]
})
