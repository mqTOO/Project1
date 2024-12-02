// Подключение к Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализация приложения Telegram
tg.ready(); // Уведомление Telegram, что приложение готово
tg.expand(); // Расширение приложения на весь экран

// Получение информации о пользователе
const user = tg.initDataUnsafe?.user || null;

// Приветственное сообщение
if (user) {
    alert(`Привет, ${user.first_name}! Добро пожаловать в игру.`);
}

// Telegram Back Button
tg.BackButton.show(); // Отобразить кнопку "Назад"
tg.BackButton.onClick(() => {
    tg.close(); // Закрыть Web App
});

// Логика игры
const resourceCount = document.getElementById("resource-count");
const buildingsContainer = document.getElementById("buildings");
const addBuildingButton = document.getElementById("add-building");

let resources = 0;
let buildings = [];

// Обновление отображения ресурсов
function updateResources() {
    resourceCount.textContent = resources;
}

// Генерация ресурсов
function generateResources() {
    buildings.forEach(() => {
        resources += 1; // 1 ресурс с каждого здания
    });
    updateResources();
}

// Создание здания
function addBuilding() {
    const buildingId = buildings.length + 1;
    const buildingElement = document.createElement("div");
    buildingElement.classList.add("building");
    buildingElement.textContent = `Здание ${buildingId}`;
    buildingsContainer.appendChild(buildingElement);

    buildings.push(buildingId);
}

// Обработчики событий
addBuildingButton.addEventListener("click", () => {
    addBuilding();
    updateResources();
});

// Запуск таймера генерации ресурсов
setInterval(generateResources, 5000); // 1 раз в 5 секунд

// Инициализация игры
updateResources();
