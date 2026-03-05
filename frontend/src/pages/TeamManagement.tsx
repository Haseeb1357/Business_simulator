import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { Plus, X } from 'lucide-react';

const TeamManagement = () => {
    const { teams, activeTeamId, setActiveTeam, allResults, currentQuarter } = useSimulationStore();
    const [showModal, setShowModal] = useState(false);
    const latestQ = currentQuarter - 1;

    const teamsData = teams.map(t => {
        const results = allResults.get(t.id) || [];
        const latest = results.find(r => r.quarter === latestQ);
        return {
            ...t,
            rank: 0,
            profit: latest?.kpis.netProfit || 0,
            share: latest?.kpis.marketShare || 0,
            sharePrice: latest?.kpis.sharePrice || 116,
            employees: latest?.kpis.employees || 92,
        };
    }).sort((a, b) => (b.profit) - (a.profit));

    teamsData.forEach((t, i) => t.rank = i + 1);

    const fmt = (n: number) => n >= 0 ? `$${n.toLocaleString()}` : `-$${Math.abs(n).toLocaleString()}`;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Team Management</h1>
                            <p className="text-slate-500">Manage competing teams in the simulation</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Team</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Employees</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Rank</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Net Profit</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Share Price</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {teamsData.map(team => (
                                    <tr key={team.id} className={`hover:bg-slate-50 transition-colors ${team.id === activeTeamId ? 'bg-primary-50/50' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                                    T{team.companyNumber}
                                                </div>
                                                <span className="text-sm font-semibold text-slate-900">{team.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">Company {team.companyNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{team.employees}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">#{team.rank}</td>
                                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${team.profit < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {latestQ > 0 ? fmt(team.profit) : '—'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-primary-600">{team.sharePrice}¢</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                            <button onClick={() => setActiveTeam(team.id)}
                                                className={`font-medium mr-3 ${team.id === activeTeamId ? 'text-emerald-600' : 'text-primary-600 hover:text-primary-900'}`}>
                                                {team.id === activeTeamId ? '✓ Active' : 'Select'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                        <strong>Tip:</strong> Click "Select" to switch your active team. All decision inputs and reports will update for the selected team.
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TeamManagement;
