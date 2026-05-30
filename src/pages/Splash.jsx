import { useNavigate } from 'react-router-dom';
import SplashContent from '../components/splash/SplashContent';
import splashVideo from '../assets/videos/splash-bg.mp4';
import '../styles/splash.css';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <main className="splash-page">
      <video
        className="splash-video"
        src={splashVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="splash-overlay" />
      <div className="splash-glow" />

     <SplashContent onEnter={() => navigate('/welcome')} />
    </main>
  );
}