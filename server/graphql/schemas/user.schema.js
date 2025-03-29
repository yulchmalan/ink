export const userTypeDefs = `#graphql
    scalar Password
    
    enum Role {
        USER 
        MODERATOR
        ADMIN
        OWNER
    }

    enum FriendStatus {
        PENDING
        ACCEPTED
        REJECTED
    }

    type SavedTitle {
        title: Title
        rating: Int
        last_open: DateTime
        progres: Int
    }

    type List {
        name: String
        titles: [SavedTitle]
    }

    type Friend {
        user: User
        status: FriendStatus
    }

    type Settings {
        username: String
        bio: String
        pfp: String
        banner: String
    }

    type User {
        _id: ObjectID!
        email: EmailAddress
        password_hash: Password
        settings: Settings
        created: DateTime
        last_online: DateTime
        lists: [List]
        friends: [Friend!]
        reviews: [Review!]
        comments: [Comment!]
        recommendations: [Title!]
        role: Role
    }

    type Query {
        users: [User]
        user(id: ObjectID!): User
    }

    type Mutation {
        deleteUser(id: ObjectID!): User
        addUser(user: AddUserInput!): User
        updateUser(id: ObjectID!, edits: EditUserInput!): User
    }

    input AddSettingsInput {
        username: String!
    }

    input AddUserInput {
        email: EmailAddress!
        password_hash: Password!
        settings: AddSettingsInput!
    }

    input EditSettingsInput {
        username: String
        bio: String
        pfp: String
        banner: String
    }

    input EditFriendInput {
        user: User
        status: FriendStatus
    }  

    input EditSavedTitleInput {
        title: Title
        rating: Int
        last_open: DateTime
        progres: Int
    }

    input EditListInput {
        name: String
        titles: [EditSavedTitleInput]
    }

    input EditUserInput {
        email: EmailAddress
        password_hash: Password
        settings: EditSettingsInput
        created: DateTime
        last_online: DateTime
        lists: [EditListInput!]
        friends: [EditFriendInput!]
        reviews: [Review]
        comments: [Comment]
        recommendations: [Title]
        role: Role
    }
`;
