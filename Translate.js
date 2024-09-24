import React, { useState } from 'react';
import axios from 'axios';

const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://translation.googleapis.com/language/translate/v2';

const translateText = async (text, targetLanguage) => {
  const params = {
    key: apiKey,
    q: text,
    target: targetLanguage,
  };

  try {
    const response = await axios.post(apiUrl, params);
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const Translate = ({ text, targetLanguage, setTranslatedText }) => {
  const handleTranslate = async () => {
    const translatedText = await translateText(text, targetLanguage);
    setTranslatedText(translatedText);
  };

  return (
    <div>
      <select value={targetLanguage} onChange={(e) => setTargetLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        {/* add more languages as needed */}
      </select>
      <button onClick={handleTranslate}>Translate</button>
    </div>
  );
};

export default Translate;