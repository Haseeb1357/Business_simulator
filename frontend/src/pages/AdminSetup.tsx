import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';

const AdminSetup = () => {
    const { gameConfig, updateGameConfig } = useSimulationStore();
    const [activeTab, setActiveTab] = useState('products');

    return (
        <div className="flex h-screen overflow-hidden bg-navy-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72">
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
                    <div className="border-b border-navy-800 pb-6">
                        <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">
                            Global <span className="text-gold-500">Configuration</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Environment & Product Parameters</p>
                    </div>

                    <div className="bg-navy-800 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden">
                        <div className="border-b border-navy-700 bg-navy-900/50">
                            <nav className="flex px-8">
                                {['products', 'economy', 'settings'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`whitespace-nowrap py-5 px-8 font-black text-[10px] uppercase tracking-[0.2em] transition-all border-b-2 ${activeTab === tab ? 'border-gold-500 text-gold-500 bg-navy-800' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-8">
                            {activeTab === 'products' && (
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-black text-white uppercase italic">Product Definitions</h3>
                                        <div className="h-px flex-1 bg-navy-700"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                        {[
                                            { id: 1, name: 'Consumer Good', cost: 40, demand: 3700, time: 118, quality: 3 },
                                            { id: 2, name: 'Professional', cost: 75, demand: 2025, time: 165, quality: 4 },
                                            { id: 3, name: 'Premium', cost: 150, demand: 900, time: 330, quality: 5 },
                                        ].map(p => (
                                            <div key={p.id} className="bg-navy-900/50 border border-navy-700 rounded-2xl p-6 space-y-6 hover:border-gold-500/30 transition-all group shadow-inner">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-black text-lg text-white uppercase italic group-hover:text-gold-500 transition-colors">Unit-{p.id}</h4>
                                                    <span className="text-[10px] font-black bg-navy-800 text-slate-400 px-3 py-1 rounded-full border border-navy-700">{p.name}</span>
                                                </div>
                                                <div className="space-y-4">
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">Material Cost ($)</label>
                                                        <input type="number" defaultValue={p.cost} className="w-full bg-navy-800 border-navy-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">Market Demand</label>
                                                        <input type="number" defaultValue={p.demand} className="w-full bg-navy-800 border-navy-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">Assembly Time (m)</label>
                                                        <input type="number" defaultValue={p.time} className="w-full bg-navy-800 border-navy-700 text-white rounded-xl py-3 px-4 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block mb-2 ml-1">Quality Index</label>
                                                        <div className="flex items-center gap-1.5 p-1">
                                                            {[1, 2, 3, 4, 5].map(star => (
                                                                <span key={star} className={`text-xl ${star <= p.quality ? 'text-gold-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-navy-700'}`}>★</span>
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
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-black text-white uppercase italic">Economic Variables</h3>
                                        <div className="h-px flex-1 bg-navy-700"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">GDP Dynamics (%)</label>
                                            <input type="number" value={gameConfig.gdpGrowth} step={0.1}
                                                onChange={e => updateGameConfig({ gdpGrowth: Number(e.target.value) })}
                                                className="w-full bg-navy-900 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Labor Market (%)</label>
                                            <input type="number" value={gameConfig.unemploymentRate} step={0.1}
                                                onChange={e => updateGameConfig({ unemploymentRate: Number(e.target.value) })}
                                                className="w-full bg-navy-900 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Interbank Interest (%)</label>
                                            <input type="number" value={gameConfig.interestRate} step={0.25}
                                                onChange={e => updateGameConfig({ interestRate: Number(e.target.value) })}
                                                className="w-full bg-navy-900 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Raw Material Index ($)</label>
                                            <input type="number" value={gameConfig.materialPrice}
                                                onChange={e => updateGameConfig({ materialPrice: Number(e.target.value) })}
                                                className="w-full bg-navy-900 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'settings' && (
                                <div className="space-y-10">
                                    <div className="flex items-center gap-4">
                                        <h3 className="text-lg font-black text-white uppercase italic">System Constraints</h3>
                                        <div className="h-px flex-1 bg-navy-700"></div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Simulation Depth (Rounds)</label>
                                            <input type="number" defaultValue={12} className="w-full bg-navy-900 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Entity Limit (Direct)</label>
                                            <input type="number" defaultValue={8} className="w-full bg-navy-900 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/30 outline-none transition-all font-bold" />
                                        </div>
                                    </div>
                                    <button className="bg-gold-500 hover:bg-white text-navy-900 font-black py-4 px-10 rounded-2xl shadow-xl shadow-gold-500/10 transition-all active:scale-95 uppercase text-[10px] tracking-[0.2em] mt-4">
                                        Commit Protocol Updates
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
