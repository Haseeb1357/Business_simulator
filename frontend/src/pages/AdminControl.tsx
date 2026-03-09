import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { Play, RefreshCw, RotateCcw, CheckCircle2, AlertTriangle, Clock, X, Settings, AlertCircle, Users, Pause, Trash2, ChevronRight, Search, Download, Cpu, Database, Shield } from 'lucide-react';

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
        <div className="flex h-screen overflow-hidden bg-navy-900">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72">
                <main className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full space-y-8">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 border-b border-navy-800 pb-8">
                        <div>
                            <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                                <Settings className="text-gold-500 w-8 h-8" />
                                Simulation <span className="text-gold-500">Control</span>
                            </h1>
                            <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Global System Administration — Fiscal Phase {currentQuarter}</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 bg-navy-800 border border-navy-700 px-4 py-2 rounded-xl shadow-lg">
                                <div className="relative flex h-3 w-3">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isProcessing ? 'bg-blue-400' : 'bg-emerald-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-3 w-3 ${isProcessing ? 'bg-blue-500' : 'bg-emerald-500'}`}></span>
                                </div>
                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{isProcessing ? 'Engine Active' : 'System Ready'}</span>
                            </div>
                            <button onClick={handleResetClick} className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:text-white hover:bg-rose-500/10 px-3 py-2 rounded-lg transition-all flex items-center gap-2 border border-rose-500/20">
                                <RotateCcw className="h-4 w-4" /> Master Reset
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Quarter Execution */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-2xl p-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Play className="w-32 h-32" />
                                </div>
                                <div className="relative z-10">
                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                        <div>
                                            <h3 className="text-2xl font-black text-white uppercase italic">Command Q{currentQuarter} Execution</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <div className="h-2 w-32 bg-navy-900 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gold-500 transition-all" style={{ width: `${(submittedTeams.size / Math.max(1, teams.length)) * 100}%` }} />
                                                </div>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                    {submittedTeams.size} / {teams.length} Directives Received
                                                </p>
                                            </div>
                                        </div>
                                        <button onClick={handleRunSimulation} disabled={isProcessing}
                                            className="w-full md:w-auto flex items-center justify-center gap-3 bg-gold-500 hover:bg-white text-navy-900 px-8 py-5 rounded-2xl font-black shadow-2xl shadow-gold-500/10 transition-all active:scale-[0.98] disabled:opacity-50 uppercase text-xs tracking-[0.2em]">
                                            {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Play className="h-5 w-5" />}
                                            {isProcessing ? 'Processing...' : 'Run Simulation'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-2xl overflow-hidden">
                                <div className="px-6 py-4 border-b border-navy-700 bg-navy-900/50 flex items-center justify-between">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity Readiness</h3>
                                    <Clock className="w-4 h-4 text-slate-600" />
                                </div>
                                <table className="w-full text-left">
                                    <thead className="bg-navy-900/30">
                                        <tr>
                                            <th className="px-6 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest">Name</th>
                                            <th className="px-6 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-navy-700/50">
                                        {teams.map(t => (
                                            <tr key={t.id} className="hover:bg-navy-700/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-black text-slate-100 uppercase tracking-wide">{t.name}</span>
                                                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Unit {t.companyNumber}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {submittedTeams.has(t.id) ? (
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2 py-1 text-[9px] font-black text-emerald-500 border border-emerald-500/20 uppercase">
                                                            <CheckCircle2 className="h-3 w-3" /> Transmitted
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-2 py-1 text-[9px] font-black text-amber-500 border border-amber-500/20 uppercase">
                                                            <Clock className="h-3 w-3" /> Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Intervention & Variables */}
                        <div className="space-y-6">
                            <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-2xl p-6">
                                <h2 className="text-[10px] font-black text-white uppercase tracking-widest border-b border-navy-700 pb-4 mb-6 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-gold-500" /> Global Dispatch
                                </h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Market Bulletin</label>
                                        <div className="flex flex-col gap-3">
                                            <textarea
                                                rows={3}
                                                value={newsInput}
                                                onChange={(e) => setNewsInput(e.target.value)}
                                                placeholder="Enter market news summary..."
                                                className="w-full bg-navy-900 border border-navy-700 text-slate-200 text-xs px-4 py-3 rounded-xl focus:ring-2 focus:ring-gold-500/50 outline-none transition-all placeholder-navy-700 font-medium"
                                            />
                                            <button onClick={handleBroadcastNews} className="w-full bg-navy-700 hover:bg-navy-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all">Send Bulletin</button>
                                        </div>
                                    </div>

                                    <div className="border-t border-navy-700 pt-6">
                                        <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-4 ml-1">Macroeconomic Shift</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-600 uppercase mb-1.5 ml-1">GDP Growth (%)</label>
                                                <input type="number" value={gameConfig.gdpGrowth} step={0.1}
                                                    onChange={e => updateGameConfig({ gdpGrowth: Number(e.target.value) })}
                                                    className="w-full bg-navy-900 border border-navy-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold-500/50 outline-none" />
                                            </div>
                                            <div>
                                                <label className="block text-[9px] font-black text-slate-600 uppercase mb-1.5 ml-1">Base Rate (%)</label>
                                                <input type="number" value={gameConfig.interestRate} step={0.25}
                                                    onChange={e => updateGameConfig({ interestRate: Number(e.target.value) })}
                                                    className="w-full bg-navy-900 border border-navy-700 text-white rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-gold-500/50 outline-none" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Terminal */}
                            <div className="bg-navy-950 rounded-2xl p-5 font-mono text-[11px] text-emerald-400 h-64 overflow-y-auto shadow-inner border border-navy-800 relative">
                                <div className="absolute top-0 right-0 p-3 opacity-20"><RefreshCw className={`w-4 h-4 ${isProcessing ? 'animate-spin' : ''}`} /></div>
                                {logLines.length === 0 && <p className="text-navy-700">{'>'} SYS_IDLE: Waiting for execution command...</p>}
                                {logLines.map((line, i) => (
                                    <p key={i} className={`mb-1 ${line.includes('COMPLETE') ? 'text-gold-500 font-bold' : line.includes('Error') ? 'text-rose-500' : ''}`}>
                                        <span className="text-navy-700 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                        {line}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Team Expansion Terminal */}
                    <div className="bg-navy-800 rounded-3xl border border-navy-700 shadow-2xl p-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                            <div>
                                <h2 className="text-xl font-black text-white uppercase italic tracking-tight">Entity Deployment</h2>
                                <p className="text-xs text-slate-500 font-bold tracking-widest uppercase mt-1">Manage competing market participants</p>
                            </div>
                            <div className="flex gap-3 w-full md:w-auto">
                                <input
                                    type="text"
                                    value={newTeamName}
                                    onChange={(e) => setNewTeamName(e.target.value)}
                                    placeholder="Enter New Entity Name"
                                    className="flex-1 md:w-64 bg-navy-900 border border-navy-700 text-white px-5 py-3 rounded-2xl focus:ring-2 focus:ring-gold-500/50 outline-none transition-all placeholder-navy-700 text-xs font-bold uppercase tracking-widest"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddTeam()}
                                />
                                <button onClick={handleAddTeam} className="bg-emerald-600 hover:bg-white hover:text-navy-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95">
                                    + Deploy Unit
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {teams.map(t => (
                                <div key={t.id} className="relative group bg-navy-900/50 border border-navy-700 rounded-2xl p-5 hover:border-gold-500/30 transition-all overflow-hidden">
                                    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Users className="w-20 h-20" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Unit-{t.companyNumber}</span>
                                            <button
                                                onClick={() => setTeamToDelete({ id: t.id, name: t.name })}
                                                className="text-navy-700 hover:text-rose-500 transition-colors bg-navy-900 p-1 rounded-md"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <h4 className="text-sm font-black text-white uppercase tracking-tight group-hover:text-gold-500 transition-colors">{t.name}</h4>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Team Deletion Confirmation Modal */}
            {teamToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-md" onClick={() => setTeamToDelete(null)} />
                    <div className="relative bg-navy-800 rounded-3xl border border-navy-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 border border-rose-500/20 shadow-xl shadow-rose-500/10">
                                <AlertTriangle className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tigh">Terminate Entity</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                System confirmation required to remove <strong className="text-white">{teamToDelete.name}</strong> from active simulation. All historical data, directives, and KPIs will be purged from the core database.
                            </p>
                        </div>
                        <div className="bg-navy-900/50 px-8 py-6 flex flex-col md:flex-row gap-4 border-t border-navy-700">
                            <button
                                onClick={() => setTeamToDelete(null)}
                                className="flex-1 px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Abort Deletion
                            </button>
                            <button
                                onClick={() => {
                                    removeTeam(teamToDelete.id);
                                    setLogLines(prev => [...prev, `> Removed team: ${teamToDelete.name}`]);
                                    setTeamToDelete(null);
                                }}
                                className="flex-1 px-6 py-4 text-xs font-black text-navy-900 bg-rose-500 rounded-2xl hover:bg-white transition-all shadow-xl shadow-rose-500/10 active:scale-95"
                            >
                                Confirm Termination
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-navy-950/90 backdrop-blur-md" onClick={() => setShowResetModal(false)} />
                    <div className="relative bg-navy-800 rounded-3xl border border-navy-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-8">
                            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6 border border-rose-500/20 shadow-xl shadow-rose-500/10">
                                <RotateCcw className="h-8 w-8" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tight">Full System Reset</h3>
                            <p className="text-slate-400 text-sm leading-relaxed font-medium">
                                Initiating a master reset will return the entire simulation environment to <strong>Phase Q1</strong>. All competitive progress and historical ledgers will be wiped across all entities.
                            </p>
                            <div className="mt-6 p-4 bg-rose-500/5 border border-rose-500/20 rounded-2xl">
                                <p className="text-[10px] text-rose-500 font-black uppercase tracking-widest flex items-center gap-2">
                                    <AlertTriangle className="w-3 h-3" /> System Critical Operation
                                </p>
                            </div>
                        </div>
                        <div className="bg-navy-900/50 px-8 py-6 flex flex-col md:flex-row gap-4 border-t border-navy-700">
                            <button
                                onClick={() => setShowResetModal(false)}
                                className="flex-1 px-6 py-4 text-xs font-black text-slate-400 uppercase tracking-widest hover:text-white transition-colors"
                            >
                                Cancel Reset
                            </button>
                            <button
                                onClick={handleResetConfirm}
                                className="flex-1 px-6 py-4 text-xs font-black text-navy-900 bg-rose-500 rounded-2xl hover:bg-white transition-all shadow-xl shadow-rose-500/10 active:scale-95"
                            >
                                Confirm Master Reset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminControl;
