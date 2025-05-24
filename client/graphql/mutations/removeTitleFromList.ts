export const REMOVE_TITLE_FROM_LIST = `
    mutation RemoveTitleFromList($userId: ObjectID!, $titleId: ObjectID!) {
        removeTitleFromLists(userId: $userId, titleId: $titleId) {
            name
        }
    }
`;
