'use client'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts'

const COLORS = [
    '#00d4ff', // accent (Cyan)
    '#ff6b35', // orange (Accent2)
    '#ffd700', // gold
    '#00ff88', // green
    '#ff4757', // danger (Red)
]

export default function GamesPieChart({ data = [] }) {
    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-surface border border-accent/20 p-4 rounded-xl shadow-glow-sm backdrop-blur-md">
                    <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">{payload[0].name}</p>
                    <div className="space-y-1">
                        <p className="font-orbitron font-black text-white text-md tracking-widest">{payload[0].value.toLocaleString()} Orders</p>
                        <p className="text-[10px] text-muted font-bold uppercase tracking-tighter italic">Ecosystem Dominance Level</p>
                    </div>
                </div>
            )
        }
        return null
    }

    return (
        <div className="card h-[400px] p-8 border-border relative overflow-hidden group">

            {/* Background Decor */}
            <div className="absolute top-4 left-8 text-5xl opacity-[0.03] select-none group-hover:scale-125 transition-transform duration-1000">
                🛸
            </div>

            <div className="mb-8">
                <h3 className="font-orbitron font-black text-sm text-white tracking-[0.2em] uppercase">Ecosystem Split</h3>
                <p className="text-[10px] font-black font-rajdhani text-muted uppercase tracking-[0.3em] mt-1 opacity-50">Market Share Acquisition</p>
            </div>

            <div className="w-full h-[260px] pb-4">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={5}
                            dataKey="value"
                            animationBegin={0}
                            animationDuration={1500}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                    stroke="rgba(255, 255, 255, 0.1)"
                                    strokeWidth={2}
                                    className="hover:opacity-80 transition-opacity cursor-pointer shadow-glow grayscale"
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            iconType="circle"
                            formatter={(value) => (
                                <span className="text-[10px] font-black font-rajdhani text-muted uppercase tracking-widest ml-2 group-hover:text-white transition-colors uppercase leading-none pb-2">{value}</span>
                            )}
                            layout="vertical"
                            verticalAlign="middle"
                            align="right"
                            wrapperStyle={{ paddingLeft: '20px' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Decorative Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-accent2/30 to-transparent" />

        </div>
    )
}