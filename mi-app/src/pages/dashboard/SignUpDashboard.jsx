import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Anchor, ArrowLeft, Building2, Lock, Mail, User } from 'lucide-react';
import { getSession, registerUser } from '../../utils/auth';

export default function SignUpDashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getSession()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (!data.password || data.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    const result = await registerUser(data);
    setLoading(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col justify-center px-4 py-12 font-sans text-[#041627]">
      <div className="max-w-md w-full mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase text-slate-600 hover:text-[#041627] mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Main Portal
        </Link>

        <div className="bg-white border border-[#c4c6cd] rounded-lg shadow-sm overflow-hidden">
          <div className="bg-[#041627] text-white px-6 py-5 flex items-center gap-3">
            <Anchor className="w-6 h-6 text-brand-orange" />
            <div>
              <h1 className="text-lg font-bold tracking-tight">Create Operator Account</h1>
              <p className="text-xs font-mono text-slate-300">NextDocker Cloud Fleet Access</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Andres Silva"
                  className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                Work Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="operator@company.com"
                  className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                Company Name
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  name="company"
                  placeholder="Pacific Maritime Logistics"
                  className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-brand-orange hover:brightness-95 disabled:opacity-60 text-[#181c1e] font-mono font-bold text-xs uppercase py-3 rounded transition cursor-pointer"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <p className="text-xs text-center text-slate-600 pt-2 border-t border-slate-100">
              Already registered?{' '}
              <Link to="/dashboard/login" className="font-bold text-[#041627] hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}