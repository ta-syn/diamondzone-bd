/** @type {import('tailwindcss').Config} */
export default {
    content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                bg: '#060910',
                surface: '#0d1117',
                surface2: '#111820',
                border: '#1e2d3d',
                primary: '#00d4ff',
                secondary: '#ff0055',
                accent: '#00d4ff',
                accent2: '#ff6b35',
                gold: '#ffd700',
                success: '#00ff88',
                danger: '#ff4757',
                muted: '#6b8899',
            },
            fontFamily: {
                orbitron: ['Orbitron', 'monospace'],
                rajdhani: ['Rajdhani', 'sans-serif'],
            },
            boxShadow: {
                glow: '0 0 20px rgba(0,212,255,0.3)',
                'glow-lg': '0 0 40px rgba(0,212,255,0.4)',
                'glow-orange': '0 0 20px rgba(255,107,53,0.3)',
                'glow-green': '0 0 20px rgba(0,255,136,0.3)',
                'glow-secondary': '0 0 20px rgba(255,0,85,0.3)',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'ticker': 'ticker 30s linear infinite',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'fade-in': 'fadeIn 0.5s ease forwards',
                'slide-up': 'slideUp 0.4s ease forwards',
                'glitch': 'glitch 1.5s infinite linear alternate-reverse',
                'shake': 'shake 0.6s ease-in-out 1',
                'bounce-success': 'bounceSuccess 1.5s ease-out 1',
                'confetti': 'confetti 3s linear infinite',
            },
            keyframes: {
                float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
                ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
                pulseGlow: { '0%,100%': { boxShadow: '0 0 0 0 rgba(0,212,255,0.4)' }, '50%': { boxShadow: '0 0 0 8px rgba(0,212,255,0)' } },
                fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
                slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
                glitch: {
                    '0%, 100%': { transform: 'translate(0)' },
                    '20%, 60%': { transform: 'translate(-4px, 4px)' },
                    '40%, 80%': { transform: 'translate(4px, -4px)' }
                },
                shake: {
                    '0%, 100%': { transform: 'translateX(0)' },
                    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
                    '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
                },
                bounceSuccess: {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'scale(1) translateY(0)' },
                    '40%': { transform: 'scale(1.1) translateY(-10px)' },
                    '60%': { transform: 'scale(1.05) translateY(-5px)' }
                },
                confetti: {
                    '0%': { opacity: '0', transform: 'translateY(0) rotate(0deg)' },
                    '10%, 90%': { opacity: '1' },
                    '100%': { opacity: '0', transform: 'translateY(-300px) rotate(720deg)' }
                }
            },
        },
    },
    plugins: [],
}
