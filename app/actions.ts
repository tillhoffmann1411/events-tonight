"use server"

import { createServerClient } from "@/lib/supabase/server"
import type { Event } from "@/types/event"

// Funktion zum Abrufen aller Events mit Tags
export async function getEvents(): Promise<Event[]> {
  const supabase = createServerClient()

  // Abrufen aller Events mit Club-Informationen
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select(`
      *,
      club: clubs (
        *
      )
    `)
    .order("date", { ascending: true })

  if (eventsError) {
    console.error("Fehler beim Abrufen der Events:", eventsError)
    return []
  }

  if (!eventsData) {
    return []
  }

  // Parse dates into Date objects
  return eventsData.map(event => ({
    ...event,
    date: new Date(event.date),
    created_at: new Date(event.created_at)
  })) as Event[]
}
