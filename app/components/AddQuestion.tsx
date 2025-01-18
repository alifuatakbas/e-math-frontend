import React, { useState } from 'react';
import styles from '../styles/AddQuestion.module.css';

interface AddQuestionProps {
  examId: number;
  onQuestionAdded: () => void;
}

const AddQuestion: React.FC<AddQuestionProps> = ({ examId, onQuestionAdded }) => {
  const [text, setText] = useState('');
  const [options, setOptions] = useState(['', '', '', '', '']);
  const [correctOption, setCorrectOption] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır');
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin');
        return;
      }

      setImage(file);
      setError('');

      // Önizleme oluştur
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setError('Soru metni boş olamaz');
      return;
    }

    if (options.some(opt => !opt.trim())) {
      setError('Tüm seçenekler doldurulmalıdır');
      return;
    }

    const formData = new FormData();
    formData.append('text', text);
    // Backend'in beklediği formatta options gönder
    options.forEach((opt) => {
      formData.append('options', opt);
    });
    formData.append('correct_option_index', correctOption.toString());
    if (image) {
      formData.append('image', image);
    }

    try {
      console.log('Gönderilen veriler:', {
        examId,
        text,
        options,
        correctOption
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/admin/add-question/${examId}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      console.log('Backend yanıtı:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Soru eklenirken bir hata oluştu');
      }

      // Başarılı
      setText('');
      setOptions(['', '', '', '', '']);
      setCorrectOption(0);
      setImage(null);
      setImagePreview(null);
      setError('');
      onQuestionAdded();

    } catch (error) {
      console.error('Hata detayı:', error);
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Soru eklenirken bir hata oluştu');
      }
    }
};

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="questionText">Soru Metni:</label>
        <textarea
          id="questionText"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="questionImage">Soru Görseli (Opsiyonel):</label>
        <input
          type="file"
          id="questionImage"
          accept="image/*"
          onChange={handleImageChange}
        />
        {imagePreview && (
          <div className={styles.imagePreview}>
            <img src={imagePreview} alt="Soru görseli önizleme" />
          </div>
        )}
      </div>

      {options.map((option, index) => (
        <div key={index} className={styles.optionGroup}>
          <input
            type="text"
            value={option}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[index] = e.target.value;
              setOptions(newOptions);
            }}
            placeholder={`${index + 1}. Seçenek`}
            required
          />
          <input
            type="radio"
            name="correctOption"
            checked={correctOption === index}
            onChange={() => setCorrectOption(index)}
          />
        </div>
      ))}

      {error && <div className={styles.error}>{error}</div>}

      <button type="submit" className={styles.submitButton}>
        Soru Ekle
      </button>
    </form>
  );
};

export default AddQuestion;