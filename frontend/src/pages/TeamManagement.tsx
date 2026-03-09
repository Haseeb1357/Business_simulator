import Navbar from '../components/Navbar';
import { useSimulationStore } from '../store/simulationStore';
import { Users, Shield } from 'lucide-react';

const TeamManagement = () => {
    const teams = useSimulationStore(s => s.teams);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);
    const setActiveTeam = useSimulationStore(s => s.setActiveTeam);
    const allResults = useSimulationStore(s => s.allResults);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const latestQ = currentQuarter - 1;

    const teamsData = teams.map(t => {
        const results = allResults.get(t.id) || [];
        const latest = results.find(r => r.quarter === latestQ);
        return {
            ...t,
            rank: 0,
            profit: latest?.kpis.netProfit || 0,
            share: latest?.kpis.marketShare || 0,
        };
    }).sort((a, b) => (b.profit) - (a.profit));

    teamsData.forEach((t, i) => t.rank = i + 1);

    const fmt = (n: number) => n >= 0 ? `$${n.toLocaleString()}` : `-$${Math.abs(n).toLocaleString()}`;

    return (
        <div className="min-h-screen bg-navy-900 pb-20">
            <Navbar />
            <div className="pt-24 px-4 sm:px-6 lg:px-8">
                <main className="max-w-7xl mx-auto w-full space-y-8">
                    <div className="border-b border-navy-800 pb-8">
                        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3 italic uppercase">
                            <Users className="text-gold-500 w-8 h-8" />
                            Entity <span className="text-gold-500">Directory</span>
                        </h1>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Market Participants & Active Units</p>
                    </div>

                    <div className="bg-navy-800 rounded-3xl border border-navy-700 shadow-2xl overflow-hidden">
                        <table className="min-w-full">
                            <thead>
                                <tr className="bg-navy-900/50 border-b border-navy-700">
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Competitor</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Assignment</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Rank</th>
                                    <th className="px-8 py-5 text-left text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Net Profit</th>
                                    <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Protocol</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-navy-700/50">
                                {teamsData.map(team => (
                                    <tr key={team.id} className={`group transition-all hover:bg-navy-700/30 ${team.id === activeTeamId ? 'bg-gold-500/5' : ''}`}>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-xs shadow-lg transition-transform group-hover:scale-110 ${team.id === activeTeamId ? 'bg-gold-500 text-navy-900' : 'bg-navy-900 text-slate-400 border border-navy-700'}`}>
                                                    T{team.companyNumber}
                                                </div>
                                                <span className={`font-black text-sm uppercase tracking-tight ${team.id === activeTeamId ? 'text-gold-500' : 'text-slate-200'} transition-colors`}>{team.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company Unit {team.companyNumber}</td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`text-lg font-black ${team.rank === 1 ? 'text-gold-500' : team.rank === 2 ? 'text-slate-300' : team.rank === 3 ? 'text-amber-600' : 'text-slate-500'}`}>#{team.rank}</span>
                                        </td>
                                        <td className={`px-8 py-6 whitespace-nowrap font-mono font-bold ${team.profit < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {latestQ > 0 ? fmt(team.profit) : '—'}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <button onClick={() => setActiveTeam(team.id)}
                                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${team.id === activeTeamId ? 'bg-gold-500/10 text-gold-500 border border-gold-500/20' : 'bg-navy-900 text-slate-500 border border-navy-700 hover:text-white hover:border-slate-500'}`}>
                                                {team.id === activeTeamId ? 'ACTIVE' : 'ENGAGE'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="bg-navy-800/50 border border-navy-700/50 rounded-2xl p-6 flex items-center gap-4">
                        <div className="h-10 w-10 bg-gold-500/10 rounded-full flex items-center justify-center text-gold-500">
                            <Shield className="w-5 h-5" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                            Selection protocol enforced. Switch the active entity to modify regional decision matrices and access internal quarterly ledgers.
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TeamManagement;
