import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: '1rem', display: 'flex', gap: '1rem', background: '#222', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff' }}>Inicio</Link>
      <Link to="/marketplace" style={{ color: '#fff' }}>Marketplace</Link>
      <Link to="/login" style={{ color: '#fff' }}>Ingresar</Link>
      <Link to="/signup" style={{ color: '#fff' }}>Registro</Link>
      <Link to="/perfil" style={{ color: '#fff' }}>Perfil</Link>
    </nav>
  );
}