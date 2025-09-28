export interface Pet {
  id?: string;
  user_id?: string;
  name: string;
  breed: string;
  personality: string;
  about: string;
  owner_name: string;
  owner_phone: string;
  owner_email: string;
  image_url?: string;
  qr_code?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email: string;
}