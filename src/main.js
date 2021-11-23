window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
window.speechSynthesis;

// speech recognition and speech synthesis
let recognition = new SpeechRecognition()
recognition.interimResults = true
recognition.lang = 'en-US';
let speech = new SpeechSynthesisUtterance();

//elements
const video = document.getElementById('video');
const botName = document.getElementById('botName')
const botParagraph = document.getElementById('botParagraph')
const hover1 = document.getElementById('hover1')
const hover2 = document.getElementById('hover2')

// if ('speechSynthesis' in window) {
//   alert("Broswer supports speech synthesis 🎉");
// } else {
//    alert("Sorry, your browser doesn't support the speech synthesis API !");
// }
// link to open url's
const instagram = "intent://instagram.com/#Intent;scheme=https;package=com.instagram.android;end";
const instagram2 = 'https://www.instagram.com/'
const spotify = 'https://play.spotify.com/collection/tracks/'
const spotify1 = 'https://play.spotify.com/'

// speech recognition function and event listener
recognition.addEventListener('result', async e => {
  e.preventDefault();
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');


    await fetch('/api/command/voice',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({speech: "Bob"})
    })
    .then(res => res.json())
    .then(interFaces => {
      console.log(interFaces.name)
      if (e.results[0].isFinal && transcript.includes(interFaces.name)) {
        console.log(interFaces.message)
      }
    })



  if (e.results[0].isFinal && transcript.includes("Bob")) {
    botName.style.background = "#A6DA57";
    hover1.classList.add("on")
    reader('Yes', 0.8, 1, 0.8, 1)
    transcript.split("Bob")[1]
    setTimeout(() => {
      botName.style.background = "linear-gradient(to right, #fd5ff5, #791179)";
      hover1.classList.remove("on")
    },5000)
    if (transcript.includes("open YouTube")) {
      relocate('https://m.youtube.com/')
      reader('YouTube opened', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes("open GitHub")) {
      relocate('https://github.com')
      reader('GitHub... opened', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes("open Spotify")) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location = spotify
      } else {
        relocate(spotify1)
      }
      reader('Spotify opened', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes("open Instagram")) {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        window.location = instagram
      } else {
        relocate(instagram2)
      }
      reader('Instagram opened', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes("what's the weather") || transcript.includes("what is the weather")) {
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
    if (transcript.includes("I need to search")) {
      const link = 'https://www.google.com/search?q=' + transcript.split("I need to search")[1]
      relocate(link)
      console.log('Searching...')
      reader('Searching for ' + " " + transcript.split("I need to search")[1], 0.8, 1, 0.8, 1)
    }
    if (transcript.includes("sing me a song")) {
      video.classList.add('on')
      video.src = rickRollVideo
      reader(rickRoll, 1, 1, 1, 2)
      setTimeout(() => {
        video.classList.add('off')
        video.src = ""
      }, 60000)
      return
    }
  }
  if (e.results[0].isFinal) {
    hover2.classList.add("on")
    botParagraph.style.background = "#A6DA57";
    setTimeout(() => {
      hover2.classList.remove("on")
      botParagraph.style.background = "linear-gradient(to right, #fd5ff5, #791179)"
    },5000)
    recognition.abort();
    if (transcript.includes("set timer for")) {
      reader(`${'Timer is set for' + transcript.split("set timer for")[1]}`, 0.8, 1, 0.8, 1)
      if (transcript.includes("seconds") || transcript.includes("second")) {
        let seconds = parseFloat(transcript.split("set timer for")[1]);
        let newseconds = parseFloat(seconds * 1000);
        setTimeout(() => {
         reader('Timer is up', 0.8, 1, 0.8, 1)
        }, newseconds);
      }
      if (transcript.includes("minutes") || transcript.includes("minute")) {
        let minutes = parseFloat(transcript.split("set timer for")[1]) * 60000;
        setTimeout(() => {
          reader('Timer is up', 0.8, 1, 0.8, 1)
        }, minutes);
        return
      }
      if (transcript.includes("hour") || transcript.includes("hours")) {
        let hours = parseFloat(transcript.split("set timer for")[1]);
        let newhours = parseFloat(hours * 3600000);
        setTimeout(() => {
          reader('Timer is up', 0.8, 1, 0.8, 1)
        }, newhours);
        return
      }
    }
    if (transcript.includes("how are you")) {
      reader(`I am Awsome, and you`, 0.8, 1, 0.8, 1)
    }
    if (transcript.includes('I am great')) {
      reader('That is excellent', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes('I am good')) {
      reader('That is great', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes('I am fine')) {
      reader('Is every thing is Ok?', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes('I am bad')) {
      reader('What happend ?', 0.8, 1, 0.8, 1)
    }
    if (transcript.includes('why so mad')) {
      reader('I am not mad', 0.8, 1, 1, 1)
    }
    if (transcript.includes('I am not mad')) {
      reader(`and you are`, 1, 1, 0.9, 0)
    }
    if (transcript.includes(`and you are`)) {
      reader('who the hell are you', 0.8, 1, 1, 1)
    }
    if (transcript.includes('who the hell are you')) {
      reader('I am a robot', 1, 1, 0.9, 0)
    }
    if (transcript.includes('I am a robot')) {
      reader('we both are', 0.8, 1, 1, 1) 
    }
    if (transcript.includes('we both are')) {
      reader('why so Mad then', 1, 1, 0.9, 0)
    }
  }
})
recognition.addEventListener('end',recognition.start)

recognition.start();

// TTs reader function
const reader = (txt, rate, pith, volume, voice, lang) => {
  let voices = window.speechSynthesis.getVoices();
  speech.lang = lang || 'en-US';
  speech.voice = voices[voice]
  speech.pitch = pith;
  speech.rate = rate;
  speech.volume = volume
  speech.text = txt
  speechSynthesis.speak(speech)
}

//weather options
const options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

// weather api 
const success = async (pos) => {
  let crd = pos.coords;

  await fetch(`https://api.openweathermap.org/data/2.5/weather?&units=Metric&lat=${crd.latitude}&lon=${crd.longitude}&appid=b264db3b74c258f2a310315d9a2b6e4c`)
   .then(res => res.json())
    .then(data => {
      reader(`${" It's feels like" + " " + (data.main.feels_like ) + "°C"}`, 0.8, 1, 0.8, 1)
    })
}

const error = async (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const relocate = async (url) => {
  window.open(url)
}

// Etc and misc
const rickRollVideo = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=0'
const rickRoll = `We're no strangers to love
You know the rules and so do I
A full commitment's what I'm thinking of
You wouldn't get this from any other guy

I just wanna tell you how I'm feeling
Gotta make you understand

Never gonna give you up
Never gonna let you downif
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you

We've known each other for so long
Your heart's been aching, but
You're too shy to say it
Inside, we both know what's been going on
We know the game and we're gonna play it

And if you ask me how I'm feeling
Don't tell me you're too blind to see

Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you

Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you

(Ooh, give you up)
(Ooh, give you up)
Never gonna give, never gonna give
(Give you up)
Never gonna give, never gonna give
(Give you up)

We've known each other for so long
Your heart's been aching, but
You're too shy to say it
Inside, we both know what's been going on
We know the game and we're gonna play it

I just wanna tell you how I'm feeling
Gotta make you understand

Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you

Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you

Never gonna give you up
Never gonna let you down
Never gonna run around and desert you
Never gonna make you cry
Never gonna say goodbye
Never gonna tell a lie and hurt you`


