import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { Globe, Cpu, TrendingUp, Users, Database, Shield, TrendingDown, PieChart } from 'lucide-react';

const MarketIntelligence = () => {
    const teams = useSimulationStore(s => s.teams);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const allResults = useSimulationStore(s => s.allResults);
    const gameConfig = useSimulationStore(s => s.gameConfig);
    const latestQ = currentQuarter - 1;

    const getTeamData = (teamId: number) => {
        const results = allResults.get(teamId) || [];
        const latest = results.find(r => r.quarter === latestQ);
        const dec = useSimulationStore.getState().currentDecisions.get(teamId);
        return { latest, dec };
    };

    return (
        <div className="flex h-screen overflow-hidden bg-navy-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72">
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
                    <div className="border-b border-navy-800 pb-8">
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 italic uppercase">
                            <Globe className="text-gold-500 w-8 h-8" />
                            Market <span className="text-gold-500">Intelligence</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Cross-Company Comparison — Quarter {currentQuarter}</p>
                    </div>

                    {/* Business Intelligence Table */}
                    <div className="bg-navy-800 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden">
                        <div className="bg-navy-900/50 text-gold-500 font-black px-6 py-4 text-[10px] uppercase tracking-[0.2em] border-b border-navy-700 flex items-center gap-2">
                            <Cpu className="w-4 h-4" /> Global Performance Benchmarking
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="bg-navy-900/80">
                                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest sticky left-0 bg-navy-900 z-10 min-w-48">KPI Variable</th>
                                        {teams.map(t => (
                                            <th key={t.id} className="px-4 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest min-w-24">Entity {t.companyNumber}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-navy-700/50">
                                    {/* Net Profit */}
                                    <tr className="group hover:bg-navy-700/20">
                                        <td className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest sticky left-0 bg-navy-800 z-10">Net Profit ($)</td>
                                        {teams.map(t => {
                                            const d = getTeamData(t.id);
                                            const np = d.latest?.kpis.netProfit || 0;
                                            return <td key={t.id} className={`px-4 py-4 text-center tabular-nums font-mono font-bold ${np < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                                {latestQ > 0 ? (np >= 0 ? `$${(np / 1000).toFixed(0)}k` : `-$${(Math.abs(np) / 1000).toFixed(0)}k`) : '—'}
                                            </td>;
                                        })}
                                    </tr>
                                    {/* Market Share */}
                                    <tr className="group hover:bg-navy-700/20 bg-navy-900/20">
                                        <td className="px-6 py-4 text-[10px] font-black text-slate-300 uppercase tracking-widest sticky left-0 bg-navy-900/20 z-10 backdrop-blur-sm">Market Share (%)</td>
                                        {teams.map(t => {
                                            const d = getTeamData(t.id);
                                            return <td key={t.id} className="px-4 py-4 text-center tabular-nums font-mono text-slate-400">{latestQ > 0 ? d.latest?.kpis.marketShare?.toFixed(1) : '—'}</td>;
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Economic Information */}
                    <div className="bg-navy-800 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden">
                        <div className="bg-navy-900/50 text-gold-500 font-black px-6 py-4 text-[10px] uppercase tracking-[0.2em] border-b border-navy-700 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" /> Macroeconmic Indicators
                        </div>
                        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[
                                { label: 'GDP Growth', value: `${gameConfig.gdpGrowth}%`, icon: Globe },
                                { label: 'Unemployment', value: `${gameConfig.unemploymentRate}%`, icon: Users },
                                { label: 'Interest Rate', value: `${gameConfig.interestRate}%`, icon: Cpu },
                                { label: 'Material Index', value: `$${gameConfig.materialPrice.toLocaleString()}`, icon: Database },
                                { label: 'Inflation', value: `${gameConfig.inflationRate}%`, icon: TrendingUp },
                                { label: 'Growth Factor', value: gameConfig.marketGrowthFactor, icon: Shield },
                            ].map((item) => (
                                <div key={item.label} className="bg-navy-900/50 p-5 rounded-2xl border border-navy-700 flex justify-between items-center group hover:border-gold-500/30 transition-all">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{item.label}</span>
                                        <span className="text-xl font-black text-white">{item.value}</span>
                                    </div>
                                    <item.icon className="w-8 h-8 text-navy-700 group-hover:text-gold-500/20 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MarketIntelligence;
