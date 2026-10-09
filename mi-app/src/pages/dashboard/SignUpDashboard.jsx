import { ArrowRight, Building2, Container, Lock, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const label = 'font-mono font-bold text-xs tracking-[0.05em] uppercase text-[#44474c]';
const input =
  'w-full bg-[#f7fafc] border border-[#c4c6cd] rounded-[2px] pl-[41px] pr-[13px] py-[11px] text-base text-[#181c1e] placeholder:text-[#74777d] focus:outline-none focus:border-[#041627]';

const fields = [
  { name: 'name', label: 'Full name', type: 'text', placeholder: 'Jane Doe', Icon: User, autoComplete: 'name' },
  { name: 'email', label: 'Work email', type: 'email', placeholder: 'jane.doe@company.com', Icon: Mail, autoComplete: 'email' },
  { name: 'company', label: 'Company name', type: 'text', placeholder: 'Global Logistics Co.', Icon: Building2, autoComplete: 'organization' },
  { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••', Icon: Lock, autoComplete: 'new-password' },
];

// Solo maqueta: el envío del formulario navega al dashboard (sin registro real por ahora).
export default function SignUpDashboard() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex items-center justify-center px-4 py-12 font-sans">
      <main className="relative w-full max-w-[448px] bg-white border border-[#c4c6cd] rounded-[4px] overflow-hidden shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-[#041627]" />
        <div className="p-8 flex flex-col items-center">
          <div className="pb-4 flex flex-col items-center">
            <div className="bg-[#041627] rounded-[2px] w-12 py-2 flex items-center justify-center">
              <Container className="size-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-2xl font-bold text-[#041627] tracking-[-0.025em] leading-8">NextDocker</span>
          </div>
          <h1 className="pb-2 text-xl font-semibold text-[#181c1e] leading-7">Create Account</h1>
          <p className="pb-8 text-sm text-[#44474c]">Register a new administrator node.</p>

          <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label htmlFor={`signup-${field.name}`} className={label}>{field.label}</label>
                <div className="relative">
                  <field.Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#44474c] pointer-events-none" aria-hidden="true" />
                  <input
                    id={`signup-${field.name}`}
                    type={field.type}
                    placeholder={field.placeholder}
                    autoComplete={field.autoComplete}
                    className={input}
                  />
                </div>
              </div>
            ))}

            <label className="pt-2 flex items-start gap-2 text-sm text-[#44474c] cursor-pointer">
              <input
                type="checkbox"
                className="mt-[2px] size-4 rounded-[2px] border border-[#c4c6cd] accent-[#041627]"
              />
              <span>
                I agree to the <span className="text-[#041627]">Terms of Service</span> and{' '}
                <span className="text-[#041627]">Privacy Policy</span>.
              </span>
            </label>

            <button
              type="submit"
              className="mt-4 bg-brand-orange hover:brightness-95 transition rounded-[2px] px-4 py-3 flex items-center justify-center gap-2 text-base font-bold text-[#181c1e]"
            >
              Create Admin Account
              <ArrowRight className="size-4" aria-hidden="true" />
            </button>
          </form>

          <div className="mt-8 w-full border-t border-[#c4c6cd] pt-[17px] text-center text-sm text-[#44474c]">
            Already have an account?{' '}
            <Link to="/dashboard/login" className="text-[#041627] hover:underline">Sign In</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
