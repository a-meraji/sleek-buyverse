export interface ProfileData {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  street_address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
}