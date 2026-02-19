import React from 'react'

const Header = ({ exchangeRate, setExchangeRate }) => {
    return (
        <header className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 md:mb-8 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white/20 shadow-sm sticky top-2 z-50">

            {/* Brand Section */}
            <div className="flex flex-row items-center gap-3 md:gap-6 animate-fade-in-down w-full md:w-auto justify-center md:justify-start">
                {/* Logo Integration */}
                <div className="bg-white p-2 md:p-3 rounded-xl shadow-sm border border-gray-100 transform hover:scale-105 transition-transform duration-300">
                    <img src="/sisbesh.png" alt="Sisbesh Logo" className="h-12 md:h-20 w-auto object-contain" />
                </div>

                <div className="flex flex-col text-left">
                    <h1 className="text-lg md:text-3xl font-extrabold text-accent-secondary tracking-widest uppercase drop-shadow-sm leading-tight">
                        SİSBECH
                    </h1>
                    <span className="text-xs md:text-sm font-bold text-accent-primary tracking-[0.2em] uppercase">
                        Transaction
                    </span>
                </div>
            </div>

            {/* Rate Section */}
            <div className="bg-white px-4 py-2 md:px-5 md:py-3 rounded-xl shadow-soft border border-gray-100 flex items-center gap-3 transform hover:scale-105 transition-all duration-300 w-full md:w-auto justify-between md:justify-start">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-text-muted text-xs md:text-sm font-bold uppercase tracking-wide">Taux USD/FCFA</span>
                </div>
                <input
                    type="number"
                    value={exchangeRate}
                    onChange={(e) => setExchangeRate(Number(e.target.value))}
                    className="bg-bg-input border border-gray-200 text-accent-primary font-bold rounded-lg px-2 py-1 w-20 md:w-24 text-right focus:outline-none focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 transition-all text-sm md:text-base shadow-inner"
                />
            </div>
        </header>
    )
}

export default Header
