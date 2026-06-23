const gqlSchema = `#graphql
    # Scalar Types
    scalar Date

    # enums
    enum PoetBloggerReqStatus{
        requested
        accepted
        declined
    }

    enum AdminPoetBloggerReqStatus{
        accepted
        declined
    }

    enum PoetBloggerRole{
        blogger
        poet
    }

    enum ContentType{
        blog
        poem
    }

    enum CorrectionStatus{
        requested
        edited
        corrected
        declined
    }

    enum CorrectionStatusInputEnum{
        corrected
        declined
    }

    type Author {
        name: String!
        username: String!
        joinedAt: Date!
        about: String
    }

    type BlogComment {
        id: Int!
        blogId: Int!
        commentedBy: Author!
        commentContent: String!
        createdAt: Date!
        updatedAt: Date!
    }

    type PoemComment {
        id: Int!
        poemId: Int!
        commentedBy: Author!
        commentContent: String!
        createdAt: Date!
        updatedAt: Date!
    }

    # Data types
    type Blog {
        id: ID!
        title: String!
        description: String!
        content: String!
        createdAt: Date!
        updatedAt: Date!
        author: Author!
        likes: Int!
        comments: [BlogComment!]
    }

    type Poem{
        id: ID!
        title: String!
        content: String!
        createdAt: Date!
        updatedAt: Date!
        author: Author!
        likes: Int!
        comments: [PoemComment!]
    }

    type MyBlog {
        id: ID!
        title: String!
        description: String!
        content: String!
        createdAt: Date!
        updatedAt: Date!
        author: Author!
        likes: Int!
        comments: [BlogComment!]
        archive: Boolean!
    }

    type MyPoem{
        id: ID!
        title: String!
        content: String!
        createdAt: Date!
        updatedAt: Date!
        author: Author!
        likes: Int!
        comments: [PoemComment!]
        archive: Boolean!
    }

    type MyBlogComment{
      id: Int!
      blogId: Int!
      commentContent: String!
      createdAt: Date!
      updatedAt: Date!
      blog: Blog
    }

    type MyPoemComment{
      id: Int!
      poemId: Int!
      commentContent: String!
      createdAt: Date!
      updatedAt: Date!
      poem: Poem
    }

    type MyInfo{
        name: String!
        username: String!
        email: String!
        joinedAt: Date
        about: String
    }

    type OperationSuccessReturn {
        success: Boolean!
        message: String!
    }

    type PoetBloggerRequest {
        id: ID!
        sample: String!
        requestedBy: Author!
        requestedDate: Date!
        status: String!
        role: PoetBloggerRole!
    }

    type CorrectionContent {
        title: String!
        description: String
        content: String!
        createdAt: Date!
        updatedAt: Date!
        archive: Boolean!
    }

    type Correction{
        id: Int!
        correction: String!
        contentId: Int!
        contentType: ContentType!
        user: Author!
        deadline: Date!
        updatedAt:Date!
        status: CorrectionStatus!
        correctionContent: CorrectionContent
    }

    # Query types
    type Query {
        # Guest Queries
        getBlogs(by:String): [Blog!]
        getBlog(id: Int!): Blog 
        viewMyPoetBloggerRequests(role:PoetBloggerRole): [PoetBloggerRequest!] 
        viewMyPoetBloggerRequest(id:Int!): PoetBloggerRequest 
        viewUserInfo: MyInfo 
        getPoems(by: String): [Poem!]
        getPoem(id: Int!): Poem
        getMyBlogs: [MyBlog!]
        getMyBlog(id: Int!): MyBlog
        getMyPoems: [MyPoem!]
        getMyPoem(id: Int!): MyPoem
        getMyLikedBlogs: [Blog!]
        getMyLikedPoems: [Poem!]
        getMyBlogComments: [MyBlogComment!]
        getMyPoemComments: [MyPoemComment!]

        # Poet/Blogger Queries
        viewMyCorrectionRequests(type:ContentType): [Correction!]
        viewMyCorrectionRequest(id:Int!): Correction

        # Admin Queries
        getPoetBloggerRequests(status:PoetBloggerReqStatus, role:PoetBloggerRole): [PoetBloggerRequest!]
        getPoetBloggerRequest(id:Int!):PoetBloggerRequest
        getCorrectionRequests(type:ContentType): [Correction!] 
        getCorrectionRequest(id: Int!): Correction 
    }

    # Input types
    input BlogInput {
        title: String!
        description: String!
        content: String!
    }

    input PoemInput {
        title: String!
        content: String!
    }

    input BlogEditInput {
        title: String
        description: String
        content: String
    }

    input PoemEditInput {
        title: String
        content: String
    }

    input CorrectionInput{
        correction: String!
        contentId: Int!
        contentType: ContentType!
        deadline: Date!
    }

    input CommentInput{
        id: Int!
        comment: String!
    }


    # Mutation types
    type Mutation{
        # Authed-User
        editUserInfo(name:String, about:String):OperationSuccessReturn!
        likeBlog(blogid:Int!):OperationSuccessReturn!
        addBlogComment(data:CommentInput!):OperationSuccessReturn!
        likePoem(poemId:Int!):OperationSuccessReturn!
        addPoemComment(data:CommentInput!):OperationSuccessReturn!
        
        
        # Guest
        applyToBeBlogger(sample:String!): OperationSuccessReturn!
        applyToBePoet(sample:String!): OperationSuccessReturn! 
        
        # Blogger-Only
        addBlog(data:BlogInput!):ID!
        editBlog(id: Int!, data:BlogEditInput!):ID! 
        
        # Poet-Only
        addPoem(data:PoemInput!):ID!
        editPoem(id: Int!, data:PoemEditInput!):ID! 

        # Admin Mutations
        acceptDeclinePoetBloggerRequest(id:Int!, status:AdminPoetBloggerReqStatus!):OperationSuccessReturn!
        requestCorrectionForPoemOrBlog(data:CorrectionInput!):ID!
        changeCorrectionReqStatus(id: Int!, status: CorrectionStatusInputEnum! ):OperationSuccessReturn!
    }
`;

export default gqlSchema;
