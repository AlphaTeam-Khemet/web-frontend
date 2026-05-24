import khemetLogo from '../../assets/logo/khemet-logo.png';

export default function SplashContent({ onEnter }) {
  return (
    <section className="splash-content">
      <img
        src={khemetLogo}
        alt="KHEMET"
        className="splash-logo"
      />

      <p className="splash-subtitle">
        Your smart journey through ancient Egypt begins here
      </p>

      <button className="splash-button" onClick={onEnter}>
        Enter Experience
        <span>→</span>
      </button>
    </section>
  );
}