window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

let recognition = new SpeechRecognition()
recognition.interimResults = true
recognition.lang = 'en-US';
let speech = new SpeechSynthesisUtterance();

// if ('speechSynthesis' in window) {
//   alert("Broswer supports speech synthesis 🎉");
// } else {
//    alert("Sorry, your browser doesn't support the speech synthesis API !");
// }

const relocate = async (url) => {
  window.open(url)
}

const instagram = "intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end";
const spotify = 'https://open.spotify.com/collection/tracks'
const spotify1 = 'https://play.spotify.com/'
const weather = 'https://www.google.com/search?q=live+weather&oq=live+wea&aqs=chrome.2.69i57j0i457i512j0i512l8.5771j0j4&sourceid=chrome&ie=UTF-8'

const reader = (txt) => {
  speech.pitch = 1.5;
  speech.rate = 0.8;
  speech.volume = 0.8
  speech.text = txt
  speechSynthesis.speak(speech)
}

recognition.addEventListener('result', e => {
  
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('')
console.log(transcript)
    if (e.results[0].isFinal && transcript.includes("Bob") ) {
      console.log(transcript)
        reader('Yes Admin')
        transcript.split("Bob")[1]
          if (transcript.includes("open YouTube")) {
            relocate('https://m.youtube.com/')
            reader('YouTube opened')
          }
          if (transcript.includes("open GitHub")) {
            relocate('https://github.com')
            reader('GitHub... opened')
          }
          if (transcript.includes("open Spotify")) {
            relocate(spotify || spotify1)
            reader('Spotify opened')
          }
          if (transcript.includes("what's the weather" ) || transcript.includes("what is the weather")) {
            relocate(weather)
            reader('')
          }
          if (transcript.includes("I need to search")) {
            const link = 'https://www.google.com/search?q=' + transcript.split("I need to search")[1]
            relocate(link)
            console.log('runing')
            reader('Searching for '+ " " + transcript.split("I need to search")[1])
          }
    }
    if (e.results[0].isFinal){
      if (transcript.includes("set timer for")) {
        reader('Timer is set')
        if("seconds"){
        const seconds = parseFloat(transcript.split("set timer for")[1])
          setTimeout(() => {
            reader('Timer is up')
          },seconds * 1000);
          
          console.log(seconds)
        }
        if("minutes"){
          const minutes = parseFloat(transcript.split("set timer for")[1])
          setTimeout(() => {
            reader('Timer is up')
          },minutes * 100000);
          console.log(minutes)
        }
        if("hours"){
          const hours = parseFloat(transcript.split("set timer for")[1])
          setTimeout(() => {
            reader('Timer is up')
          },hours * 100000000);
          console.log(hours)
        }
        }
        
        
    }
      // console.clear()
})
recognition.addEventListener('end', recognition.start)

recognition.start();

