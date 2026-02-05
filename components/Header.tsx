
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Theme } from '../types';

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const location = useLocation();

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'บันทึกข้อมูล', path: '/entry' },
    { name: 'รายงาน', path: '/reports' },
    { name: 'AI Chat', path: '/chat', icon: 'chat_bubble' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm">
      <div className="px-6 lg:px-10 py-4 max-w-[1440px] mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-dark dark:text-primary">
            <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>analytics</span>
          </div>
          <h2 className="text-lg font-bold tracking-tight">AI Financial Analyst</h2>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors flex items-center gap-2 relative ${
                  isActive 
                    ? 'text-primary-dark dark:text-primary font-bold after:content-[""] after:absolute after:-bottom-5 after:left-0 after:w-full after:h-0.5 after:bg-primary' 
                    : 'text-text-main-light/70 dark:text-text-main-dark/70 hover:text-primary-dark dark:hover:text-primary'
                }`}
              >
                {link.icon && <span className="material-symbols-outlined text-[20px]">{link.icon}</span>}
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            className="size-9 flex items-center justify-center rounded-lg bg-secondary dark:bg-white/10 text-text-main-light dark:text-white hover:bg-primary/20 transition-all"
            onClick={onToggleTheme}
          >
            <span className="material-symbols-outlined">{theme === Theme.LIGHT ? 'dark_mode' : 'light_mode'}</span>
          </button>
          <div className="size-9 rounded-full bg-gradient-to-br from-primary to-green-300 dark:to-green-700 overflow-hidden border border-white dark:border-white/20 ml-2">
            <img 
              alt="User" 
              src="https://picsum.photos/100/100?random=1" 
              className="w-full h-full object-cover" 
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
