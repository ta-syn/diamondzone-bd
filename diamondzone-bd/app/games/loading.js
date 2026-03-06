import { GameCardSkeleton } from '@/components/ui/Skeleton'

export default function GamesLoading() {
    return (
        <div className="min-h-screen bg-bg pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Skeleton */}
                <div className="text-center mb-16 animate-pulse">
                    <div className="w-1/3 h-10 bg-surface2 mx-auto mb-4 rounded-lg" />
                    <div className="w-1/4 h-4 bg-surface2 mx-auto rounded-lg" />
                </div>

                {/* Grid Skeleton (6 slots) */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <GameCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}