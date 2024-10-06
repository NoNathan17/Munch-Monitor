function createAlarm(interval) {
  chrome.alarms.create('eatReminder', // creates an alarm called eatReminder
  { 
  delayInMinutes: 0.05, 
  periodInMinutes: interval
  });

  console.log('New alarm created!')
}


chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'eatReminder') {
      chrome.tabs.query({active: true, currentWindow: true }, function(tabs) {
          tabs.forEach(function(tab) {
            if (!tab.url || tab.url.startsWith('chrome://')) { // can't inject script into chrome
              console.log("Cannot inject into chrome:// URLs.");
              return;
          } 
              // injects the content script
              chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  files: ['content.js']
              }, () => {
                  // sends message to content script
                  chrome.tabs.sendMessage(tab.id, { action: 'spawnWidget' });
              });
          });
      });
  }
});

// listen for messages from the popup to set a new reminder
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'setReminder') {
      const interval = message.interval; // gets the interval from the message
      
      chrome.alarms.clear('eatReminder', () => {
        console.log('Previous alarm cleared');
        createAlarm(interval); // Create the new alarm after clearing the old one


        // saves current reminder time to storage
        const hours = Math.floor(interval / 60);
        const minutes = interval % 60;
        chrome.storage.local.set({ currentReminder: { hours, minutes } });

        console.log(`Current Reminder saved to storage`)

        sendResponse({ status: 'success', hours, minutes, message: `Reminder set for every ${interval} minutes!` });
    });
    return true; // ensures asynchronous response send
  }
});


