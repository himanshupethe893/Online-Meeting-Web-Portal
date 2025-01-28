document.addEventListener('DOMContentLoaded', () => {
    const presentScreenButton = document.querySelector('.control-btn.present-screen');
    const presenrVideo = document.getElementById('presenr');
    const userContainer = document.getElementById('user1212');
    const presentationContainer = document.getElementById('presentationContainer');
    let screenStream;
    let isPresenting = false; // Track presentation state

    const updateLayout = (isPresenting) => {
        if (isPresenting) {
            // Adjust layout when presenting screen
            userContainer.style.flex = '0 0 40%'; // 40% width for user container
            userContainer.style.overflowY = 'auto'; // Allow scrolling if content overflows
            presentationContainer.style.flex = '0 0 60%'; // 60% width for presentation container
            presentationContainer.style.display = 'flex';

            // Adjust individual user divs
            const userDivs = userContainer.querySelectorAll('.userbox');
            userDivs.forEach(div => {
                div.style.flex = '1 1 45%'; // Make each div take 45% of the available width within the 40% container
                div.style.margin = '10px'; // Add margin for proper spacing
            });
        } else {
            // Adjust layout when not presenting screen
            userContainer.style.flex = '1'; // Full width for user container
            userContainer.style.overflowY = 'hidden'; // No scrolling required
            presentationContainer.style.display = 'none'; // Hide the presentation container

            // Reset individual user divs
            const userDivs = userContainer.querySelectorAll('.userbox');
            userDivs.forEach(div => {
                div.style.flex = '1 1 30%'; // Revert to original sizing
                div.style.margin = '5px';
            });
        }
    };

    // Toggle screen sharing
    presentScreenButton.addEventListener('click', async () => {
        if (isPresenting) {
            // Stop screen sharing
            if (screenStream) {
                const tracks = screenStream.getTracks();
                tracks.forEach(track => track.stop());
                screenStream = null;
            }
            presenrVideo.srcObject = null;
            updateLayout(false);
            isPresenting = false;
        } else {
            // Start screen sharing
            try {
                screenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                });
                // Assign the screen stream to the presenr video element
                presenrVideo.srcObject = screenStream;
                presenrVideo.play();

                // Update layout to presenting mode
                updateLayout(true);
                isPresenting = true;

                // Handle stream end
                screenStream.getTracks().forEach(track => {
                    track.onended = () => {
                        presenrVideo.srcObject = null;
                        updateLayout(false);
                        isPresenting = false;
                    };
                });
            } catch (err) {
                console.error('Error sharing screen:', err);
                alert('Screen sharing failed. Please try again.');
            }
        }
    });

    // Initial layout when the page loads
    updateLayout(false);
});
