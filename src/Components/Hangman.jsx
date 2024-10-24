import { useRef } from "react";
import { useEffect, useState } from "react"

export default function Hangman() {
    const [word, setWord] = useState("");
    const [len, setLen] = useState(Math.floor(Math.random() * 2) + 4);
    const [guessedWord, setGuessedWord] = useState("");
    const [choices, setChoices] = useState(5);
    const [options, setOptions] = useState([]);
    const [gameWon, setGameWon] = useState(false);
    const inputRef = useRef(null)


    let URL = `https://random-word-api.herokuapp.com/word?length=${len}`

    let getWord = async () => {
        let response = await fetch(URL)
        let data = await response.json()
        setWord(data[0].toUpperCase())
    }

    let handleInputChange = (event) => {
        setGuessedWord(event.target.value)
    }

    let handleSubmit = (event) => {
        event.preventDefault()
        if (guessedWord) {
            if (guessedWord.toUpperCase() === word) {
                setGameWon(true)
            } else {
                setChoices(choices - 1);
                setGuessedWord("")
            }
        }
        inputRef.current.focus()
    }

    let handleOptionClick = (option) => {
        setGuessedWord(guessedWord + option)
    }


    useEffect(() => {
        getWord()
    }, [])


    useEffect(() => {
        if (word) {
            let shuffledOptions = [...word].sort(() => Math.random() - 0.5);
            setOptions(shuffledOptions);
            console.log(shuffledOptions)
            console.log(word)
        }
    }, [word]);
    return (
        <>
            <h2>Hangman Game | Guess the word</h2>
            {
                choices ?
                    <>
                        <div>
                            <h3>Lives: {choices}</h3>
                        </div>
                        <h3>Options:</h3>
                        <div style={{margin: '10px 0 50px 0'}}>
                        {options.map((option) => {
                            return (
                                <button
                                    style={{
                                        margin: '10px',
                                        color: '#fff', fontSize: '17px'
                                    }}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.toUpperCase()}
                                </button>
                            )
                        })}
                        </div>
                        {
                            !gameWon ?
                                <form onSubmit={handleSubmit}>
                                    <input
                                        type="text"
                                        onChange={handleInputChange}
                                        value={guessedWord}
                                        style={{
                                            height: '1.5rem',
                                            fontWeight: 'bold'
                                        }}
                                        ref={inputRef}
                                    />
                                    <button type="submit" style={{marginTop: '10px'}}>Submit</button>
                                </form>
                                :
                                <>
                                    <h3>Congratulations! You guessed right!</h3>
                                    <h4>The correct word: {word}</h4>
                                </>
                        }
                    </>

                    :

                    <>
                        <h3>Game Over!</h3>
                        <h4>The correct word: {word}</h4>
                    </>
            }
        </>
    )
}