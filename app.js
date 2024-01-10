let APIkey = localStorage.getItem("key")

if(!APIkey){
    APIkey = prompt("Please input OpenWeather Api Key to use this app");
    localStorage.setItem("key", APIkey)
}

let salutation = ["Good Morning", "Good Afternoon", "Good Evening"];

document.querySelector("#resetkey").addEventListener("click", ()=>{
    localStorage.clear()
    location.reload();
})

let latitudeU;
let longitudeU;

let today = new Date();

let currentTimeDisplay = document.querySelector("#current-time")
currentTimeDisplay.innerText = getTimeForDiv(today)
setInterval(()=>{
    let date = new Date()
    let time = getTimeForDiv(date)
    currentTimeDisplay.innerText = time
}, 60000)

navigator.geolocation.getCurrentPosition(
    (position) => {
        latitudeU = position.coords.latitude;
        longitudeU = position.coords.longitude;
        getForcast(latitudeU, longitudeU);
    },
    (error) => {
        alert(`${error.message} please enter your city Name`);
    }
);

function getForcast(lat, lon) {
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
    getLocationData(url);
}

function getLocationData(url) {
    fetch(url)
        .then((data) => {
            return data.json();
        })
        .then((d) => printLocationData(d))
        .catch((e) => alert(`${e.message} Try Again Later`));
}



function getSalutation() {
    let hour = today.getHours();
    if (hour > 4 && hour < 12) {
        return salutation[0];
    } else if (hour > 12 && hour < 16) {
        return salutation[1];
    } else {
        return salutation[2];
    }
}

function getTimeForDiv(time) {
    let hr = time.getHours();
    let min = time.getMinutes();
    if(min < 10){
        min = `0${min}`
    }
    if (hr >= 12) {
        hr = hr - 12;
        return `${hr}:${min} PM`;
    } else {
        return `${hr}:${min} AM`;
    }
}

function convertTime(time) {
    let timeInJS = new Date(time * 1000);
    return getTimeForDiv(timeInJS);
}

function printLocationData(data) {
    let text = `<div class="head">
 <h2 class="name">${data.name} (${data.sys.country})</h2>
 <h2 class="date">${today.getDate()}.${today.getMonth() + 1
        }.${today.getFullYear()}</h2>
</div>
<div class="temp">
 <h1>${(data.main.temp - 273.15).toFixed(2)}&deg</h1>
</div>
<div class="others">
 <div class="type"><span class="mob-h">Wind:</span><i class="fa-solid fa-wind"></i>${data.wind.speed}</div>
 <div class="type"><img src="https://openweathermap.org/img/wn/${data.weather[0].icon
        }@2x.png" alt=""> ${data.weather[0].description}</div>
 <div class="type"><span class="mob-h">feels like:</span> <i class="fa-solid fa-temperature-three-quarters"></i>${(
            data.main.feels_like - 273.15
        ).toFixed(2)}&deg</div>
</div>
<div class="others bottom">
 <div class="type"><span class="mob-h">Pressure:</span> <i class="fa-solid fa-down-long"></i>${data.main.pressure
        }mb</div>
        <div class="type"><span class="mob-h">Humidity:</span> <i class="fa-solid fa-droplet"></i>${data.main.humidity
        }%</div>
</div>`;

    let sal = `<div class="other-info">
  <div class="type"><i class="fa-solid fa-sun"></i>${convertTime(
        data.sys.sunrise
    )}</div>
  <div class="type"><i class="fa-regular fa-sun"></i>${convertTime(
        data.sys.sunset
    )}</div>
</div>`;

    document.querySelector(".temp-container").innerHTML = text;
    document.querySelector(".salutation").innerHTML = sal;
    document.querySelector("#wish").innerHTML = `<h2>${getSalutation()}</h2>`;
    hourlyData();
}

let city = document.querySelector("#city");
let btn = document.querySelector("#btn");

btn.addEventListener("click", () => {
    let name = city.value;
    let url = `https://api.openweathermap.org/geo/1.0/direct?q=${name}&limit=1&appid=${APIkey}`;
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            let lat = data[0].lat;
            let lon = data[0].lon;
            let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`;
            getLocationData(url);
        })
        .catch((e) => console.error(e));
});

function printHourlyData(data) {
    let text = "";
    data.list.forEach((element) => {
        text += `<div class="card">
    <div class="card-1">${convertTime(element.dt)}</div>
    <div class="card-0">${element.dt_txt.slice(0, 11)}</div>
    <div class="card-2">${(element.main.temp - 273.15).toFixed(2)}&deg</div>
    <div class="card-3">${element.weather[0].description}</div>
  </div>`;
    });

    document.querySelector(".hourly").innerHTML = text;
}

function hourlyData() {
    let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitudeU}&lon=${longitudeU}&appid=${APIkey}`;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            printHourlyData(data);
        })
        .catch((e) => alert(e));
}
