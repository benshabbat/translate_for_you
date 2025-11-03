import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { wordsApi } from '../services/api';
import { Word } from '../types';

const Practice: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState({ correct: 0, incorrect: 0 });
  
  const navigate = useNavigate();

  useEffect(() => {
    loadPracticeWords();
  }, []);

  const loadPracticeWords = async () => {
    try {
      const response = await wordsApi.getPractice(10);
      if (response.data.length === 0) {
        alert('אין מילים לתרגול. הוסף מילים תחילה.');
        navigate('/dashboard');
        return;
      }
      setWords(response.data);
    } catch (err) {
      console.error('Error loading practice words:', err);
      alert('שגיאה בטעינת מילים לתרגול');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (correct: boolean) => {
    const currentWord = words[currentIndex];
    
    try {
      await wordsApi.updatePracticeResult(currentWord._id, correct);
      
      setScore(prev => ({
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
      }));

      if (currentIndex < words.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      } else {
        // Finished practice
        const total = score.correct + score.incorrect + 1;
        const finalCorrect = score.correct + (correct ? 1 : 0);
        alert(`סיימת! 🎉\nתשובות נכונות: ${finalCorrect}/${total}\nאחוז הצלחה: ${Math.round((finalCorrect / total) * 100)}%`);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error updating practice result:', err);
    }
  };

  const handleSkip = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
    } else {
      navigate('/dashboard');
    }
  };

  if (loading) {
    return <div className="loading">טוען...</div>;
  }

  if (words.length === 0) {
    return null;
  }

  const currentWord = words[currentIndex];
  const progress = ((currentIndex + 1) / words.length) * 100;

  return (
    <div className="container" style={{ maxWidth: '800px', marginTop: '50px' }}>
      <div className="card">
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>שאלה {currentIndex + 1} מתוך {words.length}</span>
            <span>✅ {score.correct} | ❌ {score.incorrect}</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', transition: 'width 0.3s' }}></div>
          </div>
        </div>

        <div className="practice-card">
          <h3 style={{ color: '#6b7280', marginBottom: '10px' }}>מה התרגום של:</h3>
          <div className="practice-word">{currentWord.english}</div>

          {showAnswer ? (
            <div>
              <div style={{ fontSize: '32px', color: '#10b981', marginTop: '20px' }}>
                {currentWord.hebrew}
              </div>
              <div className="practice-buttons">
                <button
                  onClick={() => handleAnswer(false)}
                  className="btn btn-danger"
                  style={{ padding: '15px 40px', fontSize: '18px' }}
                >
                  ❌ לא ידעתי
                </button>
                <button
                  onClick={() => handleAnswer(true)}
                  className="btn btn-primary"
                  style={{ padding: '15px 40px', fontSize: '18px' }}
                >
                  ✅ ידעתי!
                </button>
              </div>
            </div>
          ) : (
            <div className="practice-buttons">
              <button
                onClick={handleSkip}
                className="btn btn-secondary"
                style={{ padding: '15px 40px', fontSize: '18px' }}
              >
                ⏭️ דלג
              </button>
              <button
                onClick={() => setShowAnswer(true)}
                className="btn btn-primary"
                style={{ padding: '15px 40px', fontSize: '18px' }}
              >
                הצג תשובה
              </button>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
            חזור ללוח הבקרה
          </button>
        </div>
      </div>
    </div>
  );
};

export default Practice;
