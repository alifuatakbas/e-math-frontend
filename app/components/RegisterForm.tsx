"use client"
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../styles/Register.module.css';
import { FiSun, FiMoon } from 'react-icons/fi';

const Register: React.FC = () => {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    school_name: '',
    branch: '',
    parent_name: '',  // Eklendi
    phone: ''
  });
  const [error, setError] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
   const theme = localStorage.getItem('theme');
  const isDark = theme === 'dark';
  setDarkMode(isDark);

  // Tema durumunu HTML'e yansıt
  if (isDark) {
    document.documentElement.classList.add('dark-theme');
    document.body.style.backgroundColor = '#0F172A';
  } else {
    document.documentElement.classList.remove('dark-theme');
    document.body.style.backgroundColor = '#F8FAFC';
  }
}, []);

const toggleTheme = () => {
  setDarkMode(!darkMode);
  document.documentElement.classList.toggle('dark-theme');
  document.body.style.backgroundColor = darkMode ? '#F8FAFC' : '#0F172A';
  // Tema tercihini localStorage'a kaydet
  localStorage.setItem('theme', darkMode ? 'light' : 'dark');
};
// Password validation
const validatePassword = (password: string) => {
  if (password.length < 8) {
    return 'Şifre en az 8 karakter olmalıdır.';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Şifre en az bir büyük harf içermelidir.';
  }
  if (!/[a-z]/.test(password)) {
    return 'Şifre en az bir küçük harf içermelidir.';
  }
  if (!/[0-9]/.test(password)) {
    return 'Şifre en az bir rakam içermelidir.';
  }
  return '';
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};
const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone);
};
const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Yükleme başladı
    setError('');
    setMessage('');
      // Telefon numarası doğrulama
    if (!validatePhone(formData.phone)) {
        setError('Lütfen geçerli bir telefon numarası giriniz');
        setIsLoading(false);
        return;
    }
     const passwordError = validatePassword(formData.password);
    if (passwordError) {
        setError(passwordError);
        setIsLoading(false);
        return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          'Kayıt başarılı! Lütfen email adresinize gönderilen doğrulama linkine tıklayın. ' +
          'Spam klasörünü kontrol etmeyi unutmayın.'
        );

        // Form alanlarını temizle
        setFormData({
    email: '',
    password: '',
    full_name: '',
    school_name: '',
    branch: '',
    parent_name: '',  // Eklendi
    phone: ''
        });
      } else {
        if (data.detail === "Email adresi zaten kayıtlı") {
          setError('Bu email adresi zaten kullanılıyor. Lütfen başka bir email adresi deneyin.');
        } else {
          setError(data.detail?.[0]?.msg || data.detail || 'Kayıt başarısız.');
        }
      }
    } catch (error) {
      setError('Bir hata oluştu, lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false); // Yükleme bitti
    }
};

  return (
    <div className={styles.registerContainer}>
      <button
        onClick={toggleTheme}
        className={`${styles.themeToggle} ${darkMode ? styles.darkThemeToggle : ''}`}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun className={styles.themeIcon} /> : <FiMoon className={styles.themeIcon} />}
      </button>

      <div className={styles.registerBox}>
        <h2 className={styles.title}>Kayıt Ol</h2>
        <form onSubmit={handleRegister} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email:</label>
            <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="ornek@email.com"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="full_name">Ad Soyad:</label>
            <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Ad Soyad giriniz"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="school_name">Okul Adı:</label>
            <input
                type="text"
                id="school_name"
                name="school_name"
                value={formData.school_name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Okul adını giriniz"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="branch">Sınıf:</label>
            <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                required
                className={styles.input}
            >
              <option value="">Sınıfınızı seçin</option>
              <option value="2. Sınıf">5. Sınıf</option>
              <option value="3. Sınıf">5. Sınıf</option>
              <option value="4. Sınıf">5. Sınıf</option>
              <option value="5. Sınıf">5. Sınıf</option>
              <option value="6. Sınıf">6. Sınıf</option>
              <option value="7. Sınıf">7. Sınıf</option>
              <option value="8. Sınıf">8. Sınıf</option>
              <option value="9. Sınıf">9. Sınıf</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Şifre:</label>
            <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="••••••••"
            />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="parent_name">Veli Adı Soyadı:</label>
            <input
                type="text"
                id="parent_name"
                name="parent_name"
                value={formData.parent_name}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="Veli adı soyadı giriniz"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="phone">Telefon Numarası:</label>
            <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className={styles.input}
                placeholder="05XX XXX XX XX"
                pattern="[0-9]{10,11}"  // Telefon numarası formatı
                title="Lütfen geçerli bir telefon numarası giriniz"
            />
          </div>

          <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
          >
            {isLoading ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </button>
        </form>

        {error && <p className={styles.error}>{error}</p>}
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default Register;
