const video = document.getElementById('videoInput')
const username = document.getElementById('user').innerHTML;
const totalUploadedImages = parseInt(document.getElementById('imageno').innerHTML);
const videoDiv = document.getElementsByClassName('videoDiv')[0];
const auth = document.getElementById('auth');




Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
    faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
]).then(start)





function start() {
    navigator.getUserMedia(
        { video:{} },
        stream => video.srcObject = stream,
        err => console.error(err)
    )

    setTimeout(function() {
        videoDiv.style.display = 'block';
    }, 7000);
    recognizeFaces()
}





async function recognizeFaces() {

    const labeledDescriptors = await loadLabeledImages()
    console.log(labeledDescriptors)
    const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.7)

    auth.addEventListener('click', async () => {
        auth.style.display = 'none';
        const canvas = faceapi.createCanvasFromMedia(video);
        videoDiv.appendChild(canvas);

        const displaySize = { 
            width: video.width, 
            height: video.height 
        };
        faceapi.matchDimensions(canvas, displaySize);

        
        var count = 0;
        const myInterval = setInterval(async () => {
            const detections = await faceapi.detectAllFaces(video).withFaceLandmarks().withFaceDescriptors();

            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            const results = resizedDetections.map((d) => {
                return faceMatcher.findBestMatch(d.descriptor);
            })
            results.forEach( (result, i) => {
                // const box = resizedDetections[i].detection.box;
                // const drawBox = new faceapi.draw.DrawBox(box, { 
                //    label: result.toString() 
                // });
                // drawBox.draw(canvas);
                authName = result.toString();
                if( authName.substring(0, username.length ) === username ) {
                    window.location.href = "/isAuthenticated";
                }
            })
            count++;
            if (count === 100) {
                clearInterval(myInterval);
                window.location.href = "/junction";
            }
        }, 100) 
    })
}












function loadLabeledImages() {
    const labels = [username]
    return Promise.all(
        labels.map(async (label)=>{
            const descriptions = []
            for(let i=1; i<=totalUploadedImages; i++) {
                const img = await faceapi.fetchImage(`/uploads/${label}/${i}.jpg`)
                const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor()
                console.log(label + i + JSON.stringify(detections))
                descriptions.push(detections.descriptor)
            }
            document.body.append(label+' Faces Loaded | ')
            return new faceapi.LabeledFaceDescriptors(label, descriptions)
        })
    )
}