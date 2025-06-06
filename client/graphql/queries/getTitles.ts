export const GET_TITLES = `
  query GetTitles(
    $filter: TitleFilterInput,
    $sort: TitleSortInput,
    $limit: Int,
    $offset: Int,
    $userId: ObjectID
  ) {
    titles(
      filter: $filter,
      sort: $sort,
      limit: $limit,
      offset: $offset,
      userId: $userId
    ) {
      total
      results {
        id
        name
        description
        cover
        type
        translation
        status
        franchise
        author {
          name
        }
        genres {
          name {
            en
            uk
            pl
          }
        }
        tags {
          name {
            en
            uk
            pl
          }
        }
        alt_names {
          lang
          value
        }
      }
    }
  }
`;
