chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  chrome.storage.local.get(['geminiApiKey'], async (data) => {
    const apiKey = data.geminiApiKey;
    
    if (!apiKey) {
      sendResponse({ error: "Please save your Gemini API Key in the settings first." });
      return;
    }

    let prompt = "";
    if (request.action === 'SUMMARIZE') {
      prompt = "You are a study assistant. Provide a highly concise, bulleted summary of the following text:\n\n" + request.text;
    } else if (request.action === 'GENERATE_MCQ') {
      prompt = "Generate 3 multiple-choice questions based on the following text. Format it clearly with options A, B, C, D and the correct answer at the end:\n\n" + request.text;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const resultData = await response.json();
      
      if (resultData.error) {
         sendResponse({ error: resultData.error.message });
      } else {
         const textResult = resultData.candidates[0].content.parts[0].text;
         sendResponse({ result: textResult });
      }

    } catch (error) {
      sendResponse({ error: "Failed to connect to AI." });
    }
  });

  return true; // Keep the message channel open for async response
});
