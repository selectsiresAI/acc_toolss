import { supabase } from "@/integrations/supabase/client";
import type { FarmAG, FarmAGInput } from "./types";

// The _ag tables live in the shared Plataform Supabase project but are not
// present in the generated Database types (we do not use Lovable Cloud here).
// We cast the client where needed to keep type-safety at the API boundary.
const db = supabase as unknown as {
  from: (t: string) => any;
};

export async function listFarmsAG(): Promise<FarmAG[]> {
  const { data, error } = await db
    .from("farms_ag")
    .select("*")
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as FarmAG[];
}

export async function getFarmAG(id: string): Promise<FarmAG> {
  const { data, error } = await db
    .from("farms_ag")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as FarmAG;
}

export async function createFarmAG(input: FarmAGInput): Promise<FarmAG> {
  const { data: userRes, error: userErr } = await supabase.auth.getUser();
  if (userErr) throw userErr;
  const user = userRes.user;
  if (!user) throw new Error("Usuário não autenticado.");

  const { data, error } = await db
    .from("farms_ag")
    .insert({ ...input, created_by: user.id })
    .select("*")
    .single();
  if (error) throw error;

  // Grant the creator access via user_farms_ag so RLS lets them see/edit it.
  const { error: linkErr } = await db.from("user_farms_ag").insert({
    user_id: user.id,
    farm_id: (data as FarmAG).id,
    role: "owner",
  });
  if (linkErr) throw linkErr;

  return data as FarmAG;
}

export async function updateFarmAG(id: string, input: Partial<FarmAGInput>): Promise<FarmAG> {
  const { data, error } = await db
    .from("farms_ag")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as FarmAG;
}

export async function deleteFarmAG(id: string): Promise<void> {
  const { error } = await db.from("farms_ag").delete().eq("id", id);
  if (error) throw error;
}
