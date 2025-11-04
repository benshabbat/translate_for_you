import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wordsApi } from '../services/api';
import { Word } from '../types';

const Dashboard: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [english, setEnglish] = useState('');
  const [hebrew, setHebrew] = useState('');
  const [error, setError] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadWords();
  }, []);

  // Auto-translate when English word changes
  useEffect(() => {
    const translateWord = async () => {
      if (english.trim().length > 2 && showAddForm) {
        setIsTranslating(true);
        try {
          // Use our backend translation service
          const response = await fetch('/api/translate/translate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: english.trim()
            })
          });
          
          const data = await response.json();
          if (data.translation) {
            setHebrew(data.translation);
          } else if (data.message) {
            // Translation not found, user can enter manually
            console.log(data.message);
          }
        } catch (err) {
          // If translation fails, just continue without auto-translation
          console.log('Translation not available');
        } finally {
          setIsTranslating(false);
        }
      }
    };

    // Debounce the translation to avoid too many API calls
    const timer = setTimeout(translateWord, 800);
    return () => clearTimeout(timer);
  }, [english, showAddForm]);

  const loadWords = async () => {
    try {
      const response = await wordsApi.getAll();
      setWords(response.data);
    } catch (err) {
      console.error('Error loading words:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWord = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await wordsApi.add(english, hebrew);
      setEnglish('');
      setHebrew('');
      setShowAddForm(false);
      loadWords();
    } catch (err: any) {
      setError(err.response?.data?.message || 'שגיאה בהוספת המילה');
    }
  };

  const handleDeleteWord = async (id: string) => {
    if (!window.confirm('האם אתה בטוח שברצונך למחוק את המילה?')) return;

    try {
      await wordsApi.delete(id);
      loadWords();
    } catch (err) {
      alert('שגיאה במחיקת המילה');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const startPractice = () => {
    if (words.length === 0) {
      alert('אין מילים במאגר. הוסף מילים כדי להתחיל לתרגל.');
      return;
    }
    navigate('/practice');
  };

  const stats = {
    total: words.length,
    practiced: words.filter(w => w.lastPracticed).length,
    accuracy: words.length > 0 
      ? Math.round(
          (words.reduce((sum, w) => sum + w.correctCount, 0) /
            (words.reduce((sum, w) => sum + w.correctCount + w.incorrectCount, 0) || 1)) * 100
        )
      : 0,
  };

  if (loading) {
    return <div className="loading">טוען...</div>;
  }

  return (
    <div>
      <div className="navbar">
        <div className="navbar-content">
          <h1>📚 תרגום למען הלמידה</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span>שלום, {user?.username}!</span>
            <button onClick={handleLogout} className="btn btn-secondary">
              התנתק
            </button>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="stats">
          <div className="stat-card">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">סה"כ מילים</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.practiced}</div>
            <div className="stat-label">מילים שתורגלו</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.accuracy}%</div>
            <div className="stat-label">אחוז הצלחה</div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2>המילים שלי</h2>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
                {showAddForm ? 'ביטול' : '+ הוסף מילה'}
              </button>
              <button onClick={startPractice} className="btn btn-secondary">
                🎯 התחל תרגול
              </button>
            </div>
          </div>

          {showAddForm && (
            <form onSubmit={handleAddWord} style={{ marginBottom: '30px', padding: '20px', background: '#f9fafb', borderRadius: '8px' }}>
              <div className="form-group">
                <label>מילה באנגלית</label>
                <input
                  type="text"
                  className="input"
                  value={english}
                  onChange={(e) => setEnglish(e.target.value)}
                  required
                  placeholder="הקלד מילה באנגלית..."
                />
              </div>
              <div className="form-group">
                <label>תרגום לעברית {isTranslating && <span style={{ color: '#667eea', fontSize: '14px' }}>⏳ מתרגם...</span>}</label>
                <input
                  type="text"
                  className="input"
                  value={hebrew}
                  onChange={(e) => setHebrew(e.target.value)}
                  required
                  placeholder="התרגום יופיע אוטומטית..."
                />
                <small style={{ color: '#6b7280', fontSize: '12px', marginTop: '5px', display: 'block' }}>
                  💡 הקלד מילה באנגלית והתרגום יופיע אוטומטית. ניתן לערוך אותו.
                </small>
              </div>
              {error && <div className="error">{error}</div>}
              <button type="submit" className="btn btn-primary">
                הוסף
              </button>
            </form>
          )}

          {words.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
              <p>אין עדיין מילים במאגר.</p>
              <p>התחל להוסיף מילים כדי להתחיל לתרגל!</p>
            </div>
          ) : (
            <div>
              {words.map((word) => (
                <div key={word._id} className="word-item">
                  <div className="word-content">
                    <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '5px' }}>
                      {word.english}
                    </div>
                    <div style={{ color: '#6b7280' }}>{word.hebrew}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '5px' }}>
                      ✅ {word.correctCount} | ❌ {word.incorrectCount}
                      {word.lastPracticed && ` | תורגל לאחרונה: ${new Date(word.lastPracticed).toLocaleDateString('he-IL')}`}
                    </div>
                  </div>
                  <div className="word-actions">
                    <button
                      onClick={() => handleDeleteWord(word._id)}
                      className="btn btn-danger"
                      style={{ padding: '8px 16px' }}
                    >
                      מחק
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
