
import React from 'react';
import IconButton from './IconButton';
import { Concept, ConceptId } from '../types';
import { foundationalConcepts, earlyElementaryConcepts } from '../data/concepts';
import useAudioPlayer from '../hooks/useAudioPlayer';


interface LearnScreenProps {
  onExit: () => void;
  onSelectConcept: (conceptId: ConceptId) => void;
}

const ConceptCard: React.FC<{ concept: Concept; onSelect: () => void; }> = ({ concept, onSelect }) => (
  <button onClick={onSelect} className="flex text-left items-start gap-4 p-4 bg-white rounded-2xl shadow-md border-2 border-gray-200 hover:shadow-lg hover:border-purple-300 transition-all duration-300 transform hover:-translate-y-1 w-full">
    <div className="text-4xl sm:text-5xl">{concept.emoji}</div>
    <div>
      <h3 className="text-lg sm:text-xl font-bold text-purple-700">{concept.title}</h3>
      <p className="text-sm sm:text-base text-gray-600">{concept.description}</p>
    </div>
  </button>
);


const LearnScreen: React.FC<LearnScreenProps> = ({ onExit, onSelectConcept }) => {
  const { playClick } = useAudioPlayer();

  const handleSelect = (conceptId: ConceptId) => {
    playClick();
    onSelectConcept(conceptId);
  }

  return (
    <div className="relative flex flex-col items-center p-4 sm:p-8 pt-16 sm:pt-24 gap-y-6 animate-scale-in w-full max-w-3xl bg-white rounded-3xl shadow-xl border-8 border-dashed border-yellow-400 min-h-[500px]">
      <div className="absolute top-4 left-4 z-30">
        <IconButton onClick={onExit} aria-label="Back to Home" className="p-2 sm:p-3">
          <span className="text-2xl sm:text-3xl">🏠</span>
        </IconButton>
      </div>

      <div className="text-center z-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 mb-1 sm:mb-2 text-center leading-tight drop-shadow-lg">
          Let's Learn Together!
        </h1>
        <p className="text-lg sm:text-2xl text-orange-600 text-center max-w-md font-medium">
          Tap a topic to start a fun quiz! <span role="img" aria-label="Lightbulb">💡</span>
        </p>
      </div>

      <div className="w-full overflow-y-auto px-2" style={{maxHeight: 'calc(100vh - 200px)'}}>
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4 pb-2 border-b-4 border-blue-200">
            Foundational Concepts (Ages 3-5)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {foundationalConcepts.map(concept => (
              <ConceptCard key={concept.id} concept={concept} onSelect={() => handleSelect(concept.id)} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-green-600 mb-4 pb-2 border-b-4 border-green-200">
            Early Elementary Concepts (Ages 5-7)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earlyElementaryConcepts.map(concept => (
              <ConceptCard key={concept.id} concept={concept} onSelect={() => handleSelect(concept.id)} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnScreen;
