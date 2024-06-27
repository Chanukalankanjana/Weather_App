const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.getElementById('locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');
const forecastList = document.querySelector('.forecast-list');

//Default City when the page loads
let cityInput = "Colombo";

// Add click event to each city in the panel
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        // Change from default city to the clicked one
        cityInput = e.currentTarget.innerHTML; // Use e.currentTarget instead of e.target
        // Function that fetches and displays 
        // all the data from the weather API
        fetchWeatherData();
        fetchForecastData();
        // Fade out the app (simple animation)
        app.style.opacity = "0";
    });
});

// Add submit event to the form
form.addEventListener('submit', (e) => {
    // If the input field (search bar) is empty, throw an alert
    if(search.value.length == 0) { // Changed ariaValueMax to value
        alert('Please type in a city name');
    } else {
        // Change from default city to the one written in the input field
        cityInput = search.value;
        // Function that fetches and displays all the data from weather API
        fetchWeatherData();
        fetchForecastData();
        // Remove all text from the input field
        search.value = ""; 
        // Fade out the app (simple animation)
        app.style.opacity = "0";
    }
    
    // Prevents the default behavior of the form
    e.preventDefault();
});

// Function that returns a day of the week
// (Monday, Tuesday, Friday...) from a date (25 03 2024)
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    // Adjust month to be zero-indexed (0 for January, 1 for February, etc.)
    // JavaScript's getMonth() method returns month values from 0 to 11
    const adjustedMonth = month - 1;
    return weekday[new Date(year, adjustedMonth, day).getDay()];
}

// Function that fetches and displays
// the data from the weather API
function fetchWeatherData() {
    // Fetch the data and dynamically add
    // the city name with template literals
    fetch(`http://api.weatherapi.com/v1/current.json?key=9f714c1ef3d74ef1898192634242503&q=${cityInput}`)
    // Take the data (which is in JSON format)
    // and convert it to regular JS object
    .then(response => response.json())
    .then(data => {
        //console log the data to see what is available
        console.log(data);

        //adding the temperature
        // and weather condition to the page
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        // Get the date and time from the city and extract
        // the day, month, year, and time into individual variables
        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d} / ${m} / ${y}`;
        timeOutput.innerHTML = time;

        // Add the name of the city into the page
        nameOutput.innerHTML = data.location.name;

        // Get the corresponding icon URL for
        // the weather and extract a part of it
        const iconId = data.current.condition.icon.substr(
        "//cdn.weatherapi.com/weather/64x64".length);

        // Reformat the icon URL to own 
        // local folder path and add it to the page
        icon.src = "./icons" + iconId;

        // Add the weather details to the page
        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        // Set default time of day
        let timeOfDay = "day";
        // Get the unique id for each weather condition
        const code = data.current.condition.code;

        // Change to night if it's night time in the city
        if (!data.current.is_day) {
            timeOfDay = "night";
        }

        if (code == 1000) {
            // Set the background image to clear if the weather is clear
            app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
            // Change the button bg color depending on if it's day or night
            btn.style.background = "#e5ba92";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        }
        /*Something for cloudy weather*/
        else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            code == 1030 ||
            code == 1069 ||
            code == 1087 ||
            code == 1135 ||
            code == 1273 ||
            code == 1276 ||
            code == 1279 ||
            code == 1282 
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = "#fa6d1b";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        /*And rain*/
        } else if (
            code == 1063 ||
            code == 1069 ||
            code == 1072 ||
            code == 1150 ||
            code == 1153 ||
            code == 1180 ||
            code == 1183 ||
            code == 1186 ||
            code == 1189 ||
            code == 1192 ||
            code == 1195 ||
            code == 1204 ||
            code == 1207 ||
            code == 1240 ||
            code == 1243 ||
            code == 1246 ||
            code == 1249 ||
            code == 1252
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = "#647d75";
            if (timeOfDay == "night") {
                btn.style.background = "#325c80";
            }
        /*And finaly snow*/
        } else {
            app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = "#4d72aa";
            if (timeOfDay == "night") {
                btn.style.background = "#1b1b1b";
            }
        }
        //Fade in the page once all is done
        app.style.opacity = "1";
    })
    /*If the user types a city dosen't exist,
    throw an alert*/
    .catch(() => {
        alert('City not found, please try again');
        app.style.opacity = "1";
    });
}

//Call the funtion on page Load
fetchWeatherData();

// Function to fetch and display weather forecast for 5 days
function fetchForecastData() {
    const apiKey = '9f714c1ef3d74ef1898192634242503'; // Replace with your forecast API key
    const city = cityInput;

    fetch(`http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=7`)
        .then(response => response.json())
        .then(data => {
            forecastList.innerHTML = '';

            // Iterate through forecast data for the next 5 days
            data.forecast.forecastday.slice(1, 7).forEach(day => {
                const forecastItem = document.createElement('li');
                const forecastDate = new Date(day.date);
                const weekday = getWeekday(forecastDate.getDay());
                forecastItem.innerHTML = `
                    <div class="forecast-date">${weekday}</div>
                    <img src="${day.day.condition.icon}" alt="Weather Icon">
                    <div class="forecast-temp">${day.day.avgtemp_c}&#176;C</div>
                    <div class="forecast-condition">${day.day.condition.text}</div>
                `;
                forecastList.appendChild(forecastItem);
            });
        })
        .catch(error => {
            console.error('Error fetching forecast:', error);
        });
}

// Function to get weekday name from its numeric value
function getWeekday(day) {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return weekdays[day];
}

// Call fetchForecastData function on page load
fetchForecastData();

//Fade in the page
app.style.opacity = "1";