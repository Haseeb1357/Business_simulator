import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DecisionForm from './pages/DecisionForm';
import Reports from './pages/Reports';
import Leaderboard from './pages/Leaderboard';
import AdminControl from './pages/AdminControl';
import TeamManagement from './pages/TeamManagement';
import AdminSetup from './pages/AdminSetup';
import MarketIntelligence from './pages/MarketIntelligence';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/decisions" element={<DecisionForm />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/intelligence" element={<MarketIntelligence />} />
          <Route path="/admin/teams" element={<TeamManagement />} />
          <Route path="/admin/setup" element={<AdminSetup />} />
          <Route path="/admin/control" element={<AdminControl />} />
          <Route path="/*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
