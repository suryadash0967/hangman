import { useEffect, useState } from "react"
import TextField from '@mui/material/TextField';

export default function Hangman() {
    const [word, setWord] = useState("");
    const [len, setLen] = useState(Math.floor(Math.random() * 2) + 4);
    const [guessedWord, setGuessedWord] = useState("");
    const [choices, setChoices] = useState(5);
    const [options, setOptions] = useState([]);
    const [gameWon, setGameWon] = useState(false);


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
                        {options.map((option) => {
                            return (
                                <button
                                    style={{
                                        margin: '10px 10px 50px 10px',
                                        color: '#fff', fontSize: '17px'
                                    }}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.toUpperCase()}
                                </button>
                            )
                        })}
                        {
                            !gameWon ?
                                <form onSubmit={handleSubmit} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px'}}>
                                    <TextField
                                        type="text"
                                        id="outlined-basic"
                                        label="Enter Word"
                                        variant="outlined"
                                        onChange={handleInputChange}
                                        value={guessedWord}
                                    />
                                    <button type="submit">Submit</button>
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
                        <h2>Game Over!</h2>
                        <h3>The correct word: {word}</h3>
                    </>
            }
        </>
    )
}