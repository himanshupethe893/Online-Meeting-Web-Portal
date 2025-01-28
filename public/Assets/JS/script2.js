$(function () {
    // Retrieve the userName from sessionStorage
    let userName = sessionStorage.getItem("userName");

    // If no userName is found, prompt for the name
    if (!userName) {
        // userName = prompt("Please enter your name:");
        if (userName) {
            sessionStorage.setItem("userName", userName); // Save user name to sessionStorage
        } else {
            alert("Name is required to join the meeting.");
            return window.location.href="/action.html";
        }
    }

    // Parse URL parameters to get the meeting ID
    const urlParams = new URLSearchParams(window.location.search);
    var meeting_id = urlParams.get("meetingID");

    
    // Validate meeting ID and userName
    if (!userName || !meeting_id) {
        alert("User Name or Meeting ID is missing. Please try again.");
        window.location.href = "/action.html";
        return;
    }

    console.log("User Name:", userName);
    console.log("Meeting ID:", meeting_id);

    // Initialize the application
    MyApp._init(userName, meeting_id);

    // Function to retrieve participants from localStorage
    const getParticipantsFromStorage = () => {
        const participants = JSON.parse(localStorage.getItem("participants")) || [];
        console.log("Retrieved participants from storage:", participants); // Debugging log
        return participants;
    };

    // Function to store participants in localStorage
    const saveParticipantsToStorage = (participants) => {
        console.log("Saving participants to storage:", participants); // Debugging log
        localStorage.setItem("participants", JSON.stringify(participants));
    };

    // Function to update the participants list in the DOM
    const updateParticipantsList = () => {
        const participants = getParticipantsFromStorage(); // Get participants from storage
        const participantsList = document.querySelector('.participants-list'); // Select participants list container

        if (!participantsList) {
            console.error("Participants list element not found!"); // Debugging log
            return;
        }

        participantsList.innerHTML = ""; // Empty the list to avoid duplicates

        participants.forEach(participant => {
            const listItem = document.createElement('li');
            listItem.textContent = participant;
            participantsList.appendChild(listItem);
        });

        console.log("Updated participants list in DOM:", participants); // Debugging log
    };

    // Function to add a participant
    const addParticipant = (name) => {
        if (name && typeof name === "string") {
            const participants = getParticipantsFromStorage(); // Get existing participants
            if (!participants.includes(name)) { // Only add if not already in the list
                participants.push(name); // Add new participant
                saveParticipantsToStorage(participants); // Save to localStorage
                updateParticipantsList(); // Update the list in the DOM
            } else {
                console.log(`Participant '${name}' already exists.`); // Debugging log
            }
        } else {
            console.error("Invalid participant name:", name); // Debugging log
        }
    };

    // Function to remove a participant (only removes the specified participant)
    const removeParticipant = (name) => {
        if (name && typeof name === "string") {
            const participants = getParticipantsFromStorage(); // Get existing participants
            const updatedParticipants = participants.filter(participant => participant !== name); // Remove the specified participant
            saveParticipantsToStorage(updatedParticipants); // Save updated list to localStorage
            updateParticipantsList(); // Update the list in the DOM
        } else {
            console.error("Invalid participant name for removal:", name); // Debugging log
        }
    };

    // Event listener for the participants button to toggle the list
    document.querySelector('.control-btn.participants')?.addEventListener('click', function () {
        const participantsPopup = document.querySelector('.participants-popup');
        if (participantsPopup) {
            participantsPopup.classList.toggle('hidden');
            updateParticipantsList(); // Make sure to update the list when toggling
        } else {
            console.error("Participants popup element not found!"); // Debugging log
        }
    });

    // Event listener for closing the participants popup
    document.querySelector('.close-participants')?.addEventListener('click', function () {
        const participantsPopup = document.querySelector('.participants-popup');
        if (participantsPopup) {
            participantsPopup.classList.add('hidden');
        } else {
            console.error("Close participants element not found!"); // Debugging log
        }
    });

    // Add the current user to the participants list
    addParticipant(userName);

    // Automatically remove the current user when they leave (beforeunload event)
    window.addEventListener('beforeunload', () => {
        removeParticipant(userName); // Remove only the current user from the participants list
    });

    // Simulate adding/removing participants dynamically (e.g., through WebSocket)
    window.addParticipant = addParticipant; // Expose addParticipant method globally
    window.removeParticipant = removeParticipant; // Expose removeParticipant method globally

});
