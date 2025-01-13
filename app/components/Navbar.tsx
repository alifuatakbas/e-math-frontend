// components/Navbar.tsx
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Navbar.module.css';

interface User {
  full_name: string;
  email: string;
}

const Navbar: React.FC = () => {
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(false); // Sınavlar menüsü için durum
  const [currentUser, setCurrentUser] = useState<User | null>(null); // Kullanıcı bilgilerini tutacak state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Kullanıcı menüsü durumu

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
    setIsDropdownOpen(false); // Çıkış yapıldığında menüyü kapat
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Menü açma/kapama
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
                <Link href="/sinav-olustur" className={styles.examDropdownLink}>
                  Sınav Oluştur
                </Link>
                <Link href="/soru-ekle" className={styles.examDropdownLink}>
                  Soru Ekle
                </Link>
                <Link href="/sinav-coz" className={styles.examDropdownLink}>
                  Sınav Çöz
                </Link>
                <Link href="/sinav-sonuclari" className={styles.examDropdownLink}>
                  Sınav Sonuçlarına Bak
                </Link>
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
