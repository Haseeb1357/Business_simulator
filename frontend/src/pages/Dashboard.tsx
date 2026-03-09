import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { useMemo } from 'react';
import { Activity, TrendingUp, AlertCircle, FileText, ChevronRight, CheckCircle } from 'lucide-react';
import DecisionForm from './DecisionForm';

const Dashboard = () => {
    const teams = useSimulationStore(s => s.teams);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const gameStatus = useSimulationStore(s => s.gameStatus);
    const allResults = useSimulationStore(s => s.allResults);
    const gameConfig = useSimulationStore(s => s.gameConfig);
    const submittedTeams = useSimulationStore(s => s.submittedTeams);

    const activeTeam = teams.find(t => t.id === activeTeamId);
    const latestQ = currentQuarter - 1;

    // Is the current team submitted?
    const hasSubmitted = submittedTeams.has(activeTeamId);

    // Compute data
    const history = useMemo(() => allResults.get(activeTeamId) || [], [allResults, activeTeamId]);
    const latest = history.length > 0 ? history[history.length - 1] : null;

    const fmt = (n: number | undefined) => {
        if (n === undefined) return '—';
        return n >= 0 ? `£${n.toLocaleString()}` : `-£${Math.abs(n).toLocaleString()}`;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-navy-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72">
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-12">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-navy-800 pb-8">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                                Command <span className="text-gold-500">Center</span>
                            </h1>
                            <p className="text-slate-400 mt-2 font-bold tracking-wide uppercase text-xs">
                                {activeTeam?.name} <span className="text-navy-700 mx-2">|</span> Operational Unit {activeTeam?.companyNumber}
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] block mb-1">Fiscal Period</span>
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-black text-white">Q{currentQuarter}</span>
                                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter border ${gameStatus === 'inputting' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'}`}>
                                        {gameStatus === 'inputting' ? 'Decision Phase' : 'Simulation Run'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Intelligence & Market News */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Activity className="w-5 h-5 text-gold-500" />
                            <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest">Market Intelligence</h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 bg-navy-800 rounded-2xl shadow-2xl border border-navy-700 p-6 flex flex-col">
                                {gameConfig.news && gameConfig.news.length > 0 ? (
                                    <ul className="space-y-4 flex-1">
                                        {[...gameConfig.news].reverse().slice(0, 3).map((item, idx) => (
                                            <li key={idx} className="flex gap-4 items-start group">
                                                <div className="mt-1 p-1 bg-navy-900 rounded border border-navy-700 text-gold-500 group-hover:bg-gold-500 group-hover:text-navy-900 transition-colors">
                                                    <AlertCircle className="w-4 h-4" />
                                                </div>
                                                <span className="text-slate-300 text-sm leading-relaxed font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div className="flex-1 flex items-center justify-center py-8">
                                        <p className="text-sm text-slate-500 italic font-medium">Economic conditions reported as stable. No critical bulletins.</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-navy-900 rounded-xl border border-navy-700">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">GDP Growth</span>
                                        <span className="text-lg font-black text-slate-200">{gameConfig.gdpGrowth}%</span>
                                    </div>
                                    <div className="p-3 bg-navy-900 rounded-xl border border-navy-700">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Inflation</span>
                                        <span className="text-lg font-black text-slate-200">{gameConfig.inflationRate}%</span>
                                    </div>
                                    <div className="p-3 bg-navy-900 rounded-xl border border-navy-700">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Base Rate</span>
                                        <span className="text-lg font-black text-slate-200">{gameConfig.interestRate}%</span>
                                    </div>
                                    <div className="p-3 bg-navy-900 rounded-xl border border-navy-700">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-wider block mb-1">Unit Cost</span>
                                        <span className="text-lg font-black text-slate-200">£{gameConfig.materialPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Current Performance */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest">Performance Matrix (Q{latestQ})</h2>
                            </div>
                            <button className="text-xs font-black text-gold-500 hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                                Deep Analytics <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {latest ? (
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-navy-800 rounded-2xl shadow-xl border border-navy-700 p-6 group hover:border-gold-500/50 transition-all">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Revenue</span>
                                    <span className="text-3xl font-black text-white">{fmt(latest.profitAndLoss.salesRevenue)}</span>
                                </div>
                                <div className="bg-navy-800 rounded-2xl shadow-xl border border-navy-700 p-6 group hover:border-gold-500/50 transition-all">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Retained Profit</span>
                                    <span className={`text-3xl font-black ${latest.kpis.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {fmt(latest.kpis.netProfit)}
                                    </span>
                                </div>
                                <div className="bg-navy-800 rounded-2xl shadow-xl border border-navy-700 p-6 group hover:border-gold-500/50 transition-all">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Market Dominance</span>
                                    <span className="text-3xl font-black text-gold-500">{latest.kpis.marketShare.toFixed(1)}%</span>
                                </div>
                                <div className="bg-navy-800 rounded-2xl shadow-xl border border-navy-700 p-6 group hover:border-gold-500/50 transition-all">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Entity Value</span>
                                    <span className="text-3xl font-black text-white">{fmt(latest.kpis.companyValue)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-navy-800 rounded-2xl border border-dashed border-navy-700 p-12 text-center">
                                <FileText className="w-12 h-12 text-navy-700 mx-auto mb-4" />
                                <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Awaiting Initial Reports</h3>
                                <p className="text-slate-500 text-xs mt-2 uppercase">Complete the first fiscal period to view analytics.</p>
                            </div>
                        )}
                    </section>

                    {/* Section 3: Decision Input */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-gold-500" />
                            <h2 className="text-sm font-black text-slate-200 uppercase tracking-widest">Operational Directives (Q{currentQuarter})</h2>
                        </div>

                        {gameStatus !== 'inputting' ? (
                            <div className="bg-navy-800 rounded-2xl border border-navy-600 p-20 text-center shadow-2xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gold-500/5 animate-pulse" />
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-navy-900 border-2 border-gold-500/30 text-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic">Simulation in Progress</h3>
                                    <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Directives locked. Processor computing market results.</p>
                                </div>
                            </div>
                        ) : hasSubmitted ? (
                            <div className="bg-emerald-500/5 rounded-2xl border border-emerald-500/20 p-20 text-center shadow-2xl relative overflow-hidden group">
                                <div className="relative z-10">
                                    <div className="w-16 h-16 bg-navy-900 border-2 border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase italic">Directives Transmitted</h3>
                                    <p className="text-slate-400 text-xs font-bold mt-2 uppercase tracking-widest">Awaiting clearing by system administrator.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-navy-800 rounded-3xl shadow-2xl overflow-hidden border border-navy-700 p-1">
                                <DecisionForm embedded={true} />
                            </div>
                        )}
                    </section>

                    <footer className="pt-12 border-t border-navy-800 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] text-center pb-20">
                        TOPAZ-Vbe Systems Management Protocol © 2026
                    </footer>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
