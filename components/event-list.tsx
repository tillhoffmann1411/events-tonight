"use client"

import { useState, useEffect, useMemo } from "react"
import { format, isSameDay, parseISO, isAfter, startOfDay } from "date-fns"
import { de } from "date-fns/locale"
import { Clock, MapPin, Music, Ticket } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Event } from "@/types/event"
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

interface EventListProps {
  events: Event[]
}

export default function EventList({ events }: EventListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const today = new Date()
  const startOfToday = startOfDay(today)

  // Group events by day
  const eventsByDay = useMemo(() => events.reduce<Record<string, Event[]>>(
    (acc, event) => {
      const dateStr = format(event.date, "yyyy-MM-dd")

      if (!acc[dateStr]) {
        acc[dateStr] = []
      }

      acc[dateStr].push(event)
      return acc
    },
    {} as Record<string, Event[]>,
  ), [events])

  // Sort days and filter out past days
  const sortedDays = useMemo(() =>
    Object.keys(eventsByDay)
      .filter(dateStr => {
        const date = parseISO(dateStr)
        return isSameDay(date, today) || isAfter(date, startOfToday)
      })
      .sort()
    , [eventsByDay, today, startOfToday])

  // Find today's date or the first date as default
  const todayStr = sortedDays.find((day) => isSameDay(parseISO(day), today))
  const [activeTab, setActiveTab] = useState("")

  // Set active tab to URL param, today, or first available date
  useEffect(() => {
    const tabFromUrl = searchParams.get('date')
    if (tabFromUrl && sortedDays.includes(tabFromUrl)) {
      setActiveTab(tabFromUrl)
    } else if (todayStr) {
      setActiveTab(todayStr)
    } else if (sortedDays.length > 0 && !activeTab) {
      setActiveTab(sortedDays[0])
    }
  }, [todayStr, sortedDays, activeTab, searchParams])

  // Update URL when active tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const params = new URLSearchParams(searchParams)
    params.set('date', value)
    router.replace(`?${params.toString()}`)
  }

  useEffect(() => {
    // Add the scrollbar hiding styles to the document
    const styleElement = document.createElement("style")
    styleElement.innerHTML = scrollbarHideStyles
    document.head.appendChild(styleElement)

    return () => {
      // Clean up on unmount
      document.head.removeChild(styleElement)
    }
  }, [])

  useEffect(() => {
    // Scroll active tab into view when it changes
    const activeTabElement = document.querySelector(`[data-value="${activeTab}"]`)
    if (activeTabElement) {
      activeTabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
    }
  }, [activeTab])

  // Wenn keine Events vorhanden sind
  if (sortedDays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Keine Events gefunden</h2>
        <p className="text-zinc-400">Derzeit sind keine Veranstaltungen geplant.</p>
      </div>
    )
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="mb-8 -mx-4 px-4 overflow-x-auto scrollbar-hide">
        <TabsList className="h-auto w-full inline-flex flex-nowrap justify-start gap-2 bg-transparent pb-2">
          {sortedDays.map((dateStr) => {
            const date = parseISO(dateStr)
            const isToday = isSameDay(date, today)
            const formattedDate = format(date, "EEEE, d. MMMM", { locale: de })

            return (
              <TabsTrigger
                key={dateStr}
                value={dateStr}
                data-value={dateStr}
                className={cn(
                  "rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 data-[state=active]:border-zinc-600 data-[state=active]:bg-zinc-800",
                  isToday && "border-emerald-900/60 text-emerald-300 data-[state=active]:border-emerald-800",
                )}
              >
                {isToday ? `Heute (${formattedDate})` : formattedDate}
              </TabsTrigger>
            )
          })}
        </TabsList>
      </div>

      {sortedDays.map((dateStr) => (
        <TabsContent key={dateStr} value={dateStr} className="mt-0">
          <div className="space-y-4">
            {eventsByDay[dateStr].map((event) => (
              <Card
                key={event.id}
                className="overflow-hidden border-zinc-800 bg-zinc-900/80 transition-all hover:bg-zinc-800/80"
              >
                <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto]">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold tracking-tight">{event.title}</h3>
                      <p className="text-sm font-medium uppercase text-zinc-400">{event.club?.name}</p>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-300">
                      <div className="flex items-center">
                        <Clock className="mr-1 h-4 w-4 text-zinc-500" />
                        {format(event.date, "HH:mm 'Uhr'", { locale: de })}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-zinc-500" />
                        {event.club?.name}
                      </div>
                      {event.dj && (
                        <div className="flex items-center">
                          <Music className="mr-1 h-4 w-4 text-zinc-500" />
                          {event.dj}
                        </div>
                      )}
                      {event.price && (
                        <div className="flex items-center">
                          <Ticket className="mr-1 h-4 w-4 text-zinc-500" />
                          {event.price}
                        </div>
                      )}
                    </div>

                    {event.description && <p className="text-sm text-zinc-400">{event.description}</p>}

                    {event.tags && event.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs font-medium text-zinc-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    {event.event_url && (
                      <Button asChild>
                        <Link href={event.event_url} target="_blank">
                          Zum Event
                        </Link>
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

// Add a CSS class to hide scrollbars but maintain functionality
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`
