export const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Keine Events gefunden</h2>
        <p className="text-zinc-400">Derzeit sind keine Veranstaltungen geplant.</p>
    </div>
)

export const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-4">Lade Events...</h2>
        <p className="text-zinc-400">Die Veranstaltungen werden geladen.</p>
    </div>
) 