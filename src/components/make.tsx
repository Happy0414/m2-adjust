import { useState } from 'react'

type Schedule = {
    name: string,
    date1: number,
    date2: number,
    date3: number
}



export default function Make(){
    const [count, setCount] = useState<number>(0);
    const [schedule1, setSchedule] = useState<Schedule>({
        name: 'happy',
        date1: 1,
        date2: 0,
        date3: 2
    })

    const removeSchedule = () =>{
        setSchedule({
            name: '',
            date1: 0,
            date2: 0,
            date3: 0
        })
    }

    const judgeSchedule = (d: number): string =>{
        let j = ''
        
        if(d === 0) j = '×'
        else if(d === 1) j = '◯'
        else j = '△'


        return j
    }


    const addOne = () => {
        setCount(count + 1)
    }

    return (
        <div>
            <p>{count}</p>
            <button onClick={addOne}>+1</button>

            
            <button onClick={removeSchedule}>削除</button>
            <p>名前：{schedule1.name}</p>
            <p>スケジュール1：{schedule1.date1}</p>
            <p>スケジュール2：{schedule1.date2}</p>
            <p>スケジュール3：{schedule1.date3}</p>
            <p>判定</p>
            <p>スケジュール1：{judgeSchedule(schedule1.date1)}</p>
            <p>スケジュール2：{judgeSchedule(schedule1.date2)}</p>
            <p>スケジュール3：{judgeSchedule(schedule1.date3)}</p>
        </div>
    )
}
