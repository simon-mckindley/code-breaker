
export default function ResultContainer({ result }) {
    return (
        <div className="guess-result">
            {result.map((color, index) => (
                <span key={index} className={`result ${color}`}></span>
            ))}
        </div>
    );
}