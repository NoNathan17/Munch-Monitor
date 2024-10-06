let widgetActive = false // checks if widget is active

function createAlarm(interval) {
  chrome.alarms.clear('eatReminder', () => { // clears any existing alarms
    console.log('Previous alarm cleared');
  });

  chrome.alarms.create('eatReminder', // Creates an alarm called eatReminder
  { 
  delayInMinutes: 0.05, // 3 seconds
  periodInMinutes: interval
  });

}

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

// Listen for messages from the popup to set a new reminder
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setReminder') {
      const interval = message.interval; // Get the interval from the message
      createAlarm(interval); // Call the function to create the alarm
      sendResponse({ status: 'success', message: `Reminder set for every ${interval} minutes!` });
  }
});


