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
const helpBar = document.querySelector('.help-container')

const POSTS_TO_SHOW = 100;
let maxDisplayLimit = POSTS_TO_SHOW;
const dataContainer = document.querySelector('.help-container');


// speech recognition function and event listener
recognition.addEventListener('result', async e => {
  e.preventDefault();
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

  if (e.results[0].isFinal) {
    helpBar.classList.add('help-container')
    await fetch('/api/command/voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        speech: transcript,
        now: new Date()
      })
    })
      .then(res => res.json())
      .then((data) => {
        // shortcuts for the data
        const callHelp = data.data.help.command // command that will start the help statement on line 55.
        const help = data.data.help.help //Help api used in line 55-65 (on statement call maps trough the data of help , and creates help boxes), line 209-219 (the function itself that builds the help box)
        const speech = data.body.speech //Main Use on all of the Statements (speech)

        // Help Api
        if (speech.includes(callHelp)) {
          helpBar.classList.remove('help-container-off')
          helpBar.classList.add('help-container')

          const frag = document.createDocumentFragment();

          help.slice(0, maxDisplayLimit).map((newdata) => frag.appendChild(generateData(newdata)));

          dataContainer.innerHTML = '';
          dataContainer.appendChild(frag);
        }

        // Bot call command
        if (speech.includes(data.data.bot.name)) {

          // Activating Hover Effect
          helpBar.classList.add('help-container-off')
          botName.style.background = "#A6DA57";
          hover1.classList.add("on")
          setTimeout(() => {
            botName.style.background = "linear-gradient(to right, #fd5ff5, #791179)";
            hover1.classList.remove("on")
          }, 5000)

          reader(data.data.bot.message, 0.8, 1, 0.8, 1)
          speech.split(data.data.bot.name)[1]

          const commands = data.data.commands 

          // Open links Api 
          for (let i = 0; i < commands.length; i++) {

            if (speech.includes(commands[i].command)) {

              if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                window.location = commands[i].phoneWeb
              } else {
                relocate(commands[i].pcUser)
              }
              reader(commands[i].message, 0.8, 1, 0.8, 1)
            }

            // Search Api
            if (speech.includes(commands[i].search)) {
              speech.split(commands[i].search)[1]
              const open = commands[i].commands
              for (let i = 0; i < open.length; i++) {
                if (speech.includes(open[i].command)) {
                  const link = open[i].link + speech.split(open[i].command)[1];
                  relocate(link)
                  reader('Searching for ' + " " + speech.split(open[i].command)[1], 0.8, 1, 0.8, 1)
                }
              }
            }
          }

          // Song Api 
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

          // Weather Api 
          const weather = data.data.weather

          for (let i = 0; i < weather.length; i++) {
            if (speech.includes(weather[i].call)) {
              navigator.geolocation.getCurrentPosition(success, error, options);
            }
          }
        }

        // Activating Hover Effect
        hover2.classList.add("on")
        botParagraph.style.background = "#A6DA57";
        setTimeout(() => {
          hover2.classList.remove("on")
          botParagraph.style.background = "linear-gradient(to right, #fd5ff5, #791179)"
        }, 5000)

        //Timer Api 
        const timer = data.data.timer[0]

        if (speech.includes(timer.command)) {

          reader(`${'Timer is set for' + speech.split("set timer for")[1]}`, 0.8, 1, 0.8, 1)
          for (let i = 0; i < timer.specifics.length; i++) {
            if (speech.includes(timer.specifics[i].command) || speech.includes(timer.specifics[i].command)) {
              helpBar.classList.add('help-container-off')
              let seconds = parseFloat(speech.split(timer.command)[1]);
              let newseconds = parseFloat(seconds * timer.specifics[i].number);
              setTimeout(() => {
                reader(timer.specifics[i].message, 0.8, 1, 0.8, 1)
              }, newseconds);
              return
            }
          }
        }

        // Misc Api 
        const misc = data.data.misc 

        for (let i = 0; i < misc.length; i++) {

          if (speech.includes(misc[i].command)) {
            helpBar.classList.add('help-container-off')
            reader(misc[i].message, 0.8, 1, 0.8, misc[i].voice)
          }
        }

        // Time and Day Api 
        let now = new Date()
        
        if (speech.includes(data.data.timeCommand)) {
          speech.split(data.data.timeCommand)

          for (let i = 0; i < data.data.country.length; i++) {
            let country = data.data.country[i]

            if (speech.includes(country.command)) {
              helpBar.classList.add('help-container-off')
              now = now.toLocaleString(country.lang, { timeZone: country.timezone })
              now = new Date(now)
              const time = `In ${country.command} Its ${now.getHours()} And  ${now.getMinutes()} minutes`
              reader(time, 0.8, 1, 0.8, 1)
            }
          }

          for (let i = 0; i < data.data.countryArray.length; i++) {
            let world = data.data.countryArray[i]

            for (let j = 0; j < world.commands.length; j++) {

              if (speech.includes(world.commands[j])) {
                helpBar.classList.add('help-container-off')
                now = now.toLocaleString(world.lang, { timeZone: world.timezone })
                now = new Date(now)
                const time = `In ${world.commands[j]} Its ${now.getHours()} And  ${now.getMinutes()} minutes`
                reader(time, 0.8, 1, 0.8, 1)
              }
            }
          }

        } else if (speech.includes(data.data.time)) {
          helpBar.classList.add('help-container-off')
          const time = ` Its ${now.getHours()} And  ${now.getMinutes()} minutes`
          reader(time, 0.8, 1, 0.8, 1)
        }

        if (speech.includes(data.data.day)) {
          helpBar.classList.add('help-container-off')
          const days = data.data.days
          let day = days[now.getDay()].message
          reader(day, 0.8, 1, 0.8, 1)
        }
      })
  }
})
function generateData(newdata) {
  const div = document.createElement('div');
  div.classList.add('help-container');
  div.innerHTML = `
    <ul class="help-bar">
    <li class="help-li">${newdata.info}</li>
    <small class="help-small">${newdata.keyword}</small>
    </ul>
    `;
  return div
}
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
