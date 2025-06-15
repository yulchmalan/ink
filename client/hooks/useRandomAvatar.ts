import avatar1 from "@/assets/avatars/avatar1.png";
import avatar2 from "@/assets/avatars/avatar2.png";
import avatar3 from "@/assets/avatars/avatar3.png";
import avatar4 from "@/assets/avatars/avatar4.png";
import avatar5 from "@/assets/avatars/avatar5.png";
import avatar6 from "@/assets/avatars/avatar6.png";

const avatars = [avatar1, avatar2, avatar3, avatar4, avatar5, avatar6];

export const getDeterministicAvatar = (userId: string) => {
  const hash = [...userId].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const index = hash % avatars.length;
  return avatars[index];
};
