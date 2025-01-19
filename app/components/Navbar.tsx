"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/Navbar.module.css';

interface User {
  full_name: string;
  email: string;
  role?: string;
}

const ProtectedLink: React.FC<{
  href: string;
  children: React.ReactNode;
  adminOnly?: boolean;
  isAdmin?: boolean;
}> = ({ href, children, adminOnly, isAdmin }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    if (adminOnly && !isAdmin) {
      alert('Bu sayfaya erişim yetkiniz yok');
      return;
    }

    router.push(href);
  };

  if (adminOnly && !isAdmin) {
    return null;
  }

  return (
    <Link href={href} onClick={handleClick} className={styles.examDropdownLink}>
      {children}
    </Link>
  );
};

const Navbar: React.FC = () => {
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      return savedTheme === 'dark';
    }
    return false; // varsayılan olarak light mode
  });

  // Tema yönetimi için useEffect
  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      document.documentElement.classList.toggle('dark-theme', isDark);
      document.body.style.backgroundColor = isDark ? '#0F172A' : '#F8FAFC';
    } else {
      // Eğer tema kaydedilmemişse varsayılan olarak light mode kullan
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#F8FAFC';
    }

    // Tema değişikliklerini dinle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        const newTheme = e.newValue;
        const isDark = newTheme === 'dark';
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark-theme', isDark);
        document.body.style.backgroundColor = isDark ? '#0F172A' : '#F8FAFC';
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Sadece component mount olduğunda çalışsın

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark-theme', isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? '#0F172A' : '#F8FAFC';
  }, [isDarkMode]);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (response.ok) {
            const userData: User = await response.json();
            setCurrentUser(userData);
            setIsAdmin(userData.role === 'admin');
          } else {
            localStorage.removeItem('token');
          }
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
          localStorage.removeItem('token');
        }
      }
    };

    fetchCurrentUser();
  }, []);
    useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsAdmin(false);
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsExamMenuOpen(false);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsExamMenuOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className={`${styles.navbar} ${isDarkMode ? styles.darkMode : ''}`}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            LOGO
          </Link>

          <div
            className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

          <div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
            <Link href="/" className={styles.navLink} onClick={closeMenu}>
              Ana Sayfa
            </Link>

            <div
              className={styles.navLink}
              onMouseEnter={() => window.innerWidth > 768 && setIsExamMenuOpen(true)}
              onMouseLeave={() => window.innerWidth > 768 && setIsExamMenuOpen(false)}
              onClick={() => window.innerWidth <= 768 && setIsExamMenuOpen(!isExamMenuOpen)}
            >
              Sınavlar
              <div
                className={`${styles.examDropdownMenu} ${isExamMenuOpen ? styles.show : ''}`}
                onMouseEnter={() => window.innerWidth > 768 && setIsExamMenuOpen(true)}
                onMouseLeave={() => window.innerWidth > 768 && setIsExamMenuOpen(false)}
              >
                <ProtectedLink href="/sinav-olustur" adminOnly isAdmin={isAdmin}>
                  Sınav Oluştur
                </ProtectedLink>
                <ProtectedLink href="/soru-ekle" adminOnly isAdmin={isAdmin}>
                  Soru Ekle
                </ProtectedLink>
                <ProtectedLink href="/sinav-coz">
                  Sınav Çöz
                </ProtectedLink>
                <ProtectedLink href="/sinav-sonuclari">
                  Sınav Sonuçlarına Bak
                </ProtectedLink>
              </div>
            </div>

            <Link href="/hakkimizda" className={styles.navLink} onClick={closeMenu}>
              Hakkımızda
            </Link>
            <Link href="/iletisim" className={styles.navLink} onClick={closeMenu}>
              İletişim
            </Link>
            <button className={styles.ctaButton} onClick={closeMenu}>
              Başvuru
            </button>

            <div className={styles.authButtons}>
              {currentUser ? (
                <>
                  <span className={styles.userName} onClick={toggleDropdown}>
                    {currentUser.full_name} {isAdmin && '(Admin)'}
                  </span>
                  {isDropdownOpen && (
                    <div className={`${styles.userDropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                      <Link href="/profil" className={styles.userDropdownLink} onClick={closeMenu}>
                        Profil
                      </Link>
                      {isAdmin && (
                        <Link href="/admin-panel" className={styles.userDropdownLink} onClick={closeMenu}>
                          Admin Panel
                        </Link>
                      )}
                      <Link href="/settings" className={styles.userDropdownLink} onClick={closeMenu}>
                        Ayarlar
                      </Link>
                      <button onClick={handleLogout} className={styles.logoutButton}>
                        Çıkış
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <Link href="/login" className={styles.loginButton} onClick={closeMenu}>
                    Giriş
                  </Link>
                  <Link href="/register" className={styles.signupButton} onClick={closeMenu}>
                    Kaydol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.active : ''}`}
        onClick={closeMenu}
      />
    </>
  );
}

export default Navbar;