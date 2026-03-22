'use client';

import { useState } from 'react';

interface Token {
  symbol: string;
  name: string;
  decimals: number;
  balances: Record<string, number>;
  isBridgeable?: boolean;
}

interface BridgeOption {
  provider: string;
  sourceChain: string;
  destChain: string;
  estimatedTime: string;
  fee: string;
  minAmount: string;
  maxAmount: string;
  supportTokens: string[];
}

const chains = ['Ethereum', 'Arbitrum', 'Optimism', 'Base', 'Polygon', 'Avalanche', 'BNB Chain'];

const tokens: Token[] = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    balances: { Ethereum: 0.5, Arbitrum: 5.2, Optimism: 2.1, Base: 8.5, Polygon: 15, Avalanche: 1.8, 'BNB Chain': 3.2 },
    isBridgeable: true,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balances: { Ethereum: 5000, Arbitrum: 12000, Optimism: 8000, Base: 25000, Polygon: 18000, Avalanche: 6000, 'BNB Chain': 4000 },
    isBridgeable: true,
  },
  {
    symbol: 'USDT',
    name: 'USD Tether',
    decimals: 6,
    balances: { Ethereum: 3000, Arbitrum: 5000, Optimism: 3500, Base: 4200, Polygon: 6000, Avalanche: 2500, 'BNB Chain': 2000 },
    isBridgeable: true,
  },
  {
    symbol: 'WETH',
    name: 'Wrapped ETH',
    decimals: 18,
    balances: { Ethereum: 1.5, Arbitrum: 2.8, Optimism: 1.9, Base: 3.5, Polygon: 8.2, Avalanche: 2.1, 'BNB Chain': 1.5 },
    isBridgeable: true,
  },
  {
    symbol: 'WBTC',
    name: 'Wrapped Bitcoin',
    decimals: 8,
    balances: { Ethereum: 0.08, Arbitrum: 0.15, Optimism: 0.12, Base: 0.25, Polygon: 0.05, Avalanche: 0.08, 'BNB Chain': 0.04 },
    isBridgeable: true,
  },
];

const bridgeOptions: BridgeOption[] = [
  { provider: 'LayerZero', sourceChain: 'Ethereum', destChain: 'Arbitrum', estimatedTime: '1-2 min', fee: '$2.50', minAmount: '0.01 ETH', maxAmount: '500 ETH', supportTokens: ['ETH', 'USDC', 'USDT', 'WBTC'] },
  { provider: 'Hop Protocol', sourceChain: 'Ethereum', destChain: 'Optimism', estimatedTime: '5-15 min', fee: '$5.00', minAmount: '0.1 ETH', maxAmount: '1,000 ETH', supportTokens: ['ETH', 'WETH', 'USDC', 'USDT'] },
  { provider: 'Stargate', sourceChain: 'Ethereum', destChain: 'Base', estimatedTime: '2-5 min', fee: '$1.80', minAmount: '10 USDC', maxAmount: '100,000 USDC', supportTokens: ['USDC', 'USDT', 'ETH'] },
  { provider: 'Anyswap', sourceChain: 'Ethereum', destChain: 'Polygon', estimatedTime: '3-10 min', fee: '$1.20', minAmount: '50 USDC', maxAmount: '500,000 USDC', supportTokens: ['USDC', 'USDT', 'ETH', 'WBTC'] },
  { provider: 'Hybrid Bridge', sourceChain: 'Arbitrum', destChain: 'Avalanche', estimatedTime: '1-3 min', fee: '$3.00', minAmount: '0.05 ETH', maxAmount: '200 ETH', supportTokens: ['ETH', 'USDC', 'USDT'] },
  { provider: 'Hyperlane', sourceChain: 'Base', destChain: 'BNB Chain', estimatedTime: '4-8 min', fee: '$4.50', minAmount: '100 USDC', maxAmount: '50,000 USDC', supportTokens: ['USDC', 'USDT', 'ETH'] },
  { provider: 'LayerZero', sourceChain: 'Polygon', destChain: 'Arbitrum', estimatedTime: '1-2 min', fee: '$0.80', minAmount: '100 USDC', maxAmount: '1,000,000 USDC', supportTokens: ['USDC', 'USDT', 'ETH'] },
  { provider: 'Stargate', sourceChain: 'Avalanche', destChain: 'Optimism', estimatedTime: '2-4 min', fee: '$2.20', minAmount: '25 USDC', maxAmount: '75,000 USDC', supportTokens: ['USDC', 'USDT', 'ETH'] },
];

export default function Home() {
  const [sourceChain, setSourceChain] = useState(chains[0]);
  const [destChain, setDestChain] = useState(chains[1]);
  const [selectedToken, setSelectedToken] = useState<Token>(tokens[0]);
  const [amount, setAmount] = useState('');
  const [bridgeResult, setBridgeResult] = useState<string | null>(null);

  const filteredOptions = bridgeOptions.filter(
    opt => opt.sourceChain === sourceChain && opt.destChain === destChain
  );

  const handleBridge = () => {
    const inputAmount = parseFloat(amount);
    if (isNaN(inputAmount) || inputAmount <= 0) return;
    if (inputAmount < parseFloat(filteredOptions[0]?.minAmount.replace(/[^\d.]/g, '') || '0')) {
      alert('Amount below minimum');
      return;
    }

    const fee = parseFloat(filteredOptions[0]?.fee.replace(/[$]/g, '') || '0');
    const outputAmount = inputAmount - fee;
    setBridgeResult(
      `✓ Bridged ${inputAmount} ${selectedToken.symbol}\nFrom ${sourceChain} → ${destChain}\nEstimated: ${filteredOptions[0]?.estimatedTime}\nFee: ${filteredOptions[0]?.fee}`
    );
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <header className="border-b-4 border-blue-400 bg-gray-900 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black">Cross-Chain Bridge</h1>
          <p className="text-gray-400 mt-2">Bridge assets between 7 chains in 1-5 minutes</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Main Bridge Interface */}
        <section className="bg-gray-900 border-4 border-blue-400 p-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Source Chain */}
            <div>
              <label className="text-sm text-gray-400">FROM</label>
              <div className="mt-2">
                <select
                  value={sourceChain}
                  onChange={(e) => setSourceChain(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 font-bold text-xl outline-none"
                >
                  {chains.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-400">Select Token</label>
                <select
                  value={selectedToken.symbol}
                  onChange={(e) => setSelectedToken(tokens.find(t => t.symbol === e.target.value) || tokens[0])}
                  className="w-full mt-2 px-4 py-3 bg-gray-800 border-2 border-gray-600 font-bold outline-none"
                >
                  {tokens.filter(t => t.balances[sourceChain] > 0).map(t => (
                    <option key={t.symbol} value={t.symbol}>{t.symbol} ({t.balances[sourceChain].toFixed(2)})</option>
                  ))}
                </select>
              </div>
              <div className="mt-3 p-3 bg-gray-800 border-2 border-gray-700">
                <div className="text-sm text-gray-400">Available</div>
                <div className="text-2xl font-bold text-white">
                  {selectedToken.balances[sourceChain]?.toFixed(4)} {selectedToken.symbol}
                </div>
              </div>
              <div className="mt-3">
                <label className="text-sm text-gray-400">Amount</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full mt-2 px-4 py-3 bg-gray-800 border-2 border-gray-600 text-2xl font-bold outline-none"
                />
              </div>
            </div>

            {/* Destination Chain */}
            <div>
              <label className="text-sm text-gray-400">TO</label>
              <div className="mt-2">
                <select
                  value={destChain}
                  onChange={(e) => setDestChain(e.target.value)}
                  disabled={sourceChain === destChain}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-600 font-bold text-xl outline-none disabled:opacity-50"
                >
                  {chains.filter(c => c !== sourceChain).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="mt-4">
                <label className="text-sm text-gray-400">Estimated Output</label>
                <div className="p-3 bg-gray-800 border-2 border-gray-700">
                  <div className="text-sm text-gray-400">After fee</div>
                  <div className="text-2xl font-bold text-green-400">
                    {amount ? ((parseFloat(amount) * 0.98).toFixed(4)) : '0.0000'} {selectedToken.symbol}
                  </div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-800 border border-gray-700">
                  <div className="text-gray-400">Estimated Time</div>
                  <div className="font-bold">{filteredOptions[0]?.estimatedTime || 'Select chain'}</div>
                </div>
                <div className="p-2 bg-gray-800 border border-gray-700">
                  <div className="text-gray-400">Fee</div>
                  <div className="font-bold text-yellow-400">{filteredOptions[0]?.fee || '-'}</div>
                </div>
              </div>
              <button
                onClick={handleBridge}
                disabled={!amount || parseFloat(amount) <= 0 || sourceChain === destChain}
                className="w-full mt-4 py-4 bg-blue-500 text-white font-bold border-4 border-blue-400 hover:bg-blue-400 disabled:opacity-50 disabled:cursor-not-allowed text-xl"
              >
                Bridge {amount} {selectedToken.symbol}
              </button>
            </div>
          </div>
        </section>

        {/* Bridge Options */}
        {filteredOptions.length > 0 && (
          <section className="bg-gray-900 border-4 border-gray-700 p-6">
            <h2 className="text-xl font-black mb-4">Available Bridges</h2>
            <div className="space-y-2">
              {filteredOptions.map((opt, i) => (
                <div
                  key={opt.provider}
                  className={`p-4 border-4 cursor-pointer transition-all ${
                    i === 0 ? 'bg-blue-900/30 border-blue-400' : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-blue-400">{opt.provider}</h3>
                      <div className="text-sm text-gray-400">
                        {opt.sourceChain} → {opt.destChain}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-white">{opt.estimatedTime}</div>
                      <div className="text-xs text-yellow-400">${opt.fee}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-3 text-xs">
                    <span className="px-2 py-1 bg-gray-800">Min: {opt.minAmount}</span>
                    <span className="px-2 py-1 bg-gray-800">Max: {opt.maxAmount}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Bridge Result */}
        {bridgeResult && (
          <section className="bg-gray-900 border-4 border-green-400 p-6">
            <div className="p-4 bg-green-900/30 border-2 border-green-500 font-mono text-sm text-green-300 whitespace-pre-wrap">
              {bridgeResult}
            </div>
            <button
              onClick={() => setBridgeResult(null)}
              className="w-full mt-4 py-3 bg-gray-700 text-white font-bold border-2 border-gray-600 hover:bg-gray-600"
            >
              Bridge Another Asset
            </button>
          </section>
        )}

        {/* Supported Chains */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-xl font-black mb-4">Supported Chains</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {chains.map(chain => (
              <div key={chain} className="p-3 bg-gray-800 border-2 border-gray-600 text-center">
                <div className="font-bold">{chain}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-gray-900 border-4 border-gray-700 p-6">
          <h2 className="text-xl font-black mb-4">How Cross-Chain Bridging Works</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">1️⃣</div>
              <h3 className="font-bold text-blue-400 mb-2">Lock Asset</h3>
              <p className="text-xs text-gray-400">Assets locked on source chain (secured by smart contracts)</p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">2️⃣</div>
              <h3 className="font-bold text-green-400 mb-2">Mint L2</h3>
              <p className="text-xs text-gray-400">Equivalent tokens minted on destination chain</p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">3️⃣</div>
              <h3 className="font-bold text-purple-400 mb-2">Smart Bridge</h3>
              <p className="text-xs text-gray-400">LayerZero, Stargate, or Hop Protocol handle transfers</p>
            </div>
            <div className="p-4 bg-gray-800 border-2 border-gray-600 text-center">
              <div className="text-2xl mb-2">4️⃣</div>
              <h3 className="font-bold text-yellow-400 mb-2">Receive & Use</h3>
              <p className="text-xs text-gray-400">Bridged assets ready to use on destination chain</p>
            </div>
          </div>
        </section>

        {/* Safety Tips */}
        <section className="bg-gray-900 border-4 border-yellow-400 p-6">
          <h2 className="text-xl font-black text-yellow-400 mb-4">⚠️ Safety Tips</h2>
          <ul className="space-y-2 text-sm">
            <li>• Only use trusted bridges with audited smart contracts</li>
            <li>• Check bridge minimum/maximum amounts before bridging</li>
            <li>• Fees vary by chain and can increase during network congestion</li>
            <li>• Some bridges support specific tokens only</li>
          </ul>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Built by <a href="https://x.com/samdevrel" className="text-blue-400 hover:underline">@samdevrel</a>
          <button
            onClick={() => window.location.href = '/docs/overview'}
            className="w-full py-4 bg-purple-500 text-white font-bold border-4 border-purple-400 hover:bg-purple-400 mb-4"
          >
            {buttonText}
          </button>
                    </p>
        </footer>
      </div>
    </main>
  );
}
