import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import {
    LayoutDashboard, Trophy,
    Settings, Menu, X, Users
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { currentQuarter, activeTeamId, teams, gameStatus } = useSimulationStore();
    const activeTeam = teams.find(t => t.id === activeTeamId);

    const navItems = [
        { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Intelligence & Results', href: '/intelligence', icon: Trophy },
        { name: 'Team Management', href: '/admin/teams', icon: Users },
    ];

    const adminItems = [
        { name: 'Simulation Control', href: '/admin/control', icon: Settings },
    ];

    const sidebarContent = (
        <div className="flex flex-col h-full bg-navy-800 border-r border-navy-700">
            <div className="flex shrink-0 items-center px-6 py-6 justify-between">
                <h1 className="text-xl font-black tracking-tighter text-white uppercase italic">
                    <span className="text-gold-500">BHUTTO</span> & CO.
                </h1>
                <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Quarter & Status Badge */}
            <div className="mx-4 mb-8 p-4 bg-navy-900/50 rounded-2xl border border-navy-700 shadow-inner">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>Active Phase</span>
                    <span className="text-gold-500">Phase Q{currentQuarter}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold text-slate-300">Simulation Status</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tight ${gameStatus === 'inputting' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                        {gameStatus}
                    </span>
                </div>
            </div>

            <nav className="flex flex-1 flex-col px-4 gap-y-8">
                <div>
                    <h2 className="text-[10px] font-black leading-6 text-slate-500 mb-3 uppercase tracking-[0.2em]">Strategy Panel</h2>
                    <ul className="space-y-1.5">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <NavLink to={item.href} onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) => clsx(
                                        isActive ? 'bg-navy-700 text-gold-500 shadow-lg border-l-4 border-gold-500' : 'text-slate-400 hover:text-white hover:bg-navy-700/50',
                                        'group flex gap-x-3 rounded-xl p-3 text-xs leading-6 font-bold transition-all duration-200'
                                    )}>
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={clsx(isActive ? 'text-gold-500' : 'text-slate-500 group-hover:text-slate-200', 'h-5 w-5 shrink-0')} aria-hidden="true" />
                                            {item.name}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-[10px] font-black leading-6 text-slate-500 mb-3 uppercase tracking-[0.2em]">System Admin</h2>
                    <ul className="space-y-1.5">
                        {adminItems.map(item => (
                            <li key={item.name}>
                                <NavLink to={item.href} onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) => clsx(
                                        isActive ? 'bg-navy-700 text-amber-400 border-l-4 border-amber-400 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-navy-700/50',
                                        'group flex gap-x-3 rounded-xl p-3 text-xs leading-6 font-bold transition-all duration-200'
                                    )}>
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={clsx(isActive ? 'text-amber-400' : 'text-slate-500 group-hover:text-slate-200', 'h-5 w-5 shrink-0')} aria-hidden="true" />
                                            {item.name}
                                        </>
                                    )}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* User Profile Hook */}
            <div className="mt-auto p-4">
                <div className="flex items-center gap-x-4 p-3 rounded-2xl bg-navy-900 border border-navy-700">
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-gold-500 flex items-center justify-center text-navy-900 font-black text-xs shadow-lg shadow-gold-500/20">
                        {activeTeam?.companyNumber}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-black text-white truncate uppercase tracking-tight">{activeTeam?.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Team Entity</p>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-navy-800 border-b border-navy-700 px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-black tracking-tighter text-white uppercase italic">
                    <span className="text-gold-500">CUI</span> SIM
                </h1>
                <button onClick={() => setMobileOpen(true)} className="text-slate-300 hover:text-white">
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-72 flex flex-col shadow-2xl z-50">
                        {sidebarContent}
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 z-30 shadow-2xl">
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;
