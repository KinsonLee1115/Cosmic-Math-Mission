
import React, { useState } from 'react';
import MainMenuScreen from './components/MainMenuScreen';
import CalculationGame from './CalculationGame';
import NumberBondsGame from './NumberBondsGame';
import LearnScreen from './components/LearnScreen';
import ConceptQuizScreen from './components/ConceptQuizScreen';
import { GameTopic, ConceptId } from './types';
import { foundationalConcepts, earlyElementaryConcepts } from './data/concepts';

function App() {
  const [gameTopic, setGameTopic] = useState<GameTopic>('menu');
  const [selectedConceptId, setSelectedConceptId] = useState<ConceptId | null>(null);

  const handleBackToMenu = () => {
    setGameTopic('menu');
    setSelectedConceptId(null);
  };

  const handleSelectConcept = (conceptId: ConceptId) => {
    setSelectedConceptId(conceptId);
    setGameTopic('conceptQuiz');
  };

  const handleExitQuiz = () => {
    setGameTopic('learn');
    setSelectedConceptId(null);
  };

  const renderContent = () => {
    switch (gameTopic) {
      case 'calculation':
        return <CalculationGame onExit={handleBackToMenu} />;
      case 'numberBonds':
        return <NumberBondsGame onExit={handleBackToMenu} />;
      case 'learn':
        return <LearnScreen onExit={handleBackToMenu} onSelectConcept={handleSelectConcept} />;
      case 'conceptQuiz':
        if (selectedConceptId) {
            const allConcepts = [...foundationalConcepts, ...earlyElementaryConcepts];
            const concept = allConcepts.find(c => c.id === selectedConceptId);
            if (concept) {
                return <ConceptQuizScreen concept={concept} onExit={handleExitQuiz} />;
            }
        }
        // Fallback if state is inconsistent
        return <LearnScreen onExit={handleBackToMenu} onSelectConcept={handleSelectConcept} />;
      case 'menu':
      default:
        return <MainMenuScreen onSelectTopic={setGameTopic} />;
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-full text-gray-800">
      {/* Floating Background Shapes */}
      <span className="absolute top-10 left-5 text-4xl text-yellow-400 opacity-50 animate-float" style={{'--float-duration': '7s', animationDelay: '0s'} as React.CSSProperties} role="img" aria-label="Star">⭐</span>
      <span className="absolute bottom-20 right-10 text-5xl text-blue-400 opacity-50 animate-float" style={{'--float-duration': '9s', animationDelay: '2s'} as React.CSSProperties} role="img" aria-label="Plus Sign">➕</span>
      <span className="absolute top-1/4 right-1/4 text-3xl text-pink-400 opacity-50 animate-float" style={{'--float-duration': '6s', animationDelay: '1s'} as React.CSSProperties} role="img" aria-label="Minus Sign">➖</span>
      <span className="absolute bottom-1/3 left-1/4 text-5xl text-green-400 opacity-50 animate-float" style={{'--float-duration': '8s', animationDelay: '3s'} as React.CSSProperties} role="img" aria-label="Star">⭐</span>
      <span className="absolute top-1/2 left-10 text-3xl text-red-400 opacity-50 animate-float" style={{'--float-duration': '7.5s', animationDelay: '4s'} as React.CSSProperties} role="img" aria-label="Plus Sign">➕</span>
      <span className="absolute bottom-5 left-1/2 text-4xl text-purple-400 opacity-50 animate-float" style={{'--float-duration': '6.5s', animationDelay: '0.5s'} as React.CSSProperties} role="img" aria-label="Minus Sign">➖</span>
      <span className="absolute top-3/4 right-5 text-2xl text-orange-400 opacity-50 animate-float" style={{'--float-duration': '8.5s', animationDelay: '2.5s'} as React.CSSProperties} role="img" aria-label="Star">⭐</span>
      <span className="absolute top-5 right-1/2 text-6xl text-cyan-400 opacity-50 animate-float" style={{'--float-duration': '10s', animationDelay: '1.5s'} as React.CSSProperties} role="img" aria-label="Plus Sign">➕</span>
      <span className="absolute bottom-10 left-10 text-xl text-indigo-400 opacity-50 animate-float" style={{'--float-duration': '5s', animationDelay: '3.5s'} as React.CSSProperties} role="img" aria-label="Minus Sign">➖</span>
      <span className="absolute top-1/3 left-5 text-5xl text-lime-400 opacity-50 animate-float" style={{'--float-duration': '7s', animationDelay: '0.8s'} as React.CSSProperties} role="img" aria-label="Star">⭐</span>
      <span className="absolute bottom-1/4 right-5 text-4xl text-fuchsia-400 opacity-50 animate-float" style={{'--float-duration': '9.5s', animationDelay: '4.2s'} as React.CSSProperties} role="img" aria-label="Plus Sign">➕</span>
      <span className="absolute top-1/4 left-1/3 text-3xl text-rose-400 opacity-50 animate-float" style={{'--float-duration': '6s', animationDelay: '2.8s'} as React.CSSProperties} role="img" aria-label="Minus Sign">➖</span>

      {renderContent()}
    </div>
  );
}

export default App;
