document.getElementById('setReminder').addEventListener('click', () => {
    const hours = parseInt(document.getElementById('hours').value) || 0; // Default to 0 if empty
    const minutes = parseInt(document.getElementById('minutes').value) || 0; // Default to 0 if empty
    
    // Calculate total interval in minutes
    const totalInterval = (hours * 60) + minutes;

    // Check if the total interval is a valid number
    if (isNaN(totalInterval) || totalInterval <= 0) {
        alert('Please enter a valid number greater than 0.');
        return;
    }
    
    // Clear any existing alarms
    chrome.alarms.clear('eatReminder', () => {
        console.log('Previous alarm cleared');
    });

    // Create a new alarm with the total interval
    chrome.alarms.create('eatReminder', {
        delayInMinutes: totalInterval,
        periodInMinutes: totalInterval,
    });

    console.log('New alarm created');
});
