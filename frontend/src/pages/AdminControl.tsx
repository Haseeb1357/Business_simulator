import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { Play, RefreshCw, RotateCcw, CheckCircle2, AlertTriangle, Clock, X } from 'lucide-react';

const AdminControl = () => {
    const { currentQuarter, teams, submittedTeams, processQuarter, resetGame, processingLog, gameConfig, updateGameConfig, addTeam, removeTeam, addNewsItem } = useSimulationStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [logLines, setLogLines] = useState<string[]>([]);
    const [showResetModal, setShowResetModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [newsInput, setNewsInput] = useState('');
    const [teamToDelete, setTeamToDelete] = useState<{ id: number; name: string } | null>(null);

    useEffect(() => { setLogLines(processingLog); }, [processingLog]);

    const handleRunSimulation = () => {
        setIsProcessing(true);
        setLogLines(['> Initializing simulation engine...']);

        setTimeout(() => {
            processQuarter();
            setIsProcessing(false);
        }, 1500);
    };

    const handleResetClick = () => {
        setShowResetModal(true);
    };

    const handleResetConfirm = () => {
        resetGame();
        setIsProcessing(false);
        setLogLines(['> Game reset to Quarter 1.']);
        setShowResetModal(false);
    };

    const handleAddTeam = () => {
        if (newTeamName.trim()) {
            addTeam(newTeamName.trim());
            setNewTeamName('');
            setLogLines(prev => [...prev, `> Added new team: ${newTeamName.trim()}`]);
        }
    };

    const handleBroadcastNews = () => {
        if (newsInput.trim()) {
            addNewsItem(`Q${currentQuarter}: ${newsInput.trim()}`);
            setNewsInput('');
            setLogLines(prev => [...prev, `> Broadcasted news to all teams.`]);
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Simulation Control Panel</h1>
                            <p className="text-slate-500">Instructor Dashboard — Quarter {currentQuarter}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white border border-slate-300 px-3 py-1.5 rounded-md shadow-sm">
                                <span className="relative flex h-3 w-3">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isProcessing ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isProcessing ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                </span>
                                <span className="text-sm font-medium text-slate-700">{isProcessing ? 'Processing...' : 'Ready'}</span>
                            </div>
                            <button onClick={handleResetClick} className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1">
                                <RotateCcw className="h-4 w-4" /> Reset Game
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        {/* Quarter Execution */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 col-span-2">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Quarter Execution</h2>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 mb-6">
                                <div>
                                    <h3 className="font-semibold text-slate-900 text-lg">Process Quarter {currentQuarter}</h3>
                                    <p className="text-sm text-slate-500">{submittedTeams.size}/{teams.length} teams submitted decisions</p>
                                </div>
                                <button onClick={handleRunSimulation} disabled={isProcessing}
                                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                                    {isProcessing ? 'Running...' : 'Execute Simulation'}
                                </button>
                            </div>

                            <h3 className="font-medium text-slate-700 mb-3">Team Decision Status</h3>
                            <div className="w-full border border-slate-200 rounded-lg overflow-hidden">
                                <table className="min-w-full divide-y divide-slate-200">
                                    <thead className="bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Team</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Company</th>
                                            <th className="px-4 py-2.5 text-left text-xs font-medium text-slate-500 uppercase">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200">
                                        {teams.map(t => (
                                            <tr key={t.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-2.5 text-sm font-medium text-slate-900">{t.name}</td>
                                                <td className="px-4 py-2.5 text-sm text-slate-500">Company {t.companyNumber}</td>
                                                <td className="px-4 py-2.5 text-sm">
                                                    {submittedTeams.has(t.id) ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                                                            <CheckCircle2 className="h-3.5 w-3.5" /> Submitted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700">
                                                            <Clock className="h-3.5 w-3.5" /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Market Intervention & News */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Instructor Controls</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-slate-700 mb-2">Broadcast Quarterly News</h3>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={newsInput}
                                            onChange={(e) => setNewsInput(e.target.value)}
                                            placeholder="e.g. Interest rates rise by 1%..."
                                            className="flex-1 border-slate-300 rounded-md shadow-sm sm:text-sm"
                                        />
                                        <button onClick={handleBroadcastNews} className="bg-primary-600 text-white px-3 py-2 rounded-md font-medium text-sm hover:bg-primary-700">Send</button>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">This will be visible on all team dashboards.</p>
                                </div>

                                <div className="border-t border-slate-200 pt-4">
                                    <h3 className="text-sm font-medium text-slate-700 mb-2">Economic Variables</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">GDP Growth (%)</label>
                                            <input type="number" value={gameConfig.gdpGrowth} step={0.1}
                                                onChange={e => updateGameConfig({ gdpGrowth: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Interest Rate (%)</label>
                                            <input type="number" value={gameConfig.interestRate} step={0.25}
                                                onChange={e => updateGameConfig({ interestRate: Number(e.target.value) })}
                                                className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Management */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-lg font-bold text-slate-800">Dynamic Team Management</h2>
                                <p className="text-sm text-slate-500">Add or remove competing companies from the simulation.</p>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="New Team Name"
                                    className="border-slate-300 rounded-md shadow-sm sm:text-sm w-48"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                                />
                                <button onClick={handleAddTeam} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm">
                                    + Add Team
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {teams.map(t => (
                                <div key={t.id} className="flex flex-col bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="font-bold text-slate-800">{t.name}</span>
                                        <button
                                            onClick={() => setTeamToDelete({ id: t.id, name: t.name })}
                                            className="text-slate-400 hover:text-red-600 transition-colors"
                                            title="Remove Team"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <span className="text-xs text-slate-500">Company {t.companyNumber}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Terminal Log */}
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-emerald-400 h-52 overflow-y-auto shadow-inner">
                        {logLines.length === 0 && <p className="text-slate-600">{'>'} Waiting for simulation command...</p>}
                        {logLines.map((line, i) => (
                            <p key={i} className={line.includes('COMPLETE') ? 'text-emerald-300 font-bold' : line.includes('Error') ? 'text-red-400' : ''}>
                                {line}
                            </p>
                        ))}
                    </div>
                </main>
            </div>

            {/* Team Deletion Confirmation Modal */}
            {teamToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setTeamToDelete(null)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Remove Team</h3>
                            <p className="text-sm text-slate-500">
                                Are you sure you want to completely remove <strong>{teamToDelete.name}</strong> from the simulation?
                                This action will delete their history, decisions, and all associated data. This action cannot be undone.
                            </p>
                        </div>
                        <div className="bg-slate-50 px-6 py-4 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                onClick={() => setTeamToDelete(null)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    removeTeam(teamToDelete.id);
                                    setLogLines(prev => [...prev, `> Removed team: ${teamToDelete.name}`]);
                                    setTeamToDelete(null);
                                }}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Yes, Remove Team
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowResetModal(false)} />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden animate-in">
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-2">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">Reset Simulation</h3>
                            </div>
                            <button onClick={() => setShowResetModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-4">
                            <p className="text-slate-600 text-sm leading-relaxed">
                                This will <strong className="text-red-600">permanently reset</strong> the entire simulation back to <strong>Quarter 1</strong>. All team results, financial data, and submitted decisions will be lost.
                            </p>
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="text-xs text-amber-800 font-medium">⚠ This action cannot be undone.</p>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleResetConfirm}
                                className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Yes, Reset Game
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminControl;
