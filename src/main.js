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

// speech recognition function and event listener
recognition.addEventListener('result', async e => {
  e.preventDefault();
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

  if (e.results[0].isFinal) {
    await fetch('/api/command/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        speech: transcript,
        now: new Date() })
    })
      .then(res => res.json())
      .then(data => {
        const speech = data.body.speech
        console.log(speech)
        if (speech.includes(data.data.bot.name)) {

          botName.style.background = "#A6DA57";
          hover1.classList.add("on")
          reader(data.data.bot.message, 0.8, 1, 0.8, 1)
          speech.split(data.data.bot.name)[1]

          setTimeout(() => {
            botName.style.background = "linear-gradient(to right, #fd5ff5, #791179)";
            hover1.classList.remove("on")
          }, 5000)

          for (let i = 0; i < data.data.commands.length; i++) {

            if (speech.includes(data.data.commands[i].command)) {

              if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                window.location = data.data.commands[i].phoneWeb
              } else {
                relocate(data.data.commands[i].pcUser)
              }
              reader(data.data.commands[i].message, 0.8, 1, 0.8, 1)
            }

            if (speech.includes(data.data.commands[i].search)) {
              const link = 'https://www.google.com/search?q=' + speech.split(data.data.commands[i].search)[1]
              relocate(link)
              reader('Searching for ' + " " + speech.split(data.data.commands[i].search)[1], 0.8, 1, 0.8, 1)
            }
          }

          const song = data.data.songs[0]

          if (speech.includes(song.sing)) {
            video.classList.add('on')
            video.src = song.url
            reader(song.lyrics, 1, 1, 1, 2)
            setTimeout(() => {
              video.classList.add('off')
              video.src = ""
            }, 60000)
            return
          }

          const weather = data.data.weather[0]

          if (speech.includes(weather.call)) {
            navigator.geolocation.getCurrentPosition(success, error, options);
          }
        }

        hover2.classList.add("on")
        botParagraph.style.background = "#A6DA57";
        setTimeout(() => {
          hover2.classList.remove("on")
          botParagraph.style.background = "linear-gradient(to right, #fd5ff5, #791179)"
        }, 5000)

        recognition.abort();
        const timer = data.data.timer[0]

        if (speech.includes(timer.command)) {
          reader(`${'Timer is set for' + speech.split("set timer for")[1]}`, 0.8, 1, 0.8, 1)
          for (let i = 0; i < timer.specifics.length; i++) {
            if (speech.includes(timer.specifics[i].command) || speech.includes(timer.specifics[i].command)) {
              let seconds = parseFloat(speech.split(timer.command)[1]);
              let newseconds = parseFloat(seconds * timer.specifics[i].number);
              setTimeout(() => {
                reader(timer.specifics[i].message, 0.8, 1, 0.8, 1)
              }, newseconds);
              return
            }
          }
        }

        const misc = data.data.misc

        for (let i = 0; i < misc.length; i++) {
          if (speech.includes(misc[i].command)) {
            reader(misc[i].message, 0.8, 1, 0.8, misc[i].voice)
          }
        }

        const now = new Date(data.body.now)

        console.log(now)

        if (speech.includes(data.data.time)) {
          const time =` Its ${now.getHours()} And  ${now.getMinutes()} minutes`
          reader(time, 0.8, 1, 0.8, 1)
        }
        
        if (speech.includes(data.data.day)) {
          const days = data.data.days
          let day = days[now.getDay()].message;
          reader(day, 0.8, 1, 0.8, 1)
        }
      })
  }
})
recognition.addEventListener('end', recognition.start)

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
      reader(`${" It's feels like" + " " + (data.main.feels_like) + "°C"}`, 0.8, 1, 0.8, 1)
    })
}

const error = async (err) => {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

const relocate = async (url) => {
  window.open(url)
}
