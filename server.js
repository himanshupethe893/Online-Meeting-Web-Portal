// const express = require("express");
// const path = require("path");
// const app = express();
// const server = app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

// const io = require("socket.io")(server, {
//     allowEIO3: true, // Use this only if needed
// });

// // Serve static files from the '' directory
// app.use(express.static(path.join(__dirname, "")));
// var userConnections = [];
// // Handle socket connections
// io.on("connection", (socket) => {
//     console.log("Socket connected with ID:", socket.id);
//     socket.on("userconnect", (data)=>{
//         console.log("userconnect", data.displayName, data.meeting_id);
//         var other_users = userConnections.filter((p)=> p.meeting_id ==data.meetingid);
//         userConnections.push({
//             connectionId: socket.id,
//             user_id: data.displayName,
//             meeting_id: data.meeting_id,
//         });

//         other_users.forEach((v)=>{
//             socket.to(v.connectionId).emit("inform_others_about_me",{
//                 other_user_id: data.displayName,
//                 connId: socket.id,
//             })
//         })
//         socket.emit("inform _me_about_other_user", other_users);
//     });
//     socket.on("SDPProcess", (data)=>{
//         socket.to(data.to_connid).emit("SDPProcess",{
//             message: data.message,
//             from_connid: socket.id,
//         })
//     })
// });
////////////////////////////////////////////////////////////
// // // server.js
// const express = require("express");
// const path = require("path");
// const app = express();
// const server = app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

// const io = require("socket.io")(server, {
//     allowEIO3: true, // Use this only if needed
// });

// // Serve static files from the current directory
// app.use(express.static(path.join(__dirname, "")));

// let userConnections = [];

// // Handle socket connections
// io.on("connection", (socket) => {
//     console.log("Socket connected with ID:", socket.id);

//     socket.on("userconnect", (data) => {
//         console.log("User connected:", data.displayName, data.meeting_id);

//         // Find other users in the same meeting
//         const otherUsers = userConnections.filter(
//             (user) => user.meeting_id === data.meeting_id
//         );

//         // Add the new user to the userConnections array
//         userConnections.push({
//             connectionId: socket.id,
//             user_id: data.displayName,
//             meeting_id: data.meeting_id,
//         });

//         // Inform other users about the new user
//         otherUsers.forEach((user) => {
//             socket.to(user.connectionId).emit("inform_others_about_me", {
//                 other_user_id: data.displayName,
//                 connId: socket.id,
//                 meeting_id : data.meeting_id,
//             });
//         });

//         // Inform the new user about other users
//         socket.emit("inform_me_about_other_users", otherUsers);
//     });

//     socket.on("SDPProcess", (data) => {
//         socket.to(data.to_connid).emit("SDPProcess", {
//             message: data.message,
//             from_connid: socket.id,
//         });
//     });

    
    
// });




// //admin_signup code for database connectivity
// // const express = require('express');
// const mysql = require('mysql');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt');

// // const app = express();
// const port = 3000;

// // Middleware
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

// // MySQL Connection
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root', // Replace with your MySQL username
//     password: 'Him@nshu2003', // Replace with your MySQL password
//     database: 'faculty_db' // Replace with your database name
// });

// // Connect to Database
// db.connect((err) => {
//     if (err) {
//         console.error('Error connecting to the database:', err);
//         return;
//     }
//     console.log('Connected to the MySQL database.');
// });

// // Route to handle signup
// app.post('/signup', async (req, res) => {
//     const { fname, email, password, repassword } = req.body;

//     // Validation: Check if passwords match
//     if (password !== repassword) {
//         return res.status(400).send('Passwords do not match.');
//     }

//     try {
//         // Hash the password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // Insert user into the database
//         const query = 'INSERT INTO faculties (name, email, password) VALUES (?, ?, ?)';
//         db.query(query, [fname, email, hashedPassword], (err, result) => {
//             if (err) {
//                 console.error('Error inserting user into the database:', err);
//                 return res.status(500).send('Error occurred during signup.');
//             }
//             res.status(200).send('Signup successful!');
//         });
//     } catch (error) {
//         console.error('Error hashing password:', error);
//         res.status(500).send('Server error.');
//     }
// });

// // Serve the frontend
// app.use(express.static('')); // Assume your HTML and CSS are in the 'public' folder

// // Start the server
// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

//server.js
const express = require("express");
const http = require("http");
const path = require("path");
const app = express();
const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

const io = require("socket.io")(server, {
    allowEIO3: true,
});

let adminConnections = new Map(); // Map to track admin status for each meeting
let meetingStatus = new Map(); // Map to track if admin
let userConnections = [];
// Serve static files
app.use(express.static(path.join(__dirname)));



// Socket.io functionality
io.on("connection", (socket) => {
    console.log("Socket connected with ID:", socket.id);

    socket.on("userconnect", (data) => {
        console.log("User connected:", data.displayName, data.meeting_id);

        const isAdmin = data.isAdmin || false;
        const meetingId = data.meeting_id;

        if (!isAdmin && !meetingStatus.get(meetingId)) {
            socket.emit("meeting_error", {
                message: "Please wait for the admin to start the meeting."
            });
            return;
        }

        // If admin is connecting
        if (isAdmin) {
            adminConnections.set(meetingId, socket.id);
            meetingStatus.set(meetingId, true);
            console.log(`Admin joined meeting: ${meetingId}`);
        }

        // Check if the user_id already exists in the meeting
        var isDuplicateUser = userConnections.some(
            (user) =>
                user.user_id === data.displayName &&
                user.meeting_id === data.meeting_id
        );

        if (isDuplicateUser) {
            // console.log(
            //     `Duplicate user_id '${data.displayName}' attempted to join meeting '${data.meeting_id}'.`
            // );

            // Inform the client about the duplicate user_id
            socket.emit("duplicate_user", {
                message: `User ID '${data.displayName}' already exists in meeting '${data.meeting_id}'.`,
            });

            // Optionally disconnect the socket to clean up state
            socket.disconnect();
            return; // Stop further execution for this connection
        }



        // if (user.user_id === data.displayName && user.meeting_id===data.meeting_id){
        //     res.redirect("/action.html");
        // }
        // Get other users in the meeting
        const otherUsers = userConnections.filter(
            (user) => user.meeting_id === data.meeting_id
        );

        // Add the new user connection
        userConnections.push({
            connectionId: socket.id,
            user_id: data.displayName,
            meeting_id: data.meeting_id,
            isAdmin: isAdmin,
        });

        // Notify other users about the new connection
        otherUsers.forEach((user) => {
            socket.to(user.connectionId).emit("inform_others_about_me", {
                other_user_id: data.displayName,
                connId: socket.id,
                meeting_id: data.meeting_id,
                isAdmin: isAdmin,
            });
        });

        
        // Inform the new user about other users
        socket.emit("inform_me_about_other_users", otherUsers);

        otherUsers.forEach((user) => {
            socket.to(user.connectionId).emit("alert_new_user_joined", {
                new_user: data.displayName,
            });
        });
    });

    socket.on("SDPProcess", (data) => {
        socket.to(data.to_connid).emit("SDPProcess", {
            message: data.message,
            from_connid: socket.id,
        });
    });

    socket.on("endCall", (data) => {
        console.log(`User ${data.displayName} is leaving the meeting.`);

        const user = userConnections.find((u) => u.connectionId === socket.id);
        if (user) {
            socket.to(user.meeting_id).emit("userLeft", {
                connid: socket.id,
                userId: user.user_id,
                isAdmin: isAdmin,
            });
        }
        userConnections = userConnections.filter(
            (user) => user.connectionId !== socket.id
        );
    });

    socket.on("disconnect", () => {
        console.log(`Socket ${socket.id} disconnected.`);
        
        // Check if disconnected user was an admin
        for (let [meetingId, adminId] of adminConnections.entries()) {
            if (adminId === socket.id) {
                // Notify all users in the meeting that admin has left
                const meetingUsers = userConnections.filter(
                    user => user.meeting_id === meetingId
                );
                meetingUsers.forEach(user => {
                    io.to(user.connectionId).emit("admin_left");
                });
                adminConnections.delete(meetingId);
                meetingStatus.set(meetingId, false);
                break;
            }
        }
        // const index = userConnections.findIndex(p => p.connectionId === socket.id);
        // if (index !== -1) {
        //     userConnections.splice(index, 1);
        // }
        // socket.emit("userdisconnect", { connid: socket.id });

        // Handle regular user disconnection
        const leavingUser = userConnections.find(
            (user) => user.connectionId === socket.id
        );
        
        if (leavingUser) {
            const { meeting_id, user_id } = leavingUser;
            
            // Inform other users about the disconnection
            userConnections
                .filter(
                    (user) =>
                        user.meeting_id === meeting_id &&
                        user.connectionId !== socket.id
                )
                .forEach((user) => {
                    socket.to(user.connectionId).emit("userLeft", {
                        connid: socket.id,
                        userId: user_id,
                        // isAdmin: isAdmin
                    });
                });
                
            // Remove the user from the connection list
            userConnections = userConnections.filter(
                (user) => user.connectionId !== socket.id
            );
        }
    });
});



// MySQL setup for admin signup
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");

// Middleware for parsing requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Replace with your MySQL username
    password: "Him@nshu2003", // Replace with your MySQL password
    database: "faculty_db", // Replace with your database name
});

// Connect to Database
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
        return;
    }
    console.log("Connected to the MySQL database.");
});

// app.use(express.static(path.join(__dirname)));
app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "admin_sigup.html"));
});
// Route to handle signup
// Route to handle signup
app.post("/signup", async (req, res) => {
    const { fname, email, password, repassword } = req.body;

    // Validation: Check if all fields are provided
    if (!fname || !email || !password || !repassword) {
        return res.status(400).json({ message: "All fields are required." });
    }

    // Validation: Check if passwords match
    if (password !== repassword) {
        return res.status(400).json({ message: "Passwords do not match." });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user into the database
        const query = "INSERT INTO faculties (name, email, password) VALUES (?, ?, ?)";
        db.query(query, [fname, email, hashedPassword], (err, result) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") {
                    return res.status(400).json({ message: "Email already exists." });
                }
                console.error("Error inserting user into the database:", err);
                // return res.status(500).json({ message: "Error occurred during signup." });
            }

            // Respond with success message
            console.log("Signup successful! Redirecting to login...");
            
            // alert("Signup successful! Redirecting to login...");
            // res.status(200).json({ message: "Signup successful! Redirecting to login..." });
            res.redirect("/login");
        });
    } catch (error) {
        console.error("Error hashing password:", error);
        res.status(500).json({ message: "Server error." });
    }
});

// Serve static files from the main directory
// app.use(express.static(path.join(__dirname)));

// Route to serve login.html
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "admin_login.html"));
});


//admin_login.html

// Route to handle login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    // console.log("Login called")
    // Validate the inputs
    if (!email || !password) {
        return res.status(400).send("Email and password are required.");
    }

    try {
        // Fetch the user from the database
        const query = "SELECT * FROM faculties WHERE email = ?";
        db.query(query, [email], async (err, results) => {
            if (err) {
                console.error("Error querying the database:", err);
                return res.status(500).send("Server error.");
            }

            // Check if the user exists
            if (results.length === 0) {
                return res.status(400).send("Invalid email or password.");
            }

            const user = results[0];
            
            // Compare the hashed password
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                return res.status(400).send("Invalid email or password.");
            }

            // Get the user's name from the database result
            const user_name = user.name; // Assuming the column name in the table is `name`
            console.log("user name:", user_name);
            
            
            // var userName = user_name;
            res.send(`
                <script>
                    sessionStorage.setItem('userName', '${user_name}');
                    window.location.href = '/adminjoin'; // Replace "someMeetingID" with your meeting ID logic
                </script>
            `);
            
            // console.log(userName);
            // sessionStorage.setItem("userName", userName);
            // res.json({ userName: user_name });
            // sessionStorage.setItem("userName", userName);
            // Redirect to the desired route after successful login
            // res.redirect("/adminjoin");
            
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Server error.");
    }
});

// app.use(express.static(path.join(__dirname)));

// Route to serve login.html
app.get("/adminjoin", (req, res) => {
    res.sendFile(path.join(__dirname, "adminjoin.html"));
});

// app.use(express.static(path.join(__dirname)));
app.get("/action", (req, res) => {
    res.sendFile(path.join(__dirname, "action.html"));
});

app.post('/create-meeting', (req, res) => {
    const { meeting_id } = req.body;

    if (!meeting_id || isNaN(meeting_id) || meeting_id < 10000000 || meeting_id > 99999999) {
        return res.status(400).json({ message: "Invalid meeting ID." });
    }

    const query = "INSERT INTO meeting (meeting_id) VALUES (?)";
    db.query(query, [meeting_id], (err, result) => {
        if (err) {
            console.error("Error inserting meeting ID:", err);
            return res.status(500).json({ message: "Failed to insert meeting ID." });
        }
        res.status(200).json({ message: "Meeting ID inserted successfully.", meeting_id: meeting_id });
    });
});

// Endpoint to validate a meeting ID
app.post('/validate-meeting', (req, res) => {
    const { meeting_id } = req.body;

    const query = `
        SELECT meeting_id 
        FROM meeting 
        WHERE meeting_id = ? 
        AND created_at >= NOW() - INTERVAL 1 DAY
    `;

    db.query(query, [meeting_id], (err, results) => {
        if (err) {
            console.error("Error validating meeting ID:", err);
            return res.status(500).json({ message: "Failed to validate meeting ID." });
        }
        if (results.length > 0) {
            res.status(200).json({ message: "Valid meeting ID.", meeting_id: meeting_id });
        } else {
            res.status(400).json({ message: "Invalid or expired meeting ID." });
        }
    });
});


// ----------------------------------------------------------------

// const express = require("express");
// const path = require("path");
// var app = express();
// var server = app.listen(3000, function(){
//     console.log("Server is running on port 3000");
// });

// const io = require("socket.io")(server,{
//     allowEIO3: true, //false by default
// });
// app.use(express.static(path.join(__dirname, "")));
// var userConnections = [];
// io.on("connection", (socket)=>{
//     console.log("socket id is:", socket.id);
//     socket.on("userconnect" , (data)=>{
//         console.log("userconnect", data.displayName, data.meetingid);
//         var other_users = userConnections.filter(
//             (p)=>p.meeting_id == data.meetingid
//         );
//         console.log("userConnect", data.displayName, data.meeting_id);
//         userConnections.push({
//             connectionId: socket.id,
//             user_id: data.displayName,
//             meeting_id: data.meetingid,
//         });

//         other_users.forEach((v)=>{
//             socket.to(v.connectionId).emit("inform_others_about_me", {
//                 connId: socket.id,
//                 other_user_id: data.displayName,
//                 // meeting_id: data.meetingid
//             });
//         });
//         socket.emit("inform_me_about_other_user", other_users);
//     });
//     socket.on("SDPProcess",(data)=>{
//         socket.to(data.to_connid).emit("SDPProcess", {
//             message: data.message,
//             from_connid: socket.id,
//         });
//     });

// });

// -----------------------------------------------------------------
