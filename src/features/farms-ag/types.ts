export interface FarmAG {
  id: string;
  name: string;
  code: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export type FarmAGInput = Omit<FarmAG, "id" | "created_at" | "updated_at" | "created_by">;
