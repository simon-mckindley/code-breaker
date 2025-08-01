import Peg from './components/Peg';
import AnswerSlot from './components/AnswerSlot';
import GuessSlot from './components/GuessSlot';
import ResultSlot from './components/ResultSlot';

export default function CodeBreaker() {
  const positions = ['one', 'two', 'three', 'four'];
  const pegColors = ['red', 'blue', 'green', 'orange', 'purple', 'brown'];

  return (
    <>
      <div className="heading-wrapper">
        <h1>Code Breaker</h1>
      </div>

      <div className="center-wrapper">
        
        <div className="peg-wrapper">
          {pegColors.map(color => (
            <Peg key={color} color={color} />
          ))}
        </div>

        <div className="game-wrapper">
          <div className="inner answer-wrapper">
            {positions.map(pos => (
              <AnswerSlot key={pos} position={pos} />
            ))}
          </div>

          <div className="guess-wrapper">
            {[...Array(10)].map((_, i) => (
              <div key={i} id={`guess-${i + 1}`}>
                <div className="inner guess-inner">
                  {positions.map(pos => (
                    <GuessSlot key={pos} position={pos} />
                  ))}
                </div>
                <div className="inner guess-result">
                  <ResultSlot position="one" />
                  <ResultSlot position="two" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
