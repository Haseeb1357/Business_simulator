import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';
import {
    LayoutDashboard, Trophy,
    Settings, Menu, X, Users
} from 'lucide-react';
import clsx from 'clsx';

const Navbar = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { currentQuarter, activeTeamId, teams, gameStatus, isSynced, isOnline } = useSimulationStore();
    const activeTeam = teams.find(t => t.id === activeTeamId);

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Intelligence', href: '/intelligence', icon: Trophy },
        { name: 'Teams', href: '/admin/teams', icon: Users },
        { name: 'Admin', href: '/admin/control', icon: Settings },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-800/80 backdrop-blur-md border-b border-navy-700 shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Left: Branding */}
                    <div className="flex items-center">
                        <NavLink to="/dashboard" className="flex items-center gap-2 group">
                            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic group-hover:scale-105 transition-transform">
                                <span className="text-gold-500">BHUTTO</span> & CO.
                            </h1>
                        </NavLink>
                    </div>

                    {/* Center: Desktop Menu */}
                    <div className="hidden lg:flex items-center space-x-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) => clsx(
                                    isActive
                                        ? 'bg-navy-900 text-gold-500 shadow-inner border border-navy-700'
                                        : 'text-slate-400 hover:text-white hover:bg-navy-700/50',
                                    'flex items-center gap-x-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-200'
                                )}
                            >
                                <item.icon className="h-4 w-4" aria-hidden="true" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right: Status & Profile */}
                    <div className="hidden lg:flex items-center gap-6">
                        <div className="flex items-center gap-4 bg-navy-950/50 border border-navy-700 rounded-2xl px-4 py-2 shadow-inner">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Active Phase</span>
                                <span className="text-[10px] font-black text-gold-500 uppercase">Quarter {currentQuarter}</span>
                            </div>
                            <div className="h-8 w-px bg-navy-800" />
                            <div className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tight border ${gameStatus === 'inputting' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                {gameStatus}
                            </div>
                            <div className="h-8 w-px bg-navy-800" />
                            <div className="flex items-center gap-1.5" title={isSynced ? 'Live — synced across all devices' : isOnline ? 'Connecting to cloud...' : 'Offline'}>
                                <div className="relative flex h-2.5 w-2.5">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isSynced ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isSynced ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${isSynced ? 'text-emerald-500' : 'text-amber-500'}`}>
                                    {isSynced ? 'Live' : 'Sync...'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pl-4 border-l border-navy-800">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-white uppercase tracking-tight truncate w-24">{activeTeam?.name}</p>
                                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Unit {activeTeam?.companyNumber}</p>
                            </div>
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-gold-500 flex items-center justify-center text-navy-900 font-black text-xs shadow-lg shadow-gold-500/20">
                                {activeTeam?.companyNumber}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-white hover:bg-navy-700 focus:outline-none transition-colors"
                        >
                            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileOpen && (
                <div className="lg:hidden bg-navy-800 border-t border-navy-700 animate-in slide-in-from-top duration-300">
                    <div className="px-4 pt-4 pb-6 space-y-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) => clsx(
                                    isActive ? 'bg-navy-900 text-gold-500 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-navy-700/50',
                                    'flex items-center gap-x-3 px-4 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all'
                                )}
                            >
                                <item.icon className="h-5 w-5" aria-hidden="true" />
                                {item.name}
                            </NavLink>
                        ))}
                    </div>
                    {/* Mobile Profile & Status */}
                    <div className="border-t border-navy-700 p-4 bg-navy-900/50">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gold-500 flex items-center justify-center text-navy-900 font-black text-xs shadow-lg">
                                    {activeTeam?.companyNumber}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-tight">{activeTeam?.name}</p>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase">Unit {activeTeam?.companyNumber}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-navy-800 p-2 rounded-xl text-center border border-navy-700">
                                <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest">Quarter</span>
                                <span className="text-xs font-black text-gold-500 uppercase">{currentQuarter}</span>
                            </div>
                            <div className={`flex-1 p-2 rounded-xl text-center border flex flex-col justify-center ${gameStatus === 'inputting' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'}`}>
                                <span className="block text-[8px] font-black opacity-50 uppercase tracking-widest">Status</span>
                                <span className="text-xs font-black uppercase">{gameStatus}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
