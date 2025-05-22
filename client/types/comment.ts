export type CommentType = {
  id: string;
  body: string;
  createdAt: string;
  score?: {
    likes: number;
    dislikes: number;
  };
  subject_ID: string;
  user: {
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
};
