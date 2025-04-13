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

    // Load available dates only once on mount
    useEffect(() => {
        const loadDates = async () => {
            setIsLoading(true)
            const dates = await getEventDates()
            const filteredDates = dates.filter(dateStr => {
                const date = parseISO(dateStr)
                return isSameDay(date, today) || isAfter(date, startOfToday)
            })
            setDates(filteredDates.map(dateStr => ({
                date: parseISO(dateStr),
                day: dateStr
            })))
            setIsLoading(false)
        }
        loadDates()
    }, []) // Empty dependency array as we only want this to run once

    // Handle tab changes and URL updates
    const handleTabChange = useCallback((value: string) => {
        setActiveTab(value)
        const params = new URLSearchParams(searchParams)
        params.set('date', value)
        router.replace(`?${params.toString()}`)
    }, [searchParams, router])

    // Set initial active tab
    useEffect(() => {
        if (dates.length === 0) return;
        const tabFromUrl = searchParams.get('date')
        if (tabFromUrl && dates.some(date => date.day === tabFromUrl)) { // if the tab from the url is in the dates array
            handleTabChange(tabFromUrl);
        } else {
            handleTabChange(dates[0].day);
        }
    }, [dates, searchParams])

    // Load events when tab changes
    useEffect(() => {
        const loadEvents = async () => {
            if (!activeTab) return
            setIsLoading(true)
            const newEvents = await getEventsByDate(activeTab)
            setEvents(newEvents)
            setIsLoading(false)
        }
        loadEvents()
    }, [activeTab])

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
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <EventTabs
                sortedDays={dates.map(date => date.day)}
                activeTab={activeTab}
                today={today}
            />

            {dates.map((date) => (
                <TabsContent key={date.day} value={date.day} className="mt-0">
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
