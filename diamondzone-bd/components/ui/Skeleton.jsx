export function Skeleton({ className = '' }) {
    return <div className={`bg-surface2 rounded animate-pulse ${className}`} />
}

export function GameCardSkeleton() {
    return (
        <div className="card p-3 animate-pulse">
            <Skeleton className="h-32 w-full mb-3" />
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-full" />
        </div>
    )
}

export function PackageCardSkeleton() {
    return (
        <div className="card p-5 animate-pulse">
            <Skeleton className="h-6 w-32 mb-3" />
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-10 w-full" />
        </div>
    )
}

export function OrderRowSkeleton() {
    return (
        <tr className="border-b border-border">
            <td colSpan={6} className="p-4"><Skeleton className="h-5 w-full" /></td>
        </tr>
    )
}