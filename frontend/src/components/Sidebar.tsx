import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import {
    LayoutDashboard, Trophy,
    Settings, Menu, X, FileText, Users
} from 'lucide-react';
import clsx from 'clsx';

const Sidebar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { currentQuarter, activeTeamId, teams, gameStatus } = useSimulationStore();
    const activeTeam = teams.find(t => t.id === activeTeamId);

    const navItems = [
        { name: 'Command Center', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Reports', href: '/reports', icon: FileText },
        { name: 'Leaderboard', href: '/leaderboard', icon: Trophy },
        { name: 'Team Management', href: '/admin/teams', icon: Users },
    ];

    const adminItems = [
        { name: 'Simulation Control', href: '/admin/control', icon: Settings },
    ];

    const sidebarContent = (
        <>
            <div className="flex shrink-0 items-center px-6 justify-between">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent">CUI Simulation</h1>
                <button onClick={() => setMobileOpen(false)} className="lg:hidden text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Quarter & Status */}
            <div className="mx-4 px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Quarter</span>
                    <span className="font-bold text-primary-600">Q{currentQuarter}</span>
                </div>
                <div className="flex justify-between text-xs mt-1">
                    <span className="text-slate-500">Status</span>
                    <span className={`font-semibold ${gameStatus === 'inputting' ? 'text-amber-600' : gameStatus === 'processing' ? 'text-blue-600' : 'text-emerald-600'}`}>
                        {gameStatus.charAt(0).toUpperCase() + gameStatus.slice(1)}
                    </span>
                </div>
            </div>

            <nav className="flex flex-1 flex-col px-4 gap-y-6">
                <div>
                    <h2 className="text-xs font-semibold leading-6 text-slate-400 mb-2 uppercase tracking-wider">Team Actions</h2>
                    <ul className="space-y-1">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <NavLink to={item.href} onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) => clsx(
                                        isActive ? 'bg-primary-50 text-primary-600 border-l-2 border-primary-600' : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50',
                                        'group flex gap-x-3 rounded-md p-2.5 text-sm leading-6 font-medium transition-colors'
                                    )}>
                                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h2 className="text-xs font-semibold leading-6 text-slate-400 mb-2 uppercase tracking-wider">Administration</h2>
                    <ul className="space-y-1">
                        {adminItems.map(item => (
                            <li key={item.name}>
                                <NavLink to={item.href} onClick={() => setMobileOpen(false)}
                                    className={({ isActive }) => clsx(
                                        isActive ? 'bg-amber-50 text-amber-600 border-l-2 border-amber-500' : 'text-slate-700 hover:text-amber-600 hover:bg-slate-50',
                                        'group flex gap-x-3 rounded-md p-2.5 text-sm leading-6 font-medium transition-colors'
                                    )}>
                                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                                    {item.name}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* User Profile */}
            <div className="mt-auto px-4 border-t border-slate-100 pt-4 pb-3">
                <div className="flex items-center gap-x-3 p-2 rounded-lg bg-slate-50">
                    <div className="h-9 w-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        T{activeTeam?.companyNumber}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-900">{activeTeam?.name}</p>
                        <p className="text-xs text-slate-500">Company {activeTeam?.companyNumber}</p>
                    </div>
                </div>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile hamburger */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <h1 className="text-lg font-bold bg-gradient-to-r from-primary-600 to-primary-900 bg-clip-text text-transparent">CUI Simulation</h1>
                <button onClick={() => setMobileOpen(true)} className="text-slate-600 hover:text-slate-800">
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div className="fixed inset-0 bg-slate-600/75" onClick={() => setMobileOpen(false)} />
                    <div className="fixed inset-y-0 left-0 w-72 bg-white flex flex-col gap-y-5 pt-5 pb-4 shadow-xl z-50">
                        {sidebarContent}
                    </div>
                </div>
            )}

            {/* Desktop sidebar */}
            <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:border-r lg:border-slate-200 lg:bg-white lg:pt-5 lg:pb-4 gap-y-5 z-30">
                {sidebarContent}
            </div>
        </>
    );
};

export default Sidebar;
