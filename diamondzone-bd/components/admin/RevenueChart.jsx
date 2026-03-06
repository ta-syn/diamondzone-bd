'use client'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts'

export default function RevenueChart({ data = [] }) {
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-accent/20 p-4 rounded-xl shadow-glow-sm backdrop-blur-md">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{label}</p>
                    <div className="space-y-1">
                        <p className="font-orbitron font-black text-white text-md">৳{payload[0].value.toLocaleString()}</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-tighter">{payload[1].value} Successful Orders</p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="card h-[400px] p-8 border-border relative overflow-hidden group">

            {/* Background Decor */}
            <div className="absolute top-4 right-8 text-5xl opacity-[0.03] select-none group-hover:scale-125 transition-transform duration-1000">
                📈
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
                <div>
                    <h3 className="font-orbitron font-black text-sm text-white tracking-[0.2em] uppercase">Revenue Trend</h3>
                    <p className="text-[10px] font-black font-rajdhani text-muted uppercase tracking-[0.3em] mt-1 opacity-50">7-Day Signal Analysis</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded bg-accent" />
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">Revenue</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded bg-accent2" />
                        <span className="text-[10px] font-black text-muted uppercase tracking-widest">Volume</span>
                    </div>
                </div>
            </div>

            <div className="w-full h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e2d3d" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6b8899', fontSize: 10, fontWeight: 'bold' }}
                            interval={'preserveStartEnd'}
                        />
                        <YAxis
                            hide={true}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            cursor={{ fill: 'rgba(0, 212, 255, 0.05)' }}
                        />
                        <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={24}>
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={index === data.length - 1 ? '#00d4ff' : '#0d1117'}
                                    stroke="#00d4ff"
                                    strokeWidth={index === data.length - 1 ? 0 : 1}
                                    className="transition-all duration-300 hover:fill-accent"
                                />
                            ))}
                        </Bar>
                        <Bar dataKey="orders" hide />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Decorative Bottom Line */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        </div>
    )
}