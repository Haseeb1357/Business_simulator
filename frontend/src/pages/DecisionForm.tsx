import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useSimulationStore } from '../store/simulationStore';
import { TeamDecision } from '../engine/simulationEngine';

interface DecisionFormProps {
    embedded?: boolean;
}

const DecisionForm: React.FC<DecisionFormProps> = ({ embedded }) => {
    const activeTeamId = useSimulationStore(state => state.activeTeamId);
    const currentDecisions = useSimulationStore(state => state.currentDecisions);
    const updateDecision = useSimulationStore(state => state.updateDecision);
    const submitDecision = useSimulationStore(state => state.submitDecision);
    const randomizeCurrentDecision = useSimulationStore(state => state.randomizeCurrentDecision);
    const submittedTeams = useSimulationStore(state => state.submittedTeams);
    const teams = useSimulationStore(state => state.teams);

    const isSubmitted = submittedTeams.has(activeTeamId);
    const team = teams.find(t => t.id === activeTeamId);

    const [dec, setDec] = useState<TeamDecision | null>(null);

    useEffect(() => {
        const d = currentDecisions.get(activeTeamId);
        if (d) setDec(d);
    }, [activeTeamId, currentDecisions]);

    if (!dec) return null;

    const handleSave = () => updateDecision(activeTeamId, dec);
    const handleSubmit = () => {
        updateDecision(activeTeamId, dec);
        submitDecision(activeTeamId);
    };
    const handleRandomize = () => {
        randomizeCurrentDecision();
        const d = useSimulationStore.getState().currentDecisions.get(activeTeamId);
        if (d) setDec(d);
    };

    const updateField = (path: (string | number)[], val: any) => {
        setDec(prev => {
            if (!prev) return prev;
            const next = JSON.parse(JSON.stringify(prev));
            let curr = next;
            for (let i = 0; i < path.length - 1; i++) {
                curr = curr[path[i]];
            }
            curr[path[path.length - 1]] = val;
            return next;
        });
    };

    const StrInp = ({ path, className }: { path: (string | number)[], className?: string }) => {
        let val: any = dec;
        for (const p of path) val = val[p];
        return <input className={`win-input ${className || ''}`} type="text" value={val} disabled={isSubmitted}
            onChange={e => updateField(path, e.target.value)} />;
    };

    const NumInp = ({ path, className }: { path: (string | number)[], className?: string }) => {
        let val: any = dec;
        for (const p of path) val = val[p];
        return <input className={`win-input ${className || ''}`} type="number" value={val} disabled={isSubmitted}
            onChange={e => updateField(path, Number(e.target.value) || 0)} />;
    };

    const ChkInp = ({ path, className }: { path: (string | number)[], className?: string }) => {
        let val: any = dec;
        for (const p of path) val = val[p];
        return <input className={`${className || ''}`} type="checkbox" checked={val} disabled={isSubmitted}
            onChange={e => updateField(path, e.target.checked)} />;
    };

    return (
        <div className={`font-['Arial',sans-serif] text-sm flex flex-col items-center ${embedded ? '' : 'p-8 min-h-screen bg-navy-900 pt-24'}`}>

            {!embedded && <Navbar />}

            {!embedded && <h1 className="text-white text-3xl font-black mb-8 self-start max-w-5xl w-full mx-auto uppercase italic tracking-tight">Mission <span className="text-gold-500">Directives</span></h1>}

            <div className="bg-[#c0c0c0] win-border-outset w-full max-w-5xl flex flex-col mb-4">
                <div className="bg-[#000080] text-white font-bold p-1 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <span className="text-xs border p-0.5 bg-[#c0c0c0] text-black italic font-bold">Bhutto</span>
                        <span>Bhutto & Co. Team Decision Sheet - {team?.name}</span>
                    </div>
                </div>

                <div className="p-2 flex flex-col gap-2">
                    <div className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-2">
                            <fieldset className="win-fieldset bg-[#00ffff]">
                                <legend className="win-legend text-black">Simulation Data</legend>
                                <div className="flex justify-between items-center px-4 text-black">
                                    <label className="flex items-center gap-2 font-bold">Simulation Code <StrInp path={['companyInfo', 'simulationCode']} className="w-24" /></label>
                                    <label className="flex items-center gap-2 font-bold">Year: <StrInp path={['companyInfo', 'year']} className="w-16" /></label>
                                    <label className="flex items-center gap-2 font-bold">Quarter: <StrInp path={['companyInfo', 'quarter']} className="w-12" /></label>
                                </div>
                            </fieldset>

                            <fieldset className="win-fieldset bg-[#ffdead]">
                                <legend className="win-legend text-black">Company Information</legend>
                                <div className="flex justify-around items-center px-4 text-black text-center">
                                    <div><div className="font-bold mb-1">Group Number</div><StrInp path={['companyInfo', 'groupNumber']} className="w-12 text-center" /></div>
                                    <div><div className="font-bold mb-1">Company Number</div><StrInp path={['companyInfo', 'companyNumber']} className="w-12 text-center" /></div>
                                    <div><div className="font-bold mb-1">Identity Number</div><StrInp path={['companyInfo', 'identityNumber']} className="w-16 text-center" /></div>
                                    <div><div className="font-bold mb-1">Status</div><StrInp path={['companyInfo', 'status']} className="w-12 text-center" /></div>
                                </div>
                            </fieldset>
                        </div>
                        <fieldset className="win-fieldset bg-black text-center w-1/3 flex flex-col justify-center border-gray-500">
                            <legend className="win-legend text-white bg-black">Information</legend>
                            <div className="text-[#00ffff] font-bold text-xl leading-tight">Simulator<br />from Edit<br />Systems Ltd</div>
                        </fieldset>
                    </div>

                    <fieldset className="win-fieldset bg-[#e0e0e0]">
                        <legend className="win-legend text-black">Decision Data</legend>
                        <div className="flex flex-col gap-4 text-black text-xs sm:text-sm">
                            <div className="flex">
                                <div className="w-1/2 pr-4">
                                    <div className="grid grid-cols-4 gap-2 mb-2 font-bold text-center items-end">
                                        <div className="text-left">'Tick' to Implement Major<br />Product Improvements (if any):</div>
                                        <div>Product 1<br /><ChkInp path={['productImprovements', 0]} className="w-4 h-4" /></div>
                                        <div>Product 2<br /><ChkInp path={['productImprovements', 1]} className="w-4 h-4" /></div>
                                        <div>Product 3<br /><ChkInp path={['productImprovements', 2]} className="w-4 h-4" /></div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mb-2 font-bold items-center">
                                        <div className="text-right pr-2">Prices:<br />(£'s)</div><div></div><div></div><div></div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mb-2 items-center">
                                        <div className="font-bold text-right pr-2">Export Market</div>
                                        <div><NumInp path={['prices', 'exportMarket', 0]} className="w-full" /></div>
                                        <div><NumInp path={['prices', 'exportMarket', 1]} className="w-full" /></div>
                                        <div><NumInp path={['prices', 'exportMarket', 2]} className="w-full" /></div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mb-4 items-center">
                                        <div className="font-bold text-right pr-2">Home Markets</div>
                                        <div><NumInp path={['prices', 'homeMarkets', 0]} className="w-full" /></div>
                                        <div><NumInp path={['prices', 'homeMarkets', 1]} className="w-full" /></div>
                                        <div><NumInp path={['prices', 'homeMarkets', 2]} className="w-full" /></div>
                                    </div>

                                    <div className="font-bold mb-2">Promotion Expenditure:</div>
                                    <div className="grid grid-cols-4 gap-2 mb-1 items-center">
                                        <div className="font-bold text-right pr-2">Trade Press<br />(£'000)</div>
                                        <div><NumInp path={['promotion', 'tradePress', 0]} className="w-full" /></div>
                                        <div><NumInp path={['promotion', 'tradePress', 1]} className="w-full" /></div>
                                        <div><NumInp path={['promotion', 'tradePress', 2]} className="w-full" /></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-1 items-center">
                                        <div className="font-bold text-right pr-2">Advertising<br />Support</div>
                                        <div><NumInp path={['promotion', 'advertisingSupport', 0]} className="w-full" /></div>
                                        <div><NumInp path={['promotion', 'advertisingSupport', 1]} className="w-full" /></div>
                                        <div><NumInp path={['promotion', 'advertisingSupport', 2]} className="w-full" /></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-4 items-center">
                                        <div className="font-bold text-right pr-2">Merchandising</div>
                                        <div><NumInp path={['promotion', 'merchandising', 0]} className="w-full" /></div>
                                        <div><NumInp path={['promotion', 'merchandising', 1]} className="w-full" /></div>
                                        <div><NumInp path={['promotion', 'merchandising', 2]} className="w-full" /></div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 items-center mb-4">
                                        <div className="font-bold text-right pr-2">Assembly Time: (Minutes)</div>
                                        <div><NumInp path={['assemblyTime', 0]} className="w-full" /></div>
                                        <div><NumInp path={['assemblyTime', 1]} className="w-full" /></div>
                                        <div><NumInp path={['assemblyTime', 2]} className="w-full" /></div>
                                    </div>
                                </div>

                                <div className="w-1/2 pl-4 border-l-2 border-gray-400">
                                    <div className="flex justify-between items-center mb-2 font-bold">
                                        <div>Dividend Rate: (pence/share) <NumInp path={['dividendRate']} className="w-12 ml-2" /></div>
                                        <div>Days Credit Allowed: <NumInp path={['daysCreditAllowed']} className="w-12 ml-2" /></div>
                                    </div>
                                    <div className="flex justify-between items-center mb-4 font-bold">
                                        <div>Vans to Buy: <NumInp path={['vansToBuy']} className="w-12 ml-2" /></div>
                                        <div>Vans to Sell: <NumInp path={['vansToSell']} className="w-12 ml-2" /></div>
                                    </div>

                                    <div className="flex gap-4 mb-4 font-bold items-center">
                                        <div>Information<br />Wanted:</div>
                                        <div>on Other<br />Companies <ChkInp path={['informationWanted', 'otherCompanies']} className="ml-1" /></div>
                                        <div>on Market<br />Shares <ChkInp path={['informationWanted', 'marketShares']} className="ml-1" /></div>
                                    </div>

                                    <div className="grid grid-cols-4 gap-2 mb-2 font-bold text-center">
                                        <div></div><div>Product 1</div><div>Product 2</div><div>Product 3</div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-1 items-center">
                                        <div className="font-bold text-right pr-2 leading-tight">Make and<br />Deliver<br />Products to:</div>
                                        <div></div><div></div><div></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-1 items-center">
                                        <div className="font-bold text-right pr-2">Export Area</div>
                                        <div><NumInp path={['deliveries', 'exportArea', 0]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'exportArea', 1]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'exportArea', 2]} className="w-full" /></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-1 items-center">
                                        <div className="font-bold text-right pr-2">South Area</div>
                                        <div><NumInp path={['deliveries', 'southArea', 0]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'southArea', 1]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'southArea', 2]} className="w-full" /></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-1 items-center">
                                        <div className="font-bold text-right pr-2">West Area</div>
                                        <div><NumInp path={['deliveries', 'westArea', 0]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'westArea', 1]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'westArea', 2]} className="w-full" /></div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 mb-4 items-center">
                                        <div className="font-bold text-right pr-2">North Area</div>
                                        <div><NumInp path={['deliveries', 'northArea', 0]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'northArea', 1]} className="w-full" /></div>
                                        <div><NumInp path={['deliveries', 'northArea', 2]} className="w-full" /></div>
                                    </div>
                                    <div className="flex items-center gap-2 font-bold mb-4">
                                        Research Expenditure:(£'000) <NumInp path={['researchExpenditure']} className="w-16" />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-400 border-t-2" />

                            <div className="flex">
                                <div className="w-1/2 pr-4">
                                    <div className="flex justify-between items-center mb-4 font-bold">
                                        <div>Salespeople<br />Allocated to</div>
                                        <div className="text-center">Export<br />Area<br /><NumInp path={['salesforceAllocated', 'exportArea']} className="w-10 mt-1" /></div>
                                        <div className="text-center">South<br />Area<br /><NumInp path={['salesforceAllocated', 'southArea']} className="w-10 mt-1" /></div>
                                        <div className="text-center">West<br />Area<br /><NumInp path={['salesforceAllocated', 'westArea']} className="w-10 mt-1" /></div>
                                        <div className="text-center">North<br />Area<br /><NumInp path={['salesforceAllocated', 'northArea']} className="w-10 mt-1" /></div>
                                    </div>

                                    <div className="flex justify-between items-center mb-2 font-bold">
                                        <div>Salespeople's<br />Remuneration</div>
                                        <div className="text-right">Quarterly<br />Salary:(£'00) <NumInp path={['salesforceRemuneration', 'quarterlySalary']} className="w-12 ml-1" /></div>
                                        <div className="text-right">% Sales<br />Commission: <NumInp path={['salesforceRemuneration', 'commission']} className="w-12 ml-1" /></div>
                                    </div>

                                    <div className="flex justify-between items-center mb-2 font-bold">
                                        <div>Assembly Workers'<br />hourly wage rate:</div>
                                        <div className="flex items-center gap-1">(Pounds.Pence)<br /><NumInp path={['assemblyWorkersWage', 'pounds']} className="w-8" /> . <NumInp path={['assemblyWorkersWage', 'pence']} className="w-8" /></div>
                                        <div>Shift level: <NumInp path={['shiftLevel']} className="w-12 ml-1" /></div>
                                    </div>
                                    <div className="flex items-center gap-2 font-bold mb-2">
                                        Quarterly Management Budget:( £'000) <NumInp path={['managementBudget']} className="w-16" />
                                    </div>
                                    <div className="flex justify-between items-center font-bold">
                                        <div>Contract Maintenance hours: <NumInp path={['contractMaintenanceHours']} className="w-12 ml-1" /></div>
                                        <div>Machines to Sell: <NumInp path={['machinesToSell']} className="w-12 ml-1" /></div>
                                    </div>
                                </div>

                                <div className="w-1/2 pl-4 border-l-2 border-gray-400 flex flex-col justify-end">
                                    <div className="flex gap-4 font-bold items-center mb-2">
                                        <div className="w-32">Salespeople</div>
                                        <div>Recruit <NumInp path={['salesforce', 'recruit']} className="w-10" /></div>
                                        <div>Dismiss <NumInp path={['salesforce', 'dismiss']} className="w-10" /></div>
                                        <div>Train <NumInp path={['salesforce', 'train']} className="w-10" /></div>
                                    </div>
                                    <div className="flex gap-4 font-bold items-center mb-6">
                                        <div className="w-32">Assembly Workers:</div>
                                        <div>Recruit <NumInp path={['assemblyWorkers', 'recruit']} className="w-10" /></div>
                                        <div>Dismiss <NumInp path={['assemblyWorkers', 'dismiss']} className="w-10" /></div>
                                        <div>Train <NumInp path={['assemblyWorkers', 'train']} className="w-10" /></div>
                                    </div>
                                    <div className="flex justify-between font-bold items-end mb-4 text-center">
                                        <div className="text-left">Raw Material:</div>
                                        <div>Units to Order<br /><NumInp path={['rawMaterial', 'unitsToOrder']} className="w-20 mt-1" /></div>
                                        <div>Supplier No.<br /><NumInp path={['rawMaterial', 'supplierNo']} className="w-12 mt-1" /></div>
                                        <div>No. of Deliveries<br /><NumInp path={['rawMaterial', 'deliveries']} className="w-12 mt-1" /></div>
                                    </div>
                                    <div className="flex justify-end items-center font-bold gap-2">
                                        New Machines to Order: <NumInp path={['newMachinesToOrder']} className="w-16" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>
            </div>

            <div className="flex justify-end gap-3 w-full max-w-5xl mt-2 pb-8">
                {isSubmitted && <div className="px-4 py-2 font-bold text-emerald-700 bg-emerald-100 rounded flex-1">✓ Decisions Submitted</div>}
                <button onClick={handleRandomize} disabled={isSubmitted} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 shadow disabled:opacity-50">
                    Randomize Data
                </button>
                <button onClick={handleSave} disabled={isSubmitted} className="bg-slate-600 hover:bg-slate-700 text-white font-bold py-2 px-6 shadow disabled:opacity-50">
                    Save Draft
                </button>
                <button onClick={handleSubmit} disabled={isSubmitted} className="bg-[#800000] hover:bg-red-800 text-white font-bold py-2 px-6 shadow disabled:opacity-50">
                    Submit Decisions
                </button>
            </div>

        </div>
    );
};

export default DecisionForm;
