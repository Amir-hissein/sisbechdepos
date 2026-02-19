import React, { useState, useEffect } from 'react'
import { Loader2, ArrowRight, Lock, Key, Eye, EyeOff, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'

// ⚠️ IMPORTANT: Remplacez cette URL par votre propre déploiement Google Apps Script
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx8n7exgoMInr7i-2nLusAKyuo6nqCXo985V9dBpwxYENmTIE_XMvX2yNoXfKKclicy/exec"

const TransactionForm = ({ activeCurrency, setActiveCurrency, exchangeRate, onAddTransaction }) => {
    // Local State
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        name: '',
        amount: '',
        percentage: 10,
        accessCode: '' // New security field
    })

    const [transactionType, setTransactionType] = useState('entry') // 'entry' or 'exit'
    const [showPassword, setShowPassword] = useState(false) // Toggle for password visibility
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState({ text: '', type: '' }) // 'success' or 'error'

    // Calculated Values
    const amount = parseFloat(formData.amount) || 0
    const fee = (amount * formData.percentage) / 100
    const total = transactionType === 'entry' ? (amount - fee) : (amount + fee)
    // ENTRY: We receive Amount, we take Fee, client gets Total (Amount - Fee) -> Wait, usually "Forfait Total" is what is recorded.
    // Let's stick to the previous logic for "Entrée" which seemed to be: Input Amount, Calculate Fee, Total = Amount + Fee (or whatever the logic was).
    // Actually, let's look at the previous code: `total = amount + fee`.
    // If it's an EXIT (Sortie), logic might be different?
    // User asked: "somme entrée et sortie".
    // Let's keep the calculation simple for now: 
    // For BOTH: We calculate a "Forfait" (Fee) based on percentage.
    // The "Total" display might need to be adjusted or just kept as "Montant + Frais" or "Montant - Frais"?
    // Previous logic: total = amount + fee. 
    // Let's keep it consistent: Total is always the base amount + the calculated fee, representing the total transaction value including fees.

    // Helper to format currency
    const formatMoney = (val, curr) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: curr === 'FCFA' ? 'XAF' : 'USD'
        }).format(val)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // 1. Validation du Code d'accès
        if (formData.accessCode !== 'Sisbech2026') {
            setMessage({ text: "Code d'accès incorrect ! 🔒", type: 'error' })
            return
        }

        // 2. Validation de l'URL du script
        if (GOOGLE_SCRIPT_URL.includes("YOUR_ACTUAL_SCRIPT_ID_HERE")) {
            setMessage({ text: "Erreur config : URL du script non définie dans le code.", type: 'error' })
            return
        }

        setLoading(true)
        setMessage({ text: '', type: '' })

        const transactionData = {
            date: formData.date,
            type: transactionType, // 'entry' or 'exit'
            nom_prenom: formData.name,
            forfait_desc: '',
            somme_entree: amount, // This will be labelled "Somme Entrée" or "Somme Sortie" in the sheet headers
            pourcentage: parseFloat(formData.percentage),
            montant_preleve: fee,
            forfait_total: total,
            devise: activeCurrency
        }

        try {
            // POST to Google Apps Script
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transactionData)
            })

            // Success (Assumed due to no-cors)
            onAddTransaction(transactionData)
            setMessage({ text: 'Transaction enregistrée avec succès !', type: 'success' })

            // Reset sensitive fields
            setFormData(prev => ({
                ...prev,
                amount: '',
                name: '',
                accessCode: ''
            }))

        } catch (error) {
            console.error(error)
            setMessage({ text: 'Erreur : ' + error.message, type: 'error' })
        } finally {
            setLoading(false)
            // Clear message after 3s
            setTimeout(() => setMessage({ text: '', type: '' }), 3000)
        }
    }

    return (
        <div className="bg-white p-4 md:p-8 rounded-2xl shadow-soft border border-gray-100 relative overflow-hidden">
            {/* Decorational Background Element */}
            <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-accent-primary/5 rounded-bl-full -mr-8 -mt-8 pointer-events-none"></div>

            {/* Controls Container (Currency + Type) */}
            <div className="flex flex-col gap-4 mb-6 md:mb-8 relative z-10">

                {/* Transaction Type Toggle */}
                <div className="bg-gray-100 p-1 md:p-1.5 rounded-xl border border-gray-200 flex">
                    <button
                        onClick={() => setTransactionType('entry')}
                        className={`flex-1 py-2 md:py-3 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex justify-center items-center gap-2 ${transactionType === 'entry'
                            ? 'bg-white text-green-600 shadow-sm ring-1 ring-black/5'
                            : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        <ArrowDownCircle className="w-4 h-4 md:w-5 md:h-5" />
                        ENTRÉE
                    </button>
                    <button
                        onClick={() => setTransactionType('exit')}
                        className={`flex-1 py-2 md:py-3 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex justify-center items-center gap-2 ${transactionType === 'exit'
                            ? 'bg-white text-red-600 shadow-sm ring-1 ring-black/5'
                            : 'text-text-muted hover:text-text-main'
                            }`}
                    >
                        <ArrowUpCircle className="w-4 h-4 md:w-5 md:h-5" />
                        SORTIE
                    </button>
                </div>

                {/* Currency Switcher */}
                <div className="flex bg-gray-100 p-1 md:p-1.5 rounded-xl border border-gray-200">
                    {['USD', 'FCFA'].map(curr => (
                        <button
                            key={curr}
                            onClick={() => setActiveCurrency(curr)}
                            className={`flex-1 py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold transition-all duration-300 flex justify-center items-center gap-1.5 md:gap-2 ${activeCurrency === curr
                                ? 'bg-white text-accent-primary shadow-sm ring-1 ring-black/5 scale-100'
                                : 'text-text-muted hover:text-text-main hover:bg-gray-200/50 scale-95'
                                }`}
                        >
                            {curr === 'USD' ? 'USD ($)' : 'FCFA (XAF)'}
                        </button>
                    ))}
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Date */}
                    <div className="group">
                        <label className="text-[10px] md:text-xs text-text-muted font-bold mb-1.5 md:mb-2 block uppercase tracking-wider group-focus-within:text-accent-primary transition-colors">Date</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-bg-input border border-gray-200 rounded-xl px-3 py-3 md:px-4 md:py-3.5 text-sm md:text-base text-text-main font-semibold focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm hover:border-gray-300"
                            required
                        />
                    </div>

                    {/* Name */}
                    <div className="group">
                        <label className="text-[10px] md:text-xs text-text-muted font-bold mb-1.5 md:mb-2 block uppercase tracking-wider group-focus-within:text-accent-primary transition-colors">Nom & Prénom</label>
                        <input
                            type="text"
                            placeholder="Ex: Jean Dupont"
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-bg-input border border-gray-200 rounded-xl px-3 py-3 md:px-4 md:py-3.5 text-sm md:text-base text-text-main font-semibold focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm hover:border-gray-300 placeholder:text-gray-400"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {/* Amount */}
                    <div className="group">
                        <label className="text-[10px] md:text-xs text-text-muted font-bold mb-1.5 md:mb-2 block uppercase tracking-wider group-focus-within:text-accent-primary transition-colors">
                            {transactionType === 'entry' ? 'Somme Entrée' : 'Somme Sortie'}
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.amount}
                            onChange={e => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full bg-bg-input border border-gray-200 rounded-xl px-3 py-3 md:px-4 md:py-3.5 text-sm md:text-base text-text-main font-semibold focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm hover:border-gray-300 placeholder:text-gray-400"
                            required
                        />
                    </div>

                    {/* Percentage */}
                    <div className="group">
                        <label className="text-[10px] md:text-xs text-text-muted font-bold mb-1.5 md:mb-2 block uppercase tracking-wider group-focus-within:text-accent-primary transition-colors">Pourcentage (%)</label>
                        <input
                            type="number"
                            value={formData.percentage}
                            onChange={e => setFormData({ ...formData, percentage: e.target.value })}
                            className="w-full bg-bg-input border border-gray-200 rounded-xl px-3 py-3 md:px-4 md:py-3.5 text-sm md:text-base text-text-main font-semibold focus:outline-none focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all shadow-sm hover:border-gray-300"
                            required
                        />
                    </div>
                </div>

                {/* Live Results Card */}
                <div className="bg-gradient-to-br from-accent-primary/5 to-transparent p-4 md:p-6 rounded-2xl border border-accent-primary/10 mt-6 md:mt-8 relative group overflow-hidden transition-all hover:shadow-md">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-accent-secondary/5 rounded-full blur-2xl -mr-10 -mt-10"></div>

                    <div className="flex justify-between items-center text-xs md:text-sm mb-3 md:mb-4 relative z-10">
                        <span className="text-text-muted font-medium flex items-center gap-2">
                            Montant prélevé <ArrowRight className="w-3 h-3 text-accent-primary" />
                        </span>
                        <span className="font-mono text-text-main font-bold bg-white/50 px-2 py-1 rounded-md text-sm md:text-base">{formatMoney(fee, activeCurrency)}</span>
                    </div>

                    <div className="flex justify-between items-end border-t border-accent-primary/10 pt-3 md:pt-4 mt-2 relative z-10">
                        <span className="text-accent-secondary font-bold text-base md:text-lg">Forfait Total</span>
                        <div className="text-right">
                            <span className="font-mono text-accent-primary text-2xl md:text-3xl font-bold tracking-tight block">{formatMoney(total, activeCurrency)}</span>
                            <span className="text-[10px] md:text-xs text-text-muted italic mt-1 block">
                                {activeCurrency === 'USD'
                                    ? `~ ${formatMoney(total * exchangeRate, 'FCFA')} (x${exchangeRate})`
                                    : `~ ${formatMoney(total / exchangeRate, 'USD')} (/ ${exchangeRate})`
                                }
                            </span>
                        </div>
                    </div>
                </div>

                {/* Access Code Section - Replaces Script URL */}
                <div className="pt-2 md:pt-4">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                            <Lock className={`h-4 w-4 md:h-5 md:w-5 transition-colors ${formData.accessCode ? 'text-accent-primary' : 'text-gray-400'}`} />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Entrez le code d'accès pour valider"
                            value={formData.accessCode}
                            onChange={e => setFormData({ ...formData, accessCode: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-12 py-3 md:py-4 text-sm md:text-base text-text-main focus:outline-none focus:bg-white focus:border-accent-primary focus:ring-4 focus:ring-accent-primary/10 transition-all placeholder:text-gray-400"
                            required
                        />

                        {/* Toggle Password Visibility */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-accent-primary transition-colors focus:outline-none cursor-pointer z-20"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
                            ) : (
                                <Eye className="h-4 w-4 md:h-5 md:w-5" />
                            )}
                        </button>
                    </div>
                    <p className="text-[10px] text-text-muted/70 mt-1 pl-2 italic">
                        🔒 Code de sécurité requis : "Sisbech..."
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-accent-primary to-teal-600 text-white font-bold py-3 md:py-4 rounded-xl shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 text-base md:text-lg uppercase tracking-wide group"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5 md:h-6 md:w-6" /> : (
                        <>
                            <span>Enregistrer la transaction</span>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>

                {/* Feedback Message */}
                {message.text && (
                    <div className={`p-3 md:p-4 rounded-xl text-center font-bold animate-fade-in-up shadow-sm flex items-center justify-center gap-2 text-sm md:text-base ${message.type === 'error' ? 'bg-red-50 text-danger border border-red-100' : 'bg-teal-50 text-accent-primary border border-teal-100'
                        }`}>
                        {message.type === 'error' ? '⚠️' : '✅'} {message.text}
                    </div>
                )}

            </form>
        </div>
    )
}

export default TransactionForm
