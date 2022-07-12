document.addEventListener("DOMContentLoaded", () => getLocation());

function getLocation() {
    let x = document.getElementById("geoMessage");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        x.innerHTML = "<div class='card-text' id='error'>Geolocation não é suportado por esse navegador.</div>";
    }
}

function showPosition(position) {
    let x = document.getElementById("geoMessage");
    x.innerHTML = (
        "<div class='card-text' id='lat'>Latitude: " + position.coords.latitude +
        "</div><div class='card-text' id='long'>Longitude: " + position.coords.longitude + "</div>"
    );
    getWeatherStatus(position.coords.latitude + "," + position.coords.longitude);
}

function showError(error) {
    let x = document.getElementById("geoMessage");
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "<div class='card-text' id='error'>Serviço de localização sem permissão.</div>";
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "<div class='card-text' id='error'>Localização não disponível.</div>";
            break;
        case error.TIMEOUT:
            x.innerHTML = "<div class='card-text' id='error'>Tempo esgotado.</div>";
            break;
        default:
            x.innerHTML = "<div class='card-text' id='error'>Um erro desconhecido ocorreu.</div>";
            break;
    }
}
