import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';

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
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">Market Intelligence</h1>
                        <p className="text-slate-500">Industry analysis and competitive landscape — Quarter {currentQuarter}</p>
                    </div>

                    {/* Business Intelligence Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden mb-6">
                        <div className="bg-slate-800 text-white font-bold p-3 text-sm">BUSINESS INTELLIGENCE — Company Comparison</div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 text-sm">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-2.5 text-left font-medium text-slate-500 sticky left-0 bg-slate-50 z-10 min-w-48">Metric</th>
                                        {teams.map(t => (
                                            <th key={t.id} className="px-3 py-2.5 text-center font-medium text-slate-500 min-w-20">Co. {t.companyNumber}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Net Profit */}
                                    <tr>
                                        <td className="px-4 py-2 font-medium text-slate-700 sticky left-0 bg-white z-10">Net Profit ($)</td>
                                        {teams.map(t => {
                                            const d = getTeamData(t.id);
                                            const np = d.latest?.kpis.netProfit || 0;
                                            return <td key={t.id} className={`px-3 py-2 text-center tabular-nums ${np < 0 ? 'text-red-600' : ''}`}>
                                                {latestQ > 0 ? (np >= 0 ? `$${(np / 1000).toFixed(0)}k` : `-$${(Math.abs(np) / 1000).toFixed(0)}k`) : '—'}
                                            </td>;
                                        })}
                                    </tr>
                                    {/* Market Share */}
                                    <tr className="bg-slate-50/50">
                                        <td className="px-4 py-2 font-medium text-slate-700 sticky left-0 bg-slate-50/50 z-10">Market Share (%)</td>
                                        {teams.map(t => {
                                            const d = getTeamData(t.id);
                                            return <td key={t.id} className="px-3 py-2 text-center tabular-nums">{latestQ > 0 ? d.latest?.kpis.marketShare?.toFixed(1) : '—'}</td>;
                                        })}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Economic Information */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="bg-slate-800 text-white font-bold p-3 text-sm">ECONOMIC INFORMATION</div>
                        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">GDP Growth</span>
                                <span className="font-bold text-slate-900">{gameConfig.gdpGrowth}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">Unemployment Rate</span>
                                <span className="font-bold text-slate-900">{gameConfig.unemploymentRate}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">Central Bank Interest Rate</span>
                                <span className="font-bold text-slate-900">{gameConfig.interestRate}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">Material Price ($ per '000)</span>
                                <span className="font-bold text-slate-900">${gameConfig.materialPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">Inflation Rate</span>
                                <span className="font-bold text-slate-900">{gameConfig.inflationRate}%</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-600">Market Growth Factor</span>
                                <span className="font-bold text-slate-900">{gameConfig.marketGrowthFactor}</span>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MarketIntelligence;
