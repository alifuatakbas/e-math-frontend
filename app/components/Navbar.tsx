"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../styles/Navbar.module.css';

interface User {
  full_name: string;
  email: string;
  role?: string; // role özelliğini ekledik
}

// Korumalı Link componenti - admin kontrolü eklendi
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

  // Eğer link admin'e özelse ve kullanıcı admin değilse linki gösterme
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
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Mobil menü için state

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

  // Mobil menü açıkken scroll'u engelle
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
    setIsMenuOpen(false); // Mobil menüyü de kapat
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Mobil menüyü aç/kapa
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Mobil menüyü kapat (link tıklamalarında kullanılacak)
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
      <nav className={styles.navbar}>
        <div className={styles.navContainer}>
          <Link href="/" className={styles.logo}>
            LOGO
          </Link>

          {/* Hamburger Menü */}
          <div
              className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
              onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

         {/* Navigation Links */}
<div className={`${styles.navLinks} ${isMenuOpen ? styles.active : ''}`}>
  <Link href="/" className={styles.navLink} onClick={closeMenu}>
    Ana Sayfa
  </Link>
  <div
    className={styles.navLink}
    onMouseEnter={() => setIsExamMenuOpen(true)}
    onMouseLeave={() => setIsExamMenuOpen(false)}
  >
    Sınavlar
    <div
      className={`${styles.examDropdownMenu} ${isExamMenuOpen ? styles.show : ''}`}
      onMouseEnter={() => setIsExamMenuOpen(true)}
      onMouseLeave={() => setIsExamMenuOpen(false)}
    >
      {/* Admin-only linkler */}
      <ProtectedLink href="/sinav-olustur" adminOnly isAdmin={isAdmin}>
        Sınav Oluştur
      </ProtectedLink>
      <ProtectedLink href="/soru-ekle" adminOnly isAdmin={isAdmin}>
        Soru Ekle
      </ProtectedLink>

      {/* Normal kullanıcı linkleri */}
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

            {/* Auth Buttons - Mobilde menü içinde göster */}
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
  );
}

export default Navbar;