import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import AuthApp from '@/apps/auth-app/AuthApp';
import MainLayout from '@/apps/main-layout/MainLayout';

function App() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/auth/*" element={<AuthApp />} />
                <Route
                    path="/*"
                    element={isAuthenticated ? <MainLayout /> : <Navigate to="/auth/login" />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
