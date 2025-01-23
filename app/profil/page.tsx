"use client";
import React, { useEffect, useState } from 'react';
import styles from '../styles/Profile.module.css';
import { FiUser, FiMail, FiBook, FiBookOpen } from 'react-icons/fi';

interface UserProfile {
  full_name: string;
  email: string;
  school_name: string;
  branch: string;
  role: string;
}

const Profile = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Profil bilgileri alınamadı:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  if (!user) {
    return <div className={styles.error}>Kullanıcı bilgileri bulunamadı.</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.profileCard}>
        <div className={styles.header}>
          <div className={styles.avatar}>
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <h1>{user.full_name}</h1>
          <span className={styles.role}>{user.role === 'admin' ? 'Yönetici' : 'Öğrenci'}</span>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <FiMail className={styles.icon} />
            <div className={styles.infoContent}>
              <label>E-posta</label>
              <span>{user.email}</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <FiBook className={styles.icon} />
            <div className={styles.infoContent}>
              <label>Okul</label>
              <span>{user.school_name || 'Belirtilmemiş'}</span>
            </div>
          </div>

          <div className={styles.infoItem}>
            <FiBookOpen className={styles.icon} />
            <div className={styles.infoContent}>
              <label>Branş</label>
              <span>{user.branch || 'Belirtilmemiş'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;