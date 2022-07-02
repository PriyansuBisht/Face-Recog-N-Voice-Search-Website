function voiceSearchStart() {
    if ( ! window.hasOwnProperty('webkitSpeechRecognition')) {
        alert("Voice Search Not Supported By Your Browser !!!");
    }
    
    var speehToText = new webkitSpeechRecognition();
    speehToText.continuous = false;
    speehToText.interimResults = false;
    speehToText.lang = 'en-US';
    document.getElementById('searchBar').placeholder = "Listening . . . ";
    document.getElementById('mike').src = "/images/microphone-blue.png";
    
    speehToText.start();

    speehToText.onresult = function ( e ) {
        console.log(e.results[0][0]);
        if( e.results[0][0].transcript === '') {
            
        } else {
            document.getElementById('searchBar').value = e.results[0][0].transcript;
            document.getElementById('searchBar').innerHTML = e.results[0][0].transcript;
            document.getElementById('mike').src = "/images/microphone-black.png";
            document.getElementById('searchBar').focus();
        }
        speehToText.stop();
    };

    speehToText.onerror = function (e) {
        speehToText.stop();
        document.getElementById('searchBar').placeholder = "Search . . . ";
        document.getElementById('mike').src = "/images/microphone-black.png";
    };
   
}