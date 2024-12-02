// Подключение к Telegram Web App
const tg = window.Telegram.WebApp;

// Инициализация Telegram Mini-App
tg.ready();
tg.expand();

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

let resources = 2500;
let buildings = [];
let cells = [];
const gridSize = 8;

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

// Обновление ресурсов
function updateResources() {
    resourceCount.textContent = resources;
}

// Генерация ресурсов
function generateResources() {
    buildings.forEach((building) => {
        resources += building.level; // Увеличиваем ресурсы в зависимости от уровня здания
    });
    updateResources();
}

// Открытие/закрытие меню постройки
openMenuButton.addEventListener("click", () => {
    buildingMenu.classList.toggle("hidden");
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
            case "town-hall":
                buildingCost = 1500;
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
    });
});

// Запуск игры
createGameField();
setInterval(generateResources, 5000);
