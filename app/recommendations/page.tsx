'use client'

import { useEffect, useState } from 'react'
import { Event } from '@/types/event'
import { Club } from '@/types/club'
import { storage } from '../utils/storage'
import { getEventsFromLikedClubs, getAllClubs } from '../actions'
import { EventCard } from '../../components/event-card'
import { format, addWeeks, isSameDay } from 'date-fns'
import { de } from 'date-fns/locale'
import { Heart, ChevronDown, ChevronRight } from 'lucide-react'

interface EventGroup {
    date: Date
    events: Event[]
}

const ClubCard = ({ club, isLiked, onToggleLike }: { club: Club; isLiked: boolean; onToggleLike: (clubId: string) => void }) => (
    <div className="bg-zinc-900 rounded-lg p-4 flex justify-between items-start">
        <div>
            <h3 className="font-medium">{club.name}</h3>
            <p className="text-sm text-gray-400">{club.location}</p>
            {club.description && (
                <p className="text-sm text-gray-300 mt-2">{club.description}</p>
            )}
        </div>
        <button
            onClick={() => onToggleLike(club.id.toString())}
            className={`${isLiked ? 'text-red-500' : 'text-gray-400'} hover:text-red-400 transition-colors`}
        >
            <Heart className="h-6 w-6" fill={isLiked ? 'currentColor' : 'none'} />
        </button>
    </div>
)

const EventGroupComponent = ({ group }: { group: EventGroup }) => {
    const [isExpanded, setIsExpanded] = useState(false)
    const toggleExpanded = () => setIsExpanded(!isExpanded)

    return (
        <div className="mb-6">
            <button
                onClick={toggleExpanded}
                className="w-full flex items-center justify-between bg-zinc-800/50 p-3 rounded-lg mb-4 hover:bg-zinc-800/80 transition-colors"
            >
                <h3 className="text-lg font-medium">
                    {format(group.date, "EEEE, dd. MMMM yyyy", { locale: de })}
                </h3>
                {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
            </button>
            {isExpanded && (
                <div className="space-y-4 max-w-screen-md mx-auto">
                    {group.events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    )
}

const AllClubs = ({ clubs, likedClubIds }: { clubs: Club[]; likedClubIds: string[] }) => {
    const handleToggleLike = (clubId: string) => {
        storage.toggleLikedClub(clubId)
        // Refresh the page to update both sections
        window.location.reload()
    }

    return (
        <section className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">All Clubs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clubs.map((club) => (
                    <ClubCard
                        key={club.id}
                        club={club}
                        isLiked={likedClubIds.includes(club.id.toString())}
                        onToggleLike={handleToggleLike}
                    />
                ))}
            </div>
        </section>
    )
}

export default function RecommendationsPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [likedClubs, setLikedClubs] = useState<Club[]>([])
    const [allClubs, setAllClubs] = useState<Club[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const likedClubIds = storage.getLikedClubs()

            // Fetch all clubs
            const clubs = await getAllClubs()
            setAllClubs(clubs)

            // Filter liked clubs
            const liked = clubs.filter(club => likedClubIds.includes(club.id.toString()))
            setLikedClubs(liked)

            // Fetch events for liked clubs
            if (likedClubIds.length) {
                const recommendedEvents = await getEventsFromLikedClubs(likedClubIds)
                setEvents(recommendedEvents)
            }

            setLoading(false)
        }

        fetchData()
    }, [])

    const today = new Date()
    const twoWeeksFromNow = addWeeks(today, 2)
    const dateRange = `${format(today, 'dd.MM.yyyy')} - ${format(twoWeeksFromNow, 'dd.MM.yyyy')}`

    // Group events by day
    const eventGroups: EventGroup[] = events.reduce((groups: EventGroup[], event) => {
        const existingGroup = groups.find(group => isSameDay(group.date, event.date))
        if (existingGroup) {
            existingGroup.events.push(event)
        } else {
            groups.push({
                date: event.date,
                events: [event]
            })
        }
        return groups
    }, []).sort((a, b) => a.date.getTime() - b.date.getTime())

    return (
        <main className="min-h-screen bg-black text-white pb-20">
            <div className="container mx-auto px-4 py-12">
                <header className="mb-12 text-center">
                    <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">For You</h1>
                    <p className="text-gray-400">Events from your favorite clubs</p>
                </header>

                {loading ? (
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-white"></div>
                    </div>
                ) : (
                    <>
                        <section>
                            <div className="flex justify-between items-baseline mb-4">
                                <h2 className="text-2xl font-semibold">Upcoming Events</h2>
                                <span className="text-sm text-gray-400">{dateRange}</span>
                            </div>
                            {eventGroups.length > 0 ? (
                                eventGroups.map((group) => (
                                    <EventGroupComponent key={group.date.toISOString()} group={group} />
                                ))
                            ) : (
                                <div className="text-center text-gray-400 bg-zinc-900/50 rounded-lg p-8">
                                    <p>No upcoming events from your favorite clubs in the next two weeks</p>
                                    <p className="mt-2">Like some clubs to see their events here!</p>
                                </div>
                            )}
                        </section>

                        <AllClubs clubs={allClubs} likedClubIds={storage.getLikedClubs()} />
                    </>
                )}
            </div>
        </main>
    )
} 