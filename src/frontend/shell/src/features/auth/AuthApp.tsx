import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useAuthStore } from '@/store/auth.store';
import { auth } from '@/lib/firebase';
import { authorizedFetch } from '@/lib/authorizedFetch';
import nexusLogo from '@/assets/images/logo.png';
import './AuthApp.css';

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <section className="auth-shell">
        <div className="auth-form-wrap">{children}</div>

        <aside className="auth-brand" aria-hidden="true">
          <img src={nexusLogo} alt="Nexus Logo" className="auth-brand-logo" />
        </aside>
      </section>
    </main>
  );
}

function Divider() {
  return (
    <div className="auth-divider" aria-hidden="true">
      <span>OR</span>
    </div>
  );
}

function SocialButtons() {
  return (
    <div className="auth-social-list">
      <button type="button" className="auth-social-btn">
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt="Google"
          className="auth-social-icon"
        />
        Continue with Google
      </button>

      <button type="button" className="auth-social-btn">
        <svg className="auth-social-icon auth-social-icon-facebook" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        Continue with Facebook
      </button>
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
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed');
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth-title">Sign In</h1>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="login-email" className="auth-label">
            Email address
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor="login-password" className="auth-label">
              Password
            </label>

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="auth-inline-link"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
          />
        </div>

        <div className="auth-options-row">
          <label className="auth-checkbox-row">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="auth-checkbox"
            />
            Remember me
          </label>

          <button type="button" className="auth-inline-link">
            Forgot your password?
          </button>
        </div>

        <button type="submit" className="auth-primary-btn">
          Login
        </button>

        <p className="auth-helper-text">
          Don&apos;t have account?{' '}
          <Link to="/auth/register" className="auth-inline-link">
            Sign up
          </Link>
        </p>
      </form>

      <Divider />
      <SocialButtons />
    </AuthLayout>
  );
}

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      if (fullName) {
        await updateProfile(cred.user, { displayName: fullName });
      }

      const res = await authorizedFetch('http://localhost:3000/auth/me');
      const data = await res.json();
      const token = await cred.user.getIdToken();

      login(data.user, token);
      navigate('/');
    } catch (err) {
      console.error('Registration failed:', err);
      alert('Registration failed');
    }
  };

  return (
    <AuthLayout>
      <h1 className="auth-title auth-title-register">Create an account</h1>
      <p className="auth-helper-text auth-helper-text-top">
        Already have an account?{' '}
        <Link to="/auth/login" className="auth-inline-link">
          Log in
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-grid-two-cols">
          <div className="auth-field">
            <label htmlFor="register-first-name" className="auth-label">
              Firstname
            </label>
            <input
              id="register-first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-last-name" className="auth-label">
              Lastname
            </label>
            <input
              id="register-last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="auth-input"
              required
            />
          </div>
        </div>

        <div className="auth-field">
          <label htmlFor="register-email" className="auth-label">
            What&apos;s your email?
          </label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
          />
        </div>

        <div className="auth-grid-two-cols">
          <div className="auth-field">
            <label htmlFor="register-password" className="auth-label">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>

          <div className="auth-field">
            <label htmlFor="register-confirm-password" className="auth-label">
              Confirm Password
            </label>
            <input
              id="register-confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="auth-input"
              required
            />
          </div>
        </div>

        <label className="auth-checkbox-row auth-terms-row">
          <input
            type="checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="auth-checkbox"
            required
          />

          <span>
            By creating an account, I agree to our <span className="auth-inline-link">Terms of use</span> and{' '}
            <span className="auth-inline-link">Privacy Policy</span>
          </span>
        </label>

        <button type="submit" className="auth-primary-btn auth-primary-btn-register">
          Create an account
        </button>
      </form>

      <Divider />
      <SocialButtons />
    </AuthLayout>
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
