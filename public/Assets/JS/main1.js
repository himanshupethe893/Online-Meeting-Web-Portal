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
      alert(`Joining meeting with code: ${meetingCode}`);
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
