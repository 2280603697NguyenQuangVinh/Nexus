import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { auth } from '../../firebaseClient';
import { authorizedFetch } from '../../authorizedFetch';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
} from 'firebase/auth';

// NEXUS Logo Component
function NexusLogo() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-6xl font-bold text-black mb-2">
                <span className="inline-block transform -skew-x-12 bg-black text-white px-2">N</span>
            </div>
            <div className="text-2xl font-bold text-black tracking-wider">NEXUS</div>
        </div>
    );
}

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const cred = await signInWithEmailAndPassword(auth, email, password);
            const res = await authorizedFetch('http://localhost:3000/auth/me');
            const data = await res.json();
            const token = await cred.user.getIdToken();
            login(data.user, token);
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error);
            alert('Login failed');
        }
    };

    const handleSocialLogin = async (providerType: 'google' | 'facebook') => {
        try {
            const provider =
                providerType === 'google'
                    ? new GoogleAuthProvider()
                    : new FacebookAuthProvider();

            const cred = await signInWithPopup(auth, provider);
            const res = await authorizedFetch('http://localhost:3000/auth/me');
            const data = await res.json();
            const token = await cred.user.getIdToken();
            login(data.user, token);
            navigate('/');
        } catch (error) {
            console.error('Social login failed:', error);
            alert('Social login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {/* Auth card 780x600 */}
            <div className="w-[780px] h-[600px] bg-white flex border border-black shadow-sm">
                {/* Left side - Form */}
                <div className="w-1/2 flex items-center justify-center px-10">
                    <div className="w-full">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-black mb-2">Sign In</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Email address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-black"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-black pr-12"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-600"
                                >
                                    {showPassword ? 'Hide' : 'Hide'}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember-me"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 border-2 border-black rounded focus:ring-0"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-black">
                                    Remember me
                                </label>
                            </div>
                            <Link
                                to="#"
                                className="text-sm text-black underline hover:no-underline"
                            >
                                Forgot your password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black font-medium py-3 rounded-lg transition-colors"
                        >
                            Login
                        </button>
                    </form>

                    <div className="mt-6">
                        <p className="text-sm text-black">
                            Don't have account?{' '}
                            <Link
                                to="/auth/register"
                                className="underline hover:no-underline font-medium"
                            >
                                Sign up
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-8">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* Social buttons */}
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="w-full border-2 border-black text-black py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            className="w-full border-2 border-black text-black py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>
                    </div>
                </div>

                {/* Right side - Logo */}
                <div className="w-1/2 flex items-center justify-center">
                    <NexusLogo />
                </div>
            </div>
        </div>
    );
}

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }
        
        if (!agreeToTerms) {
            alert('Please agree to the Terms of use and Privacy Policy');
            return;
        }

        try {
            const username = `${firstName} ${lastName}`.trim();
            const cred = await createUserWithEmailAndPassword(auth, email, password);

            if (username) {
                await updateProfile(cred.user, { displayName: username });
            }

            const res = await authorizedFetch('http://localhost:3000/auth/me');
            const data = await res.json();
            const token = await cred.user.getIdToken();
            login(data.user, token);
            navigate('/');
        } catch (error) {
            console.error('Registration failed:', error);
            alert('Registration failed');
        }
    };

    const handleSocialLogin = async (providerType: 'google' | 'facebook') => {
        try {
            const provider =
                providerType === 'google'
                    ? new GoogleAuthProvider()
                    : new FacebookAuthProvider();

            const cred = await signInWithPopup(auth, provider);
            const res = await authorizedFetch('http://localhost:3000/auth/me');
            const data = await res.json();
            const token = await cred.user.getIdToken();
            login(data.user, token);
            navigate('/');
        } catch (error) {
            console.error('Social login failed:', error);
            alert('Social login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            {/* Auth card 780x600 */}
            <div className="w-[780px] h-[600px] bg-white flex border border-black shadow-sm">
                {/* Left side - Form */}
                <div className="w-1/2 flex items-center justify-center px-10">
                    <div className="w-full">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-black mb-2">Create an account</h1>
                        <p className="text-sm text-black">
                            Already have an accout?{' '}
                            <Link
                                to="/auth/login"
                                className="underline hover:no-underline font-medium"
                            >
                                Log in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Firstname
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Lastname
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-2">
                                What's your email?
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-black"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-black rounded-lg focus:outline-none focus:border-black"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input
                                type="checkbox"
                                id="agree-terms"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                className="w-4 h-4 mt-0.5 border-2 border-black rounded focus:ring-0"
                                required
                            />
                            <label htmlFor="agree-terms" className="ml-2 text-sm text-black">
                                By creating an account, I agree to our{' '}
                                <Link to="#" className="underline hover:no-underline">
                                    Terms of use
                                </Link>{' '}
                                and{' '}
                                <Link to="#" className="underline hover:no-underline">
                                    Privacy Policy
                                </Link>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-black font-medium py-3 rounded-lg transition-colors"
                        >
                            Create an account
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-8">
                        <div className="flex-1 h-px bg-gray-300" />
                        <span className="px-4 text-gray-500 text-sm font-medium">OR</span>
                        <div className="flex-1 h-px bg-gray-300" />
                    </div>

                    {/* Social buttons */}
                    <div className="space-y-4">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('google')}
                            className="w-full border-2 border-black text-black py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>
                        
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('facebook')}
                            className="w-full border-2 border-black text-black py-3 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>
                    </div>
                </div>

                {/* Right side - Logo */}
                <div className="w-1/2 flex items-center justify-center">
                    <NexusLogo />
                </div>
             </div>
        </div>
    );
}

export default function AuthApp() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
        </Routes>
    );
}