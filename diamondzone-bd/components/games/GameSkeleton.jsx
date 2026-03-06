export default function GameSkeleton() {
    return (
        <div className="card p-4 border-border/50 bg-surface2/50 backdrop-blur-sm animate-pulse flex flex-col items-center">
            {/* Visual Area Skeleton */}
            <div className="w-full aspect-square rounded-xl bg-white/5 mb-5" />

            {/* Title Area Skeleton */}
            <div className="w-full space-y-3">
                <div className="h-3 bg-white/10 rounded w-2/3 mx-auto" />
                <div className="h-2 bg-white/5 rounded w-1/2 mx-auto" />
                <div className="h-8 bg-white/5 rounded-lg w-full mt-4" />
            </div>
        </div>
    )
}