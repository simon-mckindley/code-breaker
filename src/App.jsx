import { useState, useEffect, useRef } from 'react';
import './App.css';

import DraggablePeg from './components/DraggablePeg';
import DropSlot from './components/DropSlot';
import AnswerSlot from './components/AnswerSlot';
import ResultContainer from './components/ResultContainer';

function getRand(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
  const pegColors = ['red', 'blue', 'green', 'orange', 'purple', 'brown'];

  // Set target
  const [target] = useState(() => [
    pegColors[getRand(0, pegColors.length - 1)],
    pegColors[getRand(0, pegColors.length - 1)],
    pegColors[getRand(0, pegColors.length - 1)],
    pegColors[getRand(0, pegColors.length - 1)]
  ]);

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

  const [rectTrigger, setRectTrigger] = useState(0);

  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [results, setResults] = useState(
    Array.from({ length: 10 }, () => Array(4).fill(''))
  );

  const [answerPositions, setAnswerPositions] = useState(Array(4).fill(''));


  useEffect(() => {
    // Clear previous row rects
    setCurrentRowRects(Array(4).fill({ rowIndex: null, rect: null }));
    // Disable button
    setButtonDisabled(true);
    // Trigger re-collection in DropSlot components
    setRectTrigger(prev => prev + 1);
  }, [currentRow]);


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

      if (!updated[currentRow].includes(null)) {
        // Enable button
        setButtonDisabled(false);
      }
      // console.log({ buttonDisabled, updated });
      return updated;
    });
  };

  const handleResultsUpdate = (newResult) => {
    setResults(prevResults => {
      const updated = [...prevResults];
      updated[currentRow] = [...newResult];

      // console.log({ currentRow, updated });
      return updated;
    });
  }

  const handleButtonClick = () => {
    // console.log(guesses[currentRow]);
    if (guesses[currentRow].includes(null)) {
      console.log('Not all slots filled!');
      return;
    }
    console.log('Target: ' + target);
    console.log('Guess: ' + guesses[currentRow]);

    const newResult = checkResult(guesses[currentRow]);

    console.log(newResult);
    if (newResult.every((value) => value === 'red')) {
      console.log("WINNER 2");
      return
    }

    if (currentRow < 9) {
      setCurrentRow(currentRow => currentRow + 1);
      console.log("TRY AGAIN");
      return;
    }

    console.log("LOSER");
  };

  // 'red'=both correct / 'white'=color correct
  const checkResult = (currentGuess) => {
    let newResult = null;
    if (currentGuess.every((color, index) => color === target[index])) {
      // console.log("WINNER 1");
      newResult = Array(4).fill('red');
    } else {
      newResult = Array(4).fill('white');
    }

    handleResultsUpdate(newResult);
    return newResult;
  }

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
            onClick={handleButtonClick}
            disabled={buttonDisabled}>
            ?
          </button>
        </div>

        <div className="game-wrapper">
          {/* Hidden answer row */}
          <div className="inner answer-wrapper">
            {answerPositions.map((color, index) => (
              <AnswerSlot key={index} color={color} />
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
                      rectTrigger={rectTrigger}
                      getBoundingRect={handleRowDropSlotRects}
                    />
                  ))}
                </div>

                <ResultContainer key={rowIndex} result={results[rowIndex]} />
              </div>
            ))}
            
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
