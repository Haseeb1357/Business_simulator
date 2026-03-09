import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulationStore } from '../store/simulationStore';

const Login = () => {
    const navigate = useNavigate();
    const { teams, setActiveTeam } = useSimulationStore();
    const [selectedTeam, setSelectedTeam] = useState(1);
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setActiveTeam(selectedTeam);
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex bg-navy-900">
            {/* Left - Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden border-r border-navy-700">
                <div className="absolute inset-0 opacity-10">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="absolute h-px bg-gold-500/20" style={{
                            top: `${5 + i * 5}%`, left: 0, right: 0,
                            transform: `rotate(${-15 + i}deg)`
                        }} />
                    ))}
                </div>
                <div className="relative z-10 max-w-lg text-center">
                    <h1 className="text-6xl font-black mb-4 leading-tight tracking-tighter italic">
                        <span className="text-gold-500">CUI</span> SIMULATION
                    </h1>
                    <p className="text-xl text-slate-400 mb-12 font-bold tracking-widest uppercase">Elite Strategy Platform</p>
                    <div className="space-y-6 text-slate-300 text-sm text-left bg-navy-900/50 p-8 rounded-3xl border border-navy-700 backdrop-blur-md">
                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                            <p className="font-medium tracking-wide">Multi-product demand & pricing simulation engine</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                            <p className="font-medium tracking-wide">Advanced financial reporting: P&L, Balance Sheet, KPIS</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-2 h-2 rounded-full bg-gold-500 shadow-[0_0_10px_rgba(251,191,36,0.5)]" />
                            <p className="font-medium tracking-wide">Compete against global companies in a simulated market</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div className="lg:hidden mb-12 text-center">
                        <h1 className="text-4xl font-black text-white mb-1 italic tracking-tighter">
                            <span className="text-gold-500">CUI</span> SIM
                        </h1>
                        <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em]">Strategy Engine</p>
                    </div>

                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Access Terminal</h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Identify your operational entity</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Assigned Company</label>
                            <select
                                value={selectedTeam}
                                onChange={e => setSelectedTeam(Number(e.target.value))}
                                className="w-full bg-navy-800 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/50 outline-none transition-all font-bold text-sm"
                            >
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>ENT-{t.companyNumber} | {t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security Key</label>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-navy-800 border-navy-700 text-white rounded-2xl py-4 px-5 focus:ring-2 focus:ring-gold-500/50 outline-none transition-all placeholder-navy-600 font-mono"
                            />
                        </div>

                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest p-1">
                            <label className="flex items-center gap-3 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded-md border-navy-700 bg-navy-800 text-gold-500 focus:ring-gold-500" defaultChecked />
                                <span className="text-slate-500 group-hover:text-slate-300 transition-colors">Remember Session</span>
                            </label>
                            <a href="#" className="text-gold-500 hover:text-white transition-colors">Recovery Link</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gold-500 hover:bg-white text-navy-900 font-black py-4 px-4 rounded-2xl shadow-xl shadow-gold-500/10 transition-all active:scale-[0.98] uppercase text-xs tracking-[0.2em]"
                        >
                            Initiate Simulation
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-navy-800">
                        <p className="text-center text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
                            TOPAZ PROTOCOL v3.0 • SECURE ACCESS
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
