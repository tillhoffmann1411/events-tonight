import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Erstellen des Supabase-Clients für serverseitige Operationen
export function createServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL und Anon Key müssen in den Umgebungsvariablen definiert sein")
  }

  return createClient<Database>(supabaseUrl, supabaseKey)
}
