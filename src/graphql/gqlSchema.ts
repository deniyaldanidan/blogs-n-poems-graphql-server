const gqlSchema = `#graphql

    scalar Date

    type Blog {
        id: ID!
        title: String!
        description: String!
        content: String!
        createdAt: Date!
        updatedAt: Date!
        author: Author!
        # Author Model comes here
    }

    type Author {
        name: String!
        joinedAt: Date!
        about: String
    }

    type Query {
        getBlogs: [Blog!]!
        getBlog(id: Int!): Blog
    }

    input BlogInput {
        title: String!
        description: String!
        content: String!
    }

    type Mutation{
        addBlog(data:BlogInput!):ID
    }
`;

export default gqlSchema;
