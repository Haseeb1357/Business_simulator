import { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';

const Reports = () => {
    const teams = useSimulationStore(s => s.teams);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const allResults = useSimulationStore(s => s.allResults);

    const [selectedTeam, setSelectedTeam] = useState(activeTeamId);
    const [selectedQuarter, setSelectedQuarter] = useState(Math.max(1, currentQuarter - 1));
    const [activeReport, setActiveReport] = useState('pnl');

    const result = useMemo(() => {
        const teamResults = allResults.get(selectedTeam) || [];
        return teamResults.find(r => r.quarter === selectedQuarter);
    }, [allResults, selectedTeam, selectedQuarter]);

    const team = teams.find(t => t.id === selectedTeam);
    const availableQuarters = Array.from({ length: Math.max(0, currentQuarter - 1) }, (_, i) => i + 1);

    const fmt = (n: number) => {
        if (n === 0) return '—';
        const abs = Math.abs(Math.round(n));
        return `${n < 0 ? '(' : ''}£${abs.toLocaleString()}${n < 0 ? ')' : ''}`;
    };

    const row = (label: string, value: number, bold = false, indent = false, highlight = false) => (
        <tr className={`${bold ? 'font-semibold' : ''} ${highlight ? 'bg-slate-50' : ''}`}>
            <td className={`py-1.5 ${indent ? 'pl-8' : 'pl-4'} text-sm text-slate-700`}>{label}</td>
            <td className={`py-1.5 pr-4 text-right text-sm tabular-nums ${value < 0 ? 'text-red-600' : 'text-slate-900'}`}>{fmt(value)}</td>
        </tr>
    );

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Financial Reports</h1>
                            <p className="text-slate-500">{team?.name} — Quarter {selectedQuarter} Results</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <select value={selectedTeam} onChange={e => setSelectedTeam(Number(e.target.value))}
                                className="border-slate-300 rounded-md shadow-sm text-sm">
                                {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                            </select>
                            <select value={selectedQuarter} onChange={e => setSelectedQuarter(Number(e.target.value))}
                                className="border-slate-300 rounded-md shadow-sm text-sm">
                                {availableQuarters.length === 0 && <option value={0}>No data yet</option>}
                                {availableQuarters.map(q => <option key={q} value={q}>Quarter {q}</option>)}
                            </select>
                        </div>
                    </div>

                    {!result ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="text-5xl mb-4">📋</div>
                            <h2 className="text-lg font-bold text-slate-800 mb-2">No Results Available</h2>
                            <p className="text-slate-500">Run a quarter simulation first to see financial reports.</p>
                        </div>
                    ) : (
                        <>
                            {/* Report Tabs */}
                            <div className="flex gap-2 mb-6">
                                {[{ id: 'pnl', name: 'Profit & Loss' }, { id: 'bs', name: 'Balance Sheet' }, { id: 'cf', name: 'Cash Flow' }, { id: 'ops', name: 'Operations' }].map(tab => (
                                    <button key={tab.id} onClick={() => setActiveReport(tab.id)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeReport === tab.id ? 'bg-primary-600 text-white shadow-sm' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                                        {tab.name}
                                    </button>
                                ))}
                            </div>

                            {/* P&L */}
                            {activeReport === 'pnl' && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="bg-slate-800 text-white px-4 py-3 font-semibold text-sm">PROFIT AND LOSS ACCOUNT — Quarter {selectedQuarter}</div>
                                    <table className="w-full">
                                        <tbody>
                                            {row('Sales Revenue', result.profitAndLoss.salesRevenue, true, false, true)}
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Cost of Sales</td></tr>
                                            {row('Opening Stock Value', result.profitAndLoss.openingStockValue, false, true)}
                                            {row('Materials Purchased', result.profitAndLoss.materialsPurchased, false, true)}
                                            {row('Assembly Wages', result.profitAndLoss.assemblyWages, false, true)}
                                            {row('Machinist Wages', result.profitAndLoss.machinistWages, false, true)}
                                            {row('Machine Running Costs', result.profitAndLoss.machineRunningCosts, false, true)}
                                            {row('Less: Closing Stock Value', -result.profitAndLoss.lessClosingStockValue, false, true)}
                                            {row('Cost of Sales', result.profitAndLoss.costOfSales, true, false, true)}
                                            {row('GROSS PROFIT', result.profitAndLoss.grossProfit, true, false, true)}
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Overheads</td></tr>
                                            {row('Advertising', result.profitAndLoss.advertisingCost, false, true)}
                                            {row('Sales Expenses', result.profitAndLoss.salesExpenses, false, true)}
                                            {row('Management Salaries', result.profitAndLoss.managementSalaries, false, true)}
                                            {row('Maintenance', result.profitAndLoss.maintenanceCosts, false, true)}
                                            {row('Depreciation', result.profitAndLoss.depreciation, false, true)}
                                            {row('Other Overheads', result.profitAndLoss.otherOverheads, false, true)}
                                            {row('Total Overheads', result.profitAndLoss.totalOverheads, true, false, true)}
                                            {row('OPERATING PROFIT', result.profitAndLoss.operatingProfit, true)}
                                            {row('Interest Paid', result.profitAndLoss.interestPaid, false, true)}
                                            {row('NET PROFIT BEFORE TAX', result.profitAndLoss.netProfitBeforeTax, true, false, true)}
                                            {row('Corporation Tax (19%)', result.profitAndLoss.tax, false, true)}
                                            {row('NET PROFIT', result.profitAndLoss.netProfit, true, false, true)}
                                            <tr><td colSpan={2} className="border-t border-slate-200"></td></tr>
                                            {row('Dividend Paid', result.profitAndLoss.dividendPaid, false, true)}
                                            {row('Retained Profit', result.profitAndLoss.retainedProfit, true, false, true)}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Balance Sheet */}
                            {activeReport === 'bs' && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="bg-slate-800 text-white px-4 py-3 font-semibold text-sm">BALANCE SHEET — End of Quarter {selectedQuarter}</div>
                                    <table className="w-full">
                                        <tbody>
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Fixed Assets</td></tr>
                                            {row('Property', result.balanceSheet.fixedAssets.property, false, true)}
                                            {row('Machinery', result.balanceSheet.fixedAssets.machinery, false, true)}
                                            {row('Vehicles', result.balanceSheet.fixedAssets.vehicles, false, true)}
                                            {row('Total Fixed Assets', result.balanceSheet.fixedAssets.totalFixed, true, false, true)}
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Current Assets</td></tr>
                                            {row('Product Stocks', result.balanceSheet.currentAssets.productStock, false, true)}
                                            {row('Material Stocks', result.balanceSheet.currentAssets.materialStock, false, true)}
                                            {row('Debtors', result.balanceSheet.currentAssets.debtors, false, true)}
                                            {row('Cash', result.balanceSheet.currentAssets.cash, false, true)}
                                            {row('Total Current Assets', result.balanceSheet.currentAssets.totalCurrent, true, false, true)}
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Current Liabilities</td></tr>
                                            {row('Creditors', result.balanceSheet.currentLiabilities.creditors, false, true)}
                                            {row('Overdraft', result.balanceSheet.currentLiabilities.overdraft, false, true)}
                                            {row('Tax Owed', result.balanceSheet.currentLiabilities.taxOwed, false, true)}
                                            {row('Total Current Liabs', result.balanceSheet.currentLiabilities.totalCurrent, true, false, true)}
                                            {row('Net Current Assets', result.balanceSheet.netCurrentAssets, true, false, true)}
                                            {row('Total Assets Less Current Liabs', result.balanceSheet.totalAssetsLessCurrentLiabilities, true)}
                                            {row('Long-Term Loans', result.balanceSheet.longTermLiabilities.loans, false, true)}
                                            {row('NET ASSETS', result.balanceSheet.netAssets, true, false, true)}
                                            <tr><td colSpan={2} className="border-t-2 border-slate-300"></td></tr>
                                            {row('Share Capital', result.balanceSheet.capital.shareCapital, false, true)}
                                            {row('Reserves', result.balanceSheet.capital.reserves, false, true)}
                                            {row('TOTAL CAPITAL', result.balanceSheet.capital.totalCapital, true, false, true)}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Cash Flow */}
                            {activeReport === 'cf' && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="bg-slate-800 text-white px-4 py-3 font-semibold text-sm">CASH FLOW STATEMENT — Quarter {selectedQuarter}</div>
                                    <table className="w-full">
                                        <tbody>
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Operating Activities</td></tr>
                                            {row('Trading Receipts', result.cashFlow.tradingReceipts, false, true)}
                                            {row('Trading Payments', -result.cashFlow.tradingPayments, false, true)}
                                            {row('Operating Cash Flow', result.cashFlow.operatingCashFlow, true, false, true)}
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Investing Activities</td></tr>
                                            {row('Capital Expenditure', -result.cashFlow.capitalExpenditure, false, true)}
                                            {row('Investing Cash Flow', result.cashFlow.investingCashFlow, true, false, true)}
                                            <tr><td colSpan={2} className="px-4 pt-3 pb-1 text-xs text-slate-400 uppercase">Financing Activities</td></tr>
                                            {row('Loan Receipts', result.cashFlow.loanReceipts, false, true)}
                                            {row('Interest Paid', -result.cashFlow.interestPaid, false, true)}
                                            {row('Dividend Paid', -result.cashFlow.dividendPaid, false, true)}
                                            {row('Financing Cash Flow', result.cashFlow.financingCashFlow, true, false, true)}
                                            <tr><td colSpan={2} className="border-t-2 border-slate-300"></td></tr>
                                            {row('Net Cash Flow', result.cashFlow.netCashFlow, true, false, true)}
                                            {row('Opening Balance', result.cashFlow.openingBalance, false, true)}
                                            {row('Closing Balance', result.cashFlow.closingBalance, true, false, true)}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Operations */}
                            {activeReport === 'ops' && (
                                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                    <div className="bg-slate-800 text-white px-4 py-3 font-semibold text-sm">OPERATIONS SUMMARY — Quarter {selectedQuarter}</div>
                                    <div className="p-6">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b border-slate-200">
                                                    <th className="text-left py-2 font-medium text-slate-600">Metric</th>
                                                    <th className="text-right py-2 font-medium text-slate-600">Product 1</th>
                                                    <th className="text-right py-2 font-medium text-slate-600">Product 2</th>
                                                    <th className="text-right py-2 font-medium text-slate-600">Product 3</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[
                                                    { label: 'Demand', key: 'demand' },
                                                    { label: 'Produced', key: 'produced' },
                                                    { label: 'Sold', key: 'sold' },
                                                    { label: 'Rejected', key: 'rejected' },
                                                    { label: 'Closing Stock', key: 'closingStock' },
                                                    { label: 'Revenue', key: 'revenue' },
                                                ].map(({ label, key }) => (
                                                    <tr key={key} className="border-b border-slate-100">
                                                        <td className="py-2 font-medium text-slate-700">{label}</td>
                                                        {(['p1', 'p2', 'p3'] as const).map(pk => (
                                                            <td key={pk} className="py-2 text-right tabular-nums">
                                                                {key === 'revenue' ? fmt((result.products[pk] as any)[key]) : (result.products[pk] as any)[key]?.toLocaleString()}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Reports;
