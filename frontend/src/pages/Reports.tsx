import React, { useState, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { useSimulationStore } from '../store/simulationStore';

const Reports: React.FC = () => {
    const teams = useSimulationStore(s => s.teams);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const allResults = useSimulationStore(s => s.allResults);
    const gameConfig = useSimulationStore(s => s.gameConfig);

    const [selectedTeam, setSelectedTeam] = useState(activeTeamId);
    const [selectedQuarter, setSelectedQuarter] = useState(Math.max(1, currentQuarter - 1));

    const result = useMemo(() => {
        const teamResults = allResults.get(selectedTeam) || [];
        return teamResults.find(r => r.quarter === selectedQuarter);
    }, [allResults, selectedTeam, selectedQuarter]);

    const team = teams.find(t => t.id === selectedTeam);
    const availableQuarters = Array.from({ length: Math.max(0, currentQuarter - 1) }, (_, i) => i + 1);

    const calculateYearAndQuarter = (qNumber: number) => {
        const baseYear = 2024;
        const offset = qNumber - 1;
        const year = baseYear + Math.floor(offset / 4);
        const qtr = (offset % 4) + 1;
        return { year, qtr };
    };

    const d = result?.decisions;
    const prev = result?.previousCarryForward;
    const cf = result?.carryForward;
    const pnl = result?.profitAndLoss;
    const bs = result?.balanceSheet;

    if (!result || !d || !prev || !cf || !pnl || !bs) {
        return (
            <div className="flex h-screen overflow-hidden">
                <Navbar />
                <div className="flex-1 flex flex-col p-8 pt-20 lg:pt-8 bg-white lg:pl-72 items-center justify-center">
                    <h2 className="text-xl font-bold mb-4">No report initialized.</h2>
                    <p className="mb-4">Simulation must advance past Quarter 1 to generate reports.</p>
                </div>
            </div>
        );
    }

    const { year, qtr } = calculateYearAndQuarter(result.quarter);

    // Helper for table numbers
    const num = (val: number | undefined) => val == null ? '' : Math.round(val).toLocaleString();
    const money = (val: number | undefined) => val == null ? '' : val < 0 ? `-£${Math.abs(Math.round(val)).toLocaleString()}` : `£${Math.round(val).toLocaleString()}`;

    return (
        <div className="flex h-screen overflow-hidden">
            <Navbar />
            <div className="flex-1 flex flex-col bg-slate-200 pt-20 overflow-y-auto w-full">

                {/* Control Bar */}
                <div className="bg-white border-b border-slate-300 p-4 sticky top-0 z-10 flex flex-wrap gap-4 items-center shadow-sm print:hidden">
                    <h2 className="font-bold text-lg mr-4">Report Controls</h2>
                    <select value={selectedTeam} onChange={e => setSelectedTeam(Number(e.target.value))}
                        className="border-slate-300 rounded text-sm px-3 py-1.5 focus:ring-blue-500">
                        {teams.map(t => <option key={t.id} value={t.id}>{t.name} (Grp {t.companyNumber})</option>)}
                    </select>
                    <select value={selectedQuarter} onChange={e => setSelectedQuarter(Number(e.target.value))}
                        className="border-slate-300 rounded text-sm px-3 py-1.5 focus:ring-blue-500">
                        {availableQuarters.map(q => <option key={q} value={q}>Quarter {q}</option>)}
                    </select>
                    <button onClick={() => window.print()} className="ml-auto bg-slate-800 text-white px-4 py-1.5 rounded shadow text-sm font-medium hover:bg-slate-700">Print Report</button>
                </div>

                {/* Report Canvas */}
                <div className="p-4 md:p-8 flex justify-center w-full">
                    <div className="bg-white shadow-xl max-w-[1000px] w-full p-8 md:p-12 text-[11px] print:text-[10px] sm:text-xs font-['Arial',sans-serif] leading-tight print:shadow-none print:m-0 print:p-0 text-black mx-auto overflow-x-auto">

                        {/* Header Section */}
                        <div className="mb-6 border-b-2 border-black pb-2">
                            <h1 className="text-xl sm:text-2xl font-bold mb-2 uppercase tracking-wide">The Topaz Management Simulation Report</h1>
                            <div className="font-semibold text-sm">History — Group {team?.companyNumber} Company {team?.companyNumber}</div>
                            <div className="font-semibold text-sm">History — Year {year} Quarter {qtr} (Simulation Q{result.quarter})</div>
                        </div>

                        {/* DECISIONS BLOCK */}
                        <div className="mb-8">
                            <h2 className="font-bold text-sm bg-gray-100 border border-gray-300 p-1 mb-2">DECISIONS in effect for Year {year} Quarter {qtr}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">

                                {/* Left Decisions Column */}
                                <div>
                                    <table className="w-full mb-3 border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-300">
                                                <th className="text-left py-1"></th>
                                                <th className="w-16 text-right py-1">Prod 1</th>
                                                <th className="w-16 text-right py-1">Prod 2</th>
                                                <th className="w-16 text-right py-1">Prod 3</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-1 line-clamp-1 truncate">Major Product Improvements</td>
                                                <td className="text-right">{d.productImprovements[0] ? 1 : 0}</td>
                                                <td className="text-right">{d.productImprovements[1] ? 1 : 0}</td>
                                                <td className="text-right">{d.productImprovements[2] ? 1 : 0}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Prices (£): Export Area</td>
                                                <td className="text-right">{d.prices.exportMarket[0]}</td>
                                                <td className="text-right">{d.prices.exportMarket[1]}</td>
                                                <td className="text-right">{d.prices.exportMarket[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 pl-4 text-gray-600">Home Areas</td>
                                                <td className="text-right">{d.prices.homeMarkets[0]}</td>
                                                <td className="text-right">{d.prices.homeMarkets[1]}</td>
                                                <td className="text-right">{d.prices.homeMarkets[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 pt-2 font-semibold" colSpan={4}>Advertising Exp (£'000)</td>
                                            </tr>
                                            <tr>
                                                <td className="py-0.5 pl-4">Trade Press</td>
                                                <td className="text-right">{d.promotion.tradePress[0]}</td>
                                                <td className="text-right">{d.promotion.tradePress[1]}</td>
                                                <td className="text-right">{d.promotion.tradePress[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-0.5 pl-4">Advertising Support</td>
                                                <td className="text-right">{d.promotion.advertisingSupport[0]}</td>
                                                <td className="text-right">{d.promotion.advertisingSupport[1]}</td>
                                                <td className="text-right">{d.promotion.advertisingSupport[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-0.5 pl-4">Merchandising</td>
                                                <td className="text-right">{d.promotion.merchandising[0]}</td>
                                                <td className="text-right">{d.promotion.merchandising[1]}</td>
                                                <td className="text-right">{d.promotion.merchandising[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1 pt-2">Prod Assembly Times (mins)</td>
                                                <td className="text-right">{d.assemblyTime[0]}</td>
                                                <td className="text-right">{d.assemblyTime[1]}</td>
                                                <td className="text-right">{d.assemblyTime[2]}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="w-full mb-3">
                                        <tbody>
                                            <tr className="border-b border-gray-300">
                                                <th className="text-left font-normal">Salespeople allocated to:</th>
                                                <th className="w-12 text-right">Export</th>
                                                <th className="w-12 text-right">South</th>
                                                <th className="w-12 text-right">West</th>
                                                <th className="w-12 text-right">North</th>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td className="text-right py-1">{d.salesforceAllocated.exportArea}</td>
                                                <td className="text-right">{d.salesforceAllocated.southArea}</td>
                                                <td className="text-right">{d.salesforceAllocated.westArea}</td>
                                                <td className="text-right">{d.salesforceAllocated.northArea}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 my-2 border-b border-gray-200 pb-2">
                                        <div>Salespeople Qtrly Salary (£'00)</div><div className="text-right">{d.salesforceRemuneration.quarterlySalary}</div>
                                        <div>Sales Commission %</div><div className="text-right">{d.salesforceRemuneration.commission}</div>
                                        <div>Assembly Wages / hour (£.p)</div><div className="text-right">{d.assemblyWorkersWage.pounds}.{d.assemblyWorkersWage.pence.toString().padStart(2, '0')}</div>
                                        <div>Maintenance Hrs per Machine</div><div className="text-right">{d.contractMaintenanceHours}</div>
                                        <div>Shift Level</div><div className="text-right">{d.shiftLevel}</div>
                                        <div>New Machines to Order</div><div className="text-right">{d.newMachinesToOrder}</div>
                                        <div>Machines to Sell</div><div className="text-right">{d.machinesToSell}</div>
                                        <div>Management Budget (£'000)</div><div className="text-right">{d.managementBudget}</div>
                                    </div>
                                </div>

                                {/* Right Decisions Column */}
                                <div>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 my-2 mb-4 border-b border-gray-200 pb-2">
                                        <div>Dividend % per £1 Share</div><div className="text-right">{d.dividendRate}</div>
                                        <div>Credit Days Allowed</div><div className="text-right">{d.daysCreditAllowed}</div>
                                        <div>Vehicles to Buy</div><div className="text-right">{d.vansToBuy}</div>
                                        <div>Vehicles to Sell</div><div className="text-right">{d.vansToSell}</div>
                                        <div>Info: on company activities</div><div className="text-right">{d.informationWanted.otherCompanies ? 1 : 0}</div>
                                        <div>Info: on Market Shares</div><div className="text-right">{d.informationWanted.marketShares ? 1 : 0}</div>
                                    </div>

                                    <table className="w-full mb-4 border-collapse">
                                        <thead>
                                            <tr className="border-b border-gray-300">
                                                <th className="text-left font-normal" colSpan={4}>Quantities array (Deliver to:)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-0.5">Export</td>
                                                <td className="text-right w-16">{d.deliveries.exportArea[0]}</td>
                                                <td className="text-right w-16">{d.deliveries.exportArea[1]}</td>
                                                <td className="text-right w-16">{d.deliveries.exportArea[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-0.5">South</td>
                                                <td className="text-right">{d.deliveries.southArea[0]}</td>
                                                <td className="text-right">{d.deliveries.southArea[1]}</td>
                                                <td className="text-right">{d.deliveries.southArea[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-0.5">West</td>
                                                <td className="text-right">{d.deliveries.westArea[0]}</td>
                                                <td className="text-right">{d.deliveries.westArea[1]}</td>
                                                <td className="text-right">{d.deliveries.westArea[2]}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-0.5">North</td>
                                                <td className="text-right">{d.deliveries.northArea[0]}</td>
                                                <td className="text-right">{d.deliveries.northArea[1]}</td>
                                                <td className="text-right">{d.deliveries.northArea[2]}</td>
                                            </tr>
                                            <tr className="border-t border-gray-200 mt-1">
                                                <td className="py-1 font-semibold">Product Development (£'000)</td>
                                                <td className="text-right font-semibold" colSpan={3}>{d.researchExpenditure}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <table className="w-full mb-4">
                                        <thead>
                                            <tr className="border-b border-gray-300">
                                                <th className="text-left">Personnel:</th>
                                                <th className="w-16 text-right font-normal">Recruit</th>
                                                <th className="w-16 text-right font-normal">Dismiss</th>
                                                <th className="w-16 text-right font-normal">Train</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="py-1">Salespeople</td>
                                                <td className="text-right">{d.salesforce.recruit}</td>
                                                <td className="text-right">{d.salesforce.dismiss}</td>
                                                <td className="text-right">{d.salesforce.train}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1">Assembly Workers</td>
                                                <td className="text-right">{d.assemblyWorkers.recruit}</td>
                                                <td className="text-right">{d.assemblyWorkers.dismiss}</td>
                                                <td className="text-right">{d.assemblyWorkers.train}</td>
                                            </tr>
                                        </tbody>
                                    </table>

                                    <div className="flex justify-between items-center py-2 border-t border-gray-200">
                                        <div className="font-semibold">Materials to Order:</div>
                                        <div className="text-center"><span className="text-gray-500 mr-2">Units</span> {d.rawMaterial.unitsToOrder}</div>
                                        <div className="text-center"><span className="text-gray-500 mr-2">Supplier</span> {d.rawMaterial.supplierNo}</div>
                                        <div className="text-center"><span className="text-gray-500 mr-2">Deliveries</span> {d.rawMaterial.deliveries}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* AVAILABILITY AND RESOURCES && PRODUCT MOVEMENTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8">
                            <div>
                                <h2 className="font-bold text-sm bg-gray-100 border border-gray-300 p-1 mb-2">AVAILABILITY and USE OF RESOURCES</h2>
                                <table className="w-full">
                                    <tbody>
                                        <tr><td className="py-0.5">Machines Available Last Quarter</td><td className="text-right">{prev.assets.machines}</td></tr>
                                        <tr><td className="py-0.5">Machines Available for Next Quarter</td><td className="text-right font-bold">{cf.assets.machines}</td></tr>
                                        <tr><td className="py-0.5 pb-2">Vehicles Available Last Quarter</td><td className="text-right">{prev.assets.vehicles}</td></tr>

                                        <tr><td colSpan={2} className="py-1 font-semibold italic text-gray-700 border-t border-gray-200">Assembly Workers Hours:</td></tr>
                                        <tr><td className="py-0.5 pl-4 flex justify-between">Total Hours Available Last Quarter <span>(proxy)</span></td><td className="text-right">{cf.staffing.productionWorkers * 40 * 12}</td></tr>
                                        <tr><td className="py-0.5 pl-4">Hours of Absenteeism/Sickness</td><td className="text-right">0</td></tr>
                                        <tr><td className="py-0.5 pl-4 font-bold">Total Hours Worked Last Quarter</td><td className="text-right">{cf.staffing.productionWorkers * 35 * 12}</td></tr>

                                        <tr><td colSpan={2} className="py-1 font-semibold italic text-gray-700 mt-2 border-t border-gray-200">Machine Hours</td></tr>
                                        <tr><td className="py-0.5 pl-4">Total Hours Available Last Quarter</td><td className="text-right">{cf.assets.machines * 40 * 12}</td></tr>
                                        <tr><td className="py-0.5 pl-4 font-bold">Total Hours Worked Last Quarter</td><td className="text-right">{cf.assets.machines * 35 * 12}</td></tr>

                                        <tr><td colSpan={2} className="py-1 font-semibold italic text-gray-700 mt-2 border-t border-gray-200">Material Units Used and Available</td></tr>
                                        <tr><td className="py-0.5 pl-4">Opening Stock Available</td><td className="text-right">{prev.inventory.rawMaterials}</td></tr>
                                        <tr><td className="py-0.5 pl-4">Delivered Last Quarter</td><td className="text-right">{d.rawMaterial.unitsToOrder}</td></tr>
                                        <tr><td className="py-0.5 pl-4">Closing Stock at End of Qt</td><td className="text-right font-bold">{cf.inventory.rawMaterials}</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div>
                                <h2 className="font-bold text-sm bg-gray-100 border border-gray-300 p-1 mb-2">PRODUCT MOVEMENTS and AVAILABILITY</h2>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-300">
                                            <th className="text-left py-1 font-normal w-1/2">Quantities</th><th className="border-gray-300 border-l text-center font-normal">All Products</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr><td className="py-0.5 italic">Produced</td><td className="text-right">{num(cf.inventory.finishedGoods + d.deliveries.exportArea.reduce((a, b) => a + b, 0) + d.deliveries.southArea.reduce((a, b) => a + b, 0) + d.deliveries.westArea.reduce((a, b) => a + b, 0) + d.deliveries.northArea.reduce((a, b) => a + b, 0))}</td></tr>
                                        <tr><td className="py-0.5 italic text-red-700">Rejected (Defects)</td><td className="text-right text-red-700">{num(result.stats.defectsPercent)}%</td></tr>
                                        <tr><td colSpan={2} className="py-1 border-t border-gray-200 font-bold">Sales to:</td></tr>
                                        <tr><td className="py-0.5 pl-4">Export</td><td className="text-right">{num(result.stats.actualSalesArea2)}</td></tr>
                                        <tr><td className="py-0.5 pl-4">Home Markets (South, West, North)</td><td className="text-right">{num(result.stats.actualSalesArea1)}</td></tr>
                                        <tr><td colSpan={2} className="py-1 border-t border-gray-200 font-bold">Order Backlog:</td></tr>
                                        <tr><td className="py-0.5 pl-4">Export</td><td className="text-right">{Math.max(0, result.stats.potentialSalesArea2 - result.stats.actualSalesArea2)}</td></tr>
                                        <tr><td className="py-0.5 pl-4">Home</td><td className="text-right">{Math.max(0, result.stats.potentialSalesArea1 - result.stats.actualSalesArea1)}</td></tr>
                                        <tr><td colSpan={2} className="py-1 border-t border-gray-200 font-bold">Warehouse Stock at End of Quarter:</td></tr>
                                        <tr><td className="py-0.5 pl-4 text-blue-800 font-bold border-b border-gray-400">Total Finished Goods</td><td className="text-right text-blue-800 font-bold border-b border-gray-400">{num(cf.inventory.finishedGoods)}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ACCOUNTS */}
                        <div>
                            <h2 className="font-bold text-base bg-gray-200 border-y-2 border-black p-1 text-center mb-4 uppercase tracking-widest">ACCOUNTS</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 align-top">

                                {/* Overhead Analysis */}
                                <div>
                                    <h3 className="font-bold border-b border-gray-400 mb-1 text-center">Overhead Cost Analysis (£)</h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr><td>Advertising</td><td className="text-right">{num(pnl.advertisingCost)}</td></tr>
                                            <tr><td>Sales Force / Office</td><td className="text-right">{num(pnl.salesForceCost)}</td></tr>
                                            <tr><td>Sales Commission</td><td className="text-right">{num(pnl.commissionCost)}</td></tr>
                                            <tr><td>Admin / Personnel</td><td className="text-right">{num(pnl.adminSalaries)}</td></tr>
                                            <tr><td>Product Research</td><td className="text-right">{num(pnl.rdCost)}</td></tr>
                                            <tr><td>Quality Control (QC)</td><td className="text-right">{num(pnl.qcCost)}</td></tr>
                                            <tr className="border-t-2 border-black font-bold">
                                                <td className="py-1 uppercase">Total Overheads</td><td className="text-right">{num(pnl.totalOverheads)}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Profit and Loss */}
                                <div>
                                    <h3 className="font-bold border-b border-gray-400 mb-1 text-center">Profit and Loss Account (£)</h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr className="font-bold"><td className="uppercase">Sales Revenue</td><td className="text-right">{money(pnl.salesRevenue)}</td></tr>
                                            <tr><td className="pl-4">Opening Stock Value</td><td className="text-right">{num(pnl.openingStockValue)}</td></tr>
                                            <tr><td className="pl-4">Materials Purchased</td><td className="text-right">{num(pnl.materialsPurchased)}</td></tr>
                                            <tr><td className="pl-4">Assembly/Wages</td><td className="text-right">{num(pnl.productionWages)}</td></tr>
                                            <tr><td className="pl-4">Machine Depreciation</td><td className="text-right">{num(pnl.depreciation)}</td></tr>
                                            <tr className="border-b border-gray-300"><td className="pl-4">Less Closing Stock Value</td><td className="text-right text-red-600">({num(pnl.lessClosingStockValue)})</td></tr>
                                            <tr className="font-bold"><td className="uppercase">Cost of Goods Sold</td><td className="text-right">{num(pnl.costOfGoodsSold)}</td></tr>
                                            <tr className="font-bold bg-gray-100 border-y border-gray-300"><td className="py-1">Gross Profit</td><td className="text-right">{money(pnl.grossProfit)}</td></tr>

                                            <tr><td>Interest Paid</td><td className="text-right text-red-600">({num(pnl.interestPaid)})</td></tr>
                                            <tr><td>Overheads</td><td className="text-right text-red-600">({num(pnl.totalOverheads)})</td></tr>
                                            <tr><td>Tax Assessed</td><td className="text-right text-red-600">({num(pnl.tax)})</td></tr>
                                            <tr className="font-bold border-y-2 border-black text-sm my-1"><td className="py-1 uppercase">Net Profit/Loss</td><td className="text-right">{money(pnl.netProfit)}</td></tr>

                                            <tr><td>Dividend Paid</td><td className="text-right text-red-600">({num(pnl.dividendPaid)})</td></tr>
                                            <tr className="font-bold"><td className="uppercase">Transferred to Reserves</td><td className="text-right">{money(pnl.retainedProfit)}</td></tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Balance Sheet */}
                                <div>
                                    <h3 className="font-bold border-b border-gray-400 mb-1 text-center">Balance Sheet (£)</h3>
                                    <table className="w-full">
                                        <tbody>
                                            <tr><td colSpan={2} className="font-semibold italic text-gray-700">Assets</td></tr>
                                            <tr><td className="pl-4">Value of Property/Plant</td><td className="text-right">{num(bs.fixedAssets.plant)}</td></tr>
                                            <tr><td className="pl-4">Value of Machines</td><td className="text-right">{num(bs.fixedAssets.machines)}</td></tr>
                                            <tr><td className="pl-4">Value of Vehicles</td><td className="text-right">{num(bs.fixedAssets.vehicles)}</td></tr>
                                            <tr><td className="pl-4">Value of Stock</td><td className="text-right">{num(bs.currentAssets.stockValuation)}</td></tr>
                                            <tr><td className="pl-4">Debtors</td><td className="text-right">{num(bs.currentAssets.debtors)}</td></tr>
                                            <tr><td className="pl-4">Cash Invested</td><td className="text-right font-bold text-green-700">{num(bs.currentAssets.cash)}</td></tr>

                                            <tr><td colSpan={2} className="font-semibold italic text-gray-700 mt-2 border-t border-gray-200">Liabilities</td></tr>
                                            <tr><td className="pl-4">Tax Assessed & Due</td><td className="text-right">{num(bs.currentLiabilities.taxOwed)}</td></tr>
                                            <tr><td className="pl-4">Creditors</td><td className="text-right">{num(bs.currentLiabilities.creditors)}</td></tr>
                                            <tr><td className="pl-4">Bank Overdraft</td><td className="text-right font-bold text-red-700">{num(bs.currentLiabilities.overdraft)}</td></tr>
                                            <tr><td className="pl-4 border-b border-gray-300">Unsecured Loans</td><td className="text-right border-b border-gray-300">{num(bs.longTermLiabilities.loans)}</td></tr>

                                            <tr className="font-bold text-sm bg-gray-100 border-b border-gray-400"><td className="py-1">Net Assets</td><td className="text-right">{money(bs.netAssets)}</td></tr>

                                            <tr><td className="pl-4 pt-1">Ordinary Capital</td><td className="text-right">{num(bs.capital.shareCapital)}</td></tr>
                                            <tr><td className="pl-4 pb-1">Reserves</td><td className="text-right">{num(bs.capital.reserves)}</td></tr>
                                            <tr className="font-bold border-y-2 border-black"><td className="py-1 uppercase">Total Funding</td><td className="text-right">{money(bs.capital.totalCapital)}</td></tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* BUSINESS INTELLIGENCE */}
                        <div className="mt-8 border-t-2 border-black pt-2">
                            <h2 className="font-bold text-base bg-gray-200 text-center p-1 uppercase tracking-widest mb-4">BUSINESS INTELLIGENCE</h2>
                            <h3 className="font-bold italic text-gray-700 border-b border-gray-300 mb-2">Company Status / Free Information</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full tabular-nums whitespace-nowrap">
                                    <thead>
                                        <tr className="border-b border-gray-400">
                                            <th className="text-left py-1">Company No.</th>
                                            {teams.map(t => <th key={t.id} className="text-center w-16">{t.companyNumber}</th>)}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="py-0.5">Market Share (%)</td>
                                            {teams.map(t => <td key={t.id} className="text-center">{allResults.get(t.id)?.[result.quarter - 1]?.kpis.marketShare.toFixed(1) || 'N/A'}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="py-0.5 border-b border-gray-200">Quality Rating (%)</td>
                                            {teams.map(t => <td key={t.id} className="text-center border-b border-gray-200">{allResults.get(t.id)?.[result.quarter - 1]?.stats.qualityRatingPercent.toFixed(1) || 'N/A'}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="py-0.5">Area 1 Actual Sales</td>
                                            {teams.map(t => <td key={t.id} className="text-center">{allResults.get(t.id)?.[result.quarter - 1]?.stats.actualSalesArea1 || 'N/A'}</td>)}
                                        </tr>
                                        <tr>
                                            <td className="py-0.5">Area 2 Actual Sales</td>
                                            {teams.map(t => <td key={t.id} className="text-center">{allResults.get(t.id)?.[result.quarter - 1]?.stats.actualSalesArea2 || 'N/A'}</td>)}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* ECONOMIC INFORMATION */}
                        <div className="mt-8 border-t-2 border-black pt-2 bg-gray-50 border-b-2">
                            <h2 className="font-bold text-sm bg-gray-200 uppercase p-1 mb-2 inline-block">ECONOMIC INFORMATION</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 pb-2">
                                <div className="flex justify-between border-b border-gray-200 border-dotted"><span className="text-gray-600">GDP Growth Rate (%)</span> <span className="font-bold">{gameConfig.gdpGrowth}%</span></div>
                                <div className="flex justify-between border-b border-gray-200 border-dotted"><span className="text-gray-600">Unemployment Rate (%)</span> <span className="font-bold">{gameConfig.unemploymentRate}%</span></div>
                                <div className="flex justify-between border-b border-gray-200 border-dotted"><span className="text-gray-600">Central Bank Interest Rate (%)</span> <span className="font-bold">{gameConfig.interestRate}%</span></div>
                                <div className="flex justify-between border-b border-gray-200 border-dotted"><span className="text-gray-600">Base Material Price (£ per '000)</span> <span className="font-bold">£{gameConfig.materialPrice}</span></div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-4 text-center text-[10px] text-gray-500 pb-12">
                            <p>© Simulator is an interactive Business Simulation developed by Edit Systems Ltd.</p>
                            <p>This replica module rendered for diagnostic/historical replication purposes.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Reports;
