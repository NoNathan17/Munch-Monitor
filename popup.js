function updateCurrentReminder(hours, minutes) { // updates current reminder display
    const reminderText = `Current Reminder Interval: Every ${hours} hour(s) and ${minutes} minute(s)`;
    console.log(`Current reminder updated to ${reminderText}`)
    document.getElementById('currentReminder').textContent = reminderText;
}

function updateTimeLeft() { 
    chrome.alarms.get('eatReminder', (alarm) => {
        if (alarm) {
            const currentTime = Date.now(); 
            const timeLeft = alarm.scheduledTime - currentTime; 

            if (timeLeft > 0) {
                const minutesLeft = Math.floor(timeLeft / 60000); // converts milliseconds to minutes
                const secondsLeft = Math.floor((timeLeft % 60000) / 1000); // gets remaining seconds

                if (minutesLeft >= 60) {
                    // displays hours and minutes if more than an hour left
                    const hoursLeft = Math.floor(minutesLeft / 60);
                    const remainingMinutes = minutesLeft % 60;
                    document.getElementById('timeLeft').textContent = 
                        `Time left: ${hoursLeft} hour(s) and ${remainingMinutes} minute(s)`;

                } else {
                    // displays minutes and seconds if less than an hour left
                    document.getElementById('timeLeft').textContent = 
                        `Time left: ${minutesLeft} minute(s) and ${secondsLeft} second(s)`;
                }
            } else {
                document.getElementById('timeLeft').textContent = 'Time left: Less than a minute!';
            }
        } else {
            document.getElementById('timeLeft').textContent = 'No reminder set.';
        }
    }); 
}


document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get({ currentReminder: { hours: 0, minutes: 0 } }, (result) => {
        const { hours, minutes } = result.currentReminder;
        updateCurrentReminder(hours, minutes); // displays the saved reminder
    });

    updateTimeLeft(); // updates the remaining time
    setInterval(updateTimeLeft, 1000); // update every second
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
