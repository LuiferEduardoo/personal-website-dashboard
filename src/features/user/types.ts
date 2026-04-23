export type ImageRead = {
  id: number;
  name: string;
  folder: string | null;
  url: string;
  created_at: string;
  updated_at: string;
  removed_at: string | null;
};

export type UserRead = {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  profile_photo_id: number | null;
  profile_photo: ImageRead | null;
  created_at: string;
  updated_at: string;
};
