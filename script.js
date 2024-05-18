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
            humidityText.textContent = Nem: ${data["humidity"]} %;
            temperatureText.textContent = Sıcaklık: ${data["temperature"]} °C;

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

// "onButton" adındaki butona tıklandığında JSON dosyasındaki "buttonPressed" özelliğini toggle yap
document.getElementById("onButton").addEventListener("click", function() {
    // Firebase JSON veri URL'sini güncelleyerek "buttonPressed" özelliğini al ve durumunu toggle yap
    var updateURL = jsonURL.replace("Sensor.json", "Sensor/buttonPressed.json") + "?auth=YOUR_AUTH_TOKEN";
    fetch(updateURL)
        .then(response => response.json())
        .then(data => {
            var newStatus = (data === "on") ? "off" : "on"; // Mevcut duruma bağlı olarak yeni durumu belirle

            // Butonun içeriğini mevcut duruma göre güncelle
            document.getElementById("onButton").textContent = (newStatus === "on") ? "Power ON" : " Power OFF";

            // Yeni durumu Firebase JSON veri URL'sine gönder
            fetch(updateURL, {
                method: 'PUT',
                body: JSON.stringify(newStatus),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => console.log('Button pressed status updated:', data))
            .catch(error => console.error('Button pressed status update failed:', error));
        })
        .catch(error => console.error('Current button pressed status retrieval failed:', error));
});


// "heatMode" butonuna tıklandığında
document.getElementById("heatMode").addEventListener("click", function() {
    // Firebase JSON veri URL'sini güncelleyerek "heatMode" ve "coolMode" değerlerini ayarla
    var heatModeUpdateURL = jsonURL.replace("Sensor.json", "Sensor/heatMode.json") + "?auth=YOUR_AUTH_TOKEN";
    var coolModeUpdateURL = jsonURL.replace("Sensor.json", "Sensor/coolMode.json") + "?auth=YOUR_AUTH_TOKEN";

    // Fetch API kullanarak "heatMode" ve "coolMode" değerlerini güncelle
    Promise.all([
        fetch(heatModeUpdateURL, {
            method: 'PUT',
            body: JSON.stringify(1), // Heat Mode'u açık olarak ayarla
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        fetch(coolModeUpdateURL, {
            method: 'PUT',
            body: JSON.stringify(0), // Cool Mode'u kapalı olarak ayarla
            headers: {
                'Content-Type': 'application/json'
            }
        })
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        console.log('Heat and cool modes updated:', data);
        // Pop-up gösterme fonksiyonunu çağırarak modalı aç
        showTemperaturePopup("Isıtma Modu", "Lütfen istediğiniz sıcaklık değerini girin:");
    })
    .catch(error => console.error('Heat and cool mode update failed:', error));
});

// "coolMode" butonuna tıklandığında
document.getElementById("coolMode").addEventListener("click", function() {
    // Firebase JSON veri URL'sini güncelleyerek "heatMode" ve "coolMode" değerlerini ayarla
    var heatModeUpdateURL = jsonURL.replace("Sensor.json", "Sensor/heatMode.json") + "?auth=YOUR_AUTH_TOKEN";
    var coolModeUpdateURL = jsonURL.replace("Sensor.json", "Sensor/coolMode.json") + "?auth=YOUR_AUTH_TOKEN";

    // Fetch API kullanarak "heatMode" ve "coolMode" değerlerini güncelle
    Promise.all([
        fetch(heatModeUpdateURL, {
            method: 'PUT',
            body: JSON.stringify(0), // Heat Mode'u kapalı olarak ayarla
            headers: {
                'Content-Type': 'application/json'
            }
        }),
        fetch(coolModeUpdateURL, {
            method: 'PUT',
            body: JSON.stringify(1), // Cool Mode'u açık olarak ayarla
            headers: {
                'Content-Type': 'application/json'
            }
        })
    ])
    .then(responses => Promise.all(responses.map(response => response.json())))
    .then(data => {
        console.log('Heat and cool modes updated:', data);
        // Pop-up gösterme fonksiyonunu çağırarak modalı aç
        showTemperaturePopup("Soğutma Modu", "Lütfen istediğiniz sıcaklık değerini girin:");
    })
    .catch(error => console.error('Heat and cool mode update failed:', error));
});


// Pop-up gösterme fonksiyonu
function showTemperaturePopup(mode, message) {
    // Bootstrap modalını oluştur
    var modalContent = `
        <div class="modal" id="temperatureModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${mode}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>${message}</p>
                        <input type="number" id="temperatureInput" class="form-control" placeholder="Örn: 25" required>
                        <div id="modalAlert" class="alert alert-danger d-none" role="alert">Geçersiz bir sıcaklık değeri girdiniz. Lütfen 16 ile 30 derece arasında bir sayı girin.</div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Kapat</button>
                        <button type="button" class="btn btn-primary" onclick="saveTemperature()">Kaydet</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Modalı HTML'e ekleyelim
    var modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalContent;
    document.body.appendChild(modalContainer);

    // Bootstrap modalını etkinleştirelim
    var modal = $('#temperatureModal').modal('show');

    // Enter tuşuna basıldığında sıcaklık değerini kaydet
    modal.on('keypress', function (e) {
        if (e.which === 13) {
            saveTemperature();
        }
    });

    // Enter tuşuna basıldığında formun gönderilmesini engelleyelim
    modal.find('form').on('submit', function (e) {
        e.preventDefault();
    });
}


// Kullanıcının girdiği sıcaklık değerini kaydetme fonksiyonu wantedTemp
function saveTemperature() {
    var wantedTemp = document.getElementById("temperatureInput").value;
    var modalAlert = document.getElementById("modalAlert");

    // Girişin sıcaklık aralığına uygunluğunu kontrol et
    if (wantedTemp !== "" && !isNaN(parseFloat(wantedTemp))) {
        if (wantedTemp >= 16 && wantedTemp <= 30) {
            // Firebase JSON veri URL'sini güncelleyerek "wantedTemp" değerini kaydet
            var updateURL = jsonURL.replace("Sensor.json", "Sensor/wantedTemp.json") + "?auth=YOUR_AUTH_TOKEN";
            fetch(updateURL, {
                method: 'PUT',
                body: JSON.stringify(parseFloat(wantedTemp)),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log('Wanted temperature updated:', data);
                // Başarılı bir şekilde güncellendiğine dair kullanıcıyı modal içinde bilgilendir
                modalAlert.textContent = İstenilen sıcaklık ${wantedTemp}°C olarak ayarlandı.;
                modalAlert.classList.remove('d-none');
                // Sıcaklık güncellendikten sonra modalı kapat
                setTimeout(function() {
                    $('#temperatureModal').modal('hide');
                }, 2000); // 2 saniye sonra modalı kapat
            })
            .catch(error => console.error('Wanted temperature update failed:', error));
        } else {
            // Kullanıcıya uygun aralıkta bir sıcaklık girmesi gerektiğini modal içinde belirt
            modalAlert.textContent = "Geçersiz bir sıcaklık değeri girdiniz. Lütfen 16 ile 30 derece arasında bir sayı girin.";
            modalAlert.classList.remove('d-none');
        }
    } else {
        // Kullanıcıya sayısal bir değer girmesi gerektiğini belirt
        modalAlert.textContent = "Lütfen geçerli bir sayı girin.";
        modalAlert.classList.remove('d-none');
    }
}
