export type CommentType = {
  id: string;
  body: string;
  createdAt: string;
  subjectType: string;
  score: {
    likes: number;
    dislikes: number;
    likedBy: { _id: string }[];
    dislikedBy: { _id: string }[];
  };
  subject_ID: string;
  user: {
    _id: string;
    username: string;
  };
  title?: {
    id: string;
    name: string;
    alt_names?: {
      lang: string;
      value: string;
    }[];
  };
  parent?: { id: string };
};
