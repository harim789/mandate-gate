import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MandatesProvider } from './context/MandatesContext';
import Landing from './pages/Landing';
import Simulator from './pages/Simulator';
import RequestLedger from './pages/RequestLedger';
import RequestDetail from './pages/RequestDetail';
import Approvals from './pages/Approvals';
import MandatesList from './pages/MandatesList';
import MandateDetail from './pages/MandateDetail';
import AuditLog from './pages/AuditLog';

function Placeholder({ label }) {
  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-[var(--muted)]">
      {label} — 변환 예정
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MandatesProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/demo" element={<Simulator />} />
          <Route path="/requests" element={<RequestLedger />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/approvals" element={<Approvals />} />
          <Route path="/mandates" element={<MandatesList />} />
          <Route path="/mandates/new" element={<Placeholder label="위임장 발급" />} />
          <Route path="/mandates/:id" element={<MandateDetail />} />
          <Route path="/audit" element={<AuditLog />} />
        </Routes>
      </MandatesProvider>
    </BrowserRouter>
  );
}

export default App;
