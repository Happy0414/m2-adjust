import { useState } from 'react'
import './code.css'

function Code(){
    const dateTime=new Date();
    const hour=dateTime.getHours();
    const [show, setShow]=useState(false);

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
            <input type="text" className="search" placeholder="検索"></input>
            <select name="sort">
                <option>新しい順</option>
                <option>お気に入り</option>
                <option>古い順</option>
            </select>
            <button onClick={()=>setShow(true)}>+新規作成</button>
            <Modal show={show} setShow={setShow} />
        </div>
    )
}

function Modal({show, setShow}){
    const closeModal=()=>{
        setShow(false)
    }
    if(show){
        return(
            <div id="overlay" onClick={closeModal}>
                <div id="content" onClick={(e)=>e.stopPropagation()}>
                    <p>イベント名</p>
                    <input type="text" name="plan"></input>
                    <p>日付候補</p>
                    <textarea placeholder="例：4/1(月) 18:00~"></textarea>
                    <div className="command">
                        <button onClick={()=>setShow(false)} className="btn close">閉じる</button>
                        <button className="btn next">つくる</button>
                    </div>
                </div>
            </div>
        )
    }else{
        return  null;
    }
    
}

export default Code;