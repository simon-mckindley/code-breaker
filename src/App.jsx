import { useState } from 'react';
import './App.css';

import DraggablePeg from './components/DraggablePeg';
import DropSlot from './components/DropSlot';
import AnswerSlot from './components/AnswerSlot';
import ResultSlot from './components/ResultSlot';

function App() {
  const positions = ['one', 'two', 'three', 'four'];
  const pegColors = ['red', 'blue', 'green', 'orange', 'purple', 'brown'];

  // 10 rows of 4 guess slots each
  const [guesses, setGuesses] = useState(
    Array.from({ length: 10 }, () => Array(4).fill(null))
  );

  const [currentRow, setCurrentRow] = useState(0);

  const handleDropColor = (rowIndex, slotIndex, color) => {
    setGuesses(prevGuesses => {
      const updated = [...prevGuesses];
      updated[rowIndex] = [...updated[rowIndex]];
      updated[rowIndex][slotIndex] = color;
      console.log(updated);
      return updated;
    });
  };

  return (
    <>
      <div className="heading-wrapper">
        <h1>Code Breaker</h1>
      </div>

      <div className="center-wrapper">
        {/* Draggable pegs */}
        <div className="peg-wrapper">
          {pegColors.map(color => (
            <div className='peg-inner' key={`${color}-cont`}>
              <DraggablePeg key={color} color={color} />
            </div>
          ))}
        </div>

        <div className="game-wrapper">
          {/* Hidden answer row */}
          <div className="inner answer-wrapper">
            {positions.map((pos, index) => (
              <AnswerSlot key={index} position={pos} />
            ))}
          </div>

          {/* 10 guess rows */}
          <div className="guess-wrapper">
            {guesses.map((row, rowIndex) => (
              <div 
                key={rowIndex} 
                id={`guess-${rowIndex + 1}`} 
                className={rowIndex === currentRow ? '' : 'locked'}>
                <div className="inner guess-inner">
                  {row.map((color, slotIndex) => (
                    <DropSlot
                      key={slotIndex}
                      index={slotIndex}
                      color={color}
                      locked={rowIndex !== currentRow}
                      onDropColor={(pegColor) => handleDropColor(rowIndex, slotIndex, pegColor)}
                    />
                  ))}
                </div>
                <div className="guess-result">
                  <ResultSlot position="one" />
                  <ResultSlot position="two" />
                  <ResultSlot position="three" />
                  <ResultSlot position="four" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
