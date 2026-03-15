import React from 'react'

function AboutZakat() {
    return (
        <>
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
        </>
    )
}

export default AboutZakat
