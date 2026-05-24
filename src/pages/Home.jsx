import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import FeaturesSection from '../components/home/FeaturesSection';
import CTASection from '../components/home/CTASection';
import Footer from '../components/home/Footer';
import '../styles/home.css';

export default function Home() {
  return (
    <main className="home-page">
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}