export type BookmarkFolder = {
  id: string;
  name: string;
};

export type BookmarkLink = {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnail?: string;
  folderId: string;
};
