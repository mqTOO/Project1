// Подключение к Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализация Telegram Mini-App
tg.ready();
tg.expand();
tg.requestFullscreen();
tg.disableVerticalSwipes();

// Получение информации о пользователе
const user = tg.initDataUnsafe?.user || null;

if (user) {
    alert(`Привет, ${user.first_name}! Добро пожаловать в игру.`);
}

// Telegram Back Button
tg.BackButton.show();
tg.BackButton.onClick(() => tg.close());

const gameField = document.getElementById("game-field");
const openMenuButton = document.getElementById("open-menu");
const buildingMenu = document.getElementById("building-menu");
const closeMenuButton = document.getElementById("close-menu");
const buildingOptions = document.querySelectorAll(".building-option");

let resources = 2500;
let buildings = [];
const gridSize = 15;
let isDragging = false;
let startX, startY;
let offsetX = 0, offsetY = 0;

// Создание игрового поля
function createGameField() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.id = i;
        gameField.appendChild(cell);
    }
}

// Открытие меню
openMenuButton.addEventListener("click", () => {
    buildingMenu.classList.add("visible");
    buildingMenu.classList.remove("hidden");
});

// Закрытие меню
closeMenuButton.addEventListener("click", () => {
    buildingMenu.classList.add("hidden");
    buildingMenu.classList.remove("visible");
});

// Построить здание
buildingOptions.forEach(option => {
    option.addEventListener("click", () => {
        const buildingType = option.dataset.building;
        let buildingCost;

        switch (buildingType) {
            case "gold-mine": buildingCost = 500; break;
            case "oil-rig": buildingCost = 1000; break;
            case "barracks": buildingCost = 2000; break;
            case "builder-house": buildingCost = 2500; break;
            default: return;
        }

        if (resources < buildingCost) {
            alert("Недостаточно ресурсов!");
            return;
        }

        const emptyCell = [...gameField.children].find(cell => !cell.hasChildNodes());
        if (!emptyCell) {
            alert("Нет свободного места!");
            return;
        }

        const buildingElement = document.createElement("div");
        buildingElement.classList.add("building");
        buildingElement.textContent = buildingType.toUpperCase();

        emptyCell.appendChild(buildingElement);
        resources -= buildingCost;
        buildingMenu.classList.add("hidden");
        buildingMenu.classList.remove("visible");
    });
});

// Перемещение камеры (свайп)
gameField.addEventListener("mousedown", (e) => {
    isDragging = true;
    startX = e.clientX;
    startY = e.clientY;
});

document.addEventListener("mouseup", () => {
    isDragging = false;
});

document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    offsetX += e.clientX - startX;
    offsetY += e.clientY - startY;
    startX = e.clientX;
    startY = e.clientY;
    gameField.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

// Инициализация игры
createGameField();
createGameField();