"use strict";

let canv = document.querySelector('#game');
let ctx = canv.getContext('2d');
let grid = 16; //клетка
let count = 0; //скорость

//сама змейка
let snake = {
    //координаты
    x: 160,
    y: 160,
    //скорость змейки - в каждом новом кадре змейка смещается по оси Х или У
    dx: grid,
    dy: 0,
    //хвост, который пока пустой
    cells: [],
    //стартовая длина змейки - 4 клетки
    maxCells: 4
};

//еда змейки
let food = {
    //начальные координаты
    x: getRandomInt(0, 25) * grid,
    y: getRandomInt(0, 25) * grid
};



//Генератор случайных чисел в заданном диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//бесконечный игровой цикл, в котором происходит вся игра
function loop() {
    //функция, замедляющая ход игры с 60 кадров до 15 в секунду (пропускает три кадра)
    //срабатывает каждый 4й кадр игры
    requestAnimationFrame(loop);
    //игровой код выполнится только один раз из 4хБ в этом суть замедления кадров,
    //а пока переменная count меньше 4хБ код выполняться не будет
    if (++count < 8){
        return;
    }
    //обнуление переменной скорости
    count = 0;
    //очистка игрового поля
    ctx.clearRect(0, 0, canv.width, canv.height);
    //движение змейки с нужной скоростью
    snake.x += snake.dx;
    snake.y += snake.dy;
    //если змейка достигла края поля по горизонтали - продолжаем ее движение с противоположной стороны
    if (snake.x < 0){
        snake.x = canv.width - grid;
    } else if (snake.x >= canv.width) {
        snake.x = 0;
    }
    //тоже самое по вертикали
    if (snake.y < 0){
        snake.y = canv.width - grid;
    } else if (snake.y >= canv.width) {
        snake.y = 0;
    }
    //продолжаем двигаться в выбранном направлении. голова всегда впереди,
    //поэтому добавляем ее координаты в начало массива, который отвечает за всю змейку.
    snake.cells.unshift({x: snake.x, y: snake.y});
    //сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно освобождает клетки после себя
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    //отрисовка еды
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, grid - 1, grid - 1);
    //одно движение змейки - один новый нарисованный квадратик
    ctx.fillStyle = 'green';
    //обработчик каждого элемента змейки
    snake.cells.forEach(function (cell, index) {
        //чтобы создать эффект клеточек, делаем зеленые квадратики меньше на один пиксель, чтобы образовалась черная граница
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        //если змейка добралась до еды..
        if (cell.x === food.x && cell.y === food.y) {
            //увеличивается длина змейки
            snake.maxCells++;
            //генерируется новая еда
            //размер холста 400 на 400, при этом он разбит на ячейки 25 на 25
            food.x = getRandomInt(0, 25) * grid;
            food.y = getRandomInt(0, 25) * grid;
        }
        //проверка не столкнулась ли змейка сама с собой
        //для этого перебираем весь массив и смотри, есть ли в массиве змейки две клетки с одинаковыми координатами
        for (let i = index + 1; i < snake.cells.length; i++){
            //если такие есть, то игра начинается заново
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                alert('Вы проиграли. Ваш счет = ' + (snake.maxCells - 4));
                //задаются стартовые параметры оновным переменным
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
                //ставим еду на случайное место
                food.x = getRandomInt(0, 25) * grid;
                food.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}

//создание управления на стрелки
document.addEventListener('keydown', function (e){
    //дополнительная проверка: если змейка движется, например, влево, то еще одно нажатие влево или вправо ничего не меняет
    //стрелка влево
    //если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали..
    if ((e.key === 'a' || e.key === 'ArrowLeft') && snake.dx === 0){
        //то даем ей движение по горозинтали, влево, а вертикальное - останавливаем
        //та же самая логика будет и на остальных кнопках
        snake.dx = -grid;
        snake.dy = 0;
    }
    //стрелка вверх
    else if ((e.key === 'w' || e.key === 'ArrowUp') && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    //стрелка вправо
    else if ((e.key === 'd' || e.key === 'ArrowRight') && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    //стрелка вниз
    else if ((e.key === 's' || e.key === 'ArrowDown') && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

requestAnimationFrame(loop);