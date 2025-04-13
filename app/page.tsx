import EventList from "@/components/event-list"

export default async function Home() {

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight md:text-5xl">Dance Cologne</h1>
        </header>
        <EventList
        />
      </div>
    </main>
  )
}
