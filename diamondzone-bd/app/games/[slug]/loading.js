import { PackageCardSkeleton } from '@/components/ui/Skeleton'

export default function RechargeLoading() {
    return (
        <div className="min-h-screen bg-bg pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header Banner Skeleton */}
                <div className="w-full h-48 bg-surface2/50 rounded-2xl mb-12 animate-pulse overflow-hidden relative border border-border">
                    <div className="absolute inset-0 bg-grid opacity-5" />
                </div>

                {/* Two-Column Grid */}
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Left: Input Modules */}
                    <div className="flex-1 space-y-10">
                        {/* Packages Grid Skeleton */}
                        <div className="space-y-6">
                            <div className="w-48 h-4 bg-surface2 rounded" />
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-32 bg-surface2 rounded-xl border border-border/50 animate-pulse" />
                                ))}
                            </div>
                        </div>

                        {/* Order Input Skeleton */}
                        <div className="space-y-6">
                            <div className="w-48 h-4 bg-surface2 rounded" />
                            <div className="h-48 bg-surface2 rounded-xl border border-border/50 animate-pulse" />
                        </div>
                    </div>

                    {/* Right: Summary Modules */}
                    <aside className="w-full lg:w-[400px] flex-shrink-0 animate-pulse">
                        <div className="h-96 bg-surface2 rounded-2xl border border-border shadow-lg" />
                    </aside>

                </div>
            </div>
        </div>
    )
}