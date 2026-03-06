import { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, ResponsiveContainer,
} from 'recharts';

const Leaderboard = () => {
    const teams = useSimulationStore(s => s.teams);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const allResults = useSimulationStore(s => s.allResults);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);

    const [activeTab, setActiveTab] = useState('ranking');
    const latestQ = currentQuarter - 1;

    // Build ranking from raw state
    const rankings = useMemo(() => {
        return teams.map(t => {
            const results = allResults.get(t.id) || [];
            const latest = results.find(r => r.quarter === latestQ);
            const prev = results.find(r => r.quarter === latestQ - 1);
            return {
                ...t,
                netProfit: latest?.kpis.netProfit || 0,
                marketShare: latest?.kpis.marketShare || 0,
                companyValue: latest?.kpis.companyValue || 0,
                prevCompanyValue: prev?.kpis.companyValue || 0,
            };
        }).sort((a, b) => b.companyValue - a.companyValue);
    }, [teams, allResults, latestQ]);

    // Company value bar chart
    const companyValueData = useMemo(() => rankings.map(r => ({
        name: r.name.split(' ')[0],
        value: Math.round(r.companyValue / 1000),
    })), [rankings]);

    const getMovement = (curr: number, prev: number) => {
        if (curr > prev) return <ArrowUpRight className="h-4 w-4 text-emerald-500" />;
        if (curr < prev) return <ArrowDownRight className="h-4 w-4 text-red-500" />;
        return <Minus className="h-4 w-4 text-slate-400" />;
    };

    const fmt = (n: number) => n >= 0 ? `$${Math.abs(n).toLocaleString()}` : `-$${Math.abs(n).toLocaleString()}`;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Competitive Intelligence</h1>
                            <p className="text-slate-500">Industry Leaderboard & Market Share History</p>
                        </div>
                        {latestQ > 0 && (
                            <div className="bg-white border border-slate-200 px-3 py-2 rounded-lg shadow-sm">
                                <span className="text-xs text-slate-500">Your Rank</span>
                                <p className="text-lg font-bold text-primary-600">#{rankings.findIndex(r => r.id === activeTeamId) + 1} of {teams.length}</p>
                            </div>
                        )}
                    </div>

                    {latestQ < 1 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="text-5xl mb-4">🏆</div>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">No Rankings Yet</h2>
                            <p className="text-slate-500">Run the first quarter simulation to see the leaderboard.</p>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-2 mb-6">
                                {[{ id: 'ranking', name: 'Rankings' }, { id: 'charts', name: 'Trend Charts' }].map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                                        {tab.name}
                                    </button>
                                ))}
                            </div>

                            {activeTab === 'ranking' && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <table className="min-w-full divide-y divide-slate-200">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase w-16">Rank</th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Team</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Company Value</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Revenue</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Net Profit</th>
                                                <th className="px-4 py-3 text-right text-xs font-medium text-slate-500 uppercase">Market Share</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-200">
                                            {rankings.map((r, i) => (
                                                <tr key={r.id} className={`hover:bg-slate-50 transition-colors ${r.id === activeTeamId ? 'bg-primary-50/50' : ''}`}>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-lg font-bold ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-slate-400' : i === 2 ? 'text-amber-700' : 'text-slate-500'}`}>
                                                                {i + 1}
                                                            </span>
                                                            {getMovement(r.companyValue, r.prevCompanyValue)}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="font-semibold text-slate-900">{r.name}</span>
                                                        {r.id === activeTeamId && <span className="ml-2 text-xs text-primary-600 font-medium">(You)</span>}
                                                    </td>
                                                    <td className="px-4 py-3 text-right tabular-nums font-medium">${(r.companyValue / 1000000).toFixed(2)}M</td>
                                                    <td className={`px-4 py-3 text-right tabular-nums font-medium ${r.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                        {fmt(r.netProfit)}
                                                    </td>
                                                    <td className="px-4 py-3 text-right tabular-nums">{r.marketShare.toFixed(1)}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {activeTab === 'charts' && (
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                        <h3 className="text-sm font-semibold text-slate-800 mb-4">Company Value (£'000)</h3>
                                        <ResponsiveContainer width="100%" height={300}>
                                            <BarChart data={companyValueData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `£${v}k`} />
                                                <Tooltip formatter={(v: number) => `£${v}k`} />
                                                <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Leaderboard;
