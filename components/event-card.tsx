import { Clock, MapPin, Music, Ticket } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Event } from "@/types/event"
import Link from 'next/link'
import Image from 'next/image'
import { format } from "date-fns"
import { de } from "date-fns/locale"

interface EventCardProps {
    event: Event
}

export const EventCard = ({ event }: EventCardProps) => {
    return (
        <Card className="overflow-hidden border-zinc-800 bg-zinc-900/80 transition-all hover:bg-zinc-800/80">
            <div className="grid gap-4 md:grid-cols-[250px_1fr_auto]">
                {event.image_url ? (
                    <div className="relative h-[200px] w-full md:h-full">
                        <Image
                            src={event.image_url}
                            alt={event.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 250px"
                        />
                    </div>
                ) : (
                    <div className="hidden md:block" />
                )}
                <div className="space-y-3 p-5">
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

                <div className="flex items-center p-5">
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
    )
} 