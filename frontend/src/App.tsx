import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import DecisionForm from './pages/DecisionForm';
import Intelligence from './pages/Intelligence';
import AdminControl from './pages/AdminControl';
import TeamManagement from './pages/TeamManagement';
import AdminSetup from './pages/AdminSetup';
import MarketIntelligence from './pages/MarketIntelligence';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-navy-900 text-slate-100 font-sans">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/decisions" element={<DecisionForm />} />
          <Route path="/intelligence" element={<Intelligence />} />
          <Route path="/reports" element={<Navigate to="/intelligence" replace />} />
          <Route path="/leaderboard" element={<Navigate to="/intelligence" replace />} />
          <Route path="/market" element={<MarketIntelligence />} />
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
