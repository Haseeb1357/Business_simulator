import Sidebar from '../components/Sidebar';
import { useSimulationStore } from '../store/simulationStore';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    PieChart, Pie, Cell, BarChart, Bar, ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

const COLORS = ['#2563eb', '#059669', '#d97706', '#dc2626', '#7c3aed', '#0891b2', '#be123c', '#65a30d'];

const Dashboard = () => {
    const teams = useSimulationStore(s => s.teams);
    const activeTeamId = useSimulationStore(s => s.activeTeamId);
    const currentQuarter = useSimulationStore(s => s.currentQuarter);
    const gameStatus = useSimulationStore(s => s.gameStatus);
    const allResults = useSimulationStore(s => s.allResults);

    const activeTeam = teams.find(t => t.id === activeTeamId);
    const latestQ = currentQuarter - 1;

    // Compute data from raw state
    const history = useMemo(() => allResults.get(activeTeamId) || [], [allResults, activeTeamId]);
    const latest = history.length > 0 ? history[history.length - 1] : null;

    const latestResults = useMemo(() => {
        if (latestQ < 1) return [];
        return teams.map(t => {
            const res = allResults.get(t.id) || [];
            return res.find(r => r.quarter === latestQ);
        }).filter(Boolean) as any[];
    }, [allResults, teams, latestQ]);

    // Revenue trend data for line chart
    const revenueTrend = useMemo(() => history.map(r => ({
        quarter: `Q${r.quarter}`,
        Revenue: r.kpis.totalRevenue,
        'Net Profit': r.kpis.netProfit,
    })), [history]);

    // Market share pie data
    const marketShareData = useMemo(() => latestResults.map((r: any, i: number) => ({
        name: teams.find(t => t.id === r.teamId)?.name || `Team ${r.teamId}`,
        value: Math.round(r.kpis.marketShare * 100) / 100,
        fill: COLORS[i % COLORS.length],
    })), [latestResults, teams]);

    // Production bar data
    const productionData = useMemo(() => latest ? [
        { product: 'Product 1', Demand: latest.products.p1.demand, Produced: latest.products.p1.produced, Sold: latest.products.p1.sold },
        { product: 'Product 2', Demand: latest.products.p2.demand, Produced: latest.products.p2.produced, Sold: latest.products.p2.sold },
        { product: 'Product 3', Demand: latest.products.p3.demand, Produced: latest.products.p3.produced, Sold: latest.products.p3.sold },
    ] : [], [latest]);

    // Share price comparison
    const sharePriceHistory = useMemo(() => {
        const data: Record<string, any>[] = [];
        for (let q = 1; q <= latestQ; q++) {
            const point: Record<string, any> = { quarter: `Q${q}` };
            teams.forEach(t => {
                const res = allResults.get(t.id) || [];
                const r = res.find(r => r.quarter === q);
                point[t.name] = r?.kpis.sharePrice || 116;
            });
            data.push(point);
        }
        return data;
    }, [allResults, teams, latestQ]);

    const fmt = (n: number) => n >= 0 ? `£${n.toLocaleString()}` : `-£${Math.abs(n).toLocaleString()}`;

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden pt-16 lg:pt-0 lg:pl-72 bg-slate-50">
                <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-800">Executive Dashboard</h1>
                            <p className="text-slate-500">{activeTeam?.name} — Performance Overview</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
                                <span className="text-xs text-slate-500">Quarter</span>
                                <p className="text-sm font-bold text-primary-600">Q{currentQuarter} {currentQuarter <= 1 ? '(Start)' : ''}</p>
                            </div>
                            <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${gameStatus === 'inputting' ? 'bg-amber-100 text-amber-700' : gameStatus === 'processing' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                                {gameStatus.toUpperCase()}
                            </div>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium">Revenue</h3>
                            <p className="text-2xl font-bold mt-1 text-slate-900">{latest ? fmt(latest.kpis.totalRevenue) : '—'}</p>
                            {history.length > 1 && <p className={`text-xs mt-1 ${latest!.kpis.totalRevenue >= history[history.length - 2].kpis.totalRevenue ? 'text-emerald-500' : 'text-red-500'}`}>
                                {latest!.kpis.totalRevenue >= history[history.length - 2].kpis.totalRevenue ? '▲' : '▼'} vs Q{currentQuarter - 2}
                            </p>}
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium">Net Profit</h3>
                            <p className={`text-2xl font-bold mt-1 ${latest && latest.kpis.netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {latest ? fmt(latest.kpis.netProfit) : '—'}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium">Share Price</h3>
                            <p className="text-2xl font-bold mt-1 text-primary-600">{latest ? `${latest.kpis.sharePrice}p` : '116.0p'}</p>
                        </div>
                        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                            <h3 className="text-xs text-slate-500 uppercase tracking-wider font-medium">Market Share</h3>
                            <p className="text-2xl font-bold mt-1 text-amber-600">{latest ? `${latest.kpis.marketShare}%` : '—'}</p>
                        </div>
                    </div>

                    {latestQ < 1 ? (
                        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
                            <div className="text-6xl mb-4">📊</div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">No Simulation Data Yet</h2>
                            <p className="text-slate-500 max-w-md mx-auto">Submit your decisions and run the first quarter simulation from the Admin Control Panel to see charts and analytics here.</p>
                        </div>
                    ) : (
                        <>
                            {/* Revenue & Profit Trend */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Revenue & Profit Trend</h3>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <LineChart data={revenueTrend}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="quarter" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `£${(v / 1000).toFixed(0)}k`} />
                                            <Tooltip formatter={(v: number) => `£${v.toLocaleString()}`} />
                                            <Legend />
                                            <Line type="monotone" dataKey="Revenue" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                                            <Line type="monotone" dataKey="Net Profit" stroke="#059669" strokeWidth={2} dot={{ r: 4 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Market Share Distribution</h3>
                                    {marketShareData.length > 0 ? (
                                        <ResponsiveContainer width="100%" height={280}>
                                            <PieChart>
                                                <Pie data={marketShareData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name.split(' ')[0]}: ${value}%`}>
                                                    {marketShareData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : <p className="text-slate-400 text-center py-20">Run simulation first</p>}
                                </div>
                            </div>

                            {/* Production & Share Price */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Production vs Demand (Latest Quarter)</h3>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <BarChart data={productionData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="product" tick={{ fontSize: 12 }} />
                                            <YAxis tick={{ fontSize: 11 }} />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="Demand" fill="#93c5fd" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Produced" fill="#2563eb" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="Sold" fill="#059669" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                                    <h3 className="text-sm font-semibold text-slate-800 mb-4">Share Price Trends (All Teams)</h3>
                                    <ResponsiveContainer width="100%" height={280}>
                                        <LineChart data={sharePriceHistory}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                                            <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}p`} />
                                            <Tooltip />
                                            <Legend wrapperStyle={{ fontSize: 11 }} />
                                            {teams.map((t, i) => (
                                                <Line key={t.id} dataKey={t.name} stroke={COLORS[i % COLORS.length]} strokeWidth={1.5} dot={false} />
                                            ))}
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
