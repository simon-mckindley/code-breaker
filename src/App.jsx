import { useState, useEffect, useRef } from 'react';
import './App.css';

import DraggablePeg from './components/DraggablePeg';
import DropSlot from './components/DropSlot';
import AnswerSlot from './components/AnswerSlot';
import ResultContainer from './components/ResultContainer';
import MessageDialog from './components/MessageDialog';

function getRand(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function App() {
    const pegColors = ['red', 'blue', 'green', 'orange', 'purple', 'brown'];

    // Message dialog
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMessage, setDialogMessage] = useState('');
    const dialogRef = useRef();

    const openMessageDialog = (title, message) => {
        setDialogTitle(title);
        setDialogMessage(message);
        dialogRef.current?.open();
    };

    // Set target
    const [target, setTarget] = useState([]);

    function setNewTarget() {
        setTarget([
                pegColors[getRand(0, pegColors.length - 1)],
                pegColors[getRand(0, pegColors.length - 1)],
                pegColors[getRand(0, pegColors.length - 1)],
                pegColors[getRand(0, pegColors.length - 1)]
            ]);
    };

    // 10 rows of 4 guess slots each
    const [guesses, setGuesses] = useState(
        Array.from({ length: 10 }, () => Array(4).fill(null))
    );

    const [currentRow, setCurrentRow] = useState(-1);

    const [currentRowRects, setCurrentRowRects] = useState(
        Array(4).fill({
            'rowIndex': null,
            'rect': null
        })
    );

    const [rectTrigger, setRectTrigger] = useState(0);

    const [checkBtnDisabled, setCheckBtnDisabled] = useState(true);
    const [goBtnDisabled, setGoBtnDisabled] = useState(false);

    const [results, setResults] = useState(
        Array.from({ length: 10 }, () => Array(4).fill(''))
    );

    const [answerPositions, setAnswerPositions] = useState(Array(4).fill(''));

    const [answerCoverPos, setCoverPos] = useState(-4);

    // When currentRow changes
    useEffect(() => {
        // Clear previous row rects
        setCurrentRowRects(Array(4).fill({ rowIndex: null, rect: null }));
        // Disable button
        setCheckBtnDisabled(true);
        // Trigger re-collection in DropSlot components
        setRectTrigger(prev => prev + 1);
    }, [currentRow]);

    // Recalculate drop slot positions on window resize
    useEffect(() => {
        const handleResize = () => {
            setRectTrigger(prev => prev + 1);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [])


    const handleRowDropSlotRects = (slotIndex, rowIndex, boundingRect) => {
        setCurrentRowRects(prevCurrentRowRects => {
            const updated = [...prevCurrentRowRects];
            updated[slotIndex] = {
                'rowIndex': rowIndex,
                'rect': boundingRect
            };

            return updated;
        });
    };

    // Start the game
    const handleGoBtnClick = () => {
        setCoverPos(0);
        setGoBtnDisabled(true);
        setAnswerPositions(Array(4).fill(''));
        setResults(Array.from({ length: 10 }, () => Array(4).fill('')));
        setGuesses(Array.from({ length: 10 }, () => Array(4).fill(null)));
        setTimeout(() => {
            setNewTarget();
            setCurrentRow(0);
        }, 2000);
    }

    const handleDropColor = (slotIndex, rowIndex, color) => {
        setGuesses(prevGuesses => {
            const updated = [...prevGuesses];
            updated[rowIndex] = [...updated[rowIndex]];
            updated[rowIndex][slotIndex] = color;

            if (!updated[currentRow].includes(null)) {
                // Enable button
                setCheckBtnDisabled(false);
            }

            return updated;
        });
    };

    const handleResultsUpdate = (newResult) => {
        setResults(prevResults => {
            const updated = [...prevResults];
            updated[currentRow] = [...newResult];

            return updated;
        });
    }

    const handleCheckBtnClick = () => {
        if (guesses[currentRow].includes(null)) {
            console.log('Not all slots filled!');
            return;
        }
        // console.log('Target: ' + target);
        // console.log('Guess: ' + guesses[currentRow]);

        const newResult = checkResult(guesses[currentRow]);

        if (newResult.every((value) => value === 'red')) {
            console.log("WINNER");
            handleGameEnd(true);
            return;
        }

        if (currentRow < 9) {
            setCurrentRow(currentRow => currentRow + 1);
            console.log("TRY AGAIN");
            return;
        }

        console.log("LOSER");
        handleGameEnd(false);
    };

    // 'red'=both correct / 'white'=color correct
    function checkResult(currentGuess) {
        const newResult = []; // will be filled with 'red' and 'white'
        const targetCopy = [...target];
        const guessCopy = [...currentGuess];

        // First pass: find exact matches (correct color and position)
        for (let i = 0; i < targetCopy.length; i++) {
            if (guessCopy[i] === targetCopy[i]) {
                newResult.push('red');
                targetCopy[i] = null; // remove matched item
                guessCopy[i] = null;
            }
        }

        // Second pass: find correct color but wrong position
        for (let i = 0; i < targetCopy.length; i++) {
            if (guessCopy[i] !== null) {
                const index = targetCopy.indexOf(guessCopy[i]);
                if (index !== -1) {
                    newResult.push('white');
                    targetCopy[index] = null; // remove matched item
                }
            }
        }

        // Make sure the result is the full length
        for (let i = newResult.length; i < targetCopy.length; i++) {
            newResult.push('');
        }

        handleResultsUpdate(newResult);
        return newResult;
    }

    function handleGameEnd(winner) {
        setAnswerPositions([...target]);
        setCoverPos(-4);
        setCurrentRow(-1);
        setTimeout(() => {
            winner ?
                openMessageDialog('🎉 You got it!', 'You worked out the code, great job!') :
                openMessageDialog('😢 Out of tries', 'You were close. Why don\'t you try again?');
            setGoBtnDisabled(false);
        }, 5000);
    }


    return (
        <>
            <div className="heading-wrapper">
                <h1>Code Breaker</h1>
            </div>

            <div className="center-wrapper">

                <div className='game-head-wrapper'>
                    <button
                        type="button"
                        className='start-btn'
                        onClick={handleGoBtnClick}
                        disabled={goBtnDisabled}>
                        Go
                    </button>

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
                        onClick={handleCheckBtnClick}
                        disabled={checkBtnDisabled}>
                        ?
                    </button>
                </div>

                <div className="game-wrapper">
                    {/* Hidden answer row */}
                    <div
                        className="inner answer-wrapper"
                        style={{ '--_cover-position': `${answerCoverPos}rem` }}>
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

                                <ResultContainer
                                    key={rowIndex}
                                    locked={rowIndex !== currentRow}
                                    result={results[rowIndex]}
                                />
                            </div>
                        ))}

                    </div>
                </div>
            </div>

            <MessageDialog ref={dialogRef} title={dialogTitle} message={dialogMessage} />
        </>
    );
}

export default App;
