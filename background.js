chrome.alarms.create('eatReminder', // Creates an alarm called eatReminder
{ 
delayInMinutes: 0.05, // 3 seconds
periodInMinutes: 180
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'eatReminder') {
      chrome.tabs.query({active: true, currentWindow: true }, function(tabs) {
          tabs.forEach(function(tab) {
              // Use chrome.scripting.executeScript to inject the content script
              chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ['content.js']
              }, () => {
                  // After content script injection, send a message to it
                  chrome.tabs.sendMessage(tab.id, { action: 'spawnWidget' });
              });
          });
      });
  }
});

