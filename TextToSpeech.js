import React, { useState, useEffect } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import TextArea from "./components/TextArea";
import VoiceSelection from "./components/VoiceSelection";
import './TextToSpeech.css';

function TextToSpeech() {

    const [id, setId] = useState(1);
    const [title, setTitle] = useState('Text 1');
    const [text, setText] = useState('');
    const [volume, setVolume] = useState(0.9);
    const [wordTimings, setWordTimings] = useState([]);
    const [preparedWords, setPreparedWords] = useState([]);
    const { speak, cancel, speaking } = useSpeechSynthesis();
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [uploadedTextCounter, setUploadedTextCounter] = useState(2);
    const [isVisibile, setIsVisible] = useState(false);

    useEffect(() => {
        const voices = window.speechSynthesis.getVoices();

        setSelectedVoice(voices[0]);
    }, []);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    }

    const handleTextChange = (e) => {
        setText(e.target.value);
    };

    const handleVoiceChange = (e) => {
        const selectedVoiceName = e.target.value;
        const selectedVoice = window.speechSynthesis.getVoices().find((voice) => voice.name === selectedVoiceName);

        setSelectedVoice(selectedVoice);
    };

    const handleVolumeChange = (e) => {
        setVolume(e.target.value);
    };

    const handleStartPauseSpeech = () => {
        if (speaking === false) {
            const utterance = new SpeechSynthesisUtterance(text);

            utterance.volume = volume;

            if (selectedVoice) {
                utterance.voice = selectedVoice;
            }

            speak(utterance);
        }
        else {
            cancel();
        }
    };

    const handlePrepare = () => {

        /// The average number of characters per syllable for English (Need to add pausa for ',.;:' chars)
        /// The average reading time per character for English (68 ms per character)
        /// Calculate the average reading time per syllable for English

        const words = text.split(' ');
        const averageCharsPerSyllable = 3;
        const averageCharReadingTimeMillis = 68;
        const averageSyllableReadingTimeMillis = averageCharsPerSyllable * averageCharReadingTimeMillis;
        let totalReadingTimeMillis = 0;
        const newWordTimings = [];

        function recordTiming(word) {

            // Calculate the estimated reading time for the word based on its syllables (didn't calculate stops in speech such as ',' '.')

            const syllables = word.length / averageCharsPerSyllable;
            const estimatedReadingTimeMillis = syllables * averageSyllableReadingTimeMillis;
            const newTitle = "Text " + uploadedTextCounter;

            // Convert milliseconds to seconds: ReadingTime / 1000

            newWordTimings.push({
                word,
                startTime: totalReadingTimeMillis / 1000,
                endTime: (totalReadingTimeMillis + estimatedReadingTimeMillis) / 1000,
                readingTime: estimatedReadingTimeMillis / 1000,
            });

            totalReadingTimeMillis += estimatedReadingTimeMillis;
            setTitle(newTitle);
            setUploadedTextCounter(uploadedTextCounter + 1);
            setText("");
        }

        for (const i in words) {
            recordTiming(words[i]);
        }

        setWordTimings(newWordTimings);
        updateOrCreateJSON({
            id: id,
            voiceURI: selectedVoice.voiceURI,
            title: title,
            text: text,
            words: newWordTimings
        });
        setId(id + 1);

        const preparedWordList = words.map((word) => word.trim()).filter((word) => word.length > 0);
        setPreparedWords(preparedWordList);
    };

    const updateOrCreateJSON = (newData) => {

        const filename = 'word_timings.json';

        if (localStorage.getItem(filename)) {
            let existingData = JSON.parse(localStorage.getItem(filename));
            const updatedData = existingData.concat([newData]);

            localStorage.setItem(filename, JSON.stringify(updatedData));
        }
        else {
            localStorage.setItem(filename, JSON.stringify([newData]));
        }
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisibile);
    }

    return (
        <div className="text-to-speech">
            {!isVisibile && <h2 className="title">Choose voice</h2>}
            {!isVisibile && <VoiceSelection onChange={handleVoiceChange} />}
            {isVisibile && <h2 className="title">Provide text</h2>}
            {isVisibile && < TextArea
                title={title}
                text={text}
                onChange={[handleTitleChange, handleTextChange, handleStartPauseSpeech]}
                {...{ handlePrepare }}
            />}
            <button className="continue-button" onClick={toggleVisibility}>Continue</button>
        </div>
    );
}

export default TextToSpeech;