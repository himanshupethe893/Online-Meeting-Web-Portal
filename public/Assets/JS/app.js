//app.js
var AppProcess = (function () {
    var peers_connection_ids = [];
    var peers_connection = [];
    var remote_vid_stream = [];
    var remote_aud_stream = [];
    var local_div;
    var serverProcess;
    var audio;
    var isAudioMute = true;
    var video_states = {
        None: 0,
        Camera: 1,
        ScreenShare: 2,
    };
    var video_st = video_states.None;
    var videoCamTrack;
    var rtp_aud_senders = [];
    var rtp_vid_senders = [];

    async function _init(SDP_function, my_connid) {
        serverProcess = SDP_function;
        my_connection_id = my_connid;
        eventProcess();
        AppProcess.local_div = document.getElementById("LocalVideoPlayer");
    }

    function eventProcess() {
        $("#miceMuteUnmute").on("click", async function () {
            if (!audio) {
                await loadAudio();
            }
            if (!audio) {
                alert("Audio permission has not been granted");
                return;
            }
            if (isAudioMute) {
                audio.enabled = true;
                $(this).html("<span class='material-icons'>mic</span>");
                updateMediaSenders(audio, rtp_aud_senders);
            } else {
                audio.enabled = false;
                $(this).html("<span class='material-icons'>mic_off</span>");
                removeMediaSenders(rtp_aud_senders);
            }
            isAudioMute = !isAudioMute;
        });

        // Mute All Button Click Event
        $("#muteAllBtn").on("click", function () {
            muteAllParticipants();
        });



        $("#videoCamOnOff").on("click", async function () {
            const videoButton = $(this);
            
            try {
                if (video_st == video_states.Camera) {
                    // Turn off
                    await videoProcess(video_states.None);
                    videoButton.html("<span class='material-icons'>videocam_off</span>");
                } else if (video_st == video_states.None || video_st == video_states.ScreenShare) {
                    // Turn on
                    await videoProcess(video_states.Camera);
                    videoButton.html("<span class='material-icons'>videocam</span>");
                }
            } catch (err) {
                console.error("Error toggling video:", err);
                // Reset button to appropriate state
                const icon = (video_st == video_states.Camera) ? 
                    "videocam" : "videocam_off";
                videoButton.html(`<span class='material-icons'>${icon}</span>`);
            }
        });

        $("#btnScreenShareOnOff").on("click", async function () {
            if (video_st == video_states.ScreenShare) {
                await videoProcess(video_states.None);
            } else {
                await videoProcess(video_states.ScreenShare);
            }
        });

        $("#end-call").on("click", function () {
            console.log("End Call button clicked");
            if (confirm("Are you sure you want to leave the meeting?")) {
                console.log("Confirmed leave");
        
                // Stop local media tracks
                if (AppProcess.local_div && AppProcess.local_div.srcObject) {
                    AppProcess.local_div.srcObject.getTracks().forEach((track) => {
                        track.stop();
                    });
                    AppProcess.local_div.srcObject = null; // Clear reference
                } else {
                    console.warn("local_div is not initialized or srcObject is null");
                }
        
                // Close peer connections
                for (let connid in AppProcess.peers_connection) {
                    if (AppProcess.peers_connection[connid]) {
                        AppProcess.peers_connection[connid].close();
                        AppProcess.peers_connection[connid] = null;
                    }
                }
        
                // Notify the server if socket is defined
                if (typeof socket !== "undefined" && socket !== null) {
                    socket.emit("endCall", { connid: socket.id, displayName: user_id });
                    socket.disconnect();
                } else {
                    console.warn("Socket is not defined or initialized");
                }
        
                // Redirect to 'action.html'
                console.log("Redirecting to action.html");
                window.location.href = "/action.html";
            }
        });
        
        
        
        
        
    }

    async function loadAudio() {
        try {
            const astream = await navigator.mediaDevices.getUserMedia({
                video: false,
                audio: true,
            });
            audio = astream.getAudioTracks()[0];
            audio.enabled = false;
        } catch (e) {
            console.log("Audio error:", e);
        }
    }

    async function videoProcess(newVideoState) {
        try {
            // If switching to None state, stop existing tracks
            if (newVideoState == video_states.None) {
                if (videoCamTrack) {
                    videoCamTrack.stop();
                    videoCamTrack = null;
                }
                if (AppProcess.local_div.srcObject) {
                    AppProcess.local_div.srcObject.getTracks().forEach(track => track.stop());
                    AppProcess.local_div.srcObject = null;
                }
                removeMediaSenders(rtp_vid_senders);
                video_st = newVideoState;  // Update state
                return;
            }
    
            // Get new video stream
            var vstream = null;
            if (newVideoState == video_states.Camera) {
                vstream = await navigator.mediaDevices.getUserMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
            } else if (newVideoState == video_states.ScreenShare) {
                vstream = await navigator.mediaDevices.getDisplayMedia({
                    video: { width: { ideal: 1280 }, height: { ideal: 720 } },
                    audio: false,
                });
            }
    
            // Stop existing video track if it exists
            if (videoCamTrack) {
                videoCamTrack.stop();
                videoCamTrack = null;
            }
    
            if (vstream && vstream.getVideoTracks().length > 0) {
                videoCamTrack = vstream.getVideoTracks()[0];
                if (videoCamTrack) {
                    // Stop any existing tracks in local_div
                    if (AppProcess.local_div.srcObject) {
                        AppProcess.local_div.srcObject.getTracks().forEach(track => track.stop());
                    }
                    AppProcess.local_div.srcObject = new MediaStream([videoCamTrack]);
    
                    // Update media senders for all peer connections
                    updateMediaSenders(videoCamTrack, rtp_vid_senders);
                    video_st = newVideoState;  // Update state after successful setup
                }
            }
        } catch (e) {
            console.log("Error in videoProcess:", e);
            // Don't update video_st if there was an error
            throw e;  // Re-throw to be caught by click handler
        }
    }

    // Mute All Functionality
function muteAllParticipants() {
    // Loop through each peer and mute their audio
    for (var connid in peers_connection_ids) {
        if (peers_connection[connid]) {
            peers_connection[connid].getSenders().forEach((sender) => {
                if (sender.track && sender.track.kind === 'audio') {
                    sender.track.enabled = false; // Mute the audio track
                }
            });
        }
    }

    // Mute your own microphone as well
    if (audio) {
        audio.enabled = false;
        $("#miceMuteUnmute").html("<span class='material-icons'>mic_off</span>");
        removeMediaSenders(rtp_aud_senders);
    }
}

    function updateMediaSenders(track, rtp_senders) {
        for (var connid in peers_connection_ids) {
            if (peers_connection[connid]) {
                if (rtp_senders[connid] && rtp_senders[connid].track) {
                    rtp_senders[connid].replaceTrack(track);
                } else {
                    rtp_senders[connid] = peers_connection[connid].addTrack(track);
                }
            }
        }
    }

    function removeMediaSenders(rtp_senders) {
        for (var connid in peers_connection_ids) {
            if (rtp_senders[connid] && peers_connection[connid]) {
                peers_connection[connid].removeTrack(rtp_senders[connid]);
                rtp_senders[connid] = null;
            }
        }
    }

    async function setConnection(connid) {
        if (peers_connection[connid]) {
            console.log("Connection already exists for connid:", connid);
            return;
        }

        const pc = new RTCPeerConnection();
        peers_connection[connid] = pc;

        pc.onicecandidate = (event) => {
            if (event.candidate) {
                serverProcess(JSON.stringify({ ice: event.candidate }), connid);
            }
        };

        pc.ontrack = (event) => {
            if (!remote_vid_stream[connid]) {
                remote_vid_stream[connid] = new MediaStream();
            }
            remote_vid_stream[connid].addTrack(event.track);

            const videoElement = document.getElementById("v_" + connid);
            if (videoElement) {
                videoElement.srcObject = remote_vid_stream[connid];
            }
        };

        if (videoCamTrack) {
            pc.addTrack(videoCamTrack);
        }
        if (audio) {
            pc.addTrack(audio);
        }
    }

    return {
        init: async function (SDP_function, my_connid) {
            await _init(SDP_function, my_connid);
        },
        setNewConnection: async function (connid) {
            await setConnection(connid);
        },
    };
})();

var MyApp = (function () {
    // Socket initialization (early in app.js)
    

    var socket = null;
    var user_id = "";
    var meeting_id = "";
    var isAdmin = false;

    function init(uid, mid) {
        user_id = uid;
        meeting_id = mid;
        isAdmin = sessionStorage.getItem("isAdmin")==="true";
        $("#meetingContainer").show();
        $("#me h2").text(user_id + "(Me)");
        setupUIPrivileges();
        document.title = user_id;

        
        event_process_for_signaling_server();
    }

    function setupUIPrivileges(){
        if (!isAdmin){
            $("#moreOptionsMenu").remove();
            $("#mutebtn").remove();
            $("#waitinglist").remove();
            
            // Remove screen sharing for non-admin users
            $(".present-screen").remove();
            
            // Add visual indicator for admin status
            // $(".bottom-left").append('<div class="admin-status">Participant</div>');

        }
    }

    function event_process_for_signaling_server() {
        

        socket = io.connect();

        socket.on("meeting_error", (data)=>{
            alert(data.message);
            window.location.href="/action"
        });

        socket.on("admin_left", () => {
            alert("The admin has left the meeting. The meeting will end shortly.");
            setTimeout(() => {
                window.location.href = "/action.html";
            }, 5000);
        });

        var SDP_function = function (data, to_connid) {
            socket.emit("SDPProcess", {
                message: data,
                to_connid: to_connid,
            });
        };
        function showPopup(message) {
            console.log('Showing popup with message:', message); // Debugging line
            const popupContainer = $("#popupAlert");
            const popupMessage = $("#popupMessage");
        
            popupMessage.text(message);
            popupContainer.show(); // Show popup
        
            setTimeout(() => {
                closePopup();
            }, 3000);
        }

        function closePopup() {
            console.log('Closing popup'); // Debugging line
            $("#popupAlert").hide(); // Hide the popup
        }
        socket.on("connect", () => {
            if (socket.connected) {
                AppProcess.init(SDP_function, socket.id);
                if (user_id !== "" && meeting_id !== "") {
                    socket.emit("userconnect", {
                        displayName: user_id,
                        meeting_id: meeting_id,
                        isAdmin: isAdmin,
                    });
                }
            }
        });

        socket.on("inform_others_about_me", function (data) {
            addUser(data.other_user_id, data.connId, data.isAdmin);
            AppProcess.setNewConnection(data.connId);

             // Show popup for a user joining
             showPopup(`${data.other_user_id} has joined the meeting.`);
        });

        socket.on("inform_me_about_other_users", function (other_users) {
            if (other_users) {
                for (var i = 0; i < other_users.length; i++) {
                    addUser(
                        other_users[i].user_id,
                        other_users[i].connectionId,
                        other_users[i].isAdmin,
                    );
                    AppProcess.setNewConnection(other_users[i].connectionId);
                }
            }
        });

        socket.on("userLeft", function (data) {
            const { connid, userId } = data;
            console.log(`User ${userId} with connId ${connid} has left.`);

            // Show popup when someone leaves the meeting
            showPopup(`${userId} has left the meeting.`);

            // Stop and release media tracks if they exist
            const videoElement = document.getElementById("v_" + connid);
            if (videoElement?.srcObject) {
                videoElement.srcObject.getTracks().forEach((track) => track.stop());
            }

            // Remove the user's div from the DOM
            $("#" + connid).remove();
        });
        socket.on("duplicate_user", (data) => {
            alert(data.message); // Show the error message
            window.location.href = "/action.html"; // Redirect to the action page
        });
        
    }

    function addUser(other_user_id, connId, isUserAdmin) {
        var newDivId = $("#otherTemplate").clone();
        newDivId = newDivId.attr("id", connId).addClass("other");
        newDivId.find("h2").text(other_user_id + (isUserAdmin ? " (Admin)" : ""));
        // newDivId.find("h2").text(other_user_id);
        newDivId.find("video").attr("id", "v_" + connId);
        newDivId.find("audio").attr("id", "a_" + connId);
        newDivId.show();
        $("#user1212").append(newDivId);
    }

    return {
        _init(uid, mid) {
            init(uid, mid);
        },
    };
})();
