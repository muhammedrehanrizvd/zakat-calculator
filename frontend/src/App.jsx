import { useState, useEffect } from 'react'
import AboutZakat from './components/aboutZakat.jsx'

function App() {
  const [gold, setGold] = useState('')
  const [silver, setSilver] = useState('')
  const [cash, setCash] = useState('')
  const [result, setResult] = useState(null)
  
  // State for currency
  const [currency, setCurrency] = useState('INR') // Default INR
  const [metalPrice, setMetalPrice] = useState({ XAU: null, XAG: null })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Currency symbols
  const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  SAR: 'SR',
  AED: 'DH',
  EUR: '€',
  GBP: '£',
  PKR: '₨',
  BDT: '৳',
  MYR: 'RM'
};

  // Fetch prices when currency changes
  useEffect(() => {
    const fetchMetals = async () => {
      setLoading(true)
      try {
        const response = await fetch(
          `https://metals.g.apised.com/v1/latest?symbols=XAU,XAG&base_currency=${currency}`,
          {
            method: 'GET',
            headers: { 'x-api-key': import.meta.env.VITE_METAL_API_KEY },
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const data = await response.json()
        console.log('API Response:', data)

        // Check if API returns per gram or per ounce
        // If per ounce, convert to gram
        const TROY_OUNCE_TO_GRAM = 31.1035
        
        // Assuming API returns per troy ounce (verify this!)
        const goldPricePerGram = data.data.rates.XAU / TROY_OUNCE_TO_GRAM
        const silverPricePerGram = data.data.rates.XAG / TROY_OUNCE_TO_GRAM

        setMetalPrice({
          XAU: Math.round(goldPricePerGram),
          XAG: Math.round(silverPricePerGram)
        })
        setError(null)
      } catch (error) {
        console.error('Error fetching prices:', error)
        setError('Failed to fetch live prices')
        // Fallback values (INR)
        setMetalPrice({ XAU: 6500, XAG: 75 })
      } finally {
        setLoading(false)
      }
    }

    fetchMetals()
  }, [currency]) // Re-fetch when currency changes

  const NISAB = {
    gold: 87.48,      // grams
    silver: 612.36,   // grams
    goldPrice: metalPrice.XAU,
    silverPrice: metalPrice.XAG
  }

  const calculateZakat = () => {
    if (!metalPrice.XAU || !metalPrice.XAG) {
      alert('Please wait, loading prices...')
      return
    }

    const goldGrams = parseFloat(gold) || 0
    const silverGrams = parseFloat(silver) || 0
    const cashAmount = parseFloat(cash) || 0

    const nisabValue = NISAB.gold * NISAB.goldPrice
     // here we Here in this quote, we are taking jagat of end-user gold and silver and the asset separately and use nisab according to gold value in the assets. There are two problems present:
     // 1. We separate the jagat for gold, silver, and cash.
     // 2. We use only gold as nisab value for the total assets to find out this jagat.
    let goldZakat = 0
    let silverZakat = 0
    let cashZakat = 0
    let totalAssets = 0

    if (goldGrams >= NISAB.gold) {
      const goldValue = goldGrams * NISAB.goldPrice
      goldZakat = goldValue * 0.025
      totalAssets += goldValue
    }

    if (silverGrams >= NISAB.silver) {
      const silverValue = silverGrams * NISAB.silverPrice
      silverZakat = silverValue * 0.025
      totalAssets += silverValue
    }

    if (cashAmount > 0) {
      totalAssets += cashAmount
      if (totalAssets >= nisabValue) {
        cashZakat = cashAmount * 0.025
      }
    }

    const totalZakat = goldZakat + silverZakat + cashZakat

    setResult({
      goldZakat,
      silverZakat,
      cashZakat,
      totalZakat,
      totalAssets,
      nisabValue,
      isAboveNisab: totalAssets >= nisabValue
    })
  }

  const resetCalculator = () => {
    setGold('')
    setSilver('')
    setCash('')
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-purple-700 p-4 md:p-8">
      
      {/* Header */}
      <header className="text-center text-white mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
          💰 Zakat Calculator
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-4">
          Calculate your Zakat obligation
        </p>
        <p className="text-3xl font-bold">﷽</p>
        
        {loading && <p className="text-sm mt-2 animate-pulse">Loading prices... ⏳</p>}
        {error && <p className="text-sm mt-2 text-yellow-300">⚠️ {error}</p>}
      </header>

      {/* Currency Selector */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white/10 backdrop-blur rounded-lg p-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <label className="text-white font-semibold">Select Currency:</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="px-4 py-2 rounded-lg bg-white text-gray-800 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="INR">Indian Rupee (INR)</option>
              <option value="USD">US Dollar (USD)</option>
              <option value="SAR">Saudi Riyal (SAR)</option>
              <option value="AED"> UAE Dirham (AED)</option>
              <option value="EUR"> Euro (EUR)</option>
              <option value="GBP">British Pound (GBP)</option>
              <option value="PKR"> Pakistani Rupee (PKR)</option>
              <option value="BDT">Bangladeshi Taka (BDT)</option>
              <option value="MYR">Malaysian Ringgit (MYR)</option>
            </select>
          </div>

          {/* Live Prices Display */}
          {!loading && metalPrice.XAU && (
            <div className="grid grid-cols-2 gap-4 text-white text-center">
              <div>
                <p className="text-sm opacity-80">Live Gold Price</p>
                <p className="text-2xl font-bold">
                  {CURRENCY_SYMBOLS[currency]}{metalPrice.XAU}/gram
                </p>
              </div>
              <div>
                <p className="text-sm opacity-80">Live Silver Price</p>
                <p className="text-2xl font-bold">
                  {CURRENCY_SYMBOLS[currency]}{metalPrice.XAG}/gram
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calculator Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-2xl p-6 md:p-8">
          
          {/* Gold Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              <span className="mr-2">🥇</span>
              Gold Amount (grams)
            </label>
            <input
              type="number"
              value={gold}
              onChange={(e) => setGold(e.target.value)}
              placeholder="Enter gold amount"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 text-lg"
              min="0"
              step="0.01"
            />
            <small className="text-gray-500 text-sm mt-1 block">
              Nisab: {NISAB.gold} grams (7.5 tola) | Rate: {CURRENCY_SYMBOLS[currency]}{metalPrice.XAU || '...'}/gram
            </small>
          </div>

          {/* Silver Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              <span className="mr-2">🥈</span>
              Silver Amount (grams)
            </label>
            <input
              type="number"
              value={silver}
              onChange={(e) => setSilver(e.target.value)}
              placeholder="Enter silver amount"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 text-lg"
              min="0"
              step="0.01"
            />
            <small className="text-gray-500 text-sm mt-1 block">
              Nisab: {NISAB.silver} grams (52.5 tola) | Rate: {CURRENCY_SYMBOLS[currency]}{metalPrice.XAG || '...'}/gram
            </small>
          </div>

          {/* Cash Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              <span className="mr-2">💵</span>
              Cash / Savings ({CURRENCY_SYMBOLS[currency]})
            </label>
            <input
              type="number"
              value={cash}
              onChange={(e) => setCash(e.target.value)}
              placeholder="Enter cash amount"
              className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:bg-white transition duration-200 text-lg"
              min="0"
              step="0.01"
            />
            <small className="text-gray-500 text-sm mt-1 block">
              Include bank balance, cash in hand, investments
            </small>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <button
              onClick={calculateZakat}
              disabled={loading}
              className="md:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Loading...' : 'Calculate Zakat'}
            </button>
            <button
              onClick={resetCalculator}
              className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Reset
            </button>
          </div>

          {/* Results - Update currency symbols */}
          {result && (
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200">
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Your Zakat Summary
              </h2>

              <div className={`text-center py-3 px-4 rounded-full font-semibold mb-6 ${
                result.isAboveNisab 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}>
                {result.isAboveNisab ? '✅ Zakat is Obligatory' : '❌ Below Nisab Threshold'}
              </div>

              <div className="bg-white rounded-lg p-6 space-y-3">
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Total Assets:</span>
                  <span className="text-gray-800 font-semibold">
                    {CURRENCY_SYMBOLS[currency]}{result.totalAssets.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Nisab Threshold:</span>
                  <span className="text-gray-800 font-semibold">
                    {CURRENCY_SYMBOLS[currency]}{result.nisabValue.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Gold Zakat:</span>
                  <span className="text-gray-800 font-semibold">
                    {CURRENCY_SYMBOLS[currency]}{result.goldZakat.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Silver Zakat:</span>
                  <span className="text-gray-800 font-semibold">
                    {CURRENCY_SYMBOLS[currency]}{result.silverZakat.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Cash Zakat:</span>
                  <span className="text-gray-800 font-semibold">
                    {CURRENCY_SYMBOLS[currency]}{result.cashZakat.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>

                <div className="flex justify-between items-center py-3 mt-2">
                  <span className="text-gray-800 font-bold text-lg">💰 Total Zakat Due:</span>
                  <span className="text-blue-600 font-bold text-2xl">
                    {CURRENCY_SYMBOLS[currency]}{result.totalZakat.toFixed(2)}
                  </span>
                </div>
              </div>

              {result.isAboveNisab && (
                <div className="mt-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-l-4 border-yellow-500 rounded-lg p-5">
                  <p className="text-brown-700 italic text-center leading-relaxed">
                    "The example of those who spend their wealth in the way of Allah 
                    is like a seed of grain that sprouts seven ears; 
                    in every ear there are a hundred grains."
                    <br />
                    <span className="block mt-2 font-semibold text-sm text-brown-800">
                      (Quran 2:261)
                    </span>
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Info Sidebar - Same as before */}
      <AboutZakat/>
      </div>

      {/* Footer */}
      <footer className="text-center text-white mt-12 py-8">
        <p className="text-lg mb-2">May Allah accept your Zakat | الحمد لله</p>
        <p className="text-sm opacity-80 max-w-2xl mx-auto">
          Note: Prices are fetched live from international markets. 
          Please verify current rates for accurate calculation.
        </p>
      </footer>
    </div>
  )
}

export default App