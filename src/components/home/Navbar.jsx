import { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Globe2,
  UserCircle2,
  ChevronDown,
  LogOut,
  Settings,
  Menu,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useLanguage } from '../../context/LanguageContext';
import { useUserProfile } from '../../context/UserProfileContext';
import useAuth from '../../hooks/useAuth';

import logo from '../../assets/images/home/khemet-logo.png';

const navLinks = [
  { labelKey: 'home.nav.home', path: '/home' },
  { labelKey: 'home.nav.collection', path: '/collections' },
  { labelKey: 'home.nav.favorites', path: '/favorites' },
  { labelKey: 'home.nav.scan', path: '/scan' },
  { labelKey: 'home.nav.chat', path: '/chat-ai' },
  { labelKey: 'home.nav.Setting', path: '/settings' },
];

const languages = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'Arabic', short: 'AR' },
  { code: 'fr', label: 'French', short: 'FR' },
  { code: 'de', label: 'German', short: 'DE' },
  { code: 'ru', label: 'Russian', short: 'RU' },
  { code: 'es', label: 'Spanish', short: 'ES' },
  { code: 'zh', label: 'Chinese', short: 'ZH' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { user: profileUser, clearUser } = useUserProfile();
  const { user: authUser, logout, isAuthenticated, isGuest } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isSettingsPage = location.pathname.toLowerCase() === '/settings';

  const currentLanguage =
    languages.find((item) => item.code === language) || languages[0];

  const displayUser =
    isAuthenticated && authUser
      ? { ...profileUser, ...authUser }
      : profileUser;

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLanguageChange = (code) => {
    setLanguage(code);
    setIsLanguageOpen(false);
  };

  const handleProfileClick = () => {
    setIsLanguageOpen(false);

    if (isSettingsPage) {
      return;
    }

    setIsProfileOpen((prev) => !prev);
  };

  const handleOpenSettings = () => {
    setIsProfileOpen(false);
    navigate('/settings');
  };

  const handleLogout = async () => {
    setIsProfileOpen(false);

    await logout();
    clearUser();

    navigate('/welcome');
  };

  return (
    <header className="home-navbar">
      <div className="home-navbar-inner">
        <NavLink to="/home" className="home-logo">
          <img src={logo} alt="Khemet Logo" />
        </NavLink>

        <nav className="home-nav-links desktop-only">
          {navLinks.map((link) => (
            <NavLink key={link.labelKey} to={link.path}>
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="home-nav-actions desktop-only">
          <div className="home-language-menu">
            <button
              className="home-lang-btn"
              type="button"
              onClick={() => {
                setIsProfileOpen(false);
                setIsLanguageOpen((prev) => !prev);
              }}
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

          <div className="home-profile-menu">
            {isAuthenticated || isGuest ? (
              <button
                className="home-profile-btn"
                type="button"
                onClick={handleProfileClick}
                aria-label="Profile menu"
              >
                {displayUser?.avatar ? (
                  <img src={displayUser.avatar} alt={displayUser.name} />
                ) : (
                  <UserCircle2 size={25} />
                )}
              </button>
            ) : (
              <button
                className="home-profile-btn"
                type="button"
                onClick={() => navigate('/sign-in')}
                aria-label="Sign in"
              >
                <UserCircle2 size={25} />
              </button>
            )}

            {isProfileOpen && !isSettingsPage && (
              <div className="home-profile-dropdown">
                <div className="home-profile-dropdown-head">
                  <div className="home-profile-dropdown-avatar">
                    {displayUser?.avatar ? (
                      <img
                        src={displayUser.avatar}
                        alt={displayUser.name}
                      />
                    ) : (
                      <UserCircle2 size={24} />
                    )}
                  </div>

                  <div>
                    <strong>{displayUser?.name}</strong>
                    <span>{displayUser?.email}</span>
                  </div>
                </div>

                <button type="button" onClick={handleOpenSettings}>
                  <Settings size={16} />
                  {t('common.profile')}
                </button>

                <button type="button" onClick={handleLogout}>
                  <LogOut size={16} />
                  {t('common.logout')}
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          className="home-hamburger"
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      <div
        className={`home-mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className={`home-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="home-mobile-menu-header">
          <NavLink to="/home" className="home-logo" onClick={() => setIsMobileMenuOpen(false)}>
            <img src={logo} alt="Khemet Logo" />
          </NavLink>
          <button
            className="home-mobile-close"
            type="button"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={26} />
          </button>
        </div>

        <nav className="home-mobile-nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.labelKey}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>

        <div className="home-mobile-divider" />

        <div className="home-mobile-actions">
          <div className="home-mobile-section-title">{t('common.language') || 'Language'}</div>
          <div className="home-mobile-languages">
            {languages.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`home-mobile-lang-item ${item.code === language ? 'active' : ''}`}
                onClick={() => {
                  handleLanguageChange(item.code);
                }}
              >
                <span>{item.label}</span>
                <strong>{item.short}</strong>
              </button>
            ))}
          </div>

          <div className="home-mobile-divider" />

          {isAuthenticated || isGuest ? (
            <div className="home-mobile-profile-section">
              <div className="home-mobile-profile-info">
                <div className="home-mobile-avatar">
                  {displayUser?.avatar ? (
                    <img src={displayUser.avatar} alt={displayUser.name} />
                  ) : (
                    <UserCircle2 size={36} />
                  )}
                </div>
                <div className="home-mobile-user-details">
                  <strong>{displayUser?.name}</strong>
                  <span>{displayUser?.email}</span>
                </div>
              </div>
              <div className="home-mobile-profile-actions">
                <button type="button" onClick={() => { handleOpenSettings(); setIsMobileMenuOpen(false); }}>
                  <Settings size={18} />
                  {t('common.profile')}
                </button>
                <button type="button" className="logout-btn" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}>
                  <LogOut size={18} />
                  {t('common.logout')}
                </button>
              </div>
            </div>
          ) : (
            <button
              className="home-mobile-signin-btn"
              type="button"
              onClick={() => { navigate('/sign-in'); setIsMobileMenuOpen(false); }}
            >
              <UserCircle2 size={20} />
              {t('auth.signIn') || 'Sign In'}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
