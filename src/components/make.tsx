import { useState } from 'react'

type Status = "ok" | "pen" | "no"

type Schedule = {
    name: string,
    date1: Status,
    date2: Status,
    date3: Status
}

const dateKeys  = ["date1", "date2", "date3"] 



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

    return (
        <div>
            <div>
                <p>出欠情報を入力</p>
                <input
                    value = {schedule1.name}
                    onChange={(e) => 
                        setSchedule({
                            ...schedule1,
                            name: e.target.value
                        })
                    }
                />
            </div>
            
            {dateKeys.map((key, index) => (
                <div key={key}>
                    <span>スケジュール{index + 1}：</span>
                <button onClick={() => setSchedule({
                    ...schedule1,
                    [key]: "ok"
                })}>○</button>

                <button onClick={() => setSchedule({
                    ...schedule1,
                    [key]: "pen"
                })}>△</button>

                <button onClick={() => setSchedule({
                    ...schedule1,
                    [key]: "no"
                })}>×</button>
                </div>
            ))}

            <button onClick={removeSchedule}>削除</button>
            <p>名前：{schedule1.name}</p>
            <p>スケジュール1：{schedule1.date1}、判定：{judgeSchedule(schedule1.date1)}</p>
            <p>スケジュール2：{schedule1.date2}、判定：{judgeSchedule(schedule1.date2)}</p>
            <p>スケジュール3：{schedule1.date3}、判定：{judgeSchedule(schedule1.date3)}</p>
        </div>
    )
}
