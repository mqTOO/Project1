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
const gameField = document.getElementById("game-field");
const openMenuButton = document.getElementById("open-menu");
const buildingMenu = document.getElementById("building-menu");
const addBuildingButton = document.getElementById("add-building");

let resources = 2500; // Начальный баланс 2500 монет
let buildings = [];
let cells = [];
let selectedBuilding = null;
let currentBuilding = null; // Текущее выбранное здание для постройки
let movingBuilding = null; // Здание, которое перемещаем

// Устанавливаем размер поля 12x12
const gridSize = 12;

// Функция для обновления размеров сетки
function updateGridSize() {
    gameField.style.gridTemplateColumns = `repeat(${gridSize}, 60px)`;  // 60px на клетку
    gameField.style.gridTemplateRows = `repeat(${gridSize}, 60px)`;  // 60px на клетку
}

// Создаём клетки поля
function createGameField() {
    for (let i = 0; i < gridSize * gridSize; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.id = i;
        gameField.appendChild(cell);
        cells.push(cell);
    }
    updateGridSize();
}

// Обновление отображения ресурсов
function updateResources() {
    resourceCount.textContent = resources;
}

// Генерация ресурсов
function generateResources() {
    buildings.forEach((building) => {
        resources += building.level; // Зависимость от уровня здания
    });
    updateResources();
}

// Создание здания
function addBuilding() {
    if (!currentBuilding) {
        alert("Выберите здание для постройки!");
        return;
    }

    let buildingCost = 0;
    switch (currentBuilding) {
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
    }

    if (resources < buildingCost) {
        alert("Недостаточно монет для постройки здания!");
        return;
    }

    const emptyCell = cells.find(cell => !cell.hasChildNodes());
    if (!emptyCell) {
        alert("Нет места для нового здания!");
        return;
    }

    const buildingId = buildings.length + 1;
    const buildingElement = document.createElement("div");
    buildingElement.classList.add("building");
    buildingElement.textContent = currentBuilding.replace("-", " ").toUpperCase();

    // Добавляем обработчик для выбора здания
    buildingElement.addEventListener("click", (event) => {
        event.stopPropagation(); // Останавливаем всплытие клика
        const building = buildings.find(b => b.id === buildingId);
        selectBuilding(building);
    });

    emptyCell.appendChild(buildingElement);

    buildings.push({
        id: buildingId,
        type: currentBuilding,
        level: 1,
        cellId: emptyCell.dataset.id,
        element: buildingElement
    });

    resources -= buildingCost; // Уменьшаем ресурсы на стоимость здания
    updateResources();

    buildingMenu.classList.add("hidden"); // Закрыть меню после постройки
}

// Функция выбора здания
function selectBuilding(building) {
    if (selectedBuilding === building) {
        selectedBuilding = null; // Отмена выбора, если нажато повторно
        building.element.style.border = "2px solid #f57c00"; // Сброс выделения
    } else {
        if (selectedBuilding) {
            selectedBuilding.element.style.border = "2px solid #f57c00"; // Сброс предыдущего выбора
        }
        selectedBuilding = building;
        building.element.style.border = "2px dashed #00f"; // Указание выделения
    }
}

// Функция перемещения здания
function moveBuilding(toCell) {
    if (movingBuilding && !toCell.hasChildNodes()) {
        const fromCell = cells[movingBuilding.cellId];
        fromCell.removeChild(fromCell.firstChild);

        toCell.appendChild(movingBuilding.element);

        movingBuilding.cellId = toCell.dataset.id;
        movingBuilding = null; // Сбрасываем выбранное здание
    } else if (toCell.hasChildNodes()) {
        alert("Эта клетка занята!");
    }
}

// Добавляем обработчик клика для поля
gameField.addEventListener("click", (event) => {
    const targetCell = event.target.closest(".cell");
    if (targetCell) {
        moveBuilding(targetCell);
    }
});

// Открытие меню
openMenuButton.addEventListener("click", () => {
    buildingMenu.classList.toggle("hidden");
});

// Обработчики выбора зданий из меню
const buildingOptions = document.querySelectorAll(".building-option");
buildingOptions.forEach((option) => {
    option.addEventListener("click", () => {
        currentBuilding = option.dataset.building;
        addBuilding(); // Построить выбранное здание
    });
});

// Запуск таймера генерации ресурсов
setInterval(generateResources, 5000); // 1 раз в 5 секунд

// Инициализация игры
createGameField();

// Строим начальное здание в случайной клетке
const firstEmptyCell = cells.find(cell => !cell.hasChildNodes());
if (firstEmptyCell) {
    const buildingId = 1;
    const buildingElement = document.createElement("div");
    buildingElement.classList.add("building");
    buildingElement.textContent = "Ратуша";

    firstEmptyCell.appendChild(buildingElement);

    buildings.push({
        id: buildingId,
        type: "town-hall",
        level: 1,
        cellId: firstEmptyCell.dataset.id,
        element: buildingElement
    });

    resources -= 500; // Стоимость первого здания
    updateResources();
}
