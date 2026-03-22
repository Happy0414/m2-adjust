import { useState } from 'react'

type Schedule = {
    date1: number,
    date2: number,
    date3: number
}

const schedule1: Schedule = {
    date1: 1,
    date2: 0,
    date3: 2
}

export default function Make(){
    const [count, setCount] = useState<number>(0);

    const addOne = () => {
        setCount(count + 1)
    }

    return (
        <div>
            <p>{count}</p>
            <button onClick={addOne}>+1</button>
        </div>
    )
}
