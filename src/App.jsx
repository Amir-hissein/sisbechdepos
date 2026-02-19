import { useState, useEffect } from 'react'
import Header from './components/Header'
import TransactionForm from './components/TransactionForm'
// TransactionTable removed as per request

function App() {
  const [exchangeRate, setExchangeRate] = useState(655)
  const [activeCurrency, setActiveCurrency] = useState('USD') // 'USD' or 'FCFA'

  // State for transactions kept in memory/localstorage just in case, but not displayed
  // Actually, if we remove the tables, do we even need to store them in state?
  // The form sends them to Google Sheets.
  // The user might want to see the "last added" or a confirmation.
  // The form component handles the submission.
  // We can remove the table logic from App.jsx to clean it up.

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Header exchangeRate={exchangeRate} setExchangeRate={setExchangeRate} />

      <div className="mt-8">
        <TransactionForm
          activeCurrency={activeCurrency}
          setActiveCurrency={setActiveCurrency}
          exchangeRate={exchangeRate}
          onAddTransaction={() => { }} // No-op since tables are gone
        />
      </div>
    </div>
  )
}

export default App
