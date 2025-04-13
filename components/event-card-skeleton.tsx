import { Card } from "@/components/ui/card"

export const EventCardSkeleton = () => {
    return (
        <Card className="overflow-hidden border-zinc-800 bg-zinc-900/80">
            <div className="grid gap-4 md:grid-cols-[250px_1fr_auto]">
                <div className="hidden md:block h-full bg-zinc-800/50 animate-pulse" />
                <div className="space-y-3 p-5">
                    <div className="space-y-2">
                        <div className="h-6 w-2/3 bg-zinc-800/50 rounded animate-pulse" />
                        <div className="h-4 w-1/3 bg-zinc-800/50 rounded animate-pulse" />
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-2">
                        <div className="h-5 w-24 bg-zinc-800/50 rounded animate-pulse" />
                        <div className="h-5 w-32 bg-zinc-800/50 rounded animate-pulse" />
                        <div className="h-5 w-28 bg-zinc-800/50 rounded animate-pulse" />
                    </div>

                    <div className="h-16 w-full bg-zinc-800/50 rounded animate-pulse" />

                    <div className="flex flex-wrap gap-2">
                        <div className="h-5 w-16 bg-zinc-800/50 rounded-full animate-pulse" />
                        <div className="h-5 w-20 bg-zinc-800/50 rounded-full animate-pulse" />
                    </div>
                </div>

                <div className="flex items-center p-5">
                    <div className="h-9 w-24 bg-zinc-800/50 rounded animate-pulse" />
                </div>
            </div>
        </Card>
    )
} 