let APIkey = "2b0407a0c56a65e804b2d208729a3914"


navigator.geolocation.getCurrentPosition((position) => {
    getForcast(position.coords.latitude, position.coords.longitude);
  }, (error)=> {
    alert(`${error.message} please enter your city Name`)
  })
  
function getForcast(lat, lon){
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}`
    getLocationData(url)
}

function getLocationData(url){
    fetch(url).then((data)=>{
        return data.json()
    }).then((d)=> printLocationData(d))
    .catch((e)=> alert(`${e.message} Try Again Later`))
}

let today = new Date()

function printLocationData(data){
    let text = `<div class="head">
    <h2 class="name">${data.name}</h2>
    <h2 class="date">${today.getDate()}.${today.getMonth() + 1}.${today.getFullYear()}</h2>
</div>
<div class="temp">
    <h1>${(data.main.temp - 273.15).toFixed(2)}&deg</h1>
</div>
<div class="others">
    <div class="type">${data.weather[0].description}</div>
    <div class="type"><i class="fa-solid fa-wind"></i>${data.wind.speed}</div>
    <div class="type"><i class="fa-solid fa-droplet"></i>${data.main.humidity}</div>
</div>`

document.querySelector(".main-temp").innerHTML = text
}