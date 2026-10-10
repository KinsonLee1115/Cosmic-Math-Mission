import React, { useState } from 'react';
import IconButton from './IconButton';
import Button from './Button';

interface ThreeNumAdditionGuideProps {
  onClose: () => void;
  playClick: () => void;
  num1?: number;
  num2?: number;
  num3?: number;
}

type StrategyTab = 'objects' | 'biggest' | 'make10' | 'numberline' | 'order';

const ThreeNumAdditionGuide: React.FC<ThreeNumAdditionGuideProps> = ({ 
  onClose, 
  playClick,
  num1 = 3,
  num2 = 2,
  num3 = 4
}) => {
  const [activeTab, setActiveTab] = useState<StrategyTab>('objects');

  // Ensure values are numbers
  const n1 = Number(num1);
  const n2 = Number(num2);
  const n3 = Number(num3);
  const totalSum = n1 + n2 + n3;

  // --- Dynamic IDs for Counters ---
  const pinkIds = Array.from({ length: n1 }).map((_, i) => `p${i}`);
  const blueIds = Array.from({ length: n2 }).map((_, i) => `b${i}`);
  const yellowIds = Array.from({ length: n3 }).map((_, i) => `y${i}`);
  const allIds = [...pinkIds, ...blueIds, ...yellowIds];

  // --- State for Tab 1 (Objects) ---
  const [countedSet, setCountedSet] = useState<Set<string>>(new Set());
  const handleCounterClick = (id: string) => {
    playClick();
    setCountedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // --- State for Tab 2 (Biggest) ---
  const [biggestState, setBiggestState] = useState<'start' | 'highlight' | 'counting'>('start');
  const [countingStep, setCountingStep] = useState(0);

  // Compute biggest and step sequences
  const originalOperands = [
    { label: 'num1', value: n1, orderIndex: 1 },
    { label: 'num2', value: n2, orderIndex: 2 },
    { label: 'num3', value: n3, orderIndex: 3 },
  ];
  const sortedOperands = [...originalOperands].sort((a, b) => b.value - a.value);
  const biggestOp = sortedOperands[0];
  const secondOp = sortedOperands[1];
  const thirdOp = sortedOperands[2];

  const firstStepSequence: number[] = [];
  for (let i = 1; i <= secondOp.value; i++) {
    firstStepSequence.push(biggestOp.value + i);
  }

  const secondStepSequence: number[] = [];
  for (let i = 1; i <= thirdOp.value; i++) {
    secondStepSequence.push(biggestOp.value + secondOp.value + i);
  }

  // --- State for Tab 3 (Make 10 or Friendly Double) ---
  const [make10Fused, setMake10Fused] = useState(false);

  // Determine make 10 pair
  let make10Pair: [string, string] | null = null;
  if (n1 + n2 === 10) make10Pair = ['num1', 'num2'];
  else if (n1 + n3 === 10) make10Pair = ['num1', 'num3'];
  else if (n2 + n3 === 10) make10Pair = ['num2', 'num3'];

  // --- State for Tab 4 (Number Line) ---
  const [numberLineStep, setNumberLineStep] = useState(0); // 0: start, 1: +n1, 2: +n2, 3: +n3
  const numLineMax = Math.max(12, totalSum + 2); // Dynamic bounds so ticks fit beautifully

  // --- State for Tab 5 (Order Rule) ---
  const [orderIndex, setOrderIndex] = useState(0);
  const orders = [
    { num1: n1, num2: n2, num3: n3 },
    { num1: n3, num2: n2, num3: n1 },
    { num1: n2, num2: n3, num3: n1 },
  ];

  const handleTabChange = (tab: StrategyTab) => {
    playClick();
    setActiveTab(tab);
    // Reset internal states
    setCountedSet(new Set());
    setBiggestState('start');
    setCountingStep(0);
    setMake10Fused(false);
    setNumberLineStep(0);
    setOrderIndex(0);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto animate-fade-in" onClick={onClose}>
      <div 
        className="relative bg-white rounded-3xl shadow-2xl p-4 sm:p-8 border-8 border-dashed border-purple-400 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-hint-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
            Let's Solve: {n1} + {n2} + {n3}! 🌟
          </h2>
          <IconButton onClick={onClose} aria-label="Close Guide" className="bg-red-50 hover:bg-red-100 text-red-500 border-red-200">
            <span className="text-xl sm:text-2xl">✕</span>
          </IconButton>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
          <button
            onClick={() => handleTabChange('objects')}
            className={`px-3 py-2 rounded-xl font-bold text-sm sm:text-base border-b-4 transition-all ${
              activeTab === 'objects'
                ? 'bg-pink-500 text-white border-pink-700 scale-105'
                : 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100'
            }`}
          >
            🎨 Counters
          </button>
          <button
            onClick={() => handleTabChange('biggest')}
            className={`px-3 py-2 rounded-xl font-bold text-sm sm:text-base border-b-4 transition-all ${
              activeTab === 'biggest'
                ? 'bg-amber-500 text-white border-amber-700 scale-105'
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
          >
            👑 Biggest First
          </button>
          <button
            onClick={() => handleTabChange('make10')}
            className={`px-3 py-2 rounded-xl font-bold text-sm sm:text-base border-b-4 transition-all ${
              activeTab === 'make10'
                ? 'bg-teal-500 text-white border-teal-700 scale-105'
                : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
            }`}
          >
            ⭐ {make10Pair ? 'Make 10 First' : 'Group First'}
          </button>
          <button
            onClick={() => handleTabChange('numberline')}
            className={`px-3 py-2 rounded-xl font-bold text-sm sm:text-base border-b-4 transition-all ${
              activeTab === 'numberline'
                ? 'bg-blue-500 text-white border-blue-700 scale-105'
                : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
            }`}
          >
            📍 Number Line
          </button>
          <button
            onClick={() => handleTabChange('order')}
            className={`px-3 py-2 rounded-xl font-bold text-sm sm:text-base border-b-4 transition-all ${
              activeTab === 'order'
                ? 'bg-indigo-500 text-white border-indigo-700 scale-105'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            🔄 Order Rule
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-purple-50/50 rounded-2xl p-4 sm:p-6 border-3 border-purple-200 min-h-[250px] flex flex-col justify-between">
          
          {/* TAB 1: OBJECTS */}
          {activeTab === 'objects' && (
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-pink-700 mb-2">Strategy 1: Use Color Counters!</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-md">
                Build each number in different colors. Tap the balls to count them one by one!
              </p>
              <div className="text-2xl sm:text-3xl font-black text-gray-800 mb-4">
                {n1} + {n2} + {n3} = <span className="text-pink-600 font-black">{countedSet.size}</span>
              </div>
              
              <div className="flex flex-col gap-y-4 items-center w-full">
                {/* Pink Counters */}
                {n1 > 0 && (
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm font-bold text-pink-500 w-12 text-right">{n1}:</span>
                    <div className="flex flex-wrap gap-2 max-w-xs justify-start">
                      {pinkIds.map((id, index) => {
                        const isCounted = countedSet.has(id);
                        return (
                          <button
                            key={id}
                            onClick={() => handleCounterClick(id)}
                            className={`w-10 h-10 rounded-full bg-pink-400 hover:bg-pink-500 active:scale-95 border-3 transition-all flex items-center justify-center font-black text-white text-lg shadow-md ${
                              isCounted ? 'border-pink-800 scale-105 ring-4 ring-pink-200' : 'border-pink-300'
                            }`}
                          >
                            {isCounted ? '★' : index + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Blue Counters */}
                {n2 > 0 && (
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm font-bold text-blue-500 w-12 text-right">{n2}:</span>
                    <div className="flex flex-wrap gap-2 max-w-xs justify-start">
                      {blueIds.map((id, index) => {
                        const isCounted = countedSet.has(id);
                        return (
                          <button
                            key={id}
                            onClick={() => handleCounterClick(id)}
                            className={`w-10 h-10 rounded-full bg-blue-400 hover:bg-blue-500 active:scale-95 border-3 transition-all flex items-center justify-center font-black text-white text-lg shadow-md ${
                              isCounted ? 'border-blue-800 scale-105 ring-4 ring-blue-200' : 'border-blue-300'
                            }`}
                          >
                            {isCounted ? '★' : index + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Yellow Counters */}
                {n3 > 0 && (
                  <div className="flex items-center gap-x-2">
                    <span className="text-sm font-bold text-amber-500 w-12 text-right">{n3}:</span>
                    <div className="flex flex-wrap gap-2 max-w-xs justify-start">
                      {yellowIds.map((id, index) => {
                        const isCounted = countedSet.has(id);
                        return (
                          <button
                            key={id}
                            onClick={() => handleCounterClick(id)}
                            className={`w-10 h-10 rounded-full bg-amber-400 hover:bg-amber-500 active:scale-95 border-3 transition-all flex items-center justify-center font-black text-white text-lg shadow-md ${
                              isCounted ? 'border-amber-800 scale-105 ring-4 ring-amber-200' : 'border-amber-300'
                            }`}
                          >
                            {isCounted ? '★' : index + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => { playClick(); setCountedSet(new Set(allIds)); }}
                className="mt-6 text-xs sm:text-sm font-bold bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full hover:bg-pink-200 active:scale-95"
              >
                Tap all to count!
              </button>
            </div>
          )}

          {/* TAB 2: BIGGEST FIRST */}
          {activeTab === 'biggest' && (
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-amber-700 mb-2">Strategy 2: Start with the Biggest!</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-md">
                Find the largest number first, then "count on" the other two numbers!
              </p>

              <div className="flex items-center justify-center gap-x-4 mb-6 text-4xl sm:text-5xl font-black">
                <span className={`px-3 py-1.5 rounded-2xl border-3 border-amber-300 bg-amber-50 ${biggestState !== 'start' && biggestOp.label !== 'num1' ? 'opacity-40 scale-90' : ''} ${biggestState !== 'start' && biggestOp.label === 'num1' ? 'border-amber-600 bg-amber-200 scale-110 shadow-lg' : ''} transition-all relative`}>
                  {n1}
                  {biggestState !== 'start' && biggestOp.label === 'num1' && (
                    <span className="absolute -top-6 -right-6 text-3xl animate-bounce">👑</span>
                  )}
                </span>
                <span className="text-amber-400">+</span>
                <span className={`px-3 py-1.5 rounded-2xl border-3 border-amber-300 bg-amber-50 ${biggestState !== 'start' && biggestOp.label !== 'num2' ? 'opacity-40 scale-90' : ''} ${biggestState !== 'start' && biggestOp.label === 'num2' ? 'border-amber-600 bg-amber-200 scale-110 shadow-lg' : ''} transition-all relative`}>
                  {n2}
                  {biggestState !== 'start' && biggestOp.label === 'num2' && (
                    <span className="absolute -top-6 -right-6 text-3xl animate-bounce">👑</span>
                  )}
                </span>
                <span className="text-amber-400">+</span>
                <span className={`px-3 py-1.5 rounded-2xl border-3 border-amber-300 bg-amber-50 ${biggestState !== 'start' && biggestOp.label !== 'num3' ? 'opacity-40 scale-90' : ''} ${biggestState !== 'start' && biggestOp.label === 'num3' ? 'border-amber-600 bg-amber-200 scale-110 shadow-lg' : ''} transition-all relative`}>
                  {n3}
                  {biggestState !== 'start' && biggestOp.label === 'num3' && (
                    <span className="absolute -top-6 -right-6 text-3xl animate-bounce">👑</span>
                  )}
                </span>
              </div>

              {biggestState === 'start' && (
                <Button onClick={() => { playClick(); setBiggestState('highlight'); }} className="bg-amber-500 hover:bg-amber-600 border-amber-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                  Find the Biggest! 👑
                </Button>
              )}

              {biggestState === 'highlight' && (
                <div className="flex flex-col items-center gap-y-3">
                  <p className="text-amber-700 font-bold text-lg">Great! {biggestOp.value} is the largest. Now let's count on!</p>
                  <Button onClick={() => { playClick(); setBiggestState('counting'); setCountingStep(1); }} className="bg-amber-500 hover:bg-amber-600 border-amber-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                    Count On {secondOp.value} more! ➔
                  </Button>
                </div>
              )}

              {biggestState === 'counting' && (
                <div className="flex flex-col items-center gap-y-4">
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="text-xl sm:text-2xl font-black bg-amber-200 border-2 border-amber-400 px-3 py-1 rounded-xl">Start at {biggestOp.value}</span>
                    <span className="text-xl font-bold">➔</span>
                    {countingStep >= 1 && (
                      <span className={`text-xl sm:text-2xl font-black px-3 py-1 rounded-xl border-2 ${countingStep === 1 ? 'bg-orange-400 text-white border-orange-600 scale-110 animate-pulse' : 'bg-orange-100 border-orange-300'}`}>
                        {firstStepSequence.join(', ')}
                      </span>
                    )}
                    {countingStep >= 2 && secondStepSequence.length > 0 && (
                      <>
                        <span className="text-xl font-bold">➔</span>
                        <span className={`text-xl sm:text-2xl font-black px-3 py-1 rounded-xl border-2 ${countingStep === 2 ? 'bg-orange-500 text-white border-orange-700 scale-110 animate-bounce' : 'bg-orange-100 border-orange-300'}`}>
                          {secondStepSequence.join(', ')}!
                        </span>
                      </>
                    )}
                  </div>
                  
                  {countingStep === 1 && (
                    <Button onClick={() => { playClick(); setCountingStep(2); }} className="bg-amber-500 hover:bg-amber-600 border-amber-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                      Now Count On {thirdOp.value} more! ➔
                    </Button>
                  )}

                  {countingStep === 2 && (
                    <div className="flex flex-col items-center gap-y-2">
                      <p className="text-green-600 font-bold text-lg">We reached {totalSum}! Super counting! 🎉</p>
                      <button onClick={() => { playClick(); setBiggestState('start'); setCountingStep(0); }} className="text-amber-600 underline font-bold text-sm">Restart Strategy</button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MAKE 10 FIRST OR FRIENDLY DOUBLE */}
          {activeTab === 'make10' && (
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-teal-700 mb-2">
                {make10Pair ? 'Strategy 3: Make 10 First!' : 'Strategy 3: Group Two Numbers First!'}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-md">
                {make10Pair 
                  ? 'Look for any two numbers that add up to exactly 10, fuse them, then add the rest!'
                  : 'Let\'s group two numbers together first to make the addition much easier!'}
              </p>

              <div className="flex flex-col items-center justify-center min-h-[140px] w-full">
                {make10Pair ? (
                  !make10Fused ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-x-4 text-4xl sm:text-5xl font-black mb-4">
                        <span className={`px-3 py-1.5 rounded-2xl border-3 ${make10Pair.includes('num1') ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-300 text-gray-400'}`}>{n1}</span>
                        <span className="text-teal-400">+</span>
                        <span className={`px-3 py-1.5 rounded-2xl border-3 ${make10Pair.includes('num2') ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-300 text-gray-400'}`}>{n2}</span>
                        <span className="text-teal-400">+</span>
                        <span className={`px-3 py-1.5 rounded-2xl border-3 ${make10Pair.includes('num3') ? 'border-teal-500 bg-teal-50 text-teal-600' : 'border-gray-300 text-gray-400'}`}>{n3}</span>
                      </div>
                      <p className="text-teal-600 font-bold mb-4 text-sm sm:text-base">
                        {make10Pair.includes('num1') && make10Pair.includes('num2') ? `${n1} and ${n2}` : make10Pair.includes('num1') && make10Pair.includes('num3') ? `${n1} and ${n3}` : `${n2} and ${n3}`} make 10! Let's fuse them!
                      </p>
                      <Button onClick={() => { playClick(); setMake10Fused(true); }} className="bg-teal-500 hover:bg-teal-600 border-teal-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                        Fuse to 10! ⚡
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center animate-scale-in">
                      <div className="flex items-center gap-x-4 text-4xl sm:text-5xl font-black mb-4">
                        <span className="px-4 py-2 rounded-2xl border-4 border-yellow-500 bg-yellow-100 text-yellow-700 shadow-md animate-bounce">10</span>
                        <span className="text-teal-400">+</span>
                        <span className="px-3 py-1.5 rounded-2xl border-3 border-teal-500 bg-teal-50">
                          {make10Pair.includes('num1') && make10Pair.includes('num2') ? n3 : make10Pair.includes('num1') && make10Pair.includes('num3') ? n2 : n1}
                        </span>
                        <span className="text-teal-400">=</span>
                        <span className="text-teal-600">{totalSum}!</span>
                      </div>
                      <p className="text-green-600 font-bold mb-4 text-sm sm:text-base">Adding to 10 is super fast and easy! 🎉</p>
                      <button onClick={() => { playClick(); setMake10Fused(false); }} className="text-teal-600 underline font-bold text-sm">Unfuse</button>
                    </div>
                  )
                ) : (
                  // General grouping strategy if no pair makes 10
                  !make10Fused ? (
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-x-4 text-4xl sm:text-5xl font-black mb-4">
                        <span className="px-3 py-1.5 rounded-2xl border-3 border-teal-500 bg-teal-50 text-teal-600">{n1}</span>
                        <span className="text-teal-400">+</span>
                        <span className="px-3 py-1.5 rounded-2xl border-3 border-teal-500 bg-teal-50 text-teal-600">{n2}</span>
                        <span className="text-teal-400">+</span>
                        <span className="px-3 py-1.5 rounded-2xl border-3 border-gray-300 text-gray-400">{n3}</span>
                      </div>
                      <p className="text-teal-600 font-bold mb-4 text-sm sm:text-base">Let's add the first two together: {n1} + {n2} is {n1 + n2}!</p>
                      <Button onClick={() => { playClick(); setMake10Fused(true); }} className="bg-teal-500 hover:bg-teal-600 border-teal-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                        Group them! ⚡
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center animate-scale-in">
                      <div className="flex items-center gap-x-4 text-4xl sm:text-5xl font-black mb-4">
                        <span className="px-4 py-2 rounded-2xl border-4 border-yellow-500 bg-yellow-100 text-yellow-700 shadow-md animate-bounce">{n1 + n2}</span>
                        <span className="text-teal-400">+</span>
                        <span className="px-3 py-1.5 rounded-2xl border-3 border-teal-500 bg-teal-50">{n3}</span>
                        <span className="text-teal-400">=</span>
                        <span className="text-teal-600">{totalSum}!</span>
                      </div>
                      <p className="text-green-600 font-bold mb-4 text-sm sm:text-base">Nice! Now we just do a simple two-number addition!</p>
                      <button onClick={() => { playClick(); setMake10Fused(false); }} className="text-teal-600 underline font-bold text-sm">Ungroup</button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {/* TAB 4: NUMBER LINE */}
          {activeTab === 'numberline' && (
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">Strategy 4: Use a Number Line!</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-md">
                Make your first jump of {n1}, then jump forward {n2}, then jump forward {n3}!
              </p>

              {/* Number Line Visualizer */}
              <div className="relative w-full max-w-lg h-24 flex flex-col justify-end mb-6">
                {/* Horizontal line */}
                <div className="absolute left-4 right-4 bottom-8 h-1 bg-blue-400 rounded-full" />
                
                {/* Ticks and Numbers */}
                <div className="flex justify-between px-4">
                  {Array.from({ length: numLineMax + 1 }).map((_, i) => (
                    <div key={i} className="flex flex-col items-center relative h-10 w-4">
                      <div className="w-0.5 h-3 bg-blue-400 absolute top-0" />
                      <span className="text-xs font-black text-blue-800 absolute top-4">{i}</span>
                    </div>
                  ))}
                </div>

                {/* Frog / Indicator Animating Hops */}
                <div 
                  className="absolute bottom-8 text-3xl transition-all duration-500 ease-out"
                  style={{
                    left: `calc(1rem + ${(numberLineStep === 0 ? 0 : numberLineStep === 1 ? n1 : numberLineStep === 2 ? n1 + n2 : totalSum) / numLineMax} * (100% - 2rem) - 15px)`,
                    transform: 'translateY(15px)'
                  }}
                >
                  🐸
                </div>
              </div>

              {/* Controls */}
              <div className="flex flex-col items-center gap-y-3">
                {numberLineStep === 0 && (
                  <Button onClick={() => { playClick(); setNumberLineStep(1); }} className="bg-blue-500 hover:bg-blue-600 border-blue-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                    Jump to {n1}! ➔
                  </Button>
                )}
                {numberLineStep === 1 && (
                  <Button onClick={() => { playClick(); setNumberLineStep(2); }} className="bg-blue-500 hover:bg-blue-600 border-blue-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                    Jump {n2} more! ➔
                  </Button>
                )}
                {numberLineStep === 2 && (
                  <Button onClick={() => { playClick(); setNumberLineStep(3); }} className="bg-blue-500 hover:bg-blue-600 border-blue-700 text-base sm:text-lg px-6 py-2 rounded-xl">
                    Jump {n3} more! ➔
                  </Button>
                )}
                {numberLineStep === 3 && (
                  <div className="flex flex-col items-center gap-y-2">
                    <p className="text-green-600 font-bold text-lg">Hooray! The frog landed on {totalSum}! 🐸🎉</p>
                    <button onClick={() => { playClick(); setNumberLineStep(0); }} className="text-blue-600 underline font-bold text-sm">Jump Again</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: ORDER RULE */}
          {activeTab === 'order' && (
            <div className="flex flex-col items-center text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-indigo-700 mb-2">Strategy 5: The Order Rule!</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-4 max-w-md">
                You can mix the order of the numbers any way you like! The final answer is always the same!
              </p>

              <div className="flex flex-col items-center min-h-[140px] justify-center w-full">
                <div className="flex items-center gap-x-4 text-3xl sm:text-4xl font-black mb-6 animate-scale-in" key={orderIndex}>
                  <span className="px-3 py-1.5 rounded-2xl border-3 border-indigo-400 bg-indigo-50 text-indigo-700 transition-all">{orders[orderIndex].num1}</span>
                  <span className="text-indigo-400">+</span>
                  <span className="px-3 py-1.5 rounded-2xl border-3 border-indigo-400 bg-indigo-50 text-indigo-700 transition-all">{orders[orderIndex].num2}</span>
                  <span className="text-indigo-400">+</span>
                  <span className="px-3 py-1.5 rounded-2xl border-3 border-indigo-400 bg-indigo-50 text-indigo-700 transition-all">{orders[orderIndex].num3}</span>
                  <span className="text-indigo-400">=</span>
                  <span className="text-indigo-600 font-extrabold text-4xl sm:text-5xl animate-pulse">{totalSum}</span>
                </div>

                <div className="flex flex-col items-center gap-y-2">
                  <Button 
                    onClick={() => { playClick(); setOrderIndex((prev) => (prev + 1) % orders.length); }} 
                    className="bg-indigo-500 hover:bg-indigo-600 border-indigo-700 text-base sm:text-lg px-6 py-2 rounded-xl"
                  >
                    Shuffle Order! 🔄
                  </Button>
                  <p className="text-xs text-gray-500 font-medium">Rearrange the numbers to see!</p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Guidance for Parents */}
        <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200 text-left">
          <h4 className="font-bold text-yellow-800 text-sm sm:text-base mb-1">💡 Tips for Parents & Teachers:</h4>
          <p className="text-xs sm:text-sm text-yellow-700 leading-relaxed">
            Encourage children to use their fingers or physical counters at home! Grouping numbers that easily add together builds fantastic lifelong mental math confidence.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeNumAdditionGuide;
