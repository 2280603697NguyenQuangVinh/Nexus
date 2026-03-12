import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import AuthApp from '@/features/auth/AuthApp';
import ChatLayout from '@/features/chat/ChatLayout';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth/*" element={<AuthApp />} />
        <Route
          path="/*"
          element={isAuthenticated ? <ChatLayout /> : <Navigate to="/auth/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
