"use client";

import CollectionContent from "@/components/Layout/Collection/CollectionContent";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateCollectionContent() {
  const { user } = useAuth();

  if (!user) return null;

  const mockCollection = {
    id: "temp-id",
    name: "",
    description: "",
    createdAt: new Date().toISOString(),
    user: { _id: user._id, username: user.username },
    titles: [],
  };

  return <CollectionContent collection={mockCollection} isCreating />;
}
