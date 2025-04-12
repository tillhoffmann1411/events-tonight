import { Club } from './club'

export interface Event {
  id: number
  title: string
  club_id: number
  date: Date
  club?: Club
  dj?: string
  price?: string
  description?: string
  tags?: string[]
  created_at: Date
  event_url?: string
  image_url?: string
  identifier?: string
}
