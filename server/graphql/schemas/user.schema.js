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
        # title_ID: ObjectID
        rating: Int
        last_open: DateTime
        progres: Int
    }

    type List {
        name: String
        titles: [SavedTitle]
    }

    type Friend {
        # user_ID: ObjectID
        status: FriendStatus
    }

    type Settings {
        username: String
        bio: String
        pfp: String
        banner: String
    }

    type User {
        id: ObjectID!
        email: String
        password_hash: Password
        settings: Settings
        created: DateTime
        last_online: DateTime
        lists: [List]
        friends: [Friend]
        # reviews: [ObjectID]
        # comments: [ObjectID]
        # recommendations: [ObjectID]
        role: Role
    }

    type Query {
        users: [User]
    }
`;
