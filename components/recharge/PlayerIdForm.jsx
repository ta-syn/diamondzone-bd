'use client'
import { validatePlayerId, validateEmail, validatePhone } from '@/lib/validation.js'
import { useState } from 'react'

export default function PlayerIdForm({ game, playerData, onChange, errors: externalErrors }) {
    const [localErrors, setLocalErrors] = useState({})

    const validate = (field, value) => {
        let error = ''
        if (field === 'player_id') {
            if (!value) error = `${game.player_id_label} is required`
            else if (!validatePlayerId(value, game.slug)) error = `Invalid ${game.player_id_label} format`
        } else if (field === 'email') {
            if (!value) error = 'Email is required for receipt'
            else if (!validateEmail(value)) error = 'Invalid email address'
        } else if (field === 'phone' && value) {
            if (!validatePhone(value)) error = 'Invalid BD phone number'
        }

        setLocalErrors(prev => ({ ...prev, [field]: error }))
        return error
    }

    const handleBlur = (field) => {
        validate(field, playerData[field])
    }

    return (
        <div className="mb-10 animate-fade-in">
            <h3 className="font-rajdhani text-sm text-muted tracking-[0.3em] uppercase mb-4 font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent2 rounded-full animate-pulse" />
                02. Gamer Information
            </h3>

            <div className="card p-8 space-y-6 bg-surface2/50 backdrop-blur-sm border-border">
                {/* Player ID Field */}
                <div className="space-y-2 group">
                    <label className="text-xs font-black text-white font-rajdhani tracking-widest uppercase flex items-center gap-2">
                        {game.player_id_label}
                        <span className="text-accent2">*</span>
                    </label>
                    <div className="relative">
                        <input
                            name="player_id"
                            value={playerData.player_id}
                            onChange={(e) => onChange('player_id', e.target.value)}
                            onBlur={() => handleBlur('player_id')}
                            className={`input-field pr-12 ${localErrors.player_id ? 'border-danger/50' : 'border-border group-focus-within:border-accent'}`}
                            placeholder={game.player_id_hint?.includes('Example') ? game.player_id_hint : `Enter your ${game.name} ID`}
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted/30 pointer-events-none uppercase font-orbitron text-[10px] tracking-widest font-black">
                            Required
                        </div>
                    </div>
                    {game.player_id_hint && !localErrors.player_id && (
                        <p className="text-[10px] text-muted font-bold font-rajdhani tracking-wider flex items-center gap-2">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {game.player_id_hint}
                        </p>
                    )}
                    {localErrors.player_id && <p className="text-[10px] text-danger font-black tracking-widest animate-slide-up uppercase">{localErrors.player_id}</p>}
                </div>

                {/* Server Select (If applicable) */}
                {game.server_options?.length > 1 && (
                    <div className="space-y-2">
                        <label className="text-xs font-black text-white font-rajdhani tracking-widest uppercase">Select Ecosystem Server <span className="text-accent2">*</span></label>
                        <select
                            name="server"
                            value={playerData.server}
                            onChange={(e) => onChange('server', e.target.value)}
                            className="input-field appearance-none cursor-pointer"
                        >
                            <option value="">Choose Server</option>
                            {game.server_options.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email Field */}
                    <div className="space-y-2 group">
                        <label className="text-xs font-black text-white font-rajdhani tracking-widest uppercase flex items-center gap-2">
                            Email Address <span className="text-accent2">*</span>
                        </label>
                        <input
                            name="email"
                            type="email"
                            value={playerData.email}
                            onChange={(e) => onChange('email', e.target.value)}
                            onBlur={() => handleBlur('email')}
                            className={`input-field ${localErrors.email ? 'border-danger/50' : 'border-border'}`}
                            placeholder="For digital receipt"
                        />
                        {localErrors.email && <p className="text-[10px] text-danger font-black tracking-widest animate-slide-up uppercase">{localErrors.email}</p>}
                    </div>

                    {/* Phone Field */}
                    <div className="space-y-2 group">
                        <label className="text-xs font-black text-muted font-rajdhani tracking-widest uppercase">Phone (Optional)</label>
                        <input
                            name="phone"
                            value={playerData.phone}
                            onChange={(e) => onChange('phone', e.target.value)}
                            onBlur={() => handleBlur('phone')}
                            className={`input-field ${localErrors.phone ? 'border-danger/50' : 'border-border'}`}
                            placeholder="017xxxxxxxx"
                            maxLength={11}
                        />
                        {localErrors.phone && <p className="text-[10px] text-danger font-black tracking-widest animate-slide-up uppercase">{localErrors.phone}</p>}
                    </div>
                </div>
            </div>
        </div>
    )
}