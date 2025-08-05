
export default function ResultContainer({ result, locked }) {
    return (
        <div className={`guess-result ${locked ? 'locked' : ''}`}>
            {result.map((color, index) => {
                const pegged = color ? true : false;

                return <span key={index} data-peg={pegged} className={`result ${color}`}></span>
            })}
        </div>
    );
}