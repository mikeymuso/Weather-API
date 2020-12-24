// SEARCH ELEMENTS
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const content = document.getElementById('content');

// CONTENT ELEMENTS
const inputLocation = document.getElementById('location');
const icon = document.getElementById('weather-icon');
const main_temp = document.getElementById('main-temp');
const other_temps = document.getElementById('temperatures');
const desc = document.getElementById('description');
const sunrise = document.getElementById('sunrise');
const sunset = document.getElementById('sunset');
const time = document.getElementById('time');

// API INFO
const apiKey = `73189ca6480d224ad3a389cea980e316`;
const url = `https://api.openweathermap.org/data/2.5/weather`


// OPTIONS
const units = 'metric';

const getWeatherData = async (searchURL) => {
    const response = await fetch(searchURL, { mode: 'cors' });
    const data = await response.json();

    const weatherData = {
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        tempMin: data.main.temp_min,
        tempMax: data.main.temp_max,
        pressure: data.main.pressure,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset,
        description: data.weather[0].description,
        destination: data.name, 
    }

    return weatherData
}


const updateHTML = (data) => {
    const unitText = units === 'metric' ? 'c' : 'f';

    main_temp.innerHTML = `${data.temp.toFixed(1)}°${unitText}`;
    other_temps.innerHTML = `Feels like ${data.feelsLike.toFixed(1)}°${unitText} | Min ${data.tempMin.toFixed(1)}°${unitText} | Max ${data.tempMax.toFixed(1)}°${unitText}`
    desc.innerHTML = [...data.description][0].toUpperCase() + [...data.description].slice(1).join('');
    
    const formatDate = (rawDate) => {
        const date = new Date(rawDate * 1000);
        
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    sunrise.innerHTML = formatDate(data.sunrise);
    sunset.innerHTML = formatDate(data.sunset);

    const randomNum = Math.round(Math.random() * 25);

    getWeatherGif(data.description).then(imgSrc => icon.src = imgSrc.data[randomNum].images.original.url);
    
    inputLocation.innerHTML = data.destination;
}

const loadWeather = () => {
    const searchLocation = searchInput.value || 'London';
    let fullURL = `${url}?q=${searchLocation}&units=${units}&appid=${apiKey}`

    getWeatherData(fullURL).then(data => updateHTML(data));
}

// LISTENERS
searchBtn.addEventListener('click', loadWeather);
document.addEventListener('keydown', e => {
    if (e.code === 'Enter') loadWeather();
})

const runTime = () => {
    setInterval(() => {
        const currtime = new Date();
        const hours = String(currtime.getHours()).padStart(2, '0');
        const minutes = String(currtime.getMinutes()).padStart(2, '0');
        const seconds = String(currtime.getSeconds()).padStart(2, '0');
        time.innerHTML = `${hours}:${minutes}:${seconds}`;
    }, 1000)
}

const getWeatherGif = async (keyword) => {
    inputLocation.innerHTML = `loading...`;
    icon.src = 'images/loading_gif.svg';
    

    const apiKey = 'GDinKv88iJ6Uj6Sf7cxqBEMM5URrjrGl';
    const giphyURL = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${keyword}&limit=25&offset=0&rating=g&lang=en`

    const response = await fetch(giphyURL, { mode: 'cors'});
    const imgSrc = await response.json();

    return imgSrc
}

runTime();
loadWeather();
