// import { useState } from 'react'
import './code.css'

function Code(){
    const dateTime=new Date();
    const hour=dateTime.getHours();
    // const [show, setShow]=useState(false);

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
            {/* <button onClick={()=>setShow(true)}>+新規作成</button> */}
            {/* <Modal show={show} setShow={setShow}/> */}
        </div>
    )
}

// function Modal({show, setSow}){
//     if(show){
//         return(
//             <div id="overlay">
//                 <div id="content">
//                     <p>あいうえお</p>
//                     <p><button onClick={()=>setShow(false)}>close</button></p>
//                 </div>
//             </div>
//         )
//     }else{
//         return  null;
//     }
    
// }

export default Code;