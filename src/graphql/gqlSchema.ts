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


    type Author {
        name: String!
        username: String!
        joinedAt: Date!
        about: String
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
        # Likes-Count
        # Comments - Comment
    }

    type Poem{
        id: ID!
        title: String!
        content: String!
        createdAt: Date!
        updatedAt: Date!
        author: Author!
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

    # [FINAL] WATCH EACH ENDPOINTS FLOW

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
        # My-Blogs
        # My-Blog
        # My-Poems
        # My-Poem

        # Poet/Blogger Queries
        # View my correction queries (NOW-0)
        viewMyCorrectionRequests(type:ContentType): [Correction!] # Haven't TESTED YET!
        # View my correction Query (NOW-1)
        viewMyCorrectionRequest(id:Int!): Correction # Haven't TESTED YET!

        # Admin Queries
        getPoetBloggerRequests(status:PoetBloggerReqStatus, role:PoetBloggerRole): [PoetBloggerRequest!]
        getPoetBloggerRequest(id:Int!):PoetBloggerRequest
        # GET CORRECTION REQUESTS (NOW-2)
        getCorrectionRequests(type:ContentType): [Correction!] # NOT IMPLEMENTED YET!
        # GET CORRECTION REQUEST (NOW-3)
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

    input CorrectionInput{
        correction: String!
        contentId: Int!
        contentType: ContentType!
        deadline: Date!
    }


    # Mutation types
    type Mutation{
        # Authed-User
        editUserInfo(name:String, about:String):OperationSuccessReturn!
        # LIKE A BLOG (NOW-6)
        # COMMENT ON A BLOG (NOW-7)
        # LIKE A POEM (NOW-8)
        # COMMENT ON A POEM (NOW-9)
        
        # Guest
        applyToBeBlogger(sample:String!): OperationSuccessReturn!
        applyToBePoet(sample:String!): OperationSuccessReturn! 
        
        # Blogger-Only
        addBlog(data:BlogInput!):ID!
        editBlog(data:BlogInput):ID! # (NOW-4)
        
        # Poet-Only
        addPoem(data:PoemInput!):ID!
        editPoem(data:PoemInput):ID! # (NOW-5)

        # Admin Mutations
        acceptDeclinePoetBloggerRequest(id:Int!, status:AdminPoetBloggerReqStatus!):OperationSuccessReturn!
        requestCorrectionForPoemOrBlog(data:CorrectionInput!):ID!
        # CHANGE-CORRECTION-REQUEST-STATUS # (NOW-5.5)
    }
`;

export default gqlSchema;
