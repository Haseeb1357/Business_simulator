import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Trophy, Users, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
    const items = [
        { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
        { name: 'Intelligence', to: '/intelligence', icon: Trophy },
        { name: 'Teams', to: '/admin/teams', icon: Users },
        { name: 'Admin', to: '/admin/control', icon: Settings },
    ];

    return (
        <aside className="hidden lg:block fixed top-20 left-0 bottom-0 w-72 bg-navy-900 border-r border-navy-800 p-6 overflow-y-auto">
            <div className="space-y-6">
                <nav className="space-y-2">
                    {items.map(it => (
                        <NavLink
                            key={it.name}
                            to={it.to}
                            className={({ isActive }) => isActive ? 'flex items-center gap-3 px-3 py-2 rounded-lg bg-navy-800 text-gold-500 font-black' : 'flex items-center gap-3 px-3 py-2 rounded-lg text-slate-300 hover:bg-navy-800 hover:text-white'}
                        >
                            <it.icon className="h-4 w-4" />
                            <span className="text-sm font-black uppercase tracking-wider">{it.name}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-6 text-xs text-slate-400">
                    <p className="font-bold text-slate-300">Simulation Controls</p>
                    <p className="mt-2">Use the top navbar to change phases and active team.</p>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
