import { useState , useEffect } from 'react'

function App() {
           const [gold, setGold] = useState('')
         const [silver, setSilver] = useState('')
          const [cash, setCash] = useState('')
           const [result, setResult] = useState(null)
           const [metalPrice , setMetalPrice] = useState({ XAG: null , XAG: null })
       
       

       useEffect(()=>{
            const fetchMetals = async () => {
        try {
          const response = await fetch("https://metals.g.apised.com/v1/latest?symbols=XAU,XAG,XPD,XPT,XCU,NI,ZNC,ALU,LEAD&base_currency=USD", {
            method: 'GET',
            headers: { 'x-api-key': 'sk_6Af16F860Ff652Fc2CD27225575bfC4739B27D5E12be3996' },
            redirect: 'follow' }
             )
  
             if(!response.ok){
              throw  new Error(`HTTP error: ${response.status}`)
             }
               const data = await response.json()
               console.log(data)
                    setMetalPrice(data.data.rates)
              }
              
              catch (error) {
               console.log(error)
                           }
            }
            fetchMetals()
        
       },[])


 

  const NISAB = {
    gold: 87.48,
    silver: 612.36,
    goldPrice: metalPrice.XAU,
    silverPrice: metalPrice.XAG
  }

  const calculateZakat = () => {
    const goldGrams = parseFloat(gold) || 0
    const silverGrams = parseFloat(silver) || 0
    const cashAmount = parseFloat(cash) || 0

    const nisabValue = NISAB.gold * NISAB.goldPrice

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
      </header>

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
              Nisab: {NISAB.gold} grams (7.5 tola) | Rate: ₹{NISAB.goldPrice}/gram
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
              Nisab: {NISAB.silver} grams (52.5 tola) | Rate: ₹{NISAB.silverPrice}/gram
            </small>
          </div>

          {/* Cash Input */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2 text-lg">
              <span className="mr-2">💵</span>
              Cash / Savings (₹)
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
              className="md:col-span-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition duration-200"
            >
              Calculate Zakat
            </button>
            <button
              onClick={resetCalculator}
              className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-200"
            >
              Reset
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border-2 border-gray-200 animate-fadeIn">
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Your Zakat Summary
              </h2>

              {/* Status Badge */}
              <div className={`text-center py-3 px-4 rounded-full font-semibold mb-6 ${
                result.isAboveNisab 
                  ? 'bg-green-100 text-green-800 border-2 border-green-300' 
                  : 'bg-red-100 text-red-800 border-2 border-red-300'
              }`}>
                {result.isAboveNisab ? '✅ Zakat is Obligatory' : '❌ Below Nisab Threshold'}
              </div>

              {/* Result Details */}
              <div className="bg-white rounded-lg p-6 space-y-3">
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Total Assets:</span>
                  <span className="text-gray-800 font-semibold">₹{result.totalAssets.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Nisab Threshold:</span>
                  <span className="text-gray-800 font-semibold">₹{result.nisabValue.toFixed(2)}</span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Gold Zakat:</span>
                  <span className="text-gray-800 font-semibold">₹{result.goldZakat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Silver Zakat:</span>
                  <span className="text-gray-800 font-semibold">₹{result.silverZakat.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 font-medium">Cash Zakat:</span>
                  <span className="text-gray-800 font-semibold">₹{result.cashZakat.toFixed(2)}</span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent my-3"></div>

                <div className="flex justify-between items-center py-3 mt-2">
                  <span className="text-gray-800 font-bold text-lg">💰 Total Zakat Due:</span>
                  <span className="text-blue-600 font-bold text-2xl">
                    ₹{result.totalZakat.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Islamic Quote */}
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

        {/* Info Sidebar */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 h-fit">
          
          <h3 className="text-xl font-bold text-gray-800 mb-4">📚 About Zakat</h3>
          <ul className="space-y-2 text-gray-600 text-sm mb-6">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Zakat is 2.5% of wealth held for one lunar year</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Nisab is the minimum threshold for Zakat obligation</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Calculated on gold, silver, cash, business assets</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>One of the Five Pillars of Islam</span>
            </li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mb-4">ℹ️ How to Use</h3>
          <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
            <li>Enter your gold amount in grams</li>
            <li>Enter your silver amount in grams</li>
            <li>Enter total cash and savings in rupees</li>
            <li>Click "Calculate Zakat"</li>
            <li>Pay the zakat amount to eligible recipients</li>
          </ol>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-white mt-12 py-8">
        <p className="text-lg mb-2">May Allah accept your Zakat | الحمد لله</p>
        <p className="text-sm opacity-80 max-w-2xl mx-auto">
          Note: This calculator uses approximate gold/silver rates. 
          Please verify current rates for accurate calculation.
        </p>
      </footer>
    </div>
  )
}

export default App