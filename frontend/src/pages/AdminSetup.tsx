import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';

const AdminSetup = () => {
    const { gameConfig, updateGameConfig } = useSimulationStore();
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Products & Market Environment</h1>
                        <p className="text-slate-500">Configure game products and economic variables</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200">
                            <nav className="-mb-px flex px-6">
                                {['products', 'economy', 'settings'].map(tab => (
                                    <button key={tab} onClick={() => setActiveTab(tab)}
                                        className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm capitalize ${activeTab === tab ? 'border-amber-500 text-amber-600' : 'border-transparent text-slate-500 hover:border-slate-300'}`}>
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {activeTab === 'products' && (
                                <div className="space-y-8">
                                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Product Definitions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {[
                                            { id: 1, name: 'Consumer Good', cost: 40, demand: 3700, time: 118, quality: 3 },
                                            { id: 2, name: 'Professional', cost: 75, demand: 2025, time: 165, quality: 4 },
                                            { id: 3, name: 'Premium', cost: 150, demand: 900, time: 330, quality: 5 },
                                        ].map(p => (
                                            <div key={p.id} className="border border-slate-200 rounded-lg p-5 space-y-4 hover:border-slate-300 transition-colors">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-bold text-lg text-slate-800">Product {p.id}</h4>
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{p.name}</span>
                                                </div>
                                                <div className="space-y-3">
                                                    <div>
                                                        <label className="text-xs text-slate-500 block mb-1">Base Material Cost (£)</label>
                                                        <input type="number" defaultValue={p.cost} className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-500 block mb-1">Base Market Demand (units)</label>
                                                        <input type="number" defaultValue={p.demand} className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-500 block mb-1">Assembly Time (minutes)</label>
                                                        <input type="number" defaultValue={p.time} className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-slate-500 block mb-1">Quality Rating</label>
                                                        <div className="flex items-center gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <span key={star} className={`text-xl ${star <= p.quality ? 'text-amber-400' : 'text-slate-200'}`}>★</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'economy' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Economic Environment</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">GDP Growth (%)</label>
                                            <input type="number" value={gameConfig.gdpGrowth} step={0.1}
                                                onChange={e => updateGameConfig({ gdpGrowth: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Unemployment Rate (%)</label>
                                            <input type="number" value={gameConfig.unemploymentRate} step={0.1}
                                                onChange={e => updateGameConfig({ unemploymentRate: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Bank Interest Rate (%)</label>
                                            <input type="number" value={gameConfig.interestRate} step={0.25}
                                                onChange={e => updateGameConfig({ interestRate: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Raw Material Price (£ per 1000)</label>
                                            <input type="number" value={gameConfig.materialPrice}
                                                onChange={e => updateGameConfig({ materialPrice: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Inflation Rate (%)</label>
                                            <input type="number" value={gameConfig.inflationRate} step={0.1}
                                                onChange={e => updateGameConfig({ inflationRate: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Market Growth Factor</label>
                                            <input type="number" value={gameConfig.marketGrowthFactor} step={0.01}
                                                onChange={e => updateGameConfig({ marketGrowthFactor: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Simulation Settings</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Number of Rounds</label>
                                            <input type="number" defaultValue={12} className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700 block mb-2">Max Teams</label>
                                            <input type="number" defaultValue={8} className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                    </div>
                                    <button className="bg-amber-600 hover:bg-amber-500 text-white font-medium py-2.5 px-6 rounded-lg shadow-sm transition-colors">
                                        Save Settings
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminSetup;
