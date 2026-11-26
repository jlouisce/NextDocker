import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Anchor, ArrowLeft, Lock, Mail } from 'lucide-react';
import { getSession, loginUser } from '../../utils/auth';

export default function LoginDashboard() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (getSession()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const result = await loginUser(data.get('email'), data.get('password'));
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
              <h1 className="text-lg font-bold tracking-tight">NextDocker Operations</h1>
              <p className="text-xs font-mono text-slate-300">Fleet Administrator Sign In</p>
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
                Work Email
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
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className="w-full bg-[#f7fafc] border border-[#c4c6cd] rounded pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#041627]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-brand-orange hover:brightness-95 disabled:opacity-60 text-[#181c1e] font-mono font-bold text-xs uppercase py-3 rounded transition cursor-pointer"
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>

            <p className="text-xs text-center text-slate-600 pt-2 border-t border-slate-100">
              Don&apos;t have an account?{' '}
              <Link to="/dashboard/signup" className="font-bold text-[#041627] hover:underline">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}