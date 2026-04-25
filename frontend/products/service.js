import { supabase } from "@/frontend/supabase/client";

const PRODUCTS_TABLE = "products";

export async function getProducts({ newestFirst = false } = {}) {
  let query = supabase.from(PRODUCTS_TABLE).select("*");

  if (newestFirst) {
    query = query.order("id", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function createProduct(product) {
  const { error } = await supabase.from(PRODUCTS_TABLE).insert([product]);

  if (error) {
    throw error;
  }
}

export async function deleteProduct(id) {
  const { error } = await supabase.from(PRODUCTS_TABLE).delete().eq("id", id);

  if (error) {
    throw error;
  }
}
