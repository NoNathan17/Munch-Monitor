// check if widgetActive is already declared
if (typeof widgetActive === 'undefined') {
    var widgetActive = false; // declare if it hasn't been declared
}
console.log('Content script loaded successfully.');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('Message received in content script:', message);
    
    if (message.action === 'spawnWidget' && !widgetActive) { // only spawns if widget isn't active
        widgetActive = true

        console.log('Spawning widget...');

        const myList = ['pusheen', 'cat', 'dog', 'penguin', 'cow', 'axolotyl', 'eevee', 'milkmocha']
        const randomWidget = myList[Math.floor(Math.random() * myList.length)] // gets a random widget from myList

        const widget = document.createElement('img');
        widget.src = chrome.runtime.getURL('widgets/' + randomWidget + '.gif');
        widget.style.position = 'fixed';
        widget.style.bottom = '20px';
        widget.style.left = '100px';
        widget.style.width = '100px'
        widget.style.height = '100px'
        widget.style.zIndex = '9999';
        document.body.appendChild(widget); // appends the widget to the bottom left of the screen

        // animation logic
        let posX = 0;
        const step = 2; // pixels to move in each step
        const maxX = window.innerWidth; // edge of the window

        function animate() {
            posX += step;
            if (posX == maxX - 116) {
                const messageBubble = document.createElement('div');
                messageBubble.textContent = 'Time to eat!';
                messageBubble.style.fontFamily = 'monospace'
                messageBubble.style.color = 'black'
                messageBubble.style.position = 'fixed';
                messageBubble.style.bottom = '85px'; 
                messageBubble.style.right = '100px'; 
                messageBubble.style.outlineStyle = 'solid'
                messageBubble.style.padding = '10px';
                messageBubble.style.backgroundColor = 'white';
                messageBubble.style.borderRadius = '10px';
                messageBubble.style.zIndex = '9999'
                document.body.appendChild(messageBubble); // appends the message bubble to the screen

                widget.style.position = 'fixed'
                widget.style.bottom = '20px'
                widget.style.left = '90'
                document.body.appendChild(widget); // appends the widget to the bottom right of the screen

            widget.addEventListener('click', function() { // removes the widget and message bubble when the widget is clicked
                document.body.removeChild(widget);
                document.body.removeChild(messageBubble)
                widgetActive = false
            });
                return; // exit the animation loop
        }
        widget.style.left = posX + 'px'; // updates the widgets position
        requestAnimationFrame(animate); // requests next animation frame
        }

        animate();
    }
});
