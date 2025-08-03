import { useState, useEffect, useRef } from 'react';
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

  const [currentRowRects, setCurrentRowRects] = useState(
    Array(4).fill({
      'rowIndex': null,
      'rect': null
    })
  );

  const handleRowDropSlotRects = (slotIndex, rowIndex, boundingRect) => {
    setCurrentRowRects(prevCurrentRowRects => {
      const updated = [...prevCurrentRowRects];
      updated[slotIndex] = {
        'rowIndex': rowIndex,
        'rect': boundingRect
      };
      // console.log({ slotIndex, updated });
      return updated;
    });
  };

  const handleDropColor = (slotIndex, rowIndex, color) => {
    setGuesses(prevGuesses => {
      const updated = [...prevGuesses];
      updated[rowIndex] = [...updated[rowIndex]];
      updated[rowIndex][slotIndex] = color;
      // console.log({ updated });
      return updated;
    });
  };

  const handleButtonClick = () => {
    setCurrentRow(prevCurrentRow => { return (prevCurrentRow + 1) });
    console.log(currentRow);
  };


  return (
    <>
      <div className="heading-wrapper">
        <h1>Code Breaker</h1>
      </div>

      <div className="center-wrapper">

        <div className='game-head-wrapper'>
          {/* Draggable pegs */}
          <div className="peg-wrapper">
            {pegColors.map(color => (
              <div className='peg-inner' key={`${color}-cont`}>
                <DraggablePeg
                  key={color}
                  color={color}
                  dropSlotsRects={currentRowRects}
                  setDropColor={handleDropColor}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            className='guess-btn'
            onClick={handleButtonClick}>
            ?
          </button>
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
                      slotIndex={slotIndex}
                      rowIndex={rowIndex}
                      color={color}
                      locked={rowIndex !== currentRow}
                      getBoundingRect={handleRowDropSlotRects}
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
