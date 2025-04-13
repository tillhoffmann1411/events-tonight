"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { isSameDay, parseISO, isAfter, startOfDay } from "date-fns"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import type { Event } from "@/types/event"
import { useRouter, useSearchParams } from 'next/navigation'
import { EventCard } from "./event-card"
import { EventTabs } from "./event-tabs"
import { EmptyState, LoadingState } from "./event-states"
import { EventCardSkeleton } from "./event-card-skeleton"
import { scrollbarHideStyles } from "@/styles/scrollbar-hide"
import { getEventDates, getEventsByDate } from "@/app/actions"

function EventListContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const today = new Date()
    const startOfToday = startOfDay(today)

    const [dates, setDates] = useState<{ date: Date, day: string }[]>([]) // day format: YYYY-MM-DD
    const [activeTab, setActiveTab] = useState("") // format: YYYY-MM-DD
    const [events, setEvents] = useState<Event[]>([])
    const [isLoading, setIsLoading] = useState(false)

    // Load available dates and set initial active tab
    useEffect(() => {
        const loadDates = async () => {
            setIsLoading(true)
            const dates = await getEventDates()
            const filteredDates = dates.filter(dateStr => {
                const date = parseISO(dateStr)
                return isSameDay(date, today) || isAfter(date, startOfToday)
            })
            const formattedDates = filteredDates.map(dateStr => ({
                date: parseISO(dateStr),
                day: dateStr
            }))
            setDates(formattedDates)

            // Set initial active tab and load its events
            if (formattedDates.length > 0) {
                const tabFromUrl = searchParams.get('date')
                const initialTab = tabFromUrl && formattedDates.some(date => date.day === tabFromUrl)
                    ? tabFromUrl
                    : formattedDates[0].day

                setActiveTab(initialTab)
                const initialEvents = await getEventsByDate(initialTab)
                setEvents(initialEvents)
            }
            setIsLoading(false)
        }
        loadDates()
    }, []) // Initial load only

    // Handle tab changes and URL updates
    const handleTabChange = useCallback(async (value: string) => {
        setIsLoading(true)
        setActiveTab(value)
        const params = new URLSearchParams(searchParams)
        params.set('date', value)
        router.replace(`?${params.toString()}`)
        const newEvents = await getEventsByDate(value)
        setEvents(newEvents)
        setIsLoading(false)
    }, [searchParams, router])

    useEffect(() => {
        const styleElement = document.createElement("style")
        styleElement.innerHTML = scrollbarHideStyles
        document.head.appendChild(styleElement)
        return () => {
            document.head.removeChild(styleElement)
        }
    }, [])

    if (dates.length === 0 && !isLoading) {
        return <EmptyState />
    }

    return (
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full min-h-screen">
            <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
                <EventTabs
                    sortedDays={dates.map(date => date.day)}
                    activeTab={activeTab}
                    today={today}
                />
            </div>

            <div className="pt-16">
                {dates.map((date) => (
                    <TabsContent key={date.day} value={date.day} className="px-4">
                        <div className="space-y-4">
                            {isLoading ? (
                                <>
                                    <EventCardSkeleton />
                                    <EventCardSkeleton />
                                </>
                            ) : (
                                events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))
                            )}
                        </div>
                    </TabsContent>
                ))}
            </div>
        </Tabs>
    )
}

export default function EventList() {
    return (
        <Suspense fallback={<LoadingState />}>
            <EventListContent />
        </Suspense>
    )
}
