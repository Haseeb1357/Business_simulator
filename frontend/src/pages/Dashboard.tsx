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
        return n >= 0 ? `$${n.toLocaleString()}` : `-$${Math.abs(n).toLocaleString()}`;
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 lg:pl-72">
                <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 border-b border-slate-200 pb-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Command Center</h1>
                            <p className="text-slate-500 mt-1">{activeTeam?.name} <span className="text-slate-300 mx-2">|</span> Company {activeTeam?.companyNumber}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Current Phase</span>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-lg font-bold text-primary-600">Quarter {currentQuarter}</span>
                                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${gameStatus === 'inputting' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-blue-100 text-blue-700 border border-blue-200'}`}>
                                        {gameStatus === 'inputting' ? 'DECISION PHASE' : 'PROCESSING'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Intelligence & History */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-indigo-500" />
                            <h2 className="text-lg font-semibold text-slate-800">Market Intelligence & News</h2>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                            {gameConfig.news && gameConfig.news.length > 0 ? (
                                <ul className="space-y-3">
                                    {[...gameConfig.news].reverse().slice(0, 3).map((item, idx) => (
                                        <li key={idx} className="flex gap-3 items-start text-sm">
                                            <div className="mt-0.5 text-indigo-500"><AlertCircle className="w-4 h-4" /></div>
                                            <span className="text-slate-700 leading-snug">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-slate-500 italic">No market news at this time. The economic environment is stable.</p>
                            )}
                            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">GDP Growth</span>
                                    <span className="font-semibold text-slate-800">{gameConfig.gdpGrowth}%</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">Inflation</span>
                                    <span className="font-semibold text-slate-800">{gameConfig.inflationRate}%</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">Base Interest</span>
                                    <span className="font-semibold text-slate-800">{gameConfig.interestRate}%</span>
                                </div>
                                <div>
                                    <span className="text-slate-500 block text-xs mb-1">Material Cost</span>
                                    <span className="font-semibold text-slate-800">${gameConfig.materialPrice}/unit</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Current Performance (Latest Quarter) */}
                    <section>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-emerald-500" />
                                <h2 className="text-lg font-semibold text-slate-800">Performance Summary (Q{latestQ})</h2>
                            </div>
                            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
                                View Full Report <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>

                        {latest ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-1">Revenue</span>
                                    <span className="text-2xl font-bold text-slate-900">{fmt(latest.profitAndLoss.salesRevenue)}</span>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-1">Net Profit</span>
                                    <span className={`text-2xl font-bold ${latest.kpis.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                        {fmt(latest.kpis.netProfit)}
                                    </span>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 relative">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-1">Market Share</span>
                                    <span className="text-2xl font-bold text-amber-600">{latest.kpis.marketShare.toFixed(1)}%</span>
                                </div>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-widest block mb-1">Company Value</span>
                                    <span className="text-2xl font-bold text-primary-600">£{fmt(latest.kpis.companyValue)}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center bg-slate-50/50">
                                <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <FileText className="w-6 h-6 text-slate-400" />
                                </div>
                                <h3 className="text-slate-700 font-medium">No Historical Data</h3>
                                <p className="text-slate-500 text-sm mt-1">Run Quarter 1 to generate your first set of management reports.</p>
                            </div>
                        )}
                    </section>

                    {/* Section 3: Decision Entry */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <FileText className="w-5 h-5 text-primary-500" />
                            <h2 className="text-lg font-semibold text-slate-800">Quarter {currentQuarter} Decisions</h2>
                        </div>

                        {gameStatus !== 'inputting' ? (
                            <div className="bg-white rounded-xl border border-blue-200 p-8 text-center bg-blue-50/50 shadow-sm">
                                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                                <h3 className="text-blue-900 font-bold text-lg">Simulation Running</h3>
                                <p className="text-blue-700 text-sm mt-1">Please wait for the administrator to finish processing the quarter.</p>
                            </div>
                        ) : hasSubmitted ? (
                            <div className="bg-white rounded-xl border border-emerald-200 p-8 text-center bg-emerald-50/50 shadow-sm">
                                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h3 className="text-emerald-900 font-bold text-lg">Decisions Submitted</h3>
                                <p className="text-emerald-700 text-sm mt-1">Waiting for other teams and the administrator to run the quarter.</p>
                            </div>
                        ) : (
                            <div className="mt-4">
                                <DecisionForm embedded={true} />
                            </div>
                        )}
                    </section>

                </main>
            </div>
        </div>
    );
};

export default Dashboard;
