window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

let recognition = new SpeechRecognition()
recognition.interimResults = true

 let speech = new SpeechSynthesisUtterance();

const relocate = async (url) => {
  window.open(url)
}

const instagram = "intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end"; 

const reader = (txt) => {
 
  speech.lang = "en";
  speech.text = txt
  window.speechSynthesis.speak(speech)
  
}

recognition.addEventListener('result', e =>{
  const transcript = Array.from(e.results)
  .map(result => result[0])
  .map(result => result.transcript)
  .join('')
  
    if(transcript.includes("YouTube")){
      console.log('Moving to YouTube')
      window.location.replace('https://m.youtube.com/')
    }
    
    if(transcript.includes("GitHub")){
      console.log('Moving to GitHub')
      relocate('https://github.com')
    }
    if(transcript.includes("Instagram")){
      console.log('Moving to Instagram')
      window.location.replace(instagram)
    }
    if(transcript.includes("open")) {
      reader('opend function')
      console.log('runing')
    }
    
    if(e.results[0].isFinal) {
      //console.clear()
      window.speechSynthesis.speak(speech)
  }
})

recognition.addEventListener('end', recognition.start)

recognition.start()