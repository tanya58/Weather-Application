// http://api.weatherapi.com/v1/current.json?key=85ab611122ca4f1394875020252105&q=Korba&aqi=no


const temperatureField = document.querySelector(".temp");
const locationField = document.querySelector(".time_location p");
const dateandTimeField = document.querySelector(".time_location span");
const emojiField = document.querySelector(".condition .emoji");
const conditionField = document.querySelector(".condition .text");
const windField = document.querySelector(".wind");
const humidityField = document.querySelector(".humidity");
const forecastContainer = document.querySelector(".forecast");
const searchIcon = document.querySelector(".search-icon");
//const exploreContainer = document.getElementById("exploreCards");
//const conditionField = document.querySelector(".condition p");
//const iconField = document.querySelector(".weather-icon"); // remove it if not work
const searchField = document.querySelector(".search_area");
const form = document.querySelector("form");

//form.addEventListener('submit' , searchForLocation)
searchIcon.addEventListener("click", searchForLocation);

let target = 'Lucknow'

const fetchResults = async (targetLocation) =>{
        //let url = `http://api.weatherapi.com/v1/current.json?key=85ab611122ca4f1394875020252105&q=${targetLocation}&aqi=no`
        let url = `https://api.weatherapi.com/v1/forecast.json?key=85ab611122ca4f1394875020252105&q=${targetLocation}&days=5&aqi=no&alerts=no`;

        
        const res = await fetch(url)

        const data = await res.json()

        console.log(data)

        let locationName = data.location.name
        let time = data.location.localtime

        let temp = data.current.temp_c

        let condition = data.current.condition.text
        let wind = data.current.wind_kph;
        let humidity = data.current.humidity;
        let forecastDays = data.forecast.forecastday;
        //let iconUrl = data.current.condition.icon; //
        emojiField.innerText = getEmoji(condition);

        updateDetails(temp , locationName , time , condition, wind, humidity)
        updateForecast(forecastDays);
}

function updateDetails(temp , locationName , time , condition, wind, humidity){

        let dateObj = new Date(time);  // Use full localtime string
        let currentDay = getDayName(dateObj.getDay());
        
        let splitDate = time.split(" ")[0];

        let splitTime = time.split(" ")[1];

        //let currentDay = getDayName(new Date(time).getDay());

        // --- Convert time to 12-hour format with AM/PM ---
        
        temperatureField.innerText = `${temp}°C`;
        locationField.innerText = locationName;
        dateandTimeField.innerText = `${splitDate} ${currentDay} ${splitTime}`;
        conditionField.innerText = `${getEmoji(condition)} ${condition}`;
        windField.innerText = `💨 Wind: ${wind} km/h`;
        humidityField.innerText = `💧 Humidity: ${humidity}%`;
        //iconField.src = "https:" + iconUrl; //


}

function updateForecast(forecastDays) {
    forecastContainer.innerHTML = ""; // Clear previous

    forecastDays.forEach(day => {
        const date = day.date;
        const avgTemp = day.day.avgtemp_c;
        const condition = day.day.condition.text;
        const emoji = getEmoji(condition);

        const dayName = getDayName(new Date(date).getDay());

        const dayElement = document.createElement("div");
        dayElement.classList.add("forecast-day");

        dayElement.innerHTML = `
            <p><strong>${dayName}</strong></p>
            <p>${emoji}</p>
            <p>${condition}</p>
            <p>${avgTemp}°C</p>
        `;

        forecastContainer.appendChild(dayElement);
    });
}

function searchForLocation(e){
        e.preventDefault();
        
        target = searchField.value;

        fetchResults(target);


}


//fetchResults(target);


// getemoji function
function getEmoji(condition) {
    const lower = condition.toLowerCase();

    if (lower.includes("sunny")) return "☀️";
    if (lower.includes("clear")) return "🌕";
    if (lower.includes("partly cloudy")) return "⛅";
    if (lower.includes("cloudy")) return "☁️";
    if (lower.includes("overcast")) return "☁️";
    if (lower.includes("mist")) return "🌫️";
    if (lower.includes("rain")) return "🌧️";
    if (lower.includes("thunder")) return "⛈️";
    if (lower.includes("snow")) return "❄️";
    if (lower.includes("fog")) return "🌁";
    if (lower.includes("haze")) return "🌫️";
    if (lower.includes("blizzard")) return "🌨️";
    if (lower.includes("drizzle")) return "🌦️";
    if (lower.includes("sleet")) return "🌨️";
    if (lower.includes("freezing")) return "❄️🌁";
    
    return "🌈"; // fallback
}




function getDayName(number) {
        switch (number) {
        case 0: return "Sunday";
        case 1: return "Monday";
        case 2: return "Tuesday";
        case 3: return "Wednesday";
        case 4: return "Thursday";
        case 5: return "Friday";
        case 6: return "Saturday";                                             
        }
}

// ---------------
// Explore Section
// ---------------

const randomCities = [
    "London", "Tokyo", "Paris", "New York",
    "Sydney", "Dubai", "Toronto", "Mumbai",
    "Beijing", "Cape Town", "Istanbul", "Rome"
];

// Only run this if exploreContainer is defined (on explore.html)
const exploreContainer = document.getElementById("exploreCards");

if (exploreContainer) {
    fetchExploreCities(); // Only if we're on explore.html
}

async function fetchExploreCities() {
    exploreContainer.innerHTML = ""; // clear previous
    for (let city of randomCities) {
        try {
            const res = await fetch(`https://api.weatherapi.com/v1/current.json?key=85ab611122ca4f1394875020252105&q=${city}&aqi=no`);
            const data = await res.json();

            const temp = data.current.temp_c;
            const condition = data.current.condition.text;
            const emoji = getEmoji(condition);

            const card = document.createElement("div");
            card.classList.add("explore-card");
            card.innerHTML = `
                <p><strong>${city}</strong></p>
                <p>${emoji}</p>
                <p>${condition}</p>
                <p>${temp}°C</p>
            `;
            exploreContainer.appendChild(card);
        } catch (error) {
            console.error(`Error fetching ${city}`, error);
        }
    }
}

// ---------------
// Open Explore Button Click
// ---------------

const exploreBtn = document.getElementById("exploreBtn");
if (exploreBtn) {
    exploreBtn.addEventListener("click", () => {
        window.open("explore.html", "Explore Cities", "width=600,height=800");
    });
}



// ---------------
// Three Dot Menu Dropdown
// ---------------

const menuIcon = document.querySelector(".menu-icon");
const menuDropdown = document.getElementById("menuDropdown");

if (menuIcon && menuDropdown) {
    menuIcon.addEventListener("click", () => {
        menuDropdown.style.display = menuDropdown.style.display === "block" ? "none" : "block";
    });

    window.addEventListener("click", function (e) {
        if (!e.target.matches('.menu-icon')) {
            menuDropdown.style.display = "none";
        }
    });

    const exploreMenuBtn = document.getElementById("exploreMenuBtn");
    if (exploreMenuBtn) {
        exploreMenuBtn.addEventListener("click", () => {
            window.open("explore.html", "Explore Cities", "width=600,height=800");
        });
    }
}


// ----------------------------
// Geolocation Icon Dropdown
// ----------------------------

const geoIcon = document.querySelector(".geo-icon");
const geoDropdown = document.getElementById("geoDropdown");
const useLocation = document.getElementById("useLocation");

// Toggle dropdown when clicking the icon
if (geoIcon && geoDropdown) {
  geoIcon.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent click from closing dropdown
    geoDropdown.style.display = geoDropdown.style.display === "block" ? "none" : "block";
  });

  // Close dropdown if user clicks outside
  window.addEventListener("click", (e) => {
    if (!e.target.closest(".geo-container")) {
      geoDropdown.style.display = "none";
    }
  });

  // Handle "Use My Location" click
  useLocation.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locationQuery = `${lat},${lon}`;
          fetchResults(locationQuery);
          geoDropdown.style.display = "none";
        },
        (error) => {
          console.error("Geolocation error:", error);
          alert("Unable to access location. Please allow location permission.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  });
}

// Load theme from localStorage
window.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('themeSwitch');
  const savedTheme = localStorage.getItem('theme') || 'light';

  document.body.classList.add(savedTheme);
  if (savedTheme === 'dark') themeSwitch.checked = true;

  themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
      document.body.classList.replace('light', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.replace('dark', 'light');
      localStorage.setItem('theme', 'light');
    }
  });
});



// Initial weather data for default city
fetchResults(target);