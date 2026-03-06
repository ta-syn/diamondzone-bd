export default function PackageSkeleton() {
    return (
        <div className="card p-5 border-border/50 bg-surface2/50 backdrop-blur-sm animate-pulse min-h-[140px] flex flex-col justify-between">
            <div>
                <div className="h-6 bg-white/10 rounded w-1/3 mb-2" />
                <div className="h-2 bg-white/5 rounded w-1/4" />
            </div>

            <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/10">
                <div className="h-5 bg-success/10 rounded w-1/4" />
                <div className="w-5 h-5 bg-white/5 rounded-full" />
            </div>
        </div>
    )
}