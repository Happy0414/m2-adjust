import { useState, useEffect } from 'react'

function Code(){
    const dateTime=new Date();
    const hour=dateTime.getHours();

    const message=
        hour>=5 && hour<10
        ? "おはようございます"
        : hour>=17
        ? "こんばんは"
        : "こんにちは";

    return (
        <div>
            <h1>タイトル</h1>
            <h2>{message}</h2>
            <input type="text" placeholder="検索"></input>
            <select name="sort">
                <option>新しい順</option>
                <option>お気に入り</option>
                <option>古い順</option>
            </select>
            <button>+新規作成</button>
        </div>
    )
}

export default Code;

// const Timer=()=>{
//     //状態管理
//     const [time, setTime]=useState(0);
//     const [isRunning, setIsRunning]=useState(false);

//     useEffect(()=>{
//         if(isRunning){
//             const interval=setInterval(()=>{
//                 setTime((prevTime)=>prevTime+1);
//             },1000);

//             return ()=>clearInterval(interval);
//         }
//     },[isRunning]);

//     const startTimer=()=>setIsRunning(true);
//     const stopTimer=()=>setIsRunning(false);
//     const resetTimer=()=>{
//         setIsRunning(false);
//         setTime(0);
//     };

//     return (
//         <div>
//             <h1>{time}秒</h1>
//             <button onClick={startTimer} disabled={isRunning}>
//                 開始
//             </button>
//             <button onClick={stopTimer} disabled={!isRunning}>
//                 停止
//             </button>
//             <button onClick={resetTimer}>リセット</button>
//         </div>
//     );
// };
// export default Timer;

// const RealtimeClock=()=>{
//     const dateTime=new Date();
//     const time=dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getSeconds();

//     return(
//         <div>
//             <p>{time}</p>
//         </div>
//     )
// }

// export default RealtimeClock;