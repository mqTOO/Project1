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

// Логика игры
const resourceCount = document.getElementById("resource-count");
const gameField = document.getElementById("game-field");
const openMenuButton = document.getElementById("open-menu");
const buildingMenu = document.getElementById("building-menu");
const closeMenuButton = document.getElementById("close-menu");

let resources = 2500; // Стартовый баланс
let buildings = [];
let cells = [];
const gridSize = 8;

// Автоматическая адаптация игрового поля под экран пользователя
function adjustGameField() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const gameSize = Math.min(screenWidth * 0.9, screenHeight * 0.7);
    gameField.style.width = `${gameSize}px`;
    gameField.style.height = `${gameSize}px`;
}

// Создание игрового поля
function createGameField() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.id = i;
        gameField.appendChild(cell);
        cells.push(cell);
    }
    gameField.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gameField.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;
}

// Добавление ратуши в центр поля
function placeTownHall() {
    const centerIndex = Math.floor((gridSize * gridSize) / 2); // Индекс центральной ячейки
    const centerCell = cells[centerIndex];

    const townHall = document.createElement("div");
    townHall.classList.add("building");
    townHall.textContent = "РАТУША";

    centerCell.appendChild(townHall);

    buildings.push({
        id: buildings.length + 1,
        type: "town-hall",
        level: 1,
        cellId: centerCell.dataset.id,
        element: townHall
    });

    resources -= 500; // Уменьшаем начальный баланс на стоимость ратуши
    updateResources();
}

// Обновление отображения ресурсов
function updateResources() {
    resourceCount.textContent = resources;
}

// Генерация ресурсов
function generateResources() {
    buildings.forEach((building) => {
        resources += building.level; // Увеличиваем ресурсы по уровню зданий
    });
    updateResources();
}

// Открытие меню
openMenuButton.addEventListener("click", () => {
    buildingMenu.classList.add("visible");
    buildingMenu.classList.remove("hidden");
});

// Закрытие меню по кнопке крестик
closeMenuButton.addEventListener("click", () => {
    buildingMenu.classList.add("hidden");
    buildingMenu.classList.remove("visible");
});

// Закрытие меню при нажатии на пустую область
document.addEventListener("click", (event) => {
    if (
        buildingMenu.classList.contains("visible") &&
        !buildingMenu.contains(event.target) &&
        !openMenuButton.contains(event.target)
    ) {
        buildingMenu.classList.add("hidden");
        buildingMenu.classList.remove("visible");
    }
});

// Построить здание
const buildingOptions = document.querySelectorAll(".building-option");
buildingOptions.forEach((option) => {
    option.addEventListener("click", () => {
        const buildingType = option.dataset.building;
        let buildingCost = 0;

        // Стоимость здания
        switch (buildingType) {
            case "gold-mine":
                buildingCost = 500;
                break;
            case "oil-rig":
                buildingCost = 1000;
                break;
            case "barracks":
                buildingCost = 2000;
                break;
            case "builder-house":
                buildingCost = 2500;
                break;
            default:
                alert("Неизвестное здание!");
                return;
        }

        if (resources < buildingCost) {
            alert("Недостаточно ресурсов для постройки!");
            return;
        }

        const emptyCell = cells.find(cell => !cell.hasChildNodes());
        if (!emptyCell) {
            alert("Нет свободного места для постройки здания!");
            return;
        }

        // Создание элемента здания
        const buildingElement = document.createElement("div");
        buildingElement.classList.add("building");
        buildingElement.textContent = buildingType.replace("-", " ").toUpperCase();

        emptyCell.appendChild(buildingElement);

        buildings.push({
            id: buildings.length + 1,
            type: buildingType,
            level: 1,
            cellId: emptyCell.dataset.id,
            element: buildingElement
        });

        resources -= buildingCost;
        updateResources();
        buildingMenu.classList.add("hidden");
        buildingMenu.classList.remove("visible");
    });
});

// Перемещение зданий (дополнительно, если потребуется)
gameField.addEventListener("click", (event) => {
    const targetCell = event.target.closest(".cell");
    if (!targetCell) return;

    // Реализация перемещения здания, если потребуется.
});

// Обработка изменения размеров окна
adjustGameField();
window.addEventListener("resize", adjustGameField);

// Запуск игры
createGameField();
placeTownHall(); // Устанавливаем ратушу в центр
setInterval(generateResources, 5000); // Генерация ресурсов каждые 5 секунд
