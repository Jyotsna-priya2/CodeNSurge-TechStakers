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

export default translateText;