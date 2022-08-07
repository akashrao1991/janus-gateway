
function Call() {

    const [localStream, setLocalStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [remoteStreams, setRemoteStreams] = useState([])

    const subscribeStore = () => {
        const streams = store2.getState().streams
        const local = streams.localStream
        const remotes = streams.remoteStreams
        // console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!',streams.localStream)
        // streams.localStream.getTracks()
        // const remoteStreamsMap = new Map()
        setLocalStream(local)
        // if(local && remotes.length){
        // const remote = remotes.filter(element => element.id!=local.id).pop();
        setRemoteStreams(remotes)
        // }
    }
    store2.subscribe(subscribeStore)

    useEffect(() => {
        // Janus.attachMediaStream($("#localVideo1234").get(0), stream);
        // $("#localVideo1234").srcObject = stream;

        const container = document.getElementById('local-video-container')
        if (localStream) {
            // const url = URL.createObjectURL(stream)
            // const url = 'https://www.youtube.com/watch?v=d46Azg3Pm4c'

            renderReactPlayer(container, { url: localStream, playing: true })
        }

    }, [localStream])

    // useEffect(()=>{
    //     // Janus.attachMediaStream($("#localVideo1234").get(0), stream);
    //     // $("#localVideo1234").srcObject = stream;

    //     const container = document.getElementById('remote-video-container')
    //     if(remoteStream){
    //         // const url = URL.createObjectURL(stream)
    //         // const url = 'https://www.youtube.com/watch?v=d46Azg3Pm4c'

    //         renderReactPlayer(container, { url:remoteStream, playing: true })
    //     }
    //     console.log('++++++++++++++++++++++++++++++',remoteStream)

    // },[remoteStream])

    // useEffect(()=>{
    //     let id=0
    //     if(localStream){
    //         id = localStream.id
    //         const remote = remoteStreams.filter(stream=>stream.id!=id)[0]
    //         setRemoteStream(remote)
    //     }
    // },[remoteStreams])


    return (
        <div>
            {/* {stream} */}

            {/* <video 
                id="localVideo1234" 
                width="100%" 
                height="100%" 
                autoPlay 
                playsInline 
                muted="muted"
            /> */}
            {/* <video width="750" height="500" controls >
                <source src='https://www.youtube.com/watch?v=d46Azg3Pm4c' />
            </video> */}
            <div id="local-video-container"></div>

            <div class="input-group margin-bottom-sm">
                <span class="input-group-addon"><i class="fa fa-phone fa-fw"></i></span>
                <input class="form-control" type="text" placeholder="Who should we call?" autocomplete="off" id="peer" onkeypress="return checkEnter(this, event);" />
            </div>
            <button class="btn btn-success margin-bottom-sm" autocomplete="off" id="call">Call</button>

            <div id="remote-video-container"></div>

        </div>
    )

}