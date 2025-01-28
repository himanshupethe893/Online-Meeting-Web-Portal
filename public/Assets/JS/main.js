// document.addEventListener("DOMContentLoaded", () => {
//   // Delay container visibility until heading animation is complete
//   const container = document.querySelector(".container");
//   const heading = document.querySelector(".heading");

//   // First, show the container after heading animation
//   setTimeout(() => {
//     container.classList.remove("hidden");
//   }, 1000); // 1000ms delay to match the heading animation

//   // Hide the heading after the animation
//   setTimeout(() => {
//     heading.style.display = "none";
//   }, 3000); // Assuming 3000ms to allow the heading to stay visible during the animation time

//   // Get DOM elements for role selection and buttons
//   const roleSelect = document.getElementById("roleSelect");
//   const confirmRoleBtn = document.getElementById("confirmRoleBtn");
//   const meetingOptions = document.getElementById("meetingOptions");
//   const roleSelection = document.getElementById("roleSelection");
//   const newMeetingBtn = document.getElementById("newMeetingBtn");
//   const joinBtn = document.getElementById("joinBtn");
//   const codeInput = document.getElementById("codeInput");
//   const emailInput = document.getElementById("email-id");

//   // Role confirmation logic with email validation
//   confirmRoleBtn.addEventListener("click", () => {
//     const selectedRole = roleSelect.value;
//     const email = emailInput.value.trim();

//     if (!selectedRole) {
//       alert("Please select a role to proceed.");
//       return;
//     }

//     if (!validateEmail(email)) {
//       alert("Please enter a valid email address.");
//       return;
//     }

//     roleSelection.classList.add("hidden"); // Hide role selection
//     meetingOptions.classList.remove("hidden"); // Show meeting options

//     if (selectedRole === "admin") {
//       alert(`Welcome Admin! Email: ${email}`);
//     } else {
//       alert(`Welcome Intern! Email: ${email}`);
//     }
//   });

//   // Email validation function
//   function validateEmail(email) {
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     return emailRegex.test(email);
//   }

//   // New Meeting button logic
//   newMeetingBtn.addEventListener("click", () => {
//     alert("New Meeting Created!");
//   });

//   // Join Meeting button logic
//   joinBtn.addEventListener("click", () => {
//     const meetingCode = codeInput.value.trim();
//     if (meetingCode) {
//       alert(`Joining meeting with code: ${meetingCode}`);
//     } else {
//       alert("Please enter a valid meeting code.");
//     }
//   });

//   // Cursor customization logic
//   const cursor = document.getElementById("cursor");

//   document.addEventListener("mousemove", (e) => {
//     cursor.style.top = `${e.clientY}px`;
//     cursor.style.left = `${e.clientX}px`;
//   });

//   document.addEventListener("mousedown", () => {
//     cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
//     cursor.style.transition = "transform 0.2s ease";
//   });

//   document.addEventListener("mouseup", () => {
//     cursor.style.transform = "translate(-50%, -50%) scale(1)";
//     cursor.style.transition = "transform 0.2s ease";
//   });
// });

// // Meeting scheduling logic
// function scheduleMeeting(event) {
//   event.preventDefault();

//   // Get meeting details from the form
//   const name = document.getElementById("meetingName").value.trim();
//   const date = document.getElementById("meetingDate").value;
//   const time = document.getElementById("meetingTime").value;

//   if (!name || !date || !time) {
//     alert("Please fill all fields before scheduling.");
//     return;
//   }

//   // Create a new list item for the scheduled meeting
//   const newMeeting = document.createElement("li");
//   newMeeting.innerHTML = `
//     <strong>${name}</strong> - ${time}, ${new Date(date).toLocaleDateString()}
//     <button class="button" onclick="alert('Joining ${name} Meeting')">Join</button>
//   `;

//   // Add the new meeting to the scheduled meetings list
//   document.getElementById("scheduledMeetingsList").appendChild(newMeeting);

//   // Clear the form
//   document.getElementById("scheduleMeetingForm").reset();
//   alert("Meeting scheduled successfully!");
// }




document.addEventListener("DOMContentLoaded", () => {
  // Delay container visibility until heading animation is complete
  const container = document.querySelector(".container");
  const heading = document.querySelector(".heading");

  // First, show the container after heading animation
  setTimeout(() => {
    container.classList.remove("hidden");
  }, 1000); // 1000ms delay to match the heading animation

  setTimeout(() => {
    heading.classList.add("shift-up");
  }, 2000); // Shift the heading after 2 seconds


  // Get DOM elements for role selection and buttons
  const confirmRoleBtn = document.getElementById("confirmRoleBtn");
  const meetingOptions = document.getElementById("meetingOptions");
  const usernameInput = document.getElementById("username");
  const organizationInput = document.getElementById("organization");
  const emailInput = document.getElementById("email-id");
  const joinBtn = document.getElementById("joinBtn");
  const codeInput = document.getElementById("codeInput");

  // Role confirmation logic with email validation
  confirmRoleBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    const organization = organizationInput.value.trim();
    const email = emailInput.value.trim();

    if (!username || !organization || !email) {
      alert("Please fill in all fields.");
      return;
    }

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    meetingOptions.classList.remove("hidden"); // Show meeting options
  });

  // Email validation function
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Join Meeting button logic
  joinBtn.addEventListener("click", () => {
    const meetingCode = codeInput.value.trim();
    if (meetingCode) {
      // alert(`Joining meeting with code: ${meetingCode}`);
    } else {
      alert("Please enter a valid meeting code.");
    }
  });

  // Cursor customization logic
  const cursor = document.getElementById("cursor");

  document.addEventListener("mousemove", (e) => {
    cursor.style.top = `${e.clientY}px`;
    cursor.style.left = `${e.clientX}px`;
  });

  document.addEventListener("mousedown", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1.5)";
    cursor.style.transition = "transform 0.2s ease";
  });

  document.addEventListener("mouseup", () => {
    cursor.style.transform = "translate(-50%, -50%) scale(1)";
    cursor.style.transition = "transform 0.2s ease";
  });
});
