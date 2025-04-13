"use server"

import { createServerClient } from "@/lib/supabase/server"
import type { Event } from "@/types/event"
import { startOfDay, endOfDay, format } from 'date-fns'

// Function to get all future dates that have events
export async function getEventDates(): Promise<string[]> {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from("events")
    .select('date')
    .gte('date', format(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ssXXX"))
    .order('date', { ascending: true })

  if (error) {
    console.error("Error fetching event dates:", error)
    return []
  }

  return [...new Set(data?.map(event => format(new Date(event.date), 'yyyy-MM-dd')) || [])]
}

// Function to get events for a specific date
export async function getEventsByDate(date: string): Promise<Event[]> {
  const supabase = createServerClient()

  // Convert the date string to the start and end of the day in ISO format with timezone
  const targetDate = new Date(date)
  const startDateISO = format(startOfDay(targetDate), "yyyy-MM-dd'T'HH:mm:ssXXX")
  const endDateISO = format(endOfDay(targetDate), "yyyy-MM-dd'T'HH:mm:ssXXX")

  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select(`
      *,
      club: clubs (
        *
      )
    `)
    .filter('date', 'gte', startDateISO)
    .filter('date', 'lt', endDateISO)
    .order('date', { ascending: true })
    .order('club_id', { ascending: true })

  if (eventsError) {
    console.error("Error fetching events for date:", eventsError)
    return []
  }

  if (!eventsData) {
    return []
  }

  return eventsData.map(event => ({
    ...event,
    date: new Date(event.date),
    created_at: new Date(event.created_at)
  })) as Event[]
}

// Legacy function to get all events (can be removed if not needed elsewhere)
export async function getEvents(): Promise<Event[]> {
  const supabase = createServerClient()

  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select(`
      *,
      club: clubs (
        *
      )
    `)
    .gte('date', format(startOfDay(new Date()), "yyyy-MM-dd'T'HH:mm:ssXXX"))
    .order('date', { ascending: true })

  if (eventsError) {
    console.error("Error fetching events:", eventsError)
    return []
  }

  if (!eventsData) {
    return []
  }

  return eventsData.map(event => ({
    ...event,
    date: new Date(event.date),
    created_at: new Date(event.created_at)
  })) as Event[]
}
