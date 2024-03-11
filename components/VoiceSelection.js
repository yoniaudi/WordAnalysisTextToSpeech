import React, { useState } from 'react';
import VoiceListItem from './VoiceListItem';
import './VoiceSelection.css';

function VoiceSelection(props) {
    const [selectedVoice, setSelectedVoice] = useState(null);

    const handleVoiceChange = (selectedVoiceName) => {
        setSelectedVoice(selectedVoiceName);
    };

    const displayName = [
        'Deep voice',
        'Base voice',
        'Tenor voice',
        'Soft voice',
        'Strong voice'
    ]

    const listOfChosenMaleVoices = [
        'Microsoft David - English (United States)',
        'Microsoft Mark - English (United States)',
        'Microsoft Asaf - Hebrew (Israel)',
        'Google Nederlands',
        'Google UK English Male'
    ];

    const listOfChosenFemaleVoices = [
        'Microsoft Zira - English (United States)',
        'Google UK English Female',
        'Google polski',
        'Google US English',
        'Google italiano'
    ];

    const filteredMaleVoices = window.speechSynthesis.getVoices().filter(voice =>
        listOfChosenMaleVoices.includes(voice.name)
    );

    const filteredFemaleVoices = window.speechSynthesis.getVoices().filter(voice =>
        listOfChosenFemaleVoices.includes(voice.name)
    );

    return (
        <div className="voice-selection">
            <div className="voice-list" onChange={props.onChange}>
                {filteredMaleVoices.map((voice, index) => (
                    <div><VoiceListItem
                        key={voice.name}
                        voice={voice}
                        selected={selectedVoice === voice.name}
                        onChange={() => handleVoiceChange(voice.name)}
                        displayName={displayName[index]}
                    /></div>
                ))}
            </div>
            <div className="voice-list" onChange={props.onChange}>
                {filteredFemaleVoices.map((voice, index) => (
                    <div><VoiceListItem
                        key={voice.name}
                        voice={voice}
                        selected={selectedVoice === voice.name}
                        onChange={() => handleVoiceChange(voice.name)}
                        displayName={displayName[index]}
                    /></div>
                ))}
            </div>
        </div>
    );
}

export default VoiceSelection;