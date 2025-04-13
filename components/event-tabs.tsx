import { useEffect } from "react"
import { format, isSameDay } from "date-fns"
import { de } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"

interface EventTabsProps {
    sortedDays: string[]
    activeTab: string
    today: Date
}

export const EventTabs = ({ sortedDays, activeTab, today }: EventTabsProps) => {
    useEffect(() => {
        // Scroll active tab into view when it changes
        const activeTabElement = document.querySelector(`[data-value="${activeTab}"]`)
        if (activeTabElement) {
            activeTabElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
        }
    }, [activeTab])

    return (
        <div className="w-full overflow-x-auto scrollbar-hide py-2">
            <TabsList className="h-12 w-full inline-flex flex-nowrap justify-start gap-2 px-4 bg-transparent">
                {sortedDays.map((dateStr) => {
                    const date = new Date(dateStr)
                    const isToday = isSameDay(date, today)
                    const formattedDate = format(date, "EEEE, d. MMMM", { locale: de })

                    return (
                        <TabsTrigger
                            key={dateStr}
                            value={dateStr}
                            data-value={dateStr}
                            className={cn(
                                "rounded-full border border-zinc-800 bg-zinc-900 px-4 py-2 data-[state=active]:text-zinc-300 data-[state=active]:border-zinc-600 data-[state=active]:bg-zinc-800",
                                isToday && "border-emerald-900/60 text-emerald-300 data-[state=active]:border-emerald-800",
                            )}
                        >
                            {isToday ? `Heute (${formattedDate})` : formattedDate}
                        </TabsTrigger>
                    )
                })}
            </TabsList>
        </div>
    )
} 