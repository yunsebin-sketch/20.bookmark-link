export type BookmarkFolder = {
  id: string;
  name: string;
  count: number;
};

export type BookmarkLink = {
  id: string;
  title: string;
  url: string;
  description?: string;
  folderId: string;
};
