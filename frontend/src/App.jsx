import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';

// Placeholder pages
const Stations = () => <div className="text-xl">Stations Management</div>;
const Analytics = () => <div className="text-xl">Analytics & Reports</div>;
const Settings = () => <div className="text-xl">System Settings</div>;
const Login = () => <div className="flex h-screen items-center justify-center">Login Page Placeholder</div>;

const ProtectedRoute = ({ children }) => {
  // Mocking auth for development if token exists or simple bypass for MVP visual check
  // In real app, check state.auth.isAuthenticated
  const { isAuthenticated } = useSelector((state) => state.auth);
  
  // For development/demo without backend running, we might want to bypass
  // return isAuthenticated ? children : <Navigate to="/login" />;
  
  // Temporary: Always allow for visual testing of dashboard
  return children; 
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="stations" element={<Stations />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;