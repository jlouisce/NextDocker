import { Container, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import authBg from '../../assets/figma/auth-bg.jpg';

const label = 'font-mono font-bold text-xs tracking-[0.05em] uppercase';
const input =
  'w-full bg-[#f7fafc] border border-[#c4c6cd] rounded-[2px] pl-[41px] pr-[13px] py-[15px] text-base text-[#181c1e] placeholder:text-[#c4c6cd] focus:outline-none focus:border-[#041627]';

// Solo maqueta: el envío del formulario navega al dashboard (sin autenticación por ahora).
export default function LoginDashboard() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-screen bg-[#041627] flex items-center justify-center px-4 py-12 font-sans overflow-hidden">
      <img src={authBg} alt="" className="absolute inset-0 size-full object-cover mix-blend-multiply opacity-20" />
      <div className="absolute inset-0 bg-[#041627] opacity-90" />

      <main className="relative w-full max-w-[440px] flex flex-col gap-8">
        <div className="bg-[#f7fafc] border border-[#c4c6cd] rounded-[2px] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
          <div className="border-b border-[#ebeef0] px-8 pt-8 pb-[25px] flex flex-col items-center gap-2">
            <div className="bg-[#041627] rounded-[2px] w-12 py-2 flex items-center justify-center">
              <Container className="size-5 text-white" aria-hidden="true" />
            </div>
            <h1 className="pt-2 text-2xl font-semibold text-[#041627] tracking-[-0.025em] leading-8">NextDocker</h1>
            <p className="text-sm text-[#44474c]">Secure Admin Access</p>
          </div>

          <form className="p-8 flex flex-col gap-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <label htmlFor="login-email" className={`${label} text-[#44474c]`}>Email address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#44474c] pointer-events-none" aria-hidden="true" />
                <input
                  id="login-email"
                  type="email"
                  placeholder="admin@nextdocker.com"
                  autoComplete="email"
                  className={input}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pb-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className={`${label} text-[#44474c]`}>Password</label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#44474c] pointer-events-none" aria-hidden="true" />
                <input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={input}
                />
              </div>
            </div>

            <button
              type="submit"
              className={`${label} bg-[#e1c29b] hover:brightness-95 transition text-[#211200] rounded-[2px] border border-transparent px-[17px] py-[13px] drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)]`}
            >
              Sign in
            </button>
          </form>

          <div className="bg-white border-t border-[#ebeef0] px-8 pt-[17px] pb-4 text-center text-sm text-[#44474c]">
            New administrator?{' '}
            <Link to="/dashboard/signup" className={`${label} text-[#041627] hover:underline`}>Register fleet</Link>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 opacity-80">
          <span className="size-2 rounded-full bg-[#10b981]" />
          <span className={`${label} text-[#d8e3fa]`}>Global network online</span>
        </div>
      </main>
    </div>
  );
}
