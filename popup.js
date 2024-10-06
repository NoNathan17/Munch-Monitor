function updateCurrentReminder(hours, minutes) { // updates current reminder display
    const reminderText = `Current reminder: ${hours} hour(s) and ${minutes} minute(s)`;
    console.log(`Current reminder updated to ${reminderText}`)
    document.getElementById('currentReminder').textContent = reminderText;
}

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get({ currentReminder: { hours: 0, minutes: 0 } }, (result) => {
        const { hours, minutes } = result.currentReminder;
        updateCurrentReminder(hours, minutes); // displays the saved reminder
    });
});

document.getElementById('setReminder').addEventListener('click', () => {
    const hours = parseInt(document.getElementById('hours').value) || 0; // default 0 if empty
    const minutes = parseInt(document.getElementById('minutes').value) || 0; 
    
    // calculate total interval in minutes
    const totalInterval = (hours * 60) + minutes;

    // check if the total interval is a valid number
    if (isNaN(totalInterval) || totalInterval <= 0) {
        alert('Please enter a valid number greater than 0.');
        return;
    }

    // sends a message to background.js to create the alarm
    chrome.runtime.sendMessage({ action: 'setReminder', interval: totalInterval }, (response) => {
        if (response.status === 'success') {
            updateCurrentReminder(response.hours, response.minutes); // update the displayed reminder
        }
    });
});
