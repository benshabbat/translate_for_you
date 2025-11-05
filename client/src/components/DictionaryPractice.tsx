import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dictionaryApi, wordsApi } from '../services/api';

interface DictionaryWord {
  _id: string;
  english: string;
  hebrew: string;
  category: string;
  isProgramming: boolean;
}

interface Category {
  category: string;
  count: number;
}

const DictionaryPractice: React.FC = () => {
  const [words, setWords] = useState<DictionaryWord[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [suggestedTranslation, setSuggestedTranslation] = useState('');
  const [reportReason, setReportReason] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');
  const [addedToMyWords, setAddedToMyWords] = useState<Set<string>>(new Set());
  const [addWordSuccess, setAddWordSuccess] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
    loadWords();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await dictionaryApi.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const loadWords = async (category: string = 'all') => {
    setLoading(true);
    try {
      let response;
      if (category === 'all') {
        response = await dictionaryApi.getPracticeWords(20);
      } else {
        response = await dictionaryApi.getPracticeByCategory(category, 20);
      }
      setWords(response.data);
      setCurrentIndex(0);
      setShowAnswer(false);
      setReportMode(false);
    } catch (err) {
      console.error('Error loading words:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    loadWords(category);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setReportMode(false);
      setSuggestedTranslation('');
      setReportReason('');
      setReportSuccess('');
      setAddWordSuccess('');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setReportMode(false);
      setSuggestedTranslation('');
      setReportReason('');
      setReportSuccess('');
      setAddWordSuccess('');
    }
  };

  const handleReportTranslation = async () => {
    if (!suggestedTranslation.trim()) {
      alert('אנא הכנס תרגום מוצע');
      return;
    }

    try {
      await dictionaryApi.reportTranslation(
        currentWord.english,
        currentWord.hebrew,
        suggestedTranslation,
        reportReason
      );
      setReportSuccess('✅ תודה על הדיווח! נבדוק אותו בקרוב');
      setSuggestedTranslation('');
      setReportReason('');
      setTimeout(() => {
        setReportMode(false);
        setReportSuccess('');
      }, 2000);
    } catch (err: any) {
      alert(err.response?.data?.message || 'שגיאה בשליחת הדיווח');
    }
  };

  const handleAddToMyWords = async () => {
    const currentWord = words[currentIndex];
    
    // Check if already added
    if (addedToMyWords.has(currentWord.english)) {
      setAddWordSuccess('⚠️ המילה כבר נוספה למאגר שלך');
      setTimeout(() => setAddWordSuccess(''), 2000);
      return;
    }

    try {
      await wordsApi.add(currentWord.english, currentWord.hebrew);
      
      setAddedToMyWords(prev => new Set([...prev, currentWord.english]));
      setAddWordSuccess('✅ המילה נוספה למאגר שלך!');
      setTimeout(() => setAddWordSuccess(''), 2000);
    } catch (err: any) {
      if (err.response?.data?.message?.includes('already exists')) {
        setAddedToMyWords(prev => new Set([...prev, currentWord.english]));
        setAddWordSuccess('⚠️ המילה כבר קיימת במאגר שלך');
      } else {
        alert(err.response?.data?.message || 'שגיאה בהוספת המילה');
      }
      setTimeout(() => setAddWordSuccess(''), 2000);
    }
  };

  if (loading) {
    return <div className="loading">טוען מילים...</div>;
  }

  if (words.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>אין מילים זמינות</h2>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          חזור למסך הראשי
        </button>
      </div>
    );
  }

  const currentWord = words[currentIndex];

  return (
    <div>
      <div className="navbar">
        <div className="navbar-content">
          <h1>📚 תרגול מהמאגר הגלובלי</h1>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            חזור למסך הראשי
          </button>
        </div>
      </div>

      <div className="container" style={{ maxWidth: '800px', margin: '40px auto' }}>
        {/* Category Selection */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            בחר קטגוריה:
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="input"
            style={{ width: '100%' }}
          >
            <option value="all">כל המילים ({words.length})</option>
            {categories.map((cat) => (
              <option key={cat.category} value={cat.category}>
                {cat.category} ({cat.count})
              </option>
            ))}
          </select>
        </div>

        {/* Progress */}
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#667eea' }}>
          <strong>מילה {currentIndex + 1} מתוך {words.length}</strong>
        </div>

        {/* Word Card */}
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e5e7eb',
          borderRadius: '12px',
          padding: '40px',
          textAlign: 'center',
          minHeight: '300px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '20px'
        }}>
          {/* English Word */}
          <div>
            <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>
              מילה באנגלית:
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#1f2937' }}>
              {currentWord.english}
            </div>
            {currentWord.isProgramming && (
              <div style={{ 
                display: 'inline-block',
                marginTop: '10px',
                padding: '4px 12px',
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                💻 מונח תכנות
              </div>
            )}
          </div>

          {/* Hebrew Translation */}
          {showAnswer && (
            <div style={{ marginTop: '20px' }}>
              <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>
                תרגום לעברית:
              </div>
              <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#059669' }}>
                {currentWord.hebrew}
              </div>
              
              {/* Action Buttons */}
              {!reportMode && (
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
                  <button
                    onClick={handleAddToMyWords}
                    className="btn"
                    style={{
                      backgroundColor: addedToMyWords.has(currentWord.english) ? '#10b981' : '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      opacity: addedToMyWords.has(currentWord.english) ? 0.7 : 1
                    }}
                    disabled={addedToMyWords.has(currentWord.english)}
                  >
                    {addedToMyWords.has(currentWord.english) ? '✓ נוסף למילים שלי' : '➕ הוסף למילים שלי'}
                  </button>
                  <button
                    onClick={() => setReportMode(true)}
                    className="btn"
                    style={{
                      backgroundColor: '#f59e0b',
                      color: 'white',
                      padding: '8px 16px'
                    }}
                  >
                    ⚠️ דווח על תרגום שגוי
                  </button>
                </div>
              )}

              {/* Add Word Success Message */}
              {addWordSuccess && (
                <div style={{
                  marginTop: '15px',
                  padding: '12px',
                  backgroundColor: addWordSuccess.includes('✅') ? '#d1fae5' : '#fef3c7',
                  color: addWordSuccess.includes('✅') ? '#065f46' : '#92400e',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  {addWordSuccess}
                </div>
              )}

              {/* Report Form */}
              {reportMode && !reportSuccess && (
                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  backgroundColor: '#fef3c7',
                  borderRadius: '8px',
                  textAlign: 'right'
                }}>
                  <h3 style={{ marginBottom: '15px', fontSize: '18px' }}>דווח על תרגום שגוי</h3>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                      תרגום מוצע (נכון):
                    </label>
                    <input
                      type="text"
                      value={suggestedTranslation}
                      onChange={(e) => setSuggestedTranslation(e.target.value)}
                      className="input"
                      placeholder="הכנס את התרגום הנכון..."
                    />
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                      סיבה (אופציונלי):
                    </label>
                    <textarea
                      value={reportReason}
                      onChange={(e) => setReportReason(e.target.value)}
                      className="input"
                      placeholder="למה התרגום הנוכחי שגוי?"
                      rows={3}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleReportTranslation}
                      className="btn btn-primary"
                    >
                      שלח דיווח
                    </button>
                    <button
                      onClick={() => setReportMode(false)}
                      className="btn btn-secondary"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {reportSuccess && (
                <div style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}>
                  {reportSuccess}
                </div>
              )}
            </div>
          )}

          {/* Show Answer Button */}
          {!showAnswer && (
            <button
              onClick={() => setShowAnswer(true)}
              className="btn btn-primary"
              style={{ fontSize: '18px', padding: '15px 40px' }}
            >
              הצג תרגום
            </button>
          )}
        </div>

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
          gap: '10px'
        }}>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
             מילה קודמת →
          </button>
          <button
            onClick={() => loadWords(selectedCategory)}
            className="btn"
            style={{ flex: 1, backgroundColor: '#8b5cf6', color: 'white' }}
          >
            🔄 מילים חדשות
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === words.length - 1}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            ← מילה הבאה 
          </button>
        </div>
      </div>
    </div>
  );
};

export default DictionaryPractice;
