function StartCallButton() {

    // const render = ()=>{
    //     console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>',store.getState().toString())
    // }
    // store.subscribe(render)
    
    // const render2 = ()=>{
    //     console.log('----------------------------',store2.getState().toString())
    // }
    // store2.subscribe(render2)

    const [disabled,setDisabled] = useState(true)
    // const [loading,setLoading] = useState(false)

    const buttonClickHandler = useCallback(() => {

        // $(this).attr('disabled', true).unbind('click');
            // Make sure the browser supports WebRTC
            if(!Janus.isWebrtcSupported()) {
                bootbox.alert("No WebRTC support... ");
                return;
            }
            setDisabled(true)
            // setLoading(true)
            // Create session
            janus = new Janus(
                {
                    server: server,
                    iceServers: iceServers,
                    // Should the Janus API require authentication, you can specify either the API secret or user token here too
                    //		token: "mytoken",
                    //	or
                    //		apisecret: "serversecret",
                    success: function() {
                        // Attach to VideoCall plugin
                        janus.attach(
                            {
                                plugin: "janus.plugin.videocall",
                                opaqueId: opaqueId,
                                success: function(pluginHandle) {
                                    $('#details').remove();
                                    videocall = pluginHandle;
                                    Janus.log("Plugin attached! (" + videocall.getPlugin() + ", id=" + videocall.getId() + ")");
                                    // Prepare the username registration
                                    $('#videocall').removeClass('hide').show();
                                    $('#login').removeClass('hide').show();
                                    $('#registernow').removeClass('hide').show();
                                    $('#register').click(registerUsername);
                                    $('#username').focus();
                                    $('#start').removeAttr('disabled').html("Stop")
                                        .click(function() {
                                            $(this).attr('disabled', true);
                                            // store.dispatch({type:'INCREMENT'})
                                            // store2.dispatch(increment())
                                            janus.destroy();
                                        });
                                },
                                error: function(error) {
                                    Janus.error("  -- Error attaching plugin...", error);
                                    bootbox.alert("  -- Error attaching plugin... " + error);
                                },
                                consentDialog: function(on) {
                                    Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
                                    if(on) {
                                        // Darken screen and show hint
                                        $.blockUI({
                                            message: '<div><img src="up_arrow.png"/></div>',
                                            css: {
                                                border: 'none',
                                                padding: '15px',
                                                backgroundColor: 'transparent',
                                                color: '#aaa',
                                                top: '10px',
                                                left: (navigator.mozGetUserMedia ? '-100px' : '300px')
                                            } });
                                    } else {
                                        // Restore screen
                                        $.unblockUI();
                                    }
                                },
                                iceState: function(state) {
                                    Janus.log("ICE state changed to " + state);
                                },
                                mediaState: function(medium, on, mid) {
                                    Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium + " (mid=" + mid + ")");
                                },
                                webrtcState: function(on) {
                                    Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                                    $("#videoleft").parent().unblock();
                                },
                                slowLink: function(uplink, lost, mid) {
                                    Janus.warn("Janus reports problems " + (uplink ? "sending" : "receiving") +
                                        " packets on mid " + mid + " (" + lost + " lost packets)");
                                },
                                onmessage: function(msg, jsep) {
                                    Janus.debug(" ::: Got a message :::", msg);
                                    var result = msg["result"];
                                    if(result) {
                                        if(result["list"]) {
                                            var list = result["list"];
                                            Janus.debug("Got a list of registered peers:", list);
                                            for(var mp in list) {
                                                Janus.debug("  >> [" + list[mp] + "]");
                                            }
                                        } else if(result["event"]) {
                                            var event = result["event"];
                                            if(event === 'registered') {
                                                myusername = escapeXmlTags(result["username"]);
                                                Janus.log("Successfully registered as " + myusername + "!");
                                                $('#youok').removeClass('hide').show().html("Registered as '" + myusername + "'");
                                                // Get a list of available peers, just for fun
                                                videocall.send({ message: { request: "list" }});
                                                // Enable buttons to call now
                                                $('#phone').removeClass('hide').show();
                                                $('#call').unbind('click').click(doCall);
                                                $('#peer').focus();
                                            } else if(event === 'calling') {
                                                Janus.log("Waiting for the peer to answer...");
                                                // TODO Any ringtone?
                                                bootbox.alert("Waiting for the peer to answer...");
                                            } else if(event === 'incomingcall') {
                                                Janus.log("Incoming call from " + result["username"] + "!");
                                                yourusername = escapeXmlTags(result["username"]);
                                                // Notify user
                                                bootbox.hideAll();
                                                incoming = bootbox.dialog({
                                                    message: "Incoming call from " + yourusername + "!",
                                                    title: "Incoming call",
                                                    closeButton: false,
                                                    buttons: {
                                                        success: {
                                                            label: "Answer",
                                                            className: "btn-success",
                                                            callback: function() {
                                                                incoming = null;
                                                                $('#peer').val(result["username"]).attr('disabled', true);
                                                                videocall.createAnswer(
                                                                    {
                                                                        jsep: jsep,
                                                                        // We want bidirectional audio and video, if offered,
                                                                        // plus data channels too if they were negotiated
                                                                        tracks: [
                                                                            { type: 'audio', capture: true, recv: true },
                                                                            { type: 'video', capture: true, recv: true },
                                                                            { type: 'data' },
                                                                        ],
                                                                        success: function(jsep) {
                                                                            Janus.debug("Got SDP!", jsep);
                                                                            var body = { request: "accept" };
                                                                            videocall.send({ message: body, jsep: jsep });
                                                                            $('#peer').attr('disabled', true);
                                                                            $('#call').removeAttr('disabled').html('Hangup')
                                                                                .removeClass("btn-success").addClass("btn-danger")
                                                                                .unbind('click').click(doHangup);
                                                                        },
                                                                        error: function(error) {
                                                                            Janus.error("WebRTC error:", error);
                                                                            bootbox.alert("WebRTC error... " + error.message);
                                                                        }
                                                                    });
                                                            }
                                                        },
                                                        danger: {
                                                            label: "Decline",
                                                            className: "btn-danger",
                                                            callback: function() {
                                                                doHangup();
                                                            }
                                                        }
                                                    }
                                                });
                                            } else if(event === 'accepted') {
                                                bootbox.hideAll();
                                                var peer = escapeXmlTags(result["username"]);
                                                if(!peer) {
                                                    Janus.log("Call started!");
                                                } else {
                                                    Janus.log(peer + " accepted the call!");
                                                    yourusername = peer;
                                                }
                                                // Video call can start
                                                if(jsep)
                                                    videocall.handleRemoteJsep({ jsep: jsep });
                                                $('#call').removeAttr('disabled').html('Hangup')
                                                    .removeClass("btn-success").addClass("btn-danger")
                                                    .unbind('click').click(doHangup);
                                            } else if(event === 'update') {
                                                // An 'update' event may be used to provide renegotiation attempts
                                                if(jsep) {
                                                    if(jsep.type === "answer") {
                                                        videocall.handleRemoteJsep({ jsep: jsep });
                                                    } else {
                                                        videocall.createAnswer(
                                                            {
                                                                jsep: jsep,
                                                                // We want bidirectional audio and video, if offered,
                                                                // plus data channels too if they were negotiated
                                                                tracks: [
                                                                    { type: 'audio', capture: true, recv: true },
                                                                    { type: 'video', capture: true, recv: true },
                                                                    { type: 'data' },
                                                                ],
                                                                success: function(jsep) {
                                                                    Janus.debug("Got SDP!", jsep);
                                                                    var body = { request: "set" };
                                                                    videocall.send({ message: body, jsep: jsep });
                                                                },
                                                                error: function(error) {
                                                                    Janus.error("WebRTC error:", error);
                                                                    bootbox.alert("WebRTC error... " + error.message);
                                                                }
                                                            });
                                                    }
                                                }
                                            } else if(event === 'hangup') {
                                                Janus.log("Call hung up by " + result["username"] + " (" + result["reason"] + ")!");
                                                // Reset status
                                                bootbox.hideAll();
                                                videocall.hangup();
                                                if(spinner)
                                                    spinner.stop();
                                                $('#waitingvideo').remove();
                                                $('#videos').hide();
                                                $('#peer').removeAttr('disabled').val('');
                                                $('#call').removeAttr('disabled').html('Call')
                                                    .removeClass("btn-danger").addClass("btn-success")
                                                    .unbind('click').click(doCall);
                                                $('#toggleaudio').attr('disabled', true);
                                                $('#togglevideo').attr('disabled', true);
                                                $('#bitrate').attr('disabled', true);
                                                $('#curbitrate').hide();
                                                $('#curres').hide();
                                            } else if(event === "simulcast") {
                                                // Is simulcast in place?
                                                var substream = result["substream"];
                                                var temporal = result["temporal"];
                                                if((substream !== null && substream !== undefined) || (temporal !== null && temporal !== undefined)) {
                                                    if(!simulcastStarted) {
                                                        simulcastStarted = true;
                                                        addSimulcastButtons(result["videocodec"] === "vp8");
                                                    }
                                                    // We just received notice that there's been a switch, update the buttons
                                                    updateSimulcastButtons(substream, temporal);
                                                }
                                            }
                                        }
                                    } else {
                                        // FIXME Error?
                                        var error = msg["error"];
                                        bootbox.alert(error);
                                        if(error.indexOf("already taken") > 0) {
                                            // FIXME Use status codes...
                                            $('#username').removeAttr('disabled').val("");
                                            $('#register').removeAttr('disabled').unbind('click').click(registerUsername);
                                        }
                                        // TODO Reset status
                                        videocall.hangup();
                                        if(spinner)
                                            spinner.stop();
                                        $('#waitingvideo').remove();
                                        $('#videos').hide();
                                        $('#peer').removeAttr('disabled').val('');
                                        $('#call').removeAttr('disabled').html('Call')
                                            .removeClass("btn-danger").addClass("btn-success")
                                            .unbind('click').click(doCall);
                                        $('#toggleaudio').attr('disabled', true);
                                        $('#togglevideo').attr('disabled', true);
                                        $('#bitrate').attr('disabled', true);
                                        $('#curbitrate').hide();
                                        $('#curres').hide();
                                        if(bitrateTimer)
                                            clearInterval(bitrateTimer);
                                        bitrateTimer = null;
                                    }
                                },
                                onlocaltrack: function(track, on) {
                                    Janus.debug("Local track " + (on ? "added" : "removed") + ":", track);
                                    // We use the track ID as name of the element, but it may contain invalid characters
                                    var trackId = track.id.replace(/[{}]/g, "");
                                    if(!on) {
                                        // Track removed, get rid of the stream and the rendering
                                        var stream = localTracks[trackId];

                                        if(stream) {
                                            try {
                                                var tracks = stream.getTracks();
                                                for(var i in tracks) {
                                                    var mst = tracks[i];
                                                    if(mst !== null && mst !== undefined)
                                                        mst.stop();
                                                }
                                            } catch(e) {}
                                        }
                                        if(track.kind === "video") {
                                            $('#myvideo' + trackId).remove();
                                            localVideos--;
                                            if(localVideos === 0) {
                                                // No video, at least for now: show a placeholder
                                                if($('#videoleft .no-video-container').length === 0) {
                                                    $('#videoleft').append(
                                                        '<div class="no-video-container">' +
                                                            '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                                            '<span class="no-video-text">No webcam available</span>' +
                                                        '</div>');
                                                }
                                            }
                                        }
                                        delete localTracks[trackId];
                                        return;
                                    }
                                    // If we're here, a new track was added
                                    var stream = localTracks[trackId];
                                    if(stream) {
                                        // We've been here already
                                        return;
                                    }
                                    if($('#videoleft video').length === 0) {
                                        $('#videos').removeClass('hide').show();
                                    }
                                    if(track.kind === "audio") {
                                        // We ignore local audio tracks, they'd generate echo anyway
                                        if(localVideos === 0) {
                                            // No video, at least for now: show a placeholder
                                            if($('#videoleft .no-video-container').length === 0) {
                                                $('#videoleft').append(
                                                    '<div class="no-video-container">' +
                                                        '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                                        '<span class="no-video-text">No webcam available</span>' +
                                                    '</div>');
                                            }
                                        }
                                    } else {
                                        // New video track: create a stream out of it
                                        localVideos++;
                                        $('#videoleft .no-video-container').remove();
                                        stream = new MediaStream([track]);
                                        store2.dispatch(setLocalStream(stream))
                                        localTracks[trackId] = stream;
                                        Janus.log("Created local stream:", stream);
                                        $('#videoleft').append('<video class="rounded centered" id="myvideo' + trackId + '" width="100%" height="100%" autoplay playsinline muted="muted"/>');
                                        Janus.attachMediaStream($('#myvideo' + trackId).get(0), stream);
                                    }
                                    if(videocall.webrtcStuff.pc.iceConnectionState !== "completed" &&
                                            videocall.webrtcStuff.pc.iceConnectionState !== "connected") {
                                        $("#videoleft").parent().block({
                                            message: '<b>Publishing...</b>',
                                            css: {
                                                border: 'none',
                                                backgroundColor: 'transparent',
                                                color: 'white'
                                            }
                                        });
                                    }
                                },
                                onremotetrack: function(track, mid, on) {
                                    Janus.debug("Remote track (mid=" + mid + ") " + (on ? "added" : "removed") + ":", track);
                                    if(!on) {
                                        // Track removed, get rid of the stream and the rendering
                                        var stream = remoteTracks[mid];
                                        if(stream) {
                                            try {
                                                var tracks = stream.getTracks();
                                                for(var i in tracks) {
                                                    var mst = tracks[i];
                                                    if(mst)
                                                        mst.stop();
                                                }
                                            } catch(e) {}
                                        }
                                        $('#peervideo' + mid).remove();
                                        if(track.kind === "video") {
                                            remoteVideos--;
                                            if(remoteVideos === 0) {
                                                // No video, at least for now: show a placeholder
                                                if($('#videoright .no-video-container').length === 0) {
                                                    $('#videoright').append(
                                                        '<div class="no-video-container">' +
                                                            '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                                            '<span class="no-video-text">No remote video available</span>' +
                                                        '</div>');
                                                }
                                            }
                                        }
                                        delete remoteTracks[mid];
                                        return;
                                    }
                                    // If we're here, a new track was added
                                    var addButtons = false;
                                    if($('#videoright audio').length === 0 && $('#videoright video').length === 0) {
                                        addButtons = true;
                                        $('#videos').removeClass('hide').show();
                                    }
                                    if(track.kind === "audio") {
                                        // New audio track: create a stream out of it, and use a hidden <audio> element
                                        stream = new MediaStream([track]);
                                        remoteTracks[mid] = stream;
                                        Janus.log("Created remote audio stream:", stream);
                                        $('#videoright').append('<audio class="hide" id="peervideo' + mid + '" autoplay playsinline/>');
                                        Janus.attachMediaStream($('#peervideo' + mid).get(0), stream);
                                        if(remoteVideos === 0) {
                                            // No video, at least for now: show a placeholder
                                            if($('#videoright .no-video-container').length === 0) {
                                                $('#videoright').append(
                                                    '<div class="no-video-container">' +
                                                        '<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
                                                        '<span class="no-video-text">No webcam available</span>' +
                                                    '</div>');
                                            }
                                        }
                                    } else {
                                        // New video track: create a stream out of it
                                        remoteVideos++;
                                        $('#videoright .no-video-container').remove();
                                        stream = new MediaStream([track]);
                                        store2.dispatch(setRemoteStream(stream))
                                        remoteTracks[mid] = stream;
                                        Janus.log("Created remote video stream:", stream);
                                        $('#videoright').append('<video class="rounded centered" id="peervideo' + mid + '" width="100%" height="100%" autoplay playsinline/>');
                                        Janus.attachMediaStream($('#peervideo' + mid).get(0), stream);

                                        // Note: we'll need this for additional videos too
                                        if(!bitrateTimer) {
                                            $('#curbitrate').removeClass('hide').show();
                                            bitrateTimer = setInterval(function() {
                                                if(!$("#peervideo" + mid).get(0))
                                                    return;
                                                // Display updated bitrate, if supported
                                                var bitrate = videocall.getBitrate();
                                                //~ Janus.debug("Current bitrate is " + videocall.getBitrate());
                                                $('#curbitrate').text(bitrate);
                                                // Check if the resolution changed too
                                                var width = $("#peervideo" + mid).get(0).videoWidth;
                                                var height = $("#peervideo" + mid).get(0).videoHeight;
                                                if(width > 0 && height > 0)
                                                    $('#curres').removeClass('hide').text(width+'x'+height).show();
                                            }, 1000);
                                        }
                                    }
                                    if(!addButtons)
                                        return;
                                    // Enable audio/video buttons and bitrate limiter
                                    audioenabled = true;
                                    videoenabled = true;
                                    $('#toggleaudio').removeAttr('disabled').click(
                                        function() {
                                            audioenabled = !audioenabled;
                                            if(audioenabled)
                                                $('#toggleaudio').html("Disable audio").removeClass("btn-success").addClass("btn-danger");
                                            else
                                                $('#toggleaudio').html("Enable audio").removeClass("btn-danger").addClass("btn-success");
                                            videocall.send({ message: { request: "set", audio: audioenabled }});
                                        });
                                    $('#togglevideo').removeAttr('disabled').click(
                                        function() {
                                            videoenabled = !videoenabled;
                                            if(videoenabled)
                                                $('#togglevideo').html("Disable video").removeClass("btn-success").addClass("btn-danger");
                                            else
                                                $('#togglevideo').html("Enable video").removeClass("btn-danger").addClass("btn-success");
                                            videocall.send({ message: { request: "set", video: videoenabled }});
                                        });
                                    $('#toggleaudio').parent().removeClass('hide').show();
                                    $('#bitrate a').removeAttr('disabled').click(function() {
                                        var id = $(this).attr("id");
                                        var bitrate = parseInt(id)*1000;
                                        if(bitrate === 0) {
                                            Janus.log("Not limiting bandwidth via REMB");
                                        } else {
                                            Janus.log("Capping bandwidth to " + bitrate + " via REMB");
                                        }
                                        $('#bitrateset').html($(this).html() + '<span class="caret"></span>').parent().removeClass('open');
                                        videocall.send({ message: { request: "set", bitrate: bitrate }});
                                        return false;
                                    });
                                },
                                ondataopen: function(data) {
                                    Janus.log("The DataChannel is available!");
                                    $('#videos').removeClass('hide').show();
                                    $('#datasend').removeAttr('disabled');
                                },
                                ondata: function(data) {
                                    Janus.debug("We got data from the DataChannel!", data);
                                    $('#datarecv').val(data);
                                },
                                oncleanup: function() {
                                    Janus.log(" ::: Got a cleanup notification :::");
                                    $("#videoleft").empty().parent().unblock();
                                    $('#videoright').empty();
                                    $('#callee').empty().hide();
                                    yourusername = null;
                                    $('#curbitrate').hide();
                                    $('#curres').hide();
                                    $('#videos').hide();
                                    $('#toggleaudio').attr('disabled', true);
                                    $('#togglevideo').attr('disabled', true);
                                    $('#bitrate').attr('disabled', true);
                                    $('#curbitrate').hide();
                                    $('#curres').hide();
                                    if(bitrateTimer)
                                        clearInterval(bitrateTimer);
                                    bitrateTimer = null;
                                    $('#videos').hide();
                                    simulcastStarted = false;
                                    $('#simulcast').remove();
                                    $('#peer').removeAttr('disabled').val('');
                                    $('#call').removeAttr('disabled').html('Call')
                                        .removeClass("btn-danger").addClass("btn-success")
                                        .unbind('click').click(doCall);
                                    localTracks = {};
                                    localVideos = 0;
                                    remoteTracks = {};
                                    remoteVideos = 0;
                                }
                            });
                    },
                    error: function(error) {
                        Janus.error(error);
                        bootbox.alert(error, function() {
                            window.location.reload();
                        });
                    },
                    destroyed: function() {
                        window.location.reload();
                    }
                });

    },[])
    

    useEffect(()=>{
        Janus.init({debug: true, callback: function() {
            // Use a button to start the demo
            setDisabled(false)
            // setLoading(false)
        }});
    },[])


    
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{
                display:'grid',
                // flex:1,
                minWidth:'100%',
                height:"100%",
                // backgroundColor:'blue'

            }}
            >

            <Button 
                variant="contained" 
                onClick={buttonClickHandler}
                disabled={disabled}
                // loading={loading.toString()}
                // loadingPosition="start"
            >
                Start Call
            </Button>          
            </Grid>
    ) 
    }
    