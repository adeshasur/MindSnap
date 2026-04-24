document.addEventListener('DOMContentLoaded', () => {
  const btnSummarize = document.getElementById('btnSummarize');
  const btnMCQ = document.getElementById('btnMCQ');
  const inputText = document.getElementById('inputText');
  const resultBox = document.getElementById('resultBox');
  const apiKeyInput = document.getElementById('apiKey');
  const saveKeyBtn = document.getElementById('saveKey');

  // Load saved API key
  chrome.storage.local.get(['geminiApiKey'], (data) => {
    if (data.geminiApiKey) apiKeyInput.value = data.geminiApiKey;
  });

  saveKeyBtn.addEventListener('click', () => {
    chrome.storage.local.set({ geminiApiKey: apiKeyInput.value }, () => {
      saveKeyBtn.textContent = "Saved!";
      setTimeout(() => saveKeyBtn.textContent = "Save Key", 2000);
    });
  });

  function processText(action) {
    const text = inputText.value.trim();
    if (!text) {
      resultBox.textContent = "Please enter some text first!";
      return;
    }
    
    resultBox.innerHTML = "<span style='color: white;'>Thinking... ⚡</span>";
    
    chrome.runtime.sendMessage({ action: action, text: text }, (response) => {
      if (response.error) {
        resultBox.textContent = "Error: " + response.error;
      } else {
        // Format response a bit
        resultBox.innerHTML = response.result.replace(/\n/g, '<br>');
      }
    });
  }

  btnSummarize.addEventListener('click', () => processText('SUMMARIZE'));
  btnMCQ.addEventListener('click', () => processText('GENERATE_MCQ'));
});
