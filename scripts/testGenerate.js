(async ()=>{
  try {
    const { GoogleGenAI } = require('@google/genai');
    const apiKey = require('fs').readFileSync('c:/Users/avina/skill-path/.env.local','utf8').split('=')[1].trim();
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Test prompt: say hello`;
    const response = await ai.models.generateContent({
      model: 'models/gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    console.log('RESPONSE_KEYS:', Object.keys(response));
    try { console.log('RESPONSE_TEXT:', response.text); } catch(e){ console.error('TEXT_ERR', e); }
    try { console.log('RESPONSE_JSON:', JSON.stringify(response, null, 2)); } catch(e) { console.error('STRINGIFY_ERR', e); }
  } catch (err) {
    console.error('ERR', err);
  }
})();
