"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/Navbar.module.css';

interface User {
  full_name: string;
  email: string;
}

// Korumalı Link componenti
const ProtectedLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      router.push(href);
    }
  };

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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData: User = await response.json();
          setCurrentUser(userData);
        } else {
          localStorage.removeItem('token');
        }
      }
    };

    fetchCurrentUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          LOGO
        </Link>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink}>
            Ana Sayfa
          </Link>
          <div
            className={styles.navLink}
            onMouseEnter={() => setIsExamMenuOpen(true)}
            onMouseLeave={() => setIsExamMenuOpen(false)}
          >
            Sınavlar
            {isExamMenuOpen && (
              <div
                className={`${styles.examDropdownMenu} ${isExamMenuOpen ? styles.show : ''}`}
                onMouseEnter={() => setIsExamMenuOpen(true)}
                onMouseLeave={() => setIsExamMenuOpen(false)}
              >
                <ProtectedLink href="/sinav-olustur">
                  Sınav Oluştur
                </ProtectedLink>
                <ProtectedLink href="/soru-ekle">
                  Soru Ekle
                </ProtectedLink>
                <ProtectedLink href="/sinav-coz">
                  Sınav Çöz
                </ProtectedLink>
                <ProtectedLink href="/sinav-sonuclari">
                  Sınav Sonuçlarına Bak
                </ProtectedLink>
              </div>
            )}
          </div>
          <Link href="/hakkimizda" className={styles.navLink}>
            Hakkımızda
          </Link>
          <Link href="/iletisim" className={styles.navLink}>
            İletişim
          </Link>
          <button className={styles.ctaButton}>Başvuru</button>
        </div>

        <div className={styles.authButtons}>
          {currentUser ? (
            <>
              <span className={styles.userName} onClick={toggleDropdown}>
                {currentUser.full_name}
              </span>
              {isDropdownOpen && (
                <div className={`${styles.userDropdownMenu} ${isDropdownOpen ? styles.show : ''}`}>
                  <Link href="/profil" className={styles.userDropdownLink}>
                    Profil
                  </Link>
                  <Link href="/settings" className={styles.userDropdownLink}>
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
              <Link href="/login" className={styles.loginButton}>
                Giriş
              </Link>
              <Link href="/register" className={styles.signupButton}>
                Kaydol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;