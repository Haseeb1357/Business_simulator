import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { ArrowUpRight, ArrowDownRight, Minus, FileText, Trophy, BarChart2 } from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, ResponsiveContainer,
} from 'recharts';

const Intelligence: React.FC = () => {
    const teams = useSimulationStore(s => s.teams);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const allResults = useSimulationStore(s => s.allResults);
    const gameConfig = useSimulationStore(s => s.gameConfig);

    const latestQ = Math.max(0, currentQuarter - 1);

    // Selection state for detailed report
    const [selectedTeam, setSelectedTeam] = useState(activeTeamId);
    const [selectedQuarter, setSelectedQuarter] = useState(latestQ);
    const [activeTab, setActiveTab] = useState('ranking');

    useEffect(() => {
        setSelectedQuarter(latestQ);
    }, [latestQ]);

    // ---- LEADERBOARD LOGIC ----
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

    const companyValueData = useMemo(() => rankings.map(r => ({
        name: r.name.split(' ')[0],
        value: Math.round(r.companyValue / 1000),
    })), [rankings]);

    const getMovement = (curr: number, prev: number) => {
        if (curr > prev) return <ArrowUpRight className="h-4 w-4 text-emerald-400" />;
        if (curr < prev) return <ArrowDownRight className="h-4 w-4 text-rose-400" />;
        return <Minus className="h-4 w-4 text-slate-500" />;
    };

    // ---- REPORT LOGIC ----
    const reportResult = useMemo(() => {
        const teamResults = allResults.get(selectedTeam) || [];
        return teamResults.find(r => r.quarter === selectedQuarter);
    }, [allResults, selectedTeam, selectedQuarter]);

    const availableQuarters = Array.from({ length: latestQ }, (_, i) => i + 1);
    const team = teams.find(t => t.id === selectedTeam);

    const calculateYearAndQuarter = (qNumber: number) => {
        const baseYear = 2024;
        const offset = qNumber - 1;
        const year = baseYear + Math.floor(offset / 4);
        const qtr = (offset % 4) + 1;
        return { year, qtr };
    };

    const num = (val: number | undefined) => val == null ? '' : Math.round(val).toLocaleString();
    const money = (val: number | undefined) => val == null ? '' : val < 0 ? `-£${Math.abs(Math.round(val)).toLocaleString()}` : `£${Math.round(val).toLocaleString()}`;

    // ---- RENDER HELPERS ----
    const renderDetailedReport = () => {
        if (!reportResult) return (
            <div className="bg-navy-800 rounded-xl p-12 text-center border border-navy-700">
                <FileText className="w-12 h-12 text-navy-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-200">No report available for selection</h3>
                <p className="text-slate-400 mt-2">Simulation must advance past Q1 and you must select an available quarter.</p>
            </div>
        );

        const { year, qtr } = calculateYearAndQuarter(reportResult.quarter);
        const d = reportResult.decisions;
        const prev = reportResult.previousCarryForward;
        const cf = reportResult.carryForward;
        const pnl = reportResult.profitAndLoss;
        const bs = reportResult.balanceSheet;

        return (
            <div className="bg-white text-black p-8 rounded shadow-2xl max-w-5xl mx-auto overflow-x-auto text-[11px] font-sans leading-tight">
                {/* Internal Report Content (preserving original replica style) */}
                <div className="mb-6 border-b-2 border-black pb-2">
                    <h1 className="text-2xl font-bold mb-1 uppercase tracking-wider">The Topaz Management Simulation Report</h1>
                    <div className="font-semibold text-sm">History — Group {team?.companyNumber} Company {team?.companyNumber}</div>
                    <div className="font-semibold text-sm">Year {year} Quarter {qtr} (Simulation Q{reportResult.quarter})</div>
                </div>

                {/* Simplified Grid for the Report Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Decisions */}
                    <div className="space-y-4">
                        <h2 className="font-bold text-xs bg-gray-100 border border-gray-300 p-1">DECISIONS IN EFFECT</h2>
                        <table className="w-full text-right border-collapse">
                            <thead>
                                <tr className="border-b border-black">
                                    <th className="text-left py-1">Item</th>
                                    <th className="w-16">P1</th>
                                    <th className="w-16">P2</th>
                                    <th className="w-16">P3</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td className="text-left py-0.5">Price (Home)</td><td>{d.prices.homeMarkets[0]}</td><td>{d.prices.homeMarkets[1]}</td><td>{d.prices.homeMarkets[2]}</td></tr>
                                <tr><td className="text-left py-0.5">Adv Support</td><td>{d.promotion.advertisingSupport[0]}</td><td>{d.promotion.advertisingSupport[1]}</td><td>{d.promotion.advertisingSupport[2]}</td></tr>
                                <tr><td className="text-left py-0.5">Merch</td><td>{d.promotion.merchandising[0]}</td><td>{d.promotion.merchandising[1]}</td><td>{d.promotion.merchandising[2]}</td></tr>
                                <tr className="border-t border-gray-200"><td className="text-left font-bold">Res Exp</td><td colSpan={3} className="text-right">{d.researchExpenditure}</td></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Resources */}
                    <div className="space-y-4">
                        <h2 className="font-bold text-xs bg-gray-100 border border-gray-300 p-1">RESOURCES USED</h2>
                        <table className="w-full text-right">
                            <tbody>
                                <tr><td className="text-left py-0.5">Machines</td><td className="font-bold">{cf.assets.machines}</td></tr>
                                <tr><td className="text-left py-0.5">Workers</td><td className="font-bold">{cf.staffing.productionWorkers}</td></tr>
                                <tr><td className="text-left py-0.5">Stock FG</td><td>{num(cf.inventory.finishedGoods)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* P&L */}
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="font-bold border-b-2 border-black mb-2 pb-1">PROFIT & LOSS Account (£)</h3>
                        <table className="w-full text-right">
                            <tbody>
                                <tr className="font-bold"><td className="text-left uppercase">Revenue</td><td>{money(pnl.salesRevenue)}</td></tr>
                                <tr><td className="text-left pl-4">Cost of Goods Sold</td><td>({num(pnl.costOfGoodsSold)})</td></tr>
                                <tr className="border-t border-gray-300 font-bold bg-gray-50">
                                    <td className="text-left pr-4">Gross Profit</td><td>{money(pnl.grossProfit)}</td>
                                </tr>
                                <tr><td className="text-left pl-4">Overheads</td><td>({num(pnl.totalOverheads)})</td></tr>
                                <tr><td className="text-left pl-4">Interest</td><td>({num(pnl.interestPaid)})</td></tr>
                                <tr><td className="text-left pl-4">Tax</td><td>({num(pnl.tax)})</td></tr>
                                <tr className="border-y-2 border-black font-bold text-sm bg-gray-100">
                                    <td className="text-left py-1 uppercase">Net Profit</td><td>{money(pnl.netProfit)}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Balance Sheet Summary */}
                    <div>
                        <h3 className="font-bold border-b-2 border-black mb-2 pb-1">BALANCE SHEET (£)</h3>
                        <table className="w-full text-right">
                            <tbody>
                                <tr><td className="text-left">Fixed Assets</td><td>{num(bs.fixedAssets.totalFixed)}</td></tr>
                                <tr><td className="text-left">Net Current</td><td>{num(bs.netCurrentAssets)}</td></tr>
                                <tr className="border-t-2 border-black font-bold"><td className="text-left uppercase">Net Assets</td><td>{money(bs.netAssets)}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-navy-900">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto lg:pl-72 pt-16 lg:pt-0">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy-800 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                <Trophy className="text-gold-500 w-8 h-8" />
                                Intelligence & Results
                            </h1>
                            <p className="text-slate-400 mt-1">Global ranking and detailed quarterly performance reports</p>
                        </div>
                        {latestQ > 0 && (
                            <div className="bg-navy-800 border border-navy-700 px-4 py-2 rounded-xl shadow-lg">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Your Global Rank</span>
                                <p className="text-2xl font-black text-gold-500 mt-0.5">#{rankings.findIndex(r => r.id === activeTeamId) + 1} <span className="text-xs font-normal text-slate-400">of {teams.length}</span></p>
                            </div>
                        )}
                    </div>

                    {/* TOP SECTION: LEADERBOARD & CHARTS */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* SUB-NAV for Ranking/Charts */}
                        <div className="xl:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 bg-navy-800 p-1.5 rounded-lg w-fit border border-navy-700">
                                <button onClick={() => setActiveTab('ranking')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'ranking' ? 'bg-navy-700 text-gold-500 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Ranking</button>
                                <button onClick={() => setActiveTab('charts')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'charts' ? 'bg-navy-700 text-gold-500 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Trend Charts</button>
                            </div>

                            {latestQ < 1 ? (
                                <div className="bg-navy-800 rounded-2xl border border-navy-700 p-12 text-center shadow-xl">
                                    <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏆</div>
                                    <h3 className="text-xl font-bold text-slate-200">No Historical Data Yet</h3>
                                    <p className="text-slate-400 mt-2 max-w-xs mx-auto">Complete the first quarter simulation to unlock the global leaderboard and performance analytics.</p>
                                </div>
                            ) : activeTab === 'ranking' ? (
                                <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-navy-900/50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rank</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Team Name</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Company Value</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Net Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-navy-700/50">
                                            {rankings.map((r, i) => (
                                                <tr key={r.id} className={`group transition-all hover:bg-navy-700/30 ${r.id === activeTeamId ? 'bg-navy-700/50' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-xl font-black ${i === 0 ? 'text-gold-500' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'}`}>{i + 1}</span>
                                                            {getMovement(r.companyValue, r.prevCompanyValue)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-slate-100 group-hover:text-gold-500 transition-colors uppercase text-sm tracking-wide">{r.name}</span>
                                                        {r.id === activeTeamId && <span className="ml-2 py-0.5 px-1.5 bg-gold-500/10 text-gold-500 text-[10px] font-black rounded border border-gold-500/20">YOU</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-right tabular-nums font-mono text-slate-200">
                                                        £{(r.companyValue / 1000000).toFixed(2)}M
                                                    </td>
                                                    <td className={`px-6 py-4 text-right tabular-nums font-mono font-bold ${r.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {money(r.netProfit)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6 shadow-xl h-[400px]">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4" /> Market Capitalization (£'000)
                                    </h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={companyValueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#233554" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${v}k`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#112240', borderColor: '#233554', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#fbbf24' }}
                                                cursor={{ fill: 'rgba(251, 191, 36, 0.05)' }}
                                            />
                                            <Bar dataKey="value" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* QUICK STATS SIDEBAR */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gold-500" />
                                    Report Selection
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Company</label>
                                        <select
                                            value={selectedTeam}
                                            onChange={e => setSelectedTeam(Number(e.target.value))}
                                            className="w-full bg-navy-900 border border-navy-700 text-slate-200 text-sm px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
                                        >
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name} (Team {t.companyNumber})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Quarterly Period</label>
                                        <select
                                            value={selectedQuarter}
                                            onChange={e => setSelectedQuarter(Number(e.target.value))}
                                            className="w-full bg-navy-900 border border-navy-700 text-slate-200 text-sm px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
                                        >
                                            {availableQuarters.map(q => <option key={q} value={q}>Quarter {q}</option>)}
                                            {availableQuarters.length === 0 && <option value={0}>No Quarters Finished</option>}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full mt-2 bg-navy-700 hover:bg-navy-600 border border-navy-600 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Export PDF Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DETAILED REPORT SECTION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white tracking-tight">Quarterly Ledger Reports</h2>
                            <div className="h-px flex-1 bg-navy-800"></div>
                        </div>

                        {renderDetailedReport()}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Intelligence;
