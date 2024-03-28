chrome.alarms.create('eatReminder', // Creates an alarm called eatReminder
{ 
delayInMinutes: 0.083, // 5 seconds
periodInMinutes: 180
});

chrome.alarms.onAlarm.addListener(function(alarm) {
  if (alarm.name === 'eatReminder') {
    chrome.tabs.query({ currentWindow: true }, function(tabs) {
      tabs.forEach(function(tab) {
          chrome.tabs.sendMessage(tab.id, { action: 'spawnWidget' });
      });
    });
  }
});
