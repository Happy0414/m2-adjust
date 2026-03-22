import { useState } from 'react'

type Status = "ok" | "pen" | "no"

type Schedule = {
    name: string,
    date1: Status,
    date2: Status,
    date3: Status
}



export default function Make(){
    const [count, setCount] = useState<number>(0);
    const [schedule1, setSchedule] = useState<Schedule>({
        name: 'happy',
        date1: "ok",
        date2: "pen",
        date3: "no"
    })

    const removeSchedule = () =>{
        setSchedule({
            name: '',
            date1: "no",
            date2: "no",
            date3: "no"
        })
    }

    const judgeSchedule = (d: Status): string =>{
        let j = ''
        
        if(d === "no") j = '×'
        else if(d === "ok") j = '◯'
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
            <p>スケジュール1：{schedule1.date1}、判定：{judgeSchedule(schedule1.date1)}</p>
            <p>スケジュール2：{schedule1.date2}、判定：{judgeSchedule(schedule1.date2)}</p>
            <p>スケジュール3：{schedule1.date3}、判定：{judgeSchedule(schedule1.date3)}</p>
        </div>
    )
}
