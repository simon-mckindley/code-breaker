
export default function AnswerSlot({ color }) {
    return (
        <div className='answer'>
            {color && <div className={`peg ${color}`} />}
        </div>
    );
}
