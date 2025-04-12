"use client"

import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/database"

// Erstellen des Supabase-Clients für clientseitige Operationen
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null

export function createBrowserClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL und Anon Key müssen in den Umgebungsvariablen definiert sein")
  }

  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey)
  return supabaseClient
}
