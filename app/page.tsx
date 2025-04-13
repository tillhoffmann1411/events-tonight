import EventList from "@/components/event-list"
import { getEvents } from "@/app/actions"

export default async function Home() {
  const events = await getEvents()

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">Dance Cologne</h1>
          <p className="text-lg text-zinc-400">Your Guide to the best dance events in Cologne.</p>
        </header>
        <EventList events={events} />
      </div>
    </main>
  )
}
