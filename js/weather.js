document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("searchInput").addEventListener(
        "keydown", searchInput, false
    );
});

async function fetchAsync (url) {
    const response = await fetch(url, {
        method: "GET",
        headers: {accept: "application/json"},
    });
    return await response.json();
}

function searchInput(event) {
    if (event.code === "Enter") {
        event.preventDefault();
        searchWeather();
    }
}

function searchWeather() {
    const inputText = document.getElementById("searchInput").value;
    getWeatherStatus(inputText);
}

function getWeatherStatus(search) {
    console.log(`Call Weather API: ${Date.now()}`)

    search = search.normalize("NFD").replace(/\p{Diacritic}/gu, "");
    const url = `https://yn-bm.herokuapp.com/core/weather/search/?city=${search}`;
    fetchAsync(url).then(data => {
        const weatherData = data["weatherData"];
        const conditionData = weatherData["condition"];

        loadCityDetail(data, weatherData).then(
            time => console.log(`City detail loaded: ${time}`)
        );
        loadWeatherDetail(data, weatherData, conditionData).then(
            time => console.log(`Weather detail loaded: ${time}`)
        );
        loadAdvancedWeatherDetail(data, weatherData).then(
            time => console.log(`Weather advanced detail loaded: ${time}`)
        );
    });
}

async function loadCityDetail(data, weatherData) {
    const hourUpdated = weatherData["lastUpdated"].split(" ")[1];
    const city = data["city"];
    const state = data["state"];

    let cityDetail = document.getElementById("cityDetail");
    cityDetail.innerHTML = `${city}, ${state} ${hourUpdated}`;

    return Date.now();
}

async function loadWeatherDetail(data, weatherData, conditionData) {
    const tempC = weatherData["tempC"].toString().replace(".", ",");
    const icon = conditionData["icon"];
    const isDay = weatherData["isDay"];

    const url = "utils/conditions.json";
    fetchAsync(url).then(translation => {
        const conditionCode = conditionData["code"];
        const translationData = translation.find(
            (translation_model) => translation_model.code === conditionCode
        );
        const messages = translationData["languages"][20];
        const message = isDay ? messages["day_text"] : messages["night_text"];

        let tempStatus = document.getElementById("tempStatus");
        tempStatus.innerHTML = `<div>${tempC}°</div><div>${message}</div>`;
    });

    let tempIcon = document.getElementById("tempIcon");
    tempIcon.innerHTML = `<img href="https://www.weatherapi.com/" src="${icon}" alt="">`;

    return Date.now();
}

async function loadAdvancedWeatherDetail(data, weatherData) {
    const city = data["city"];
    const state = data["state"];
    const feelsC = weatherData["feelslikeC"].toString().replace(".", ",");
    const humidity = weatherData["humidity"];
    const windKm = weatherData["windKph"].toString().replace(".", ",");
    const pressureMb = weatherData["pressureMb"].toString().replace(".", ",");
    const precipMm = parseInt(weatherData["precipMm"].toString());

    let weatherDetail = document.getElementById("weatherDetail");
    weatherDetail.innerHTML = `Clima atual em ${city}, ${state} hoje`;

    let thermalSensation = document.getElementById("thermalSensation");
    thermalSensation.innerHTML = `${feelsC}°`;

    let humidityInfo = document.getElementById("humidityInfo");
    humidityInfo.innerHTML = `
        <div class="col"><i class="fa-solid fa-droplet"></i> Umidade</div>
        <div class="col-4 text-end">${humidity}%</div>
    `;

    let windKmInfo = document.getElementById("windKmInfo");
    windKmInfo.innerHTML = `
        <div class="col"><i class="fa-solid fa-wind"></i> Vento</div>
        <div class="col-4 text-end">${windKm} km/h</div>
    `;

    let pressureInfo = document.getElementById("pressureInfo");
    pressureInfo.innerHTML = `
        <div class="col"><i class="fa-solid fa-arrows-down-to-line"></i> Pressão</div>
        <div class="col-4 text-end">${pressureMb} mb</div>
    `;

    let precipitationInfo = document.getElementById("precipitationInfo");
    precipitationInfo.innerHTML = `
        <div class="col"><i class="fa-solid fa-cloud-showers-heavy"></i> Precipitação</div>
        <div class="col-4 text-end">${precipMm} mm</div>
    `;
}