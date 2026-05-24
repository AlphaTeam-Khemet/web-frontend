import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Globe2, UserCircle2, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/images/home/khemet-logo.png';

const navLinks = [
  { labelKey: 'home.nav.home', path: '/home' },
  { labelKey: 'home.nav.collection', path: '/collections' },
  { labelKey: 'home.nav.scan', path: '/scan' },
  { labelKey: 'home.nav.translate', path: '/translate' },
  { labelKey: 'home.nav.gallery', path: '/media-gallery' },

];

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'de', label: 'Deutsch', short: 'DE' },
  { code: 'es', label: 'Español', short: 'ES' },
  { code: 'zh', label: '中文', short: 'ZH' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);

  const currentLanguage =
    languages.find((item) => item.code === language) || languages[0];

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsLanguageOpen(false);
  };

  return (
    <header className="home-navbar">
      <div className="home-navbar-inner">
        <NavLink to="/home" className="home-logo">
          <img src={logo} alt="Khemet Logo" />
        </NavLink>

        <nav className="home-nav-links">
          {navLinks.map((link) => (
            <NavLink key={link.labelKey} to={link.path}>
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="home-nav-actions">
          <div className="home-language-menu">
            <button
              className="home-lang-btn"
              type="button"
              onClick={() => setIsLanguageOpen((prev) => !prev)}
            >
              <Globe2 size={18} />
              {currentLanguage.short}
              <ChevronDown size={15} />
            </button>

            {isLanguageOpen && (
              <div className="home-language-dropdown">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    className={item.code === language ? 'active' : ''}
                    onClick={() => handleLanguageChange(item.code)}
                  >
                    <span>{item.label}</span>
                    <strong>{item.short}</strong>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button className="home-profile-btn" type="button">
            <UserCircle2 size={25} />
          </button>
        </div>
      </div>
    </header>
  );
}