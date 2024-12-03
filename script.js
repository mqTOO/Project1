// Подключение к Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализация Telegram Mini-App
tg.ready();
tg.expand();

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

// Перемещение камеры (свайп + мышь)
function startDrag(x, y) {
    isDragging = true;
    startX = x;
    startY = y;
}

function drag(x, y) {
    if (!isDragging) return;
    offsetX += x - startX;
    offsetY += y - startY;
    startX = x;
    startY = y;
    gameField.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
}

function endDrag() {
    isDragging = false;
}

// Обработка событий мыши
gameField.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
document.addEventListener("mousemove", (e) => drag(e.clientX, e.clientY));
document.addEventListener("mouseup", endDrag);

// Обработка событий касания (для мобильных устройств)
gameField.addEventListener("touchstart", (e) => {
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
});

gameField.addEventListener("touchmove", (e) => {
    const touch = e.touches[0];
    drag(touch.clientX, touch.clientY);
    e.preventDefault(); // Предотвращает стандартное поведение, такое как прокрутка страницы
});

gameField.addEventListener("touchend", endDrag);

// Инициализация игры
createGameField();
