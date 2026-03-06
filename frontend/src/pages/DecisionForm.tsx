import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { TeamDecision } from '../engine/simulationEngine';
import { Dice5, Save, Send } from 'lucide-react';

const DecisionForm = () => {
    const { activeTeamId, currentQuarter, currentDecisions, submittedTeams, randomizeCurrentDecision, updateDecision, submitDecision, getTeamIPOState } = useSimulationStore();
    const isSubmitted = submittedTeams.has(activeTeamId);
    const [activeTab, setActiveTab] = useState('marketing');
    const [dec, setDec] = useState<TeamDecision>(currentDecisions.get(activeTeamId)!);
    const [saved, setSaved] = useState(false);
    const ipoState = getTeamIPOState(activeTeamId);

    useEffect(() => {
        const d = currentDecisions.get(activeTeamId);
        if (d) setDec(d);
    }, [activeTeamId, currentDecisions]);

    const tabs = [
        { id: 'marketing', name: 'Marketing & Sales' },
        { id: 'production', name: 'Production & Ops' },
        { id: 'hr', name: 'Human Resources' },
        { id: 'finance', name: 'Finance & R&D' },
    ];

    const handleSave = () => {
        updateDecision(activeTeamId, dec);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    const handleSubmit = () => {
        updateDecision(activeTeamId, dec);
        submitDecision(activeTeamId);
    };

    const handleRandomize = () => {
        randomizeCurrentDecision();
        const d = useSimulationStore.getState().currentDecisions.get(activeTeamId);
        if (d) setDec(d);
    };

    const updatePrice = (product: 'p1' | 'p2' | 'p3', market: 'home' | 'export', val: number) => {
        setDec(prev => ({ ...prev, prices: { ...prev.prices, [product]: { ...prev.prices[product], [market]: val } } }));
    };

    const updateAdv = (product: 'p1' | 'p2' | 'p3', type: 'trade' | 'press_tv' | 'merchandising', val: number) => {
        setDec(prev => ({ ...prev, advertising: { ...prev.advertising, [product]: { ...prev.advertising[product], [type]: val } } }));
    };

    const numInput = (label: string, value: number, onChange: (v: number) => void, min?: number, max?: number, suffix?: string) => (
        <div>
            <label className="text-sm text-slate-500 block mb-1">{label}</label>
            <div className="relative">
                <input type="number" value={value} onChange={e => onChange(Number(e.target.value))}
                    min={min} max={max} disabled={isSubmitted}
                    className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-100 disabled:text-slate-400" />
                {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">{suffix}</span>}
            </div>
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Quarterly Decisions</h1>
                            <p className="text-slate-500">Submit your strategic inputs for Q{currentQuarter}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-wrap">
                            {isSubmitted && (
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                    ✓ Submitted
                                </span>
                            )}
                            <button onClick={handleRandomize} disabled={isSubmitted}
                                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-medium py-2 px-4 rounded-lg shadow-sm disabled:opacity-50 transition-all">
                                <Dice5 className="h-4 w-4" /> Randomize
                            </button>
                            <button onClick={handleSave} disabled={isSubmitted}
                                className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 font-medium py-2 px-4 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50">
                                <Save className="h-4 w-4" /> {saved ? 'Saved ✓' : 'Save Draft'}
                            </button>
                            <button onClick={handleSubmit} disabled={isSubmitted}
                                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-4 rounded-lg shadow-sm disabled:opacity-50">
                                <Send className="h-4 w-4" /> Submit Decisions
                            </button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="border-b border-slate-200">
                            <nav className="-mb-px flex px-6 overflow-x-auto">
                                {tabs.map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-slate-500 hover:border-slate-300'}`}>
                                        {tab.name}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="p-6">
                            {/* ---- MARKETING TAB ---- */}
                            {activeTab === 'marketing' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 mb-4">Pricing Strategy ($)</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-200">
                                                        <th className="text-left py-2 pr-4 font-medium text-slate-600">Product</th>
                                                        <th className="text-left py-2 px-4 font-medium text-slate-600">Home Price ($)</th>
                                                        <th className="text-left py-2 px-4 font-medium text-slate-600">Export Price ($)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(['p1', 'p2', 'p3'] as const).map((pk, i) => (
                                                        <tr key={pk} className="border-b border-slate-100">
                                                            <td className="py-3 pr-4 font-medium text-slate-800">Product {i + 1}</td>
                                                            <td className="py-3 px-4">
                                                                <input type="number" value={dec.prices[pk].home} onChange={e => updatePrice(pk, 'home', Number(e.target.value))}
                                                                    disabled={isSubmitted} className="w-28 border-slate-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-100" />
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <input type="number" value={dec.prices[pk].export} onChange={e => updatePrice(pk, 'export', Number(e.target.value))}
                                                                    disabled={isSubmitted} className="w-28 border-slate-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-100" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold text-slate-900 border-b pb-2 mb-4">Advertising Expenditure ($'000)</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm">
                                                <thead>
                                                    <tr className="border-b border-slate-200">
                                                        <th className="text-left py-2 pr-4 font-medium text-slate-600">Product</th>
                                                        <th className="text-left py-2 px-4 font-medium text-slate-600">Trade Press</th>
                                                        <th className="text-left py-2 px-4 font-medium text-slate-600">Press & TV</th>
                                                        <th className="text-left py-2 px-4 font-medium text-slate-600">Merchandising</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {(['p1', 'p2', 'p3'] as const).map((pk, i) => (
                                                        <tr key={pk} className="border-b border-slate-100">
                                                            <td className="py-3 pr-4 font-medium text-slate-800">Product {i + 1}</td>
                                                            <td className="py-3 px-4">
                                                                <input type="number" value={dec.advertising[pk].trade} onChange={e => updateAdv(pk, 'trade', Number(e.target.value))}
                                                                    disabled={isSubmitted} className="w-24 border-slate-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-100" />
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <input type="number" value={dec.advertising[pk].press_tv} onChange={e => updateAdv(pk, 'press_tv', Number(e.target.value))}
                                                                    disabled={isSubmitted} className="w-24 border-slate-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-100" />
                                                            </td>
                                                            <td className="py-3 px-4">
                                                                <input type="number" value={dec.advertising[pk].merchandising} onChange={e => updateAdv(pk, 'merchandising', Number(e.target.value))}
                                                                    disabled={isSubmitted} className="w-24 border-slate-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-100" />
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ---- PRODUCTION TAB ---- */}
                            {activeTab === 'production' && (
                                <div className="space-y-8">
                                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Production & Operations</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {numInput('Raw Material Order (thousands)', dec.rawMaterialOrder, v => setDec(p => ({ ...p, rawMaterialOrder: v })), 0, 30, '×1000')}
                                        <div>
                                            <label className="text-sm text-slate-500 block mb-1">Shift Level</label>
                                            <select value={dec.shiftLevel} onChange={e => setDec(p => ({ ...p, shiftLevel: Number(e.target.value) }))}
                                                disabled={isSubmitted} className="w-full border-slate-300 rounded-md shadow-sm sm:text-sm disabled:bg-slate-100">
                                                <option value={1}>Single Shift (Normal)</option>
                                                <option value={2}>Overtime (+35% capacity, +50% cost)</option>
                                                <option value={3}>Double Shift (+60% capacity, +100% cost)</option>
                                            </select>
                                        </div>
                                        {numInput('Maintenance Hours', dec.maintenanceHours, v => setDec(p => ({ ...p, maintenanceHours: v })), 0, 200, 'hrs')}
                                        {numInput('Purchase New Machines', dec.machinePurchase, v => setDec(p => ({ ...p, machinePurchase: v })), 0, 10)}
                                    </div>
                                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                                        <strong>Tip:</strong> Higher maintenance hours reduce product rejection rates. Overtime shifts increase capacity but cost 50% more. Each new machine costs $100,000 and adds 1,200 hours of capacity.
                                    </div>
                                </div>
                            )}

                            {/* ---- HR TAB ---- */}
                            {activeTab === 'hr' && (
                                <div className="space-y-8">
                                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Human Resources</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {numInput('Recruit Assembly Workers', dec.recruitWorkers, v => setDec(p => ({ ...p, recruitWorkers: v })), 0, 30)}
                                        {numInput('Dismiss Assembly Workers', dec.dismissWorkers, v => setDec(p => ({ ...p, dismissWorkers: v })), 0, 30)}
                                        {numInput('Train Workers', dec.trainWorkers, v => setDec(p => ({ ...p, trainWorkers: v })), 0, 20)}
                                    </div>
                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                        <strong>Costs:</strong> Recruitment costs $800/worker. Dismissal costs $1,200/worker. Training costs $500/worker but increases productivity by up to 15%.
                                    </div>
                                </div>
                            )}

                            {/* ---- FINANCE TAB ---- */}
                            {activeTab === 'finance' && (
                                <div className="space-y-8">
                                    <h3 className="text-lg font-semibold text-slate-900 border-b pb-2">Finance & R&D</h3>

                                    {!ipoState.isPublic && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h4 className="text-md font-bold text-blue-900">Initial Public Offering (IPO)</h4>
                                                    <p className="text-sm text-blue-700">Go public to raise capital. This action is permanent.</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer"
                                                        checked={dec.launchIPO}
                                                        onChange={e => setDec(p => ({ ...p, launchIPO: e.target.checked }))}
                                                        disabled={isSubmitted}
                                                    />
                                                    <div className="w-11 h-6 bg-blue-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                    <span className="ml-3 text-sm font-medium text-blue-900">Launch IPO</span>
                                                </label>
                                            </div>
                                            {dec.launchIPO && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-blue-200/50">
                                                    {numInput('Initial Share Price (¢)', dec.ipoSharePrice || 100, v => setDec(p => ({ ...p, ipoSharePrice: v })), 10, 5000, '¢')}
                                                    {numInput('Shares to Issue', dec.ipoSharesIssued || 1000000, v => setDec(p => ({ ...p, ipoSharesIssued: v })), 100000, 100000000)}
                                                    <div className="md:col-span-2 text-xs font-semibold text-blue-800 bg-blue-100 p-2 rounded">
                                                        Estimated Capital Raised: ${(((dec.ipoSharePrice || 100) / 100) * (dec.ipoSharesIssued || 1000000)).toLocaleString()}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {ipoState.isPublic ? (
                                            numInput('Dividend (cents per share)', dec.dividendCents, v => setDec(p => ({ ...p, dividendCents: v })), 0, 20, '¢')
                                        ) : (
                                            <div className="opacity-50 pointer-events-none">
                                                {numInput('Dividend (cents per share)', 0, () => { }, 0, 0, '¢')}
                                                <p className="text-xs text-slate-500 mt-1">N/A (Private Company)</p>
                                            </div>
                                        )}
                                        {numInput('Management Budget ($\'000)', dec.managementBudgetK, v => setDec(p => ({ ...p, managementBudgetK: v })), 50, 300, '×1000')}
                                        {numInput('Loan Request ($\'000)', dec.loanRequest, v => setDec(p => ({ ...p, loanRequest: v })), 0, 500, '×1000')}
                                        {numInput('R&D Spend ($\'000)', dec.rdSpend, v => setDec(p => ({ ...p, rdSpend: v })), 0, 200, '×1000')}
                                    </div>
                                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-800">
                                        <strong>Strategy:</strong> Higher R&D spending improves product quality and demand. Dividends affect share price positively (only for public companies). Loans incur interest at the central bank rate.
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DecisionForm;
