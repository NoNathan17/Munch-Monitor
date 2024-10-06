chrome.alarms.create('eatReminder', // Creates an alarm called eatReminder
{ 
delayInMinutes: 0.05, // 3 seconds
periodInMinutes: 180
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'eatReminder') {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
          tabs.forEach(function(tab) {
              // Inject content script first
              chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ['content.js']
              }, () => {
                  // After injection, send a message to the content script
                  chrome.tabs.sendMessage(tab.id, { action: 'spawnWidget' });
              });
          });
      });
  }
});
