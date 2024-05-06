// Firebase JSON veri URL'si
var jsonURL = "https://ledyakma-beef4-default-rtdb.europe-west1.firebasedatabase.app/Sensor.json?auth=YOUR_AUTH_TOKEN";

// HTML içindeki ilgili öğeleri seçme
var humidityText = document.getElementById("humidity-text");
var temperatureText = document.getElementById("temperature-text");
var humidityProgress = document.getElementById("humidity-progress");
var temperatureProgress = document.getElementById("temperature-progress");

// Tema değiştirme anahtarı öğelerini seçme
var themeSwitch = document.getElementById("theme-switch");
var sunIcon = document.querySelector(".sun-icon");
var moonIcon = document.querySelector(".moon-icon");

// Tema değiştirme anahtarının durumunu izleme
themeSwitch.addEventListener("change", toggleTheme);

// Sayfa yüklendiğinde varsayılan tema aydınlık olsun
toggleTheme();

// Tema değiştirme işlevi
function toggleTheme() {
    if (themeSwitch.checked) {
        document.body.classList.add("dark-theme");
    } else {
        document.body.classList.remove("dark-theme");
    }
}

function updateData() {
    // Fetch API kullanarak JSON verilerini al
    fetch(jsonURL)
        .then(response => response.json())
        .then(data => {
            // JSON verilerini HTML'e yazdırma
            humidityText.textContent = `Nem: ${data["humidity"]} %`;
            temperatureText.textContent = `Sıcaklık: ${data["temperature"]} °C`;

            // Nem ve sıcaklık değerlerine göre ilerleme çubuklarını güncelleme
            var humidityPercentage = parseFloat(data["humidity"]);
            var temperaturePercentage = parseFloat(data["temperature"]);

            // Nem çemberinin doluluğunu ayarla
            var humidityCircumference = parseFloat(humidityProgress.getAttribute("r")) * 2 * Math.PI;
            var humidityOffset = humidityCircumference * (1 - humidityPercentage / 100);
            humidityProgress.style.strokeDasharray = humidityCircumference;
            humidityProgress.style.strokeDashoffset = humidityOffset;

            // Sıcaklık çemberinin doluluğunu ayarla
            var temperatureCircumference = parseFloat(temperatureProgress.getAttribute("r")) * 2 * Math.PI;
            var temperatureOffset = temperatureCircumference * (1 - temperaturePercentage / 100);
            temperatureProgress.style.strokeDasharray = temperatureCircumference;
            temperatureProgress.style.strokeDashoffset = temperatureOffset;
        })
        .catch(error => console.error('Veri alınamadı:', error));
}

// Sayfa yüklendiğinde ve her 5 saniyede bir verileri güncelle
updateData();
setInterval(updateData, 5000); // 5 saniyede bir güncelle
