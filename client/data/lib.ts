import { BookCardProps } from "@/components/UI/Cards/BookCard/BookCard";
import { popularBooks } from "./popularBooks";
import { recommendedBooks } from "./recommendedBooks";

export const booksData: Record<
  string,
  () => Promise<BookCardProps[]>
> = {
  popularBooks,
  // recommendedBooks,
};