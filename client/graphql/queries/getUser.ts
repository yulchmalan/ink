
export const GET_USER = `
  query GetUser($id: ObjectID!) {
    user(id: $id) {
      _id
      username
      email
      exp
      role
      createdAt
      last_online
      bio
      stats {
        materialsAdded
        titlesCreated
      }
      lists {
        name
        titles {
          title {
            id
            name
            cover
            type
            alt_names {
              lang
              value
            }
            chapterCount
          }
          rating
          progress
          last_open
          added
          language
        }
      }
      friends {
        user {
          _id
        }
        status
      }
    }
  }
`;
