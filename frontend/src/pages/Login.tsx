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
        <div className="min-h-screen flex">
            {/* Left - Branding Panel */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white flex-col justify-center items-center p-12 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="absolute h-px bg-white/20" style={{
                            top: `${5 + i * 5}%`, left: 0, right: 0,
                            transform: `rotate(${-15 + i}deg)`
                        }} />
                    ))}
                </div>
                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-extrabold mb-4 leading-tight">Topaz-Sync</h1>
                    <p className="text-xl text-blue-200 mb-8">Business Strategy Simulation Platform</p>
                    <div className="space-y-4 text-blue-100 text-sm">
                        <div className="flex items-start gap-3">
                            <span className="text-emerald-300 text-lg">✓</span>
                            <p>Multi-product demand & pricing simulation across home and export markets</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-emerald-300 text-lg">✓</span>
                            <p>Real-time financial reports — P&L, Balance Sheet, Cash Flow</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-emerald-300 text-lg">✓</span>
                            <p>Compete against 8 companies over 12 quarterly rounds</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <span className="text-emerald-300 text-lg">✓</span>
                            <p>Production, HR, R&D, and financial strategy decisions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right - Login Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="max-w-md w-full">
                    <div className="lg:hidden mb-8">
                        <h1 className="text-3xl font-extrabold text-primary-600 mb-1">Topaz-Sync</h1>
                        <p className="text-slate-500">Business Strategy Simulation</p>
                    </div>

                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Welcome back</h2>
                    <p className="text-slate-500 mb-8">Select your team to access the simulation dashboard.</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Select Your Team</label>
                            <select value={selectedTeam} onChange={e => setSelectedTeam(Number(e.target.value))}
                                className="w-full border-slate-300 rounded-lg shadow-sm text-sm py-3 px-4 focus:ring-primary-500 focus:border-primary-500">
                                {teams.map(t => (
                                    <option key={t.id} value={t.id}>Company {t.companyNumber} — {t.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Team Password</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                                placeholder="Enter team password (any value for demo)"
                                className="w-full border-slate-300 rounded-lg shadow-sm text-sm py-3 px-4" />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2">
                                <input type="checkbox" className="rounded border-slate-300 text-primary-600" defaultChecked />
                                <span className="text-slate-700">Remember me</span>
                            </label>
                            <a href="#" className="text-primary-600 hover:text-primary-500 font-medium">Forgot password?</a>
                        </div>

                        <button type="submit"
                            className="w-full bg-primary-600 hover:bg-primary-500 text-white font-semibold py-3 px-4 rounded-lg shadow-sm transition-colors text-sm">
                            Sign in to simulation
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-slate-400">
                        Topaz-Sync v2.0 • Business Strategy Simulation Engine
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
