import { useState } from 'react'

export default function Test() {
    const [text, setText] = useState('test')

    return(
        <h1>{text}</h1>
    )
}