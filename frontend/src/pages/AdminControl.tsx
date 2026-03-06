import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { Play, RefreshCw, RotateCcw, CheckCircle2, AlertTriangle, Clock, X } from 'lucide-react';

const AdminControl = () => {
    const { currentQuarter, gameStatus, teams, submittedTeams, processQuarter, resetGame, processingLog, gameConfig, updateGameConfig } = useSimulationStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [logLines, setLogLines] = useState<string[]>([]);
    const [showResetModal, setShowResetModal] = useState(false);

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

                        {/* Market Intervention */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Market Intervention</h2>
                            <p className="text-sm text-slate-500 mb-4">Adjust economic variables for the next run.</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">GDP Growth (%)</label>
                                    <input type="number" value={gameConfig.gdpGrowth} step={0.1}
                                        onChange={e => updateGameConfig({ gdpGrowth: Number(e.target.value) })}
                                        className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Interest Rate (%)</label>
                                    <input type="number" value={gameConfig.interestRate} step={0.25}
                                        onChange={e => updateGameConfig({ interestRate: Number(e.target.value) })}
                                        className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Inflation Rate (%)</label>
                                    <input type="number" value={gameConfig.inflationRate} step={0.1}
                                        onChange={e => updateGameConfig({ inflationRate: Number(e.target.value) })}
                                        className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Material Price ($ per 1000)</label>
                                    <input type="number" value={gameConfig.materialPrice}
                                        onChange={e => updateGameConfig({ materialPrice: Number(e.target.value) })}
                                        className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Share Price Adjustments */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Public Company Share Prices</h2>
                        <p className="text-sm text-slate-500 mb-4">Adjust the share price (in cents) for teams that have launched an IPO. Private companies cannot be adjusted here.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {teams.map(t => {
                                const ipoState = useSimulationStore.getState().getTeamIPOState(t.id);
                                return (
                                    <div key={t.id} className={`p-4 rounded-lg border ${ipoState.isPublic ? 'border-primary-200 bg-primary-50/30' : 'border-slate-200 bg-slate-50'}`}>
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-bold text-slate-800">{t.name}</span>
                                            {ipoState.isPublic ? (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">PUBLIC</span>
                                            ) : (
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">PRIVATE</span>
                                            )}
                                        </div>
                                        {ipoState.isPublic ? (
                                            <div>
                                                <label className="block text-xs font-medium text-slate-600 mb-1">Share Price (¢)</label>
                                                <input
                                                    type="number"
                                                    value={ipoState.sharePrice}
                                                    onChange={e => useSimulationStore.getState().adminEditSharePrice(t.id, Number(e.target.value))}
                                                    className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm"
                                                />
                                            </div>
                                        ) : (
                                            <div className="text-sm text-slate-400 italic mt-6">Not available</div>
                                        )}
                                    </div>
                                );
                            })}
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
