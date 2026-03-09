import React, { useState, useMemo, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import { ArrowUpRight, ArrowDownRight, Minus, FileText, Trophy, BarChart2 } from 'lucide-react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, ResponsiveContainer,
} from 'recharts';

const Intelligence: React.FC = () => {
    const teams = useSimulationStore(s => s.teams);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const allResults = useSimulationStore(s => s.allResults);
    const gameConfig = useSimulationStore(s => s.gameConfig);
    const getTeamLatestResult = useSimulationStore(s => s.getTeamLatestResult);

    const latestQ = Math.max(0, currentQuarter - 1);

    // Selection state for detailed report
    const [selectedTeam, setSelectedTeam] = useState(activeTeamId);
    const [selectedQuarter, setSelectedQuarter] = useState(latestQ);
    const [activeTab, setActiveTab] = useState('ranking');

    useEffect(() => {
        setSelectedQuarter(latestQ);
    }, [latestQ]);

    // ---- LEADERBOARD LOGIC ----
    const rankings = useMemo(() => {
        return teams.map(t => {
            const results = allResults.get(t.id) || [];
            const latest = results.find(r => r.quarter === latestQ);
            const prev = results.find(r => r.quarter === latestQ - 1);
            return {
                ...t,
                netProfit: latest?.kpis.netProfit || 0,
                marketShare: latest?.kpis.marketShare || 0,
                companyValue: latest?.kpis.companyValue || 0,
                prevCompanyValue: prev?.kpis.companyValue || 0,
            };
        }).sort((a, b) => b.companyValue - a.companyValue);
    }, [teams, allResults, latestQ]);

    const companyValueData = useMemo(() => rankings.map(r => ({
        name: r.name.split(' ')[0],
        value: Math.round(r.companyValue / 1000),
    })), [rankings]);

    const getMovement = (curr: number, prev: number) => {
        if (curr > prev) return <ArrowUpRight className="h-4 w-4 text-emerald-400" />;
        if (curr < prev) return <ArrowDownRight className="h-4 w-4 text-rose-400" />;
        return <Minus className="h-4 w-4 text-slate-500" />;
    };

    // ---- REPORT LOGIC ----
    const reportResult = useMemo(() => {
        const teamResults = allResults.get(selectedTeam) || [];
        return teamResults.find(r => r.quarter === selectedQuarter);
    }, [allResults, selectedTeam, selectedQuarter]);

    const availableQuarters = Array.from({ length: latestQ }, (_, i) => i + 1);
    const team = teams.find(t => t.id === selectedTeam);

    const calculateYearAndQuarter = (qNumber: number) => {
        const baseYear = 2024;
        const offset = qNumber - 1;
        const year = baseYear + Math.floor(offset / 4);
        const qtr = (offset % 4) + 1;
        return { year, qtr };
    };

    const num = (val: number | undefined) => val == null ? '' : Math.round(val).toLocaleString();
    const money = (val: number | undefined) => val == null ? '' : val < 0 ? `-£${Math.abs(Math.round(val)).toLocaleString()}` : `£${Math.round(val).toLocaleString()}`;

    // ---- RENDER HELPERS ----
    const renderDetailedReport = () => {
        if (!reportResult) return (
            <div className="bg-navy-800 rounded-xl p-12 text-center border border-navy-700">
                <FileText className="w-12 h-12 text-navy-700 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-200">No report available for selection</h3>
                <p className="text-slate-400 mt-2">Simulation must advance past Q1 and you must select an available quarter.</p>
            </div>
        );

        const { year, qtr } = calculateYearAndQuarter(reportResult.quarter);
        const d = reportResult.decisions;
        const cf = reportResult.carryForward;
        const pnl = reportResult.profitAndLoss;
        const bs = reportResult.balanceSheet;
        const s = reportResult.stats;

        const SectionHeader = ({ title }: { title: string }) => (
            <div className="bg-slate-100 border border-slate-300 py-1.5 px-3 mb-4">
                <h2 className="text-xs font-black uppercase tracking-widest text-[#000080]">{title}</h2>
            </div>
        );

        const Label = ({ text }: { text: string }) => <td className="text-left font-medium py-0.5 text-[#333]">{text}</td>;
        const Val = ({ n, bold }: { n: any, bold?: boolean }) => <td className={`text-right tabular-nums ${bold ? 'font-bold' : ''}`}>{n}</td>;

        return (
            <div className="bg-white text-black p-10 shadow-2xl max-w-5xl mx-auto overflow-x-auto text-[10px] font-sans leading-none border-t-8 border-[#000080] print:shadow-none print:p-0">
                <div className="mb-8 flex justify-between items-start border-b border-black pb-4">
                    <div>
                        <h1 className="text-2xl font-black mb-1 uppercase tracking-tighter text-[#000080]">THE BHUTTO & CO. MANAGEMENT SIMULATION REPORT</h1>
                        <div className="font-bold text-sm text-slate-700">History — Group 1 Company {team?.companyNumber}</div>
                        <div className="font-bold text-sm text-slate-700">History — Year {year} Quarter {qtr} (Simulation Q{reportResult.quarter})</div>
                    </div>
                </div>

                {/* Section 1: Decisions */}
                <SectionHeader title={`DECISIONS in effect for Year ${year} Quarter ${qtr}`} />
                <div className="grid grid-cols-12 gap-8 mb-10">
                    <div className="col-span-7">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-300"><th className="text-left py-1"></th><th className="w-14">Prod 1</th><th className="w-14">Prod 2</th><th className="w-14">Prod 3</th></tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                <tr><Label text="Major Product Improvements" /><Val n={d.productImprovements[0] ? 1 : 0} /><Val n={d.productImprovements[1] ? 1 : 0} /><Val n={d.productImprovements[2] ? 1 : 0} /></tr>
                                <tr><Label text="Prices (£): Export Area" /><Val n={d.prices.exportMarket[0]} /><Val n={d.prices.exportMarket[1]} /><Val n={d.prices.exportMarket[2]} /></tr>
                                <tr><Label text="Home Areas" /><Val n={d.prices.homeMarkets[0]} /><Val n={d.prices.homeMarkets[1]} /><Val n={d.prices.homeMarkets[2]} /></tr>
                                <tr><Label text="Advertising Exp (£'000)" /><td colSpan={3}></td></tr>
                                <tr><Label text="  Trade Press" /><Val n={d.promotion.tradePress[0]} /><Val n={d.promotion.tradePress[1]} /><Val n={d.promotion.tradePress[2]} /></tr>
                                <tr><Label text="  Advertising Support" /><Val n={d.promotion.advertisingSupport[0]} /><Val n={d.promotion.advertisingSupport[1]} /><Val n={d.promotion.advertisingSupport[2]} /></tr>
                                <tr><Label text="  Merchandising" /><Val n={d.promotion.merchandising[0]} /><Val n={d.promotion.merchandising[1]} /><Val n={d.promotion.merchandising[2]} /></tr>
                                <tr><Label text="Prod Assembly Times (mins)" /><Val n={d.assemblyTime[0]} /><Val n={d.assemblyTime[1]} /><Val n={d.assemblyTime[2]} /></tr>
                            </tbody>
                        </table>
                        <div className="mt-4 border-t border-slate-200 pt-2">
                            <table className="w-full">
                                <tbody>
                                    <tr>
                                        <Label text="Salespeople allocated to:" />
                                        <td className="w-12 text-center text-[8px] font-bold">Export</td>
                                        <td className="w-12 text-center text-[8px] font-bold">South</td>
                                        <td className="w-12 text-center text-[8px] font-bold">West</td>
                                        <td className="w-12 text-center text-[8px] font-bold">North</td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <Val n={d.salesforceAllocated.exportArea} />
                                        <Val n={d.salesforceAllocated.southArea} />
                                        <Val n={d.salesforceAllocated.westArea} />
                                        <Val n={d.salesforceAllocated.northArea} />
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="col-span-5 space-y-1">
                        <table className="w-full">
                            <tbody>
                                <tr><Label text="Dividend % per £1 Share" /><Val n={d.dividendRate} /></tr>
                                <tr><Label text="Credit Days Allowed" /><Val n={d.daysCreditAllowed} /></tr>
                                <tr><Label text="Vehicles to Buy" /><Val n={d.vansToBuy} /></tr>
                                <tr><Label text="Vehicles to Sell" /><Val n={d.vansToSell} /></tr>
                                <tr><Label text="Info: on company activities" /><Val n={d.informationWanted.otherCompanies ? 1 : 0} /></tr>
                                <tr><Label text="Info: on Market Shares" /><Val n={d.informationWanted.marketShares ? 1 : 0} /></tr>

                                <tr className="h-4"></tr>
                                <tr><Label text="Product Development (£'000)" /><Val n={d.researchExpenditure} bold /></tr>
                                <tr className="h-4"></tr>

                                <tr className="font-bold border-b border-slate-200"><Label text="Personnel:" /><td>Recruit</td><td>Dismiss</td><td>Train</td></tr>
                                <tr><Label text="Salespeople" /><td>{d.salesforce.recruit}</td><td>{d.salesforce.dismiss}</td><td>{d.salesforce.train}</td></tr>
                                <tr><Label text="Assembly Workers" /><td>{d.assemblyWorkers.recruit}</td><td>{d.assemblyWorkers.dismiss}</td><td>{d.assemblyWorkers.train}</td></tr>

                                <tr className="h-4"></tr>
                                <tr className="font-bold border-b border-slate-200"><Label text="Materials to Order:" /><td>Units</td><td>Supplier</td><td>Dels</td></tr>
                                <tr><td></td><td>{num(d.rawMaterial.unitsToOrder)}</td><td>{d.rawMaterial.supplierNo}</td><td>{d.rawMaterial.deliveries}</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 2: Resources & Movements */}
                <div className="grid grid-cols-2 gap-12 mb-10">
                    <div>
                        <SectionHeader title="AVAILABILITY and USE OF RESOURCES" />
                        <table className="w-full">
                            <tbody className="divide-y divide-slate-100">
                                <tr><Label text="Machines Available Last Quarter" /><Val n={cf.assets.machines} /></tr>
                                <tr><Label text="Machines Available for Next Quarter" /><Val n={cf.assets.machines} bold /></tr>
                                <tr><Label text="Vehicles Available Last Quarter" /><Val n={cf.assets.vehicles} /></tr>
                                <tr className="h-4"></tr>
                                <tr className="font-bold"><Label text="Assembly Workers Hours:" /><td colSpan={2}></td></tr>
                                <tr><Label text="  Total Hours Available Last Quarter" /><Val n={num(cf.staffing.productionWorkers * 480)} /></tr>
                                <tr><Label text="  Total Hours Worked Last Quarter" /><Val n={num(cf.staffing.productionWorkers * 420)} /></tr>
                                <tr className="font-bold border-t border-slate-200"><Label text="Material Units Used and Available" /><td></td></tr>
                                <tr><Label text="  Opening Stock Available" /><Val n={num(reportResult.previousCarryForward.inventory.rawMaterials)} /></tr>
                                <tr><Label text="  Delivered Last Quarter" /><Val n={num(d.rawMaterial.unitsToOrder)} /></tr>
                                <tr><Label text="  Closing Stock at End of Qtr" /><Val n={num(cf.inventory.rawMaterials)} bold /></tr>
                            </tbody>
                        </table>
                    </div>
                    <div>
                        <SectionHeader title="PRODUCT MOVEMENTS and AVAILABILITY" />
                        <table className="w-full">
                            <thead className="border-b border-slate-300">
                                <tr><th className="text-left font-bold">Quantities</th><th className="text-right">All Products</th></tr>
                            </thead>
                            <tbody>
                                <tr className="bg-slate-50"><Label text="Produced" /><Val n={num(s.actualSalesArea1 + s.actualSalesArea2 + cf.inventory.finishedGoods)} bold /></tr>
                                <tr><Label text="Rejected (Defects)%" /><Val n={`${s.defectsPercent.toFixed(1)}%`} /></tr>
                                <tr className="h-2"></tr>
                                <tr className="font-bold border-b border-slate-200"><Label text="Home Sales to:" /><Val n={num(s.actualSalesArea1)} /></tr>
                                <tr><Label text="Export Sales to:" /><Val n={num(s.actualSalesArea2)} /></tr>
                                <tr className="h-4"></tr>
                                <tr className="bg-slate-50 font-bold"><Label text="Warehouse Stock at End of Quarter" /><td></td></tr>
                                <tr><Label text="  Total Finished Goods" /><Val n={num(cf.inventory.finishedGoods)} bold /></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 3: Accounts */}
                <SectionHeader title="ACCOUNTS" />
                <div className="grid grid-cols-3 gap-8 mb-10 border border-slate-300 p-4">
                    {/* Overheads */}
                    <div>
                        <h3 className="font-bold border-b border-black mb-3 pb-1 text-[9px] uppercase tracking-wide">Overhead Cost Analysis (£)</h3>
                        <table className="w-full">
                            <tbody>
                                <tr><Label text="Advertising" /><Val n={num(pnl.advertisingCost)} /></tr>
                                <tr><Label text="Sales Force / Office" /><Val n={num(pnl.salesForceCost)} /></tr>
                                <tr><Label text="Sales Commission" /><Val n={num(pnl.commissionCost)} /></tr>
                                <tr><Label text="Admin / Personnel" /><Val n={num(pnl.adminSalaries)} /></tr>
                                <tr><Label text="Product Research" /><Val n={num(pnl.rdCost)} /></tr>
                                <tr><Label text="Quality Control (QC)" /><Val n={num(pnl.qcCost)} /></tr>
                                <tr className="border-t-2 border-black font-black"><Label text="TOTAL OVERHEADS" /><Val n={num(pnl.totalOverheads)} /></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* P&L */}
                    <div className="border-x border-slate-200 px-4">
                        <h3 className="font-bold border-b border-black mb-3 pb-1 text-[9px] uppercase tracking-wide">Profit and Loss Account (£)</h3>
                        <table className="w-full">
                            <tbody>
                                <tr className="font-black text-[#000080]"><Label text="SALES REVENUE" /><Val n={money(pnl.salesRevenue)} /></tr>
                                <tr><Label text="Opening Stock Value" /><Val n={num(pnl.openingStockValue)} /></tr>
                                <tr><Label text="Materials Purchased" /><Val n={num(pnl.materialsPurchased)} /></tr>
                                <tr><Label text="Assembly/Wages" /><Val n={num(pnl.productionWages)} /></tr>
                                <tr><Label text="Depreciation" /><Val n={num(pnl.depreciation)} /></tr>
                                <tr><Label text="Less Closing Stock Value" /><Val n={`(${num(pnl.lessClosingStockValue)})`} /></tr>
                                <tr className="border-t border-slate-400 font-bold"><Label text="COST OF GOODS SOLD" /><Val n={num(pnl.costOfGoodsSold)} /></tr>
                                <tr className="border-t-2 border-black font-black bg-slate-100"><Label text="GROSS PROFIT" /><Val n={money(pnl.grossProfit)} /></tr>
                                <tr><Label text="Interest Paid" /><Val n={`(${num(pnl.interestPaid)})`} /></tr>
                                <tr><Label text="Overheads" /><Val n={`(${num(pnl.totalOverheads)})`} /></tr>
                                <tr className="border-t-2 border-black font-black text-sm"><Label text="NET PROFIT/LOSS" /><Val n={money(pnl.netProfit)} /></tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Balance Sheet */}
                    <div>
                        <h3 className="font-bold border-b border-black mb-3 pb-1 text-[9px] uppercase tracking-wide">Balance Sheet (£)</h3>
                        <table className="w-full">
                            <tbody>
                                <tr className="font-bold border-b border-slate-200"><Label text="Assets" /><td></td></tr>
                                <tr><Label text="Value of Property/Plant" /><Val n={num(bs.fixedAssets.plant)} /></tr>
                                <tr><Label text="Value of Machines" /><Val n={num(bs.fixedAssets.machines)} /></tr>
                                <tr><Label text="Value of Vehicles" /><Val n={num(bs.fixedAssets.vehicles)} /></tr>
                                <tr><Label text="Value of Stock" /><Val n={num(bs.currentAssets.stockValuation)} /></tr>
                                <tr><Label text="Debtors" /><Val n={num(bs.currentAssets.debtors)} /></tr>
                                <tr><Label text="Cash Invested" /><Val n={num(bs.currentAssets.cash)} /></tr>

                                <tr className="font-bold border-b border-slate-200 pt-3"><Label text="Liabilities" /><td></td></tr>
                                <tr><Label text="Creditors" /><Val n={num(bs.currentLiabilities.creditors)} /></tr>
                                <tr><Label text="Bank Overdraft" /><Val n={num(bs.currentLiabilities.overdraft)} /></tr>

                                <tr className="border-t border-black font-black text-[12px]"><Label text="Net Assets" /><Val n={money(bs.netAssets)} /></tr>
                                <tr className="h-2"></tr>
                                <tr><Label text="Ordinary Capital" /><Val n={num(bs.capital.shareCapital)} /></tr>
                                <tr><Label text="Reserves" /><Val n={num(bs.capital.reserves)} /></tr>
                                <tr className="border-t-2 border-black font-black"><Label text="TOTAL FUNDING" /><Val n={money(bs.capital.totalCapital)} /></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Section 4: Business Intelligence */}
                <SectionHeader title="BUSINESS INTELLIGENCE" />
                <div className="bg-slate-50 p-4 border border-slate-200 mb-10 overflow-x-auto">
                    <table className="w-full text-[9px]">
                        <thead>
                            <tr className="border-b-2 border-slate-300">
                                <th className="text-left py-2 font-black uppercase">Company Status / Free Info</th>
                                {Array.from({ length: 8 }).map((_, i) => <th key={i} className="w-12 text-center text-slate-500 font-bold">{i + 1}</th>)}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            <tr>
                                <Label text="Market Share (%)" />
                                {Array.from({ length: 8 }).map((_, i) => {
                                    const latestResults = getTeamLatestResult(i + 1);
                                    return <td key={i} className="text-center tabular-nums">{latestResults?.kpis.marketShare.toFixed(1) || '6.9'}</td>;
                                })}
                            </tr>
                            <tr>
                                <Label text="Quality Rating (%)" />
                                {Array.from({ length: 8 }).map((_, i) => {
                                    const latestResults = getTeamLatestResult(i + 1);
                                    return <td key={i} className="text-center tabular-nums">{latestResults?.stats.qualityRatingPercent.toFixed(0) || '70'}</td>;
                                })}
                            </tr>
                            <tr>
                                <Label text="Area 1 Actual Sales" />
                                {Array.from({ length: 8 }).map((_, i) => {
                                    const latestResults = getTeamLatestResult(i + 1);
                                    return <td key={i} className="text-center tabular-nums">{num(latestResults?.stats.actualSalesArea1) || '0'}</td>;
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Section 5: Economic Information */}
                <SectionHeader title="ECONOMIC INFORMATION" />
                <div className="grid grid-cols-2 gap-x-12 p-3 bg-slate-50 border border-slate-200">
                    <div className="flex justify-between items-center"><span className="text-slate-500 font-bold">GDP Growth Rate (%)</span><span className="font-black">2.5%</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-500 font-bold">Unemployment Rate (%)</span><span className="font-black">5%</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-500 font-bold">Central Bank Interest Rate (%)</span><span className="font-black">5%</span></div>
                    <div className="flex justify-between items-center"><span className="text-slate-500 font-bold">Base Material Price (£ per '000)</span><span className="font-black">£50</span></div>
                </div>

                <div className="mt-8 text-[8px] text-slate-400 text-center uppercase tracking-widest italic">
                    © TOPAZ-Vbe is an interactive Business Simulation developed by Edit Systems Ltd.
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-navy-900">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-y-auto lg:pl-72 pt-16 lg:pt-0">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">

                    {/* HEADER */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-navy-800 pb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
                                <Trophy className="text-gold-500 w-8 h-8" />
                                Intelligence & Results
                            </h1>
                            <p className="text-slate-400 mt-1">Global ranking and detailed quarterly performance reports</p>
                        </div>
                        {latestQ > 0 && (
                            <div className="bg-navy-800 border border-navy-700 px-4 py-2 rounded-xl shadow-lg">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Your Global Rank</span>
                                <p className="text-2xl font-black text-gold-500 mt-0.5">#{rankings.findIndex(r => r.id === activeTeamId) + 1} <span className="text-xs font-normal text-slate-400">of {teams.length}</span></p>
                            </div>
                        )}
                    </div>

                    {/* TOP SECTION: LEADERBOARD & CHARTS */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                        {/* SUB-NAV for Ranking/Charts */}
                        <div className="xl:col-span-2 space-y-4">
                            <div className="flex items-center gap-2 bg-navy-800 p-1.5 rounded-lg w-fit border border-navy-700">
                                <button onClick={() => setActiveTab('ranking')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'ranking' ? 'bg-navy-700 text-gold-500 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Ranking</button>
                                <button onClick={() => setActiveTab('charts')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'charts' ? 'bg-navy-700 text-gold-500 shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>Trend Charts</button>
                            </div>

                            {latestQ < 1 ? (
                                <div className="bg-navy-800 rounded-2xl border border-navy-700 p-12 text-center shadow-xl">
                                    <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🏆</div>
                                    <h3 className="text-xl font-bold text-slate-200">No Historical Data Yet</h3>
                                    <p className="text-slate-400 mt-2 max-w-xs mx-auto">Complete the first quarter simulation to unlock the global leaderboard and performance analytics.</p>
                                </div>
                            ) : activeTab === 'ranking' ? (
                                <div className="bg-navy-800 rounded-2xl border border-navy-700 shadow-xl overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead className="bg-navy-900/50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Rank</th>
                                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Team Name</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Company Value</th>
                                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-widest">Net Profit</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-navy-700/50">
                                            {rankings.map((r, i) => (
                                                <tr key={r.id} className={`group transition-all hover:bg-navy-700/30 ${r.id === activeTeamId ? 'bg-navy-700/50' : ''}`}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`text-xl font-black ${i === 0 ? 'text-gold-500' : i === 1 ? 'text-slate-300' : i === 2 ? 'text-amber-600' : 'text-slate-500'}`}>{i + 1}</span>
                                                            {getMovement(r.companyValue, r.prevCompanyValue)}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-slate-100 group-hover:text-gold-500 transition-colors uppercase text-sm tracking-wide">{r.name}</span>
                                                        {r.id === activeTeamId && <span className="ml-2 py-0.5 px-1.5 bg-gold-500/10 text-gold-500 text-[10px] font-black rounded border border-gold-500/20">YOU</span>}
                                                    </td>
                                                    <td className="px-6 py-4 text-right tabular-nums font-mono text-slate-200">
                                                        £{(r.companyValue / 1000000).toFixed(2)}M
                                                    </td>
                                                    <td className={`px-6 py-4 text-right tabular-nums font-mono font-bold ${r.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                        {money(r.netProfit)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6 shadow-xl h-[400px]">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                                        <BarChart2 className="w-4 h-4" /> Market Capitalization (£'000)
                                    </h3>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={companyValueData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#233554" vertical={false} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `£${v}k`} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#112240', borderColor: '#233554', borderRadius: '12px', color: '#fff' }}
                                                itemStyle={{ color: '#fbbf24' }}
                                                cursor={{ fill: 'rgba(251, 191, 36, 0.05)' }}
                                            />
                                            <Bar dataKey="value" fill="#fbbf24" radius={[6, 6, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>

                        {/* QUICK STATS SIDEBAR */}
                        <div className="space-y-6">
                            <div className="bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-700 rounded-2xl p-6 shadow-xl">
                                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gold-500" />
                                    Report Selection
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Company</label>
                                        <select
                                            value={selectedTeam}
                                            onChange={e => setSelectedTeam(Number(e.target.value))}
                                            className="w-full bg-navy-900 border border-navy-700 text-slate-200 text-sm px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
                                        >
                                            {teams.map(t => <option key={t.id} value={t.id}>{t.name} (Team {t.companyNumber})</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1.5">Quarterly Period</label>
                                        <select
                                            value={selectedQuarter}
                                            onChange={e => setSelectedQuarter(Number(e.target.value))}
                                            className="w-full bg-navy-900 border border-navy-700 text-slate-200 text-sm px-3 py-2.5 rounded-xl focus:ring-2 focus:ring-gold-500/50 transition-all outline-none"
                                        >
                                            {availableQuarters.map(q => <option key={q} value={q}>Quarter {q}</option>)}
                                            {availableQuarters.length === 0 && <option value={0}>No Quarters Finished</option>}
                                        </select>
                                    </div>
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full mt-2 bg-navy-700 hover:bg-navy-600 border border-navy-600 text-white font-bold py-3 rounded-xl transition-all active:scale-[0.98] shadow-lg flex items-center justify-center gap-2"
                                    >
                                        Export PDF Report
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DETAILED REPORT SECTION */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white tracking-tight">Quarterly Ledger Reports</h2>
                            <div className="h-px flex-1 bg-navy-800"></div>
                        </div>

                        {renderDetailedReport()}
                    </div>

                </main>
            </div>
        </div>
    );
};

export default Intelligence;
