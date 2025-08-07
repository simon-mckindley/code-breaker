
export default function ResultContainer({ result }) {
    return (
        <div className={'guess-result'}>
            {result.map((color, index) => {
                const pegged = color ? true : false;

                return <span key={index} data-peg={pegged} className={`result ${color}`}></span>
            })}
        </div>
    );
}