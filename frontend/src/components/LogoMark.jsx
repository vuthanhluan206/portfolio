import logo from '../assets/vtl-logo.png';

export default function LogoMark({ className = '' }) {
  return <img className={`logo-mark ${className}`} src={logo} alt="VTL logo" />;
}
