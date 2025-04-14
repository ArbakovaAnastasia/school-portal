// СТРУКТУРА ВНУТРИ ЭТОГО ФАЙЛА:
// -переключение по вкладкам
// -календарь в общей и в расписании (2 в 1)
// -вкладка ОБЩАЯ ИНФОРМАЦИЯ
//      ---загрузка чата изначально снизу
//      ---кнопка запуск трансляции состояние clicked на 200ms
//      ---раскрытие списка курсов
//      ---переключение на вкладку обращения учеников
//      ---фильтр по группам +плавный скролл +фильтр по группам вкладки Обращения учеников (фильтр и по дате, и по типу, и по группе)
//      ---подсчет среднего количества в группах + открывания и закрывания списка учеников у группе
// -вкладка РАСПИСАНИЕ УРОКОВ
//      ---кнопка Создать событие состояние clicked на 200ms
// -вкладка ДОМАШНИЕ ЗАДАНИЯ
//      ---раскрывание select
//      ---фильтры по типу все-непроверенные-новые-проверенные и по дате Одновременный +открывания и закрывания списка учеников у группе
// -вкладка ПРАКТИЧЕСКИЕ ЗАДАНИЯ
//      ---разворота стрелки
//      ---раскрывание "типа select" из div-ов
//      ---фильтры по типу все-непроверенные-новые-проверенные и по дате Одновременный +открывания и закрывания списка учеников у группе
// -вкладка ОБРАЩЕНИЯ УЧЕНИКОВ
//      ---для прокрутки скриншотов в обращении
//      ---открывание обращения по id
//      ---фильтр находится в переключении вкладок, загружается при открывании, потому что скролл вправо при загрузке страницы не срабатывал из-за фильтра по группам на общей страницы, тип одновременно не могли, сделала при открывании вкладки (положительные-нейтральные-отрицательные и по дате Одновременный)
//      ---кнопка Закрыть обращение
// -вкладка ОТЗЫВЫ УЧЕНИКОВ
//      ---фильтры по типу положительные-нейтральные-отрицательные и по дате Одновременный
//      ---картинка на фоне при отсутсвии отзывов
// -вкладка ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ
//      ---кнопки переключения сайт-почта-соо-тг
//      ---редактирование инпутов
//      ---раскрывание select
//      ---загрузка аватара и удаление
//      ---перемешение блока Система при адаптиве
// -всплывашка ПРОФИЛЬ УЧЕНИКА
// нету
// -popup РАСПИСАНИЕ УРОКОВ
//      ---появление
//      ---очищение инпутов
//      ---добавления и удаления новых строк с Модули и Точки контроля
//      ---клик по кнопкам Создать и Закрыть накладывает стиль clicked
// -popup ДОМАШНЕЕ ЗАДАНИЕ
//      ---появление
//      ---состояния clicked на полсек для кнопок завершить проверку и выйти без сохранения
//      ---кнопка Завершить проверку активируется когда три инпута заполнены 
//      ---для раскрывания select-ов
// -popup ПРАКТИЧЕСКОЕ ЗАДАНИЕ
//      ---появление
//      ---состояния clicked на полсек для кнопок завершить проверку и выйти без сохранения
//      ---кнопка Завершить проверку активируется когда три инпута заполнены
// -popup Запуск трансляции
// -header

// можно искать по названию




// переключение вкладок в меню (начало)
document.addEventListener("DOMContentLoaded", function () {
    const buttons_menu = document.querySelectorAll(".n1711-lk-teacher-main-left-middle-section-option, .n1711-lk-teacher-main-header-menu-option-down-main, .n1711-lk-teacher-main-header-menu-option-down, .n1711-lk-teacher-main-header-menu-dropdown-item, .n1711-lk-teacher-main-header-teacher");
    const profileButton = document.querySelector(".n1711-lk-teacher-main-left-top[data-target='profile']");
    let hasScrolledSchedule = false; // Флаг для отслеживания прокрутки
    // Массив с данными для вкладок
    const tabs_menu = [
        { target: "info", title: "n1711-lk-teacher-main-title-info", content: "n1711-lk-teacher-main-content-info" },
        { target: "schedule", title: "n1711-lk-teacher-main-title-schedule", content: "n1711-lk-teacher-main-content-schedule", extraAction: () => {
            if (!hasScrolledSchedule) {
                const secondaryCalendarElement = document.getElementById("n1711-lk-teacher-lessonschedule-calendar1");
                console.log("Выполняем прокрутку вправо...");
                secondaryCalendarElement.scrollLeft += 100;
                hasScrolledSchedule = true; // Устанавливаем флаг, чтобы прокрутка больше не выполнялась
                // это сдвиг в горизонтальном календаре, чтобы могли прогрузится предыдущие месяцы при прокрутке влево
            }

            
            // код для прогрузки фильтра по группам, загружается вместе со вкладкой, иначе не работает
            const scrollWrap_schedule = document.querySelector('.n1711-lk-teacher-main-title-schedule-right-option-wrap');
            const scrollLeftButton_schedule = document.querySelector('.n1711-lk-teacher-main-title-schedule-right-scroll-button.left img');
            const scrollRightButton_schedule = document.querySelector('.n1711-lk-teacher-main-title-schedule-right-scroll-button.right img');

            const updateButtonImages_schedule = () => {
                const maxScrollLeft = scrollWrap_schedule.scrollWidth - scrollWrap_schedule.clientWidth;

                if (scrollWrap_schedule.scrollLeft <= 0) {
                    scrollLeftButton_schedule.src = 'img/lk_teacher_information_groups_arrow.svg';
                } else {
                    scrollLeftButton_schedule.src = 'img/lk_teacher_information_groups_arrow_blue.svg';
                }

                if (scrollWrap_schedule.scrollLeft >= maxScrollLeft) {
                    scrollRightButton_schedule.src = 'img/lk_teacher_information_groups_arrow.svg';
                } else {
                    scrollRightButton_schedule.src = 'img/lk_teacher_information_groups_arrow_blue.svg';
                }
            };

            let scrollInterval_schedule;
            const scrollSpeed_schedule = 4; // Скорость прокрутки (пикселей за шаг)
            let scrollDirection_schedule = null;

            const scrollStep_schedule = () => {
                if (scrollDirection_schedule === 'left') {
                    scrollWrap_schedule.scrollLeft -= scrollSpeed_schedule;
                } else if (scrollDirection_schedule === 'right') {
                    scrollWrap_schedule.scrollLeft += scrollSpeed_schedule;
                }
                updateButtonImages_schedule(); // Обновление состояния кнопок во время прокрутки
            };

            const startScrolling_schedule = (direction) => {
                scrollDirection_schedule = direction;
                if (!scrollInterval_schedule) {
                    scrollInterval_schedule = setInterval(scrollStep_schedule, 10); // 10 мс между шагами
                }
            };

            const stopScrolling_schedule = () => {
                clearInterval(scrollInterval_schedule);
                scrollInterval_schedule = null;
                scrollDirection_schedule = null;
            };

            // Добавляем события непосредственно на кнопки
            scrollLeftButton_schedule.addEventListener('mousedown', () => startScrolling_schedule('left'));
            scrollRightButton_schedule.addEventListener('mousedown', () => startScrolling_schedule('right'));
            scrollLeftButton_schedule.addEventListener('mouseup', stopScrolling_schedule);
            scrollRightButton_schedule.addEventListener('mouseup', stopScrolling_schedule);
            scrollLeftButton_schedule.addEventListener('mouseleave', stopScrolling_schedule);
            scrollRightButton_schedule.addEventListener('mouseleave', stopScrolling_schedule);

            // Событие на изменение скролла
            scrollWrap_schedule.addEventListener('scroll', updateButtonImages_schedule);

            // Устанавливаем начальное состояние
            scrollWrap_schedule.scrollLeft = scrollWrap_schedule.scrollWidth - scrollWrap_schedule.clientWidth;
            updateButtonImages_schedule(); // Обновляем кнопки после установки позиции скролла

            // Добавление прокрутки по колесику мыши
            scrollWrap_schedule.addEventListener('wheel', (event) => {
                event.preventDefault(); // Предотвращаем стандартное поведение прокрутки страницы
                scrollWrap_schedule.scrollLeft += event.deltaY; // Используем deltaY для горизонтального скролла
                updateButtonImages_schedule(); // Обновление состояния кнопок после прокрутки
            });

        }},
        { target: "homework", title: "n1711-lk-teacher-main-title-homework", content: "n1711-lk-teacher-main-content-homework" },
        { target: "practicework", title: "n1711-lk-teacher-main-title-practicework", content: "n1711-lk-teacher-main-content-practicework" },
        { target: "appeals", title: "n1711-lk-teacher-main-title-appeals", content: "n1711-lk-teacher-main-content-appeals", extraAction: () => {
            // код для прогрузки фильтра по группам, загружается вместе со вкладкой, иначе не работает
                const scrollWrap_appeals = document.querySelector('.n1711-lk-teacher-main-title-appeals-right-option-wrap');
                const scrollLeftButton_appeals = document.querySelector('.n1711-lk-teacher-main-title-appeals-right-scroll-button.left img');
                const scrollRightButton_appeals = document.querySelector('.n1711-lk-teacher-main-title-appeals-right-scroll-button.right img');

                const updateButtonImages_appeals = () => {
                    const maxScrollLeft = scrollWrap_appeals.scrollWidth - scrollWrap_appeals.clientWidth;

                    if (scrollWrap_appeals.scrollLeft <= 0) {
                        scrollLeftButton_appeals.src = 'img/lk_teacher_information_groups_arrow.svg';
                    } else {
                        scrollLeftButton_appeals.src = 'img/lk_teacher_information_groups_arrow_blue.svg';
                    }

                    if (scrollWrap_appeals.scrollLeft >= maxScrollLeft) {
                        scrollRightButton_appeals.src = 'img/lk_teacher_information_groups_arrow.svg';
                    } else {
                        scrollRightButton_appeals.src = 'img/lk_teacher_information_groups_arrow_blue.svg';
                    }
                };
            
                let scrollInterval_appeals;
                const scrollSpeed_appeals = 4; // Скорость прокрутки (пикселей за шаг)
                let scrollDirection_appeals = null;
        
                const scrollStep_appeals = () => {
                    if (scrollDirection_appeals === 'left') {
                        scrollWrap_appeals.scrollLeft -= scrollSpeed_appeals;
                    } else if (scrollDirection_appeals === 'right') {
                        scrollWrap_appeals.scrollLeft += scrollSpeed_appeals;
                    }
                    updateButtonImages_appeals(); // Обновление состояния кнопок во время прокрутки
                };
        
                const startScrolling_appeals = (direction) => {
                    scrollDirection_appeals = direction;
                    if (!scrollInterval_appeals) {
                        scrollInterval_appeals = setInterval(scrollStep_appeals, 10); // 10 мс между шагами
                    }
                };
        
                const stopScrolling_appeals = () => {
                    clearInterval(scrollInterval_appeals);
                    scrollInterval_appeals = null;
                    scrollDirection_appeals = null;
                };
        
                // Добавляем события непосредственно на кнопки
                scrollLeftButton_appeals.addEventListener('mousedown', () => startScrolling_appeals('left'));
                scrollRightButton_appeals.addEventListener('mousedown', () => startScrolling_appeals('right'));
                scrollLeftButton_appeals.addEventListener('mouseup', stopScrolling_appeals);
                scrollRightButton_appeals.addEventListener('mouseup', stopScrolling_appeals);
                scrollLeftButton_appeals.addEventListener('mouseleave', stopScrolling_appeals);
                scrollRightButton_appeals.addEventListener('mouseleave', stopScrolling_appeals);
        
                // Событие на изменение скролла
                scrollWrap_appeals.addEventListener('scroll', updateButtonImages_appeals);
        
                // Устанавливаем начальное состояние
                scrollWrap_appeals.scrollLeft = scrollWrap_appeals.scrollWidth - scrollWrap_appeals.clientWidth;
                updateButtonImages_appeals(); // Обновляем кнопки после установки позиции скролла
    
                // Добавление прокрутки по колесику мыши
                scrollWrap_appeals.addEventListener('wheel', (event) => {
                    event.preventDefault(); // Предотвращаем стандартное поведение прокрутки страницы
                    scrollWrap_appeals.scrollLeft += event.deltaY; // Используем deltaY для горизонтального скролла
                    updateButtonImages_appeals(); // Обновление состояния кнопок после прокрутки
                });

        }},
        { target: "reviews", title: "n1711-lk-teacher-main-title-reviews", content: "n1711-lk-teacher-main-content-reviews" },
        { target: "kpiteachersalary", title: "n1711-lk-teacher-main-title-kpiteachersalary", content: "n1711-lk-teacher-main-content-kpiteachersalary" },
        { target: "profile", title: "n1711-lk-teacher-main-title-profile", content: "n1711-lk-teacher-main-content-profile" },

        
        // Добавляйте новые вкладки здесь
    ];
    // Удобный метод для скрытия всех вкладок
    function hideAllTabs() {
        tabs_menu.forEach(tab => {
            document.getElementById(tab.title).classList.add("hidden");
            document.getElementById(tab.content).classList.add("hidden");
        });
    }
    // Функция обработки кликов по кнопкам
    function handleTabClick(target) {
        const currentTab = tabs_menu.find(tab => tab.target === target); // Находим соответствующую вкладку
        if (currentTab) {
            hideAllTabs(); // Скрываем все вкладки
            // Показываем текущую вкладку
            document.getElementById(currentTab.title).classList.remove("hidden");
            document.getElementById(currentTab.content).classList.remove("hidden");
            // Выполняем дополнительное действие, если оно есть
            if (currentTab.extraAction) {
                currentTab.extraAction();
            }
        }
    }
    // Обработчик для кнопок в ".n1711-lk-teacher-main-left-middle-section"
    buttons_menu.forEach(button => {
        button.addEventListener("click", function () {
            buttons_menu.forEach(btn => btn.classList.remove("active")); // Снимаем класс active со всех кнопок
            this.classList.add("active"); // Добавляем класс active на текущую кнопку
            profileButton.classList.remove("active"); // Добавляем класс active на текущую кнопку
            const target = this.dataset.target; // Получаем target из data-атрибута
            handleTabClick(target);
        });
    });
    // Обработчик для кнопки "profile"
    if (profileButton) {
        profileButton.addEventListener("click", function () {
            buttons_menu.forEach(btn => btn.classList.remove("active")); // Снимаем класс active со всех кнопок
            profileButton.classList.add("active"); // Добавляем класс active на текущую кнопку
            handleTabClick("profile"); // Открываем вкладку profile
        });
    }
});
// переключение вкладок в меню (конец)


// НЕ УДАЛЯТЬ ПРИГОДИТСЯ, ЭТО КОД ДЛЯ ОДНОГО КАЛЕНДАРЯ, А НИЖЕ УЖЕ НА ДВА
// // скрипт для календаря (начало) (надеюсь его можно взять и скопировать, и ничего не сломается) вроде копируется, второй календарь это копия
// // тут все само считается:
// // -календарь центрируется (сомнительно, кажется отвалилось по пути)
// // -сегодняшний день вычисляется
// // -предыдущие и следующие месяцы динамически добавляются при скролле вверх и вниз
// // -переход на расписание по датам с событием
// // -выходные дни неактивные, но бывают исключения по производственному графику, есть возможность ставить событие на выходной и делать кликабельным
// // !если копировать календарь, то убрать переход на расписание
// document.addEventListener("DOMContentLoaded", () => {
//     const calendarElement = document.getElementById("n1711-lk-teacher-lessonschedule-calendar");
//     let currentDate = new Date();
// //! здесь должен быть массив дат забронированных, т.е. в даты когда есть уроки
//     const reservedDates = ["2024-12-12", "2024-12-16", "2024-12-20", "2024-12-28", "2025-01-10"]; // Даты событий в формате YYYY-MM-DD
//     function renderMonth(date) {
//         const monthNames = [
//             "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
//             "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
//         ];
//         const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
//         const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//         const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
//         const today = new Date();
//         const monthContainer = document.createElement("div");
//         monthContainer.classList.add("n1711-lk-teacher-lessonschedule-month");
//         const header = document.createElement("div");
//         header.classList.add("n1711-lk-teacher-lessonschedule-calendar-header");
//         header.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
//         header.dataset.date = `${date.getFullYear()}-${date.getMonth() + 1}`;
//         monthContainer.appendChild(header);
//         const daysRow = document.createElement("div");
//         daysRow.classList.add("n1711-lk-teacher-lessonschedule-calendar-days");
//         daysOfWeek.forEach((day, index) => {
//             const dayElement = document.createElement("div");
//             dayElement.textContent = day;
//             if (index === 5 || index === 6) {
//                 dayElement.classList.add("n1711-lk-teacher-lessonschedule-calendar-weekend-header");
//             }
//             daysRow.appendChild(dayElement);
//         });
//         monthContainer.appendChild(daysRow);
//         const grid = document.createElement("div");
//         grid.classList.add("n1711-lk-teacher-lessonschedule-calendar-grid");
//         for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
//             const emptyCell = document.createElement("div");
//             emptyCell.classList.add("n1711-lk-teacher-lessonschedule-calendar-day", "empty-day");
//             grid.appendChild(emptyCell);
//         }
//         for (let i = 1; i <= lastDate; i++) {
//             const dayElement = document.createElement("div");
//             dayElement.classList.add("n1711-lk-teacher-lessonschedule-calendar-day");
//             dayElement.textContent = i;
//             const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
//             const formattedDate = `${dayDate.getFullYear()}-${(dayDate.getMonth() + 1).toString().padStart(2, '0')}-${dayDate.getDate().toString().padStart(2, '0')}`;
//             const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
//             if (isWeekend) {
//                 dayElement.classList.add("weekend");
//                 dayElement.setAttribute("title", "Выходной день");
//             }
//             if (
//                 date.getFullYear() === today.getFullYear() &&
//                 date.getMonth() === today.getMonth() &&
//                 i === today.getDate()
//             ) {
//                 dayElement.classList.add("today");
//             }
//             if (reservedDates.includes(formattedDate)) {
//                 dayElement.classList.add("reserved");
//                 dayElement.setAttribute("title", "Есть события");
//                 // переход на расписание 
//                 // Добавляем обработчик клика для зарезервированных дат, включая выходные с событиями
//                 dayElement.addEventListener("click", () => {
//                     const scheduleButton = document.querySelector(".n1711-lk-teacher-main-left-middle-section-option[data-target='schedule']");
//                     if (scheduleButton) {
//                         scheduleButton.click();
//                     }
//                 });
//                 // Если это зарезервированный выходной, делаем его кликабельным
//                 if (isWeekend) {
//                     dayElement.classList.remove("weekend");
//                     dayElement.style.cursor = "pointer";
//                 }
//             }
//             grid.appendChild(dayElement);
//         }
//         monthContainer.appendChild(grid);
//         return monthContainer;
//     }
//     function addMonths(direction) {
//         if (direction === "down") {
//             const lastMonthElement = calendarElement.lastElementChild;
//             const lastMonthDate = new Date(
//                 lastMonthElement.querySelector(".n1711-lk-teacher-lessonschedule-calendar-header").dataset.date
//             );
//             const nextDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 1);
//             calendarElement.appendChild(renderMonth(nextDate));
//         } else if (direction === "up") {
//             const firstMonthElement = calendarElement.firstElementChild;
//             const firstMonthDate = new Date(
//                 firstMonthElement.querySelector(".n1711-lk-teacher-lessonschedule-calendar-header").dataset.date
//             );
//             const prevDate = new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() - 1, 1);
//             calendarElement.prepend(renderMonth(prevDate));
//             calendarElement.scrollTop += calendarElement.firstElementChild.offsetHeight;
//         }
//     }
//     function handleScroll() {
//         const scrollTop = calendarElement.scrollTop;
//         const scrollHeight = calendarElement.scrollHeight;
//         const clientHeight = calendarElement.clientHeight;
//         if (scrollTop <= 0) {
//             addMonths("up");
//         } else if (scrollTop + clientHeight >= scrollHeight - 10) {
//             addMonths("down");
//         }
//     }
//     function renderInitialCalendar(startDate) {
//         calendarElement.innerHTML = "";
//         for (let i = -2; i <= 2; i++) { // Два предыдущих, текущий, два следующих месяца
//             const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
//             const month = renderMonth(date);
//             calendarElement.appendChild(month);
//         }
//         const currentMonthElement = calendarElement.children[2]; // Центрируем текущий месяц
//         if (currentMonthElement) {
//             calendarElement.scrollTop = currentMonthElement.offsetTop;
//         }
//     }
//     calendarElement.addEventListener("scroll", handleScroll);
//     renderInitialCalendar(currentDate);
// });
// // скрипт для календаря (конец) (надеюсь его можно взять и скопировать, и ничего не сломается)
// НЕ УДАЛЯТЬ

// на 2 календаря (начало)
// // тут все само считается:
// // -сегодняшний день вычисляется
// // -предыдущие и следующие месяцы динамически добавляются при скролле вверх и вниз
// // -переход на расписание по датам с событием
// // -выходные дни неактивные, но бывают исключения по производственному графику, есть возможность ставить событие на выходной и делать кликабельным
// // !если копировать календарь, то убрать переход на расписание
document.addEventListener("DOMContentLoaded", () => {
    const mainCalendarElement = document.getElementById("n1711-lk-teacher-lessonschedule-calendar");
    const secondaryCalendarElement = document.getElementById("n1711-lk-teacher-lessonschedule-calendar1");

    let currentDate = new Date();
    const reservedDates = ["2024-12-12", "2024-12-16", "2024-12-20", "2024-12-28", "2025-01-10"]; // Даты событий

    function renderMonth(date, targetElement, prepend = false) {
        const monthNames = [
            "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
            "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
        ];
        const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
        const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        const lastDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

        const today = new Date();

        const monthContainer = document.createElement("div");
        monthContainer.classList.add("n1711-lk-teacher-lessonschedule-month");

        const header = document.createElement("div");
        header.classList.add("n1711-lk-teacher-lessonschedule-calendar-header");

        // Проверяем, является ли текущий месяц
        if (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth()
        ) {
            header.style.color = "var(--dark-primary-blue, #00C2F0)";
        } else {
            header.style.color = "var(--dark-text-second, #ACAFBF)";
        }

        header.textContent = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        header.dataset.date = `${date.getFullYear()}-${date.getMonth() + 1}`;
        monthContainer.appendChild(header);

        const daysRow = document.createElement("div");
        daysRow.classList.add("n1711-lk-teacher-lessonschedule-calendar-days");
        daysOfWeek.forEach((day, index) => {
            const dayElement = document.createElement("div");
            dayElement.textContent = day;
            if (index === 5 || index === 6) {
                dayElement.classList.add("n1711-lk-teacher-lessonschedule-calendar-weekend-header");
            }
            daysRow.appendChild(dayElement);
        });
        monthContainer.appendChild(daysRow);

        const grid = document.createElement("div");
        grid.classList.add("n1711-lk-teacher-lessonschedule-calendar-grid");

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const emptyCell = document.createElement("div");
            emptyCell.classList.add("n1711-lk-teacher-lessonschedule-calendar-day", "empty-day");
            grid.appendChild(emptyCell);
        }

        for (let i = 1; i <= lastDate; i++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("n1711-lk-teacher-lessonschedule-calendar-day");
            dayElement.textContent = i;

            const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
            const formattedDate = `${dayDate.getFullYear()}-${(dayDate.getMonth() + 1).toString().padStart(2, '0')}-${dayDate.getDate().toString().padStart(2, '0')}`;

            const isWeekend = dayDate.getDay() === 0 || dayDate.getDay() === 6;
            if (isWeekend) {
                dayElement.classList.add("weekend");
                dayElement.setAttribute("title", "Выходной день");
            }

            if (
                date.getFullYear() === today.getFullYear() &&
                date.getMonth() === today.getMonth() &&
                i === today.getDate()
            ) {
                dayElement.classList.add("today");
            }

            if (reservedDates.includes(formattedDate)) {
                dayElement.classList.add("reserved");
                dayElement.setAttribute("title", "Есть события");

                dayElement.addEventListener("click", () => {
                    const scheduleButton = document.querySelector(".n1711-lk-teacher-main-left-middle-section-option[data-target='schedule']");
                    if (scheduleButton) {
                        scheduleButton.click();
                    }
                });

                if (isWeekend) {
                    dayElement.classList.remove("weekend");
                    dayElement.style.cursor = "pointer";
                }
            }

            grid.appendChild(dayElement);
        }
        monthContainer.appendChild(grid);

        if (prepend) {
            targetElement.prepend(monthContainer);
        } else {
            targetElement.appendChild(monthContainer);
        }
    }

    function addMonths(targetElement, direction) {
        if (direction === "down") {
            const lastMonthElement = targetElement.lastElementChild;
            const lastMonthDate = new Date(
                lastMonthElement.querySelector(".n1711-lk-teacher-lessonschedule-calendar-header").dataset.date
            );
            const nextDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 1);
            renderMonth(nextDate, targetElement);
        } else if (direction === "up") {
            const firstMonthElement = targetElement.firstElementChild;
            const firstMonthDate = new Date(
                firstMonthElement.querySelector(".n1711-lk-teacher-lessonschedule-calendar-header").dataset.date
            );
            const prevDate = new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() - 1, 1);
            const previousScrollHeight = targetElement.scrollHeight;
            renderMonth(prevDate, targetElement, true);
            targetElement.scrollTop += targetElement.scrollHeight - previousScrollHeight;
        }
    }

    function addMonthsHorizontally(targetElement, direction) {
        if (direction === "right") {
            const lastMonthElement = targetElement.lastElementChild;
            const lastMonthDate = new Date(
                lastMonthElement.querySelector(".n1711-lk-teacher-lessonschedule-calendar-header").dataset.date
            );
            const nextDate = new Date(lastMonthDate.getFullYear(), lastMonthDate.getMonth() + 1, 1);
            renderMonth(nextDate, targetElement);
        } else if (direction === "left") {
            const firstMonthElement = targetElement.firstElementChild;
            const firstMonthDate = new Date(
                firstMonthElement.querySelector(".n1711-lk-teacher-lessonschedule-calendar-header").dataset.date
            );
            const prevDate = new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth() - 1, 1);
            const previousScrollWidth = targetElement.scrollWidth;
            renderMonth(prevDate, targetElement, true);
            targetElement.scrollLeft += targetElement.scrollWidth - previousScrollWidth;
        }
    }

    function handleScroll(targetElement) {
        if (targetElement === mainCalendarElement) {
            const scrollTop = targetElement.scrollTop;
            const scrollHeight = targetElement.scrollHeight;
            const clientHeight = targetElement.clientHeight;

            if (scrollTop <= 0) {
                addMonths(targetElement, "up");
            } else if (scrollTop + clientHeight >= scrollHeight - 10) {
                addMonths(targetElement, "down");
            }
        } else if (targetElement === secondaryCalendarElement) {
            const scrollLeft = targetElement.scrollLeft;
            const scrollWidth = targetElement.scrollWidth;
            const clientWidth = targetElement.clientWidth;

            if (scrollLeft <= 0) {
                addMonthsHorizontally(targetElement, "left");
            } else if (scrollLeft + clientWidth >= scrollWidth - 10) {
                addMonthsHorizontally(targetElement, "right");
            }
        }
    }

    startFirstMonth = -3;
    endLastMonth = 7;

    function renderInitialCalendar(targetElement, startDate, isHorizontal = false, startFirstMonth, endLastMonth) {
        targetElement.innerHTML = "";
        for (let i = startFirstMonth; i <= endLastMonth; i++) {
            const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
            renderMonth(date, targetElement);
        }
        const currentMonthElement = targetElement.children[2];
        if (currentMonthElement) {
            if (isHorizontal) {
                targetElement.scrollLeft = currentMonthElement.offsetLeft;
            } else {
                targetElement.scrollTop = currentMonthElement.offsetTop;
            }
        }
    }

    // Рендер основного календаря
    mainCalendarElement.addEventListener("scroll", () => handleScroll(mainCalendarElement));
    renderInitialCalendar(mainCalendarElement, currentDate, false, -3, 7);

    // Рендер второго календаря
    secondaryCalendarElement.addEventListener("scroll", () => handleScroll(secondaryCalendarElement));
    renderInitialCalendar(secondaryCalendarElement, currentDate, true, -1, 7);

    secondaryCalendarElement.addEventListener("wheel", (event) => {
    if (event.deltaY !== 0) {
        event.preventDefault(); // Предотвращаем стандартную вертикальную прокрутку
        secondaryCalendarElement.scrollLeft += event.deltaY; // Преобразуем вертикальную прокрутку в горизонтальную
    }});
});
// на 2 календаря (конец)



// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ загрузка чата изначально снизу (начало)
document.addEventListener("DOMContentLoaded", () => {
    const messenger = document.querySelector('.n1711-lk-teacher-chat-messenger');
    if (messenger) {
        messenger.scrollTop = messenger.scrollHeight;
    }
});
// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ загрузка чата изначально снизу (конец)



// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ кнопка запуск трансляции состояние clicked на 200ms (начало)
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.n1711-lk-teacher-main-left-bottom-button');

    button.addEventListener('click', () => {
        // Добавляем класс "clicked"
        button.classList.add('clicked');

        // Убираем класс через 500 мс
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 500); // Длительность состояния "active" (в миллисекундах)
    });
});
// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ кнопка запуск трансляции состояние clicked на 200ms (конец)



// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ раскрытие списка курсов (начало)
document.addEventListener('DOMContentLoaded', () => {
    const courses = [
        '«Разработка сайтов и приложений»',
        '«Разработка приложений на Android»',
        '«Машинное обучение»',
        '«UI/UX дизайн»',
        '«Веб-разработка»'
    ];

    const courseListContainer = document.querySelector('.n1711-lk-teacher-main-left-top-text-courses-down-list');
    const hiddenCountSpan = document.querySelector('.n1711-lk-teacher-main-left-top-text-courses-down-quantity');

    const profileCourseListContainer = document.querySelector('.n1711-lk-teacher-main-content-profile-left-personal-info-content-top-text-courses-down-list');

    hiddenCountSpan.style.transition = 'all 0.6s ease';

    // Добавляем первые два курса в DOM
    const visibleCoursesContainer = document.createElement('div');
    visibleCoursesContainer.style.display = 'flex';
    visibleCoursesContainer.style.flexDirection = 'column';
    visibleCoursesContainer.style.gap = '4px';

    courses.slice(0, 2).forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.textContent = course;
        visibleCoursesContainer.appendChild(courseItem);
    });

    courseListContainer.appendChild(visibleCoursesContainer);

    // Создаем скрытые курсы
    const hiddenCourses = courses.slice(2);
    const hiddenCoursesContainer = document.createElement('div');
    hiddenCoursesContainer.style.overflow = 'hidden';
    hiddenCoursesContainer.style.height = '0';
    hiddenCoursesContainer.style.transition = 'height 0.6s ease';
    hiddenCoursesContainer.style.display = 'flex';
    hiddenCoursesContainer.style.flexDirection = 'column';
    hiddenCoursesContainer.style.gap = '4px';

    hiddenCourses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.textContent = course;
        hiddenCoursesContainer.appendChild(courseItem);
    });

    courseListContainer.appendChild(hiddenCoursesContainer);

    // Отображаем количество скрытых курсов
    if (hiddenCourses.length > 0) {
        hiddenCountSpan.textContent = `+${hiddenCourses.length}`;
        hiddenCountSpan.style.display = 'flex';
    }

    // Добавляем события для анимации
    hiddenCountSpan.addEventListener('mouseenter', () => {
        hiddenCoursesContainer.style.height = `${hiddenCoursesContainer.scrollHeight}px`;
        courseListContainer.style.gap = '4px';
        hiddenCountSpan.style.opacity = '0';
    });

    hiddenCountSpan.addEventListener('mouseleave', () => {
        hiddenCoursesContainer.style.height = '0';
        courseListContainer.style.gap = '0';
        hiddenCountSpan.style.opacity = '1';
    });
    
    // Выводим все курсы в профиль без скрытия
    courses.forEach(course => {
        const courseItem = document.createElement('div');
        courseItem.textContent = course;
        profileCourseListContainer.appendChild(courseItem);
    });
});
// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ раскрытие списка курсов (конец)



// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ переключение на вкладку обращения учеников (начало)
document.addEventListener("DOMContentLoaded", () => {
    const elementAppeals = document.querySelectorAll(".n1711-lk-teacher-appeal-background");
    elementAppeals.forEach(elementAppeal => {
        elementAppeal.addEventListener("click", () => {
            const appealButton = document.querySelector(".n1711-lk-teacher-main-left-middle-section-option[data-target='appeals']");
            if (appealButton) {
                appealButton.click();
            }
        });
    });
});
// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ переключение на вкладку обращения учеников (конец)



// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ фильтр по группам (начало) +фильтр по группам вкладки Обращения учеников (фильтр и по дате, и по типу, и по группе)
    // есть переключение по все option, а не по label
document.addEventListener('DOMContentLoaded', () => {

// ОБЩАЯ ИНФОРМАЦИЯ
    // Скрываем все блоки по умолчанию
    const allSections = document.querySelectorAll('.n1711-lk-teacher-informationgroup-content-section');
    allSections.forEach(section => {
        section.style.display = 'none';
    });
    // Скрываем все сообщения по умолчанию
    const allMessages = document.querySelectorAll('.n1711-lk-teacher-chat-messenger-message');
    allMessages.forEach(message => {
        message.style.display = 'none';
    });
    // Скрываем все обращения по умолчанию
    const allAppeals = document.querySelectorAll('.n1711-lk-teacher-appeal');
    allAppeals.forEach(appeal => {
        appeal.style.display = 'none';
    });
// ОБЩАЯ ИНФОРМАЦИЯ

// ОБРАЩЕНИЯ
    // Скрываем все обращения по умолчанию
    const allAppeals_appeals = document.querySelectorAll('.n1711-lk-teacher-appeal-other');
    allAppeals_appeals.forEach(appeal => {
        appeal.style.display = 'none';
    });
// ОБРАЩЕНИЯ

// ОБЩАЯ ИНФОРМАЦИЯ
    // Функция для отображения блока, соответствующего выбранной радиокнопке
    const updateVisibility = () => {
        // Получаем выбранное значение радиокнопки
        const selectedValue = document.querySelector('input[name="group_choice"]:checked')?.value;
        // Показываем только тот блок, который соответствует выбранному значению
        allSections.forEach(section => {
            if (section.getAttribute('value') === selectedValue || selectedValue === 'group-all') {
                section.style.display = 'flex';
            } else {
                section.style.display = 'none';
            }
        });
        // Фильтруем сообщения
        allMessages.forEach(message => {
            const groupSpan = message.querySelector('.n1711-lk-teacher-chat-messenger-message-title-left-down-group-yellow-span') || 
                                message.querySelector('.n1711-lk-teacher-chat-messenger-message-title-left-down-group-green-span');
            const groupValue = groupSpan?.textContent.trim();

            if (groupValue === selectedValue || selectedValue === 'group-all') {
                message.style.display = 'flex';
            } else {
                message.style.display = 'none';
            }
        });
        // Фильтруем обращения
        //  добавлять группы учеников для фильтра
        allAppeals.forEach(appeal => {
            const groupSpan = appeal.querySelector('.n1711-lk-teacher-chat-messenger-message-title-left-down-group-yellow-span')  || 
                                appeal.querySelector('.n1711-lk-teacher-chat-messenger-message-title-left-down-group-green-span');
            const groupValue = groupSpan?.textContent.trim();

            if (groupValue === selectedValue || selectedValue === 'group-all') {
                appeal.style.display = 'flex';
            } else {
                appeal.style.display = 'none';
            }
        });
        // Скрываем дату, если ниже нее нет видимых сообщений
        const allDates = document.querySelectorAll('.n1711-lk-teacher-chat-messenger-date');
        allDates.forEach(date => {
            // Получаем следующий элемент после даты
            let nextElement = date.nextElementSibling;
            let hasVisibleMessages = false;
            // Проверяем все следующие элементы, пока не встретим другую дату или конец списка
            while (nextElement && !nextElement.classList.contains('n1711-lk-teacher-chat-messenger-date')) {
                if (nextElement.style.display !== 'none') {
                    hasVisibleMessages = true;
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }
            // Показываем или скрываем дату в зависимости от наличия видимых сообщений
            if (hasVisibleMessages) {
                date.style.display = 'flex';
            } else {
                date.style.display = 'none';
            }
        });
    };
// ОБЩАЯ ИНФОРМАЦИЯ

// ОБРАЩЕНИЯ
    const updateVisibility_appeals = () => {
        // Получаем выбранное значение радиокнопки
        const selectedGroup = document.querySelector('input[name="group_choice_appeals"]:checked')?.value;
        const selectedType = document.querySelector('input[name="type_appeals"]:checked')?.value;
        const selectedDate = document.querySelector('input[name="datechoice_appeals"]:checked')?.value;

        const now = new Date();

        allAppeals_appeals.forEach(appeal => {
            const groupSpan = appeal.querySelector('.n1711-lk-teacher-appeal-author-student-group-yellow-span') ||
                appeal.querySelector('.n1711-lk-teacher-appeal-author-student-group-green-span');
            const groupValue = groupSpan?.textContent.trim();

            const appealType = appeal.getAttribute('data-rating');
            const appealDateText = appeal.querySelector('.n1711-lk-teacher-appeal-author-description span:first-child')?.textContent.trim();
            const appealDate = new Date(appealDateText.split('.').reverse().join('-'));

            // Проверяем соответствие дате
            let dateMatch = true;
            if (selectedDate === 'day') {
                dateMatch = appealDate.toDateString() === now.toDateString();
            } else if (selectedDate === 'week') {
                const oneWeekAgo = new Date(now);
                oneWeekAgo.setDate(now.getDate() - 7);
                dateMatch = appealDate >= oneWeekAgo;
            } else if (selectedDate === 'month') {
                const oneMonthAgo = new Date(now);
                oneMonthAgo.setMonth(now.getMonth() - 1);
                dateMatch = appealDate >= oneMonthAgo;
            }

            // Проверяем соответствие группе и типу
            const groupMatch = groupValue === selectedGroup || selectedGroup === 'group-all';
            const typeMatch = selectedType === 'all' || appealType === selectedType;

            // Отображаем или скрываем элемент
            if (groupMatch && typeMatch && dateMatch) {
                appeal.style.display = 'flex';
            } else {
                appeal.style.display = 'none';
            }
        });
    };
// ОБРАЩЕНИЯ

// ОБЩАЯ ИНФОРМАЦИЯ
    // Добавляем обработчик на все радиокнопки с атрибутом name="group_choice"
    const radioButtons = document.querySelectorAll('input[name="group_choice"]');
    radioButtons.forEach(button => {
        button.addEventListener('change', updateVisibility);  // Используем 'change' для правильной работы
    });
// ОБЩАЯ ИНФОРМАЦИЯ

// ОБРАЩЕНИЯ  
    // Добавляем обработчики событий для всех радиокнопок
    const radioButtonsGroup = document.querySelectorAll('input[name="group_choice_appeals"]');
    const radioButtonsType = document.querySelectorAll('input[name="type_appeals"]');
    const radioButtonsDate = document.querySelectorAll('input[name="datechoice_appeals"]');
    radioButtonsGroup.forEach(button => {
        button.addEventListener('change', updateVisibility_appeals);
    });
    radioButtonsType.forEach(button => {
        button.addEventListener('change', updateVisibility_appeals);
    });
    radioButtonsDate.forEach(button => {
        button.addEventListener('change', updateVisibility_appeals);
    });
// ОБРАЩЕНИЯ

    // Инициализируем видимость при загрузке страницы
// ОБЩАЯ ИНФОРМАЦИЯ
    updateVisibility();
// ОБРАЩЕНИЯ
    updateVisibility_appeals();

    // Обработчик для переключения радио-кнопок по клику на контейнер
    const options = document.querySelectorAll('.n1711-lk-teacher-main-title-information-right-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            const radioInput = option.querySelector('input[type="radio"]');
            if (radioInput && !radioInput.checked) {
                radioInput.checked = true; // Обновляем состояние checked
                updateVisibility();  // Обновляем видимость при изменении выбора
                updateVisibility_appeals();
            }
        });
    });
});
    // плавный скролл
document.addEventListener('DOMContentLoaded', () => {
    const scrollContainer = document.querySelector('.n1711-lk-teacher-main-title-information-right-option-wrap');
    const scrollLeftButton = document.querySelector('.n1711-lk-teacher-main-title-information-right-scroll-button.left img');
    const scrollRightButton = document.querySelector('.n1711-lk-teacher-main-title-information-right-scroll-button.right img');
    const options = document.querySelectorAll('.n1711-lk-teacher-main-title-information-right-option');
    const optionWidth = options[0].offsetWidth + 8; // ширина одного элемента с отступом

    // Проверка позиции скролла
    const updateButtonImages = () => {
        const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;

        if (scrollContainer.scrollLeft <= 0) {
            scrollLeftButton.src = 'img/lk_teacher_information_groups_arrow.svg';
        } else {
            scrollLeftButton.src = 'img/lk_teacher_information_groups_arrow_blue.svg';
        }

        if (scrollContainer.scrollLeft >= maxScrollLeft) {
            scrollRightButton.src = 'img/lk_teacher_information_groups_arrow.svg';
        } else {
            scrollRightButton.src = 'img/lk_teacher_information_groups_arrow_blue.svg';
        }
    };

    // Инициализация
    window.onload = function () {
        scrollContainer.scrollLeft = optionWidth * (options.length - 1); // Прокрутка до конца
        updateButtonImages(); // Обновление состояния кнопок
    }

    // Прокрутка с помощью кнопок
    let scrollInterval;
    const scrollSpeed = 4; // Скорость прокрутки (пикселей за шаг)
    let scrollDirection = null;

    const scrollStep = () => {
        if (scrollDirection === 'left') {
            scrollContainer.scrollLeft -= scrollSpeed;
        } else if (scrollDirection === 'right') {
            scrollContainer.scrollLeft += scrollSpeed;
        }
        updateButtonImages(); // Обновление состояния кнопок во время прокрутки
    };

    const startScrolling = (direction) => {
        scrollDirection = direction;
        if (!scrollInterval) {
            scrollInterval = setInterval(scrollStep, 10); // 10 мс между шагами
        }
    };

    const stopScrolling = () => {
        clearInterval(scrollInterval);
        scrollInterval = null;
        scrollDirection = null;
    };

    // Добавляем события непосредственно на кнопки
    scrollLeftButton.addEventListener('mousedown', () => startScrolling('left'));
    scrollRightButton.addEventListener('mousedown', () => startScrolling('right'));
    scrollLeftButton.addEventListener('mouseup', stopScrolling);
    scrollRightButton.addEventListener('mouseup', stopScrolling);
    scrollLeftButton.addEventListener('mouseleave', stopScrolling);
    scrollRightButton.addEventListener('mouseleave', stopScrolling);

    // Событие на изменение скролла
    scrollContainer.addEventListener('scroll', updateButtonImages);

    // Добавление прокрутки по колесику мыши
    scrollContainer.addEventListener('wheel', (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение прокрутки страницы
        scrollContainer.scrollLeft += event.deltaY; // Используем deltaY для горизонтального скролла
        updateButtonImages(); // Обновление состояния кнопок после прокрутки
    });
});
// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ фильтр по группам (конец) +фильтр по группам вкладки Обращения учеников 



// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ подсчет среднего количества в группах + открывания и закрывания списка учеников у группе (начало)
// id сами раставляются группам и ученикам
// раскрывашки тоже работают, при помощи раставления им id
// Обработчик для расчета средних значений и добавления ID
document.addEventListener("DOMContentLoaded", function () {
    const groups = document.querySelectorAll('.n1711-lk-teacher-informationgroup-content-section');
    const targetContainer = document.querySelector('.n1711-lk-teacher-main-content-profile-informationgroup-content');

    groups.forEach((group, groupIndex) => {
        group.setAttribute('id', `group-${groupIndex + 1}`);
        const students = group.querySelectorAll('.n1711-lk-teacher-informationgroup-content-section-open-student');
        let totalTime = 0, totalGrade = 0;

        students.forEach((student, studentIndex) => {
            student.setAttribute('id', `group-${groupIndex + 1}-student-${studentIndex + 1}`);
            const time = parseFloat(student.querySelector('.n1711-lk-teacher-informationgroup-content-section-open-student-stats-down:nth-child(2) span:nth-child(1)').textContent) || 0;
            const grade = parseFloat(student.querySelector('.n1711-lk-teacher-informationgroup-content-section-open-student-stats-down:nth-child(3) span:nth-child(1)').textContent) || 0;
            totalTime += time;
            totalGrade += grade;
        });
        const avgTime = Math.round(totalTime / students.length); // Округляем до целого
        const avgGrade = (totalGrade / students.length).toFixed(1);
        group.querySelector('.n1711-lk-teacher-informationgroup-content-section-head-middle-content:nth-child(1) span:nth-child(1)').textContent = avgTime;
        group.querySelector('.n1711-lk-teacher-informationgroup-content-section-head-middle-content:nth-child(2) span:nth-child(1)').textContent = avgGrade;

        // Копируем группу
        const groupClone = group.cloneNode(true);
        const cloneIndex = groupIndex + groups.length; // Уникальный индекс для клонированных групп
        const cloneGroupId = `group-${cloneIndex + 1}`;
        groupClone.setAttribute('id', cloneGroupId);

        // Обновляем ID внутри клонированной группы
        const cloneStudents = groupClone.querySelectorAll('.n1711-lk-teacher-informationgroup-content-section-open-student');
        cloneStudents.forEach((student, studentIndex) => {
            const cloneStudentId = `${cloneGroupId}-student-${studentIndex + 1}`;
            student.setAttribute('id', cloneStudentId);
        });
        targetContainer.appendChild(groupClone);
    });

    // Добавляем обработчики для всех групп
    const updateToggleListeners = () => {
        document.querySelectorAll('.n1711-lk-teacher-informationgroup-content-section').forEach(group => {
            const button = group.querySelector('.n1711-lk-teacher-informationgroup-content-section-head-left');
            const block = group.querySelector('.n1711-lk-teacher-informationgroup-content-section-open');
            const img = button.querySelector('.n1711-lk-teacher-informationgroup-content-section-head-left-img');

            if (button && block) {
                button.addEventListener('click', () => {
                    if (block.style.height) {
                        block.style.height = null;
                        block.style.opacity = "0";
                        block.style.transition = "height 0.5s ease-out, opacity 0.5s ease-out";
                        img.classList.remove('rotated');
                    } else {
                        block.style.height = block.scrollHeight + "px";
                        block.style.opacity = "1";
                        block.style.transition = "height 0.5s ease-in, opacity 0.5s ease-in";
                        img.classList.add('rotated');
                    }
                });
            }
        });
    };
    updateToggleListeners(); // Привязываем обработчики к оригинальным и клонированным группам
});
// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ подсчет среднего количества в группах + открывания и закрывания списка учеников у группе (конец)





// скрипт вкладки РАСПИСАНИЕ УРОКОВ кнопка Создать событие состояние clicked на 200ms (начало)
document.addEventListener('DOMContentLoaded', () => {
    const button = document.querySelector('.n1711-lk-teacher-main-title-schedule-right');
    button.addEventListener('click', () => {
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 500);
    });
});
// скрипт вкладки ОБЩАЯ ИНФОРМАЦИЯ кнопка Создать событие состояние clicked на 200ms (конец)







// скрипт вкладки ДОМАШНИЕ ЗАДАНИЯ раскрывание select (начало)
document.addEventListener('DOMContentLoaded', () => {
    const selectWraps = document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-wrap');

    selectWraps.forEach(selectWrap => {
        const inputWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-input-wrap');
        const input = selectWrap.querySelector('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-input');
        const optionsWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-option-wrap');
        const options = selectWrap.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-option');
        const customArrow = selectWrap.querySelector('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-custom-for-arrow');

        // Открытие/закрытие списка
        inputWrap.addEventListener('click', (e) => {
            e.stopPropagation();

            // Закрыть другие открытые списки
            document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-option-wrap.open').forEach(openWrap => {
                if (openWrap !== optionsWrap) {
                    openWrap.classList.remove('open');
                }
            });

            // Снимаем стиль с других стрелок
            document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-input-wrap.open .n1711-lk-teacher-main-content-homework-content-section-head-middle-select-custom-for-arrow').forEach(arrow => {
                if (arrow !== customArrow) {
                    arrow.style.transform = '';
                }
            });

            optionsWrap.classList.toggle('open');
            inputWrap.classList.toggle('open');

            // Добавляем или снимаем стиль поворота стрелки
            if (inputWrap.classList.contains('open')) {
                customArrow.style.transform = 'rotate(180deg)';
            } else {
                customArrow.style.transform = '';
            }
        });

        // Выбор пункта меню
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                // Устанавливаем текст выбранного пункта
                input.value = option.textContent;

                // Добавляем стиль синего текста для input
                input.classList.add('selected');

                // Закрываем список
                optionsWrap.classList.remove('open');
                inputWrap.classList.remove('open');
                customArrow.style.transform = '';
            });
        });
    });

    // Закрытие списка при клике вне
    document.addEventListener('click', () => {
        document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-option-wrap.open').forEach(openWrap => {
            openWrap.classList.remove('open');
        });
        document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-input-wrap.open').forEach(openInputWrap => {
            openInputWrap.classList.remove('open');
            const customArrow = openInputWrap.querySelector('.n1711-lk-teacher-main-content-homework-content-section-head-middle-select-custom-for-arrow');
            if (customArrow) {
                customArrow.style.transform = '';
            }
        });
    });
});
// скрипт вкладки ДОМАШНИЕ ЗАДАНИЯ раскрывание select (конец)


// скрипт вкладки ДОМАШНИЕ ЗАДАНИЯ фильтры по типу все-непроверенные-новые-проверенные и по дате Одновременный (начало)
// +++ открывания и закрывания списка учеников у группе

// по клику на фильтр все открытые вкладки закрываются, фильтруются и открываются
// почему так, потому что я не придумала как обновлять высоту при фильтре, подвязала к скрипту открывания по кнопке, потому что там обновляется высота

document.addEventListener('DOMContentLoaded', () => {
// скрипт открывания и закрывания списка учеников у группе
    const togglesOpenInformationGroup_homework = [
        { buttonId: "n1711-lk-teacher-main-content-homework-content-section-head-left-1", blockId: "n1711-lk-teacher-main-content-homework-content-section-open-1", sectionId: "n1711-lk-teacher-main-content-homework-content-section-1" },
        { buttonId: "n1711-lk-teacher-main-content-homework-content-section-head-left-2", blockId: "n1711-lk-teacher-main-content-homework-content-section-open-2", sectionId: "n1711-lk-teacher-main-content-homework-content-section-2" },
        { buttonId: "n1711-lk-teacher-main-content-homework-content-section-head-left-3", blockId: "n1711-lk-teacher-main-content-homework-content-section-open-3", sectionId: "n1711-lk-teacher-main-content-homework-content-section-3" },
    ];
    // нужно добавить сверху новую группу в массив
    togglesOpenInformationGroup_homework.forEach(({ buttonId, blockId, sectionId }) => {
        const buttonOpenInformationGroup = document.getElementById(buttonId);
        const blockOpenInformationGroup = document.getElementById(blockId);
        const section = document.getElementById(sectionId);
        const imgOpenInformationGroup = buttonOpenInformationGroup.querySelector('.n1711-lk-teacher-main-content-homework-content-section-head-left-img');
        if (buttonOpenInformationGroup && blockOpenInformationGroup && section) {
            buttonOpenInformationGroup.addEventListener("click", () => {
                if (blockOpenInformationGroup.style.height) {
                    section.style.gap = "0";
                    blockOpenInformationGroup.style.height = null;
                    blockOpenInformationGroup.style.opacity = "0";
                    blockOpenInformationGroup.style.transition = "height 0.5s ease-out, opacity 0.5s ease-out";
                    imgOpenInformationGroup.classList.remove('rotated');
                } else {
                    section.style.gap = "12px";
                    blockOpenInformationGroup.style.height = blockOpenInformationGroup.scrollHeight + "px";
                    blockOpenInformationGroup.style.opacity = "1";
                    blockOpenInformationGroup.style.transition = "height 0.5s ease-in, opacity 0.5s ease-in";
                    imgOpenInformationGroup.classList.add('rotated');
                }
            });
        }
    });
// скрипт открывания и закрывания списка учеников у группе
// фильтр
    // Function to close all blocks and track their state
    const closeAllBlocks = () => {
        const openBlocks = [];
        togglesOpenInformationGroup_homework.forEach(({ blockId, sectionId }) => {
            const blockOpenInformationGroup = document.getElementById(blockId);
            const section = document.getElementById(sectionId);
            const buttonOpenInformationGroup = document.querySelector(`#${blockId} ~ .n1711-lk-teacher-main-content-homework-content-section-head-left-img`);

            if (blockOpenInformationGroup && section) {
                if (blockOpenInformationGroup.style.height) {
                    openBlocks.push(blockId); // Track currently open blocks
                }
                section.style.gap = "0";
                blockOpenInformationGroup.style.height = null;
                blockOpenInformationGroup.style.opacity = "0";
                blockOpenInformationGroup.style.transition = "height 0.5s ease-out, opacity 0.5s ease-out";
                if (buttonOpenInformationGroup) {
                    buttonOpenInformationGroup.classList.remove('rotated');
                }
            }
        });
        return openBlocks;
    };
     // Function to restore open blocks
     const restoreOpenBlocks = (openBlocks) => {
        togglesOpenInformationGroup_homework.forEach(({ blockId, sectionId }) => {
            const blockOpenInformationGroup = document.getElementById(blockId);
            const section = document.getElementById(sectionId);

            if (blockOpenInformationGroup && section && openBlocks.includes(blockId)) {
                section.style.gap = "12px";
                blockOpenInformationGroup.style.height = blockOpenInformationGroup.scrollHeight + "px";
                blockOpenInformationGroup.style.opacity = "1";
                blockOpenInformationGroup.style.transition = "height 0.5s ease-in, opacity 0.5s ease-in";
            }
        });
    };
    // Получаем элементы фильтров
    const dateFilters_homework = document.querySelectorAll('input[name="datechoice"]');
    const ratingFilters_homework = document.querySelectorAll('input[name="type"]');
    const _homework = document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-open-item');
    // Функция для получения даты отзыва
    const getDate = (item) => {
        const dateText = item.querySelector('.n1711-lk-teacher-main-content-homework-content-section-open-item-content-author-description-date').textContent.trim();
        return new Date(dateText.split('.').reverse().join('-')); // Преобразуем в формат YYYY-MM-DD
    };
    // Функция для получения оценки отзыва
    const getRating = (item) => {
        return item.getAttribute('data-type'); 
    };
    // Функция фильтрации отзывов
    const filter_homework = () => {
        const openBlocks = closeAllBlocks(); // Track open blocks before filtering
        setTimeout(() => {
            const selectedDateFilter = document.querySelector('input[name="datechoice"]:checked').value;
            const selectedRatingFilter = document.querySelector('input[name="type"]:checked').value;
            const currentDate = new Date();
            _homework.forEach((item) => {
                const Date = getDate(item);
                const Rating = getRating(item);
                let dateMatches = false;
                let ratingMatches = false;
                // Проверяем фильтр по дате
                switch (selectedDateFilter) {
                    case 'all':
                        dateMatches = true;
                        break;
                    case 'day':
                        const dayDifference = (currentDate - Date) / (1000 * 3600 * 24);
                        dateMatches = dayDifference <= 1; // Если разница меньше или равна 1 дню
                        break;
                    case 'week':
                        const weekDifference = (currentDate - Date) / (1000 * 3600 * 24 * 7);
                        dateMatches = weekDifference <= 1; // Если разница меньше или равна 1 неделе
                        break;
                    case 'month':
                        const monthDifference = (currentDate.getFullYear() - Date.getFullYear()) * 12 + (currentDate.getMonth() - Date.getMonth());
                        dateMatches = monthDifference <= 1; // Если разница меньше или равна 1 месяцу
                        break;
                }
                // Проверяем фильтр по оценке
                if (selectedRatingFilter === 'all' || selectedRatingFilter === Rating) {
                    ratingMatches = true;
                }
                // Отображаем отзыв, если он подходит под оба фильтра
                if (dateMatches && ratingMatches) {
                    item.style.display = 'flex'; // Показываем отзыв
                } else {
                    item.style.display = 'none'; // Скрываем отзыв
                }
            });
        }, 500);

        // Perform filtering logic here
        setTimeout(() => {
            restoreOpenBlocks(openBlocks); // Restore only previously open blocks
        }, 1000); // Simulate delay for filtering logic
    };
    // Добавляем обработчики событий для фильтров
    dateFilters_homework.forEach((filter) => {
        filter.addEventListener('change', filter_homework);
    });
    ratingFilters_homework.forEach((filter) => {
        filter.addEventListener('change', filter_homework);
    });
    // Инициализация: применяем фильтры при загрузке страницы
    // filter_homework();
// фильтр
});
// скрипт вкладки ДОМАШНИЕ ЗАДАНИЯ фильтры по типу все-непроверенные-новые-проверенные и по дате Одновременный (конец)








// скрипт вкладки ПРАКТИЧЕСКИЕ ЗАДАНИЯ разворота стрелки (начало)
document.addEventListener('DOMContentLoaded', () => {
    // Получаем все элементы по ID
    const selectElements = [
        document.querySelector('#practicework-lessons-1'),
        document.querySelector('#practicework-lessons-2'),
        document.querySelector('#practicework-lessons-3')
    ];

    const customSelects = [
        document.querySelector('#n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-custom-for-arrow-1'),
        document.querySelector('#n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-custom-for-arrow-2'),
        document.querySelector('#n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-custom-for-arrow-3')
    ];

    // Добавляем обработчики для каждого элемента
    selectElements.forEach((selectElement, index) => {
        const customSelect = customSelects[index];

        selectElement.addEventListener('focus', () => {
            customSelect.classList.add('select-open'); // Добавляем класс при фокусе
        });

        selectElement.addEventListener('blur', () => {
            customSelect.classList.remove('select-open'); // Убираем класс при потере фокуса
        });
    });
});
// скрипт вкладки ПРАКТИЧЕСКИЕ ЗАДАНИЯ разворота стрелки (конец)



// скрипт вкладки ПРАКТИЧЕСКИЕ ЗАДАНИЯ раскрывание "типа select" из div (начало)
document.addEventListener('DOMContentLoaded', () => {
    const selectWraps = document.querySelectorAll('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-wrap');

    selectWraps.forEach(selectWrap => {
        const inputWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-input-wrap');
        const input = selectWrap.querySelector('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-input');
        const optionsWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-option-wrap');
        const options = selectWrap.querySelectorAll('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-option');
        const customArrow = selectWrap.querySelector('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-custom-for-arrow');

        // Открытие/закрытие списка
        inputWrap.addEventListener('click', (e) => {
            e.stopPropagation();

            // Закрыть другие открытые списки
            document.querySelectorAll('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-option-wrap.open').forEach(openWrap => {
                if (openWrap !== optionsWrap) {
                    openWrap.classList.remove('open');
                }
            });

            // Снимаем стиль с других стрелок
            document.querySelectorAll('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-input-wrap.open .n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-custom-for-arrow').forEach(arrow => {
                if (arrow !== customArrow) {
                    arrow.style.transform = '';
                }
            });

            optionsWrap.classList.toggle('open');
            inputWrap.classList.toggle('open');

            // Добавляем или снимаем стиль поворота стрелки
            if (inputWrap.classList.contains('open')) {
                customArrow.style.transform = 'rotate(180deg)';
            } else {
                customArrow.style.transform = '';
            }
        });

        // Выбор пункта меню
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                // Устанавливаем текст выбранного пункта
                input.value = option.textContent;

                // Добавляем стиль синего текста для input
                input.classList.add('selected');

                // Закрываем список
                optionsWrap.classList.remove('open');
                inputWrap.classList.remove('open');
                customArrow.style.transform = '';
            });
        });
    });

    // Закрытие списка при клике вне
    document.addEventListener('click', () => {
        document.querySelectorAll('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-option-wrap.open').forEach(openWrap => {
            openWrap.classList.remove('open');
        });
        document.querySelectorAll('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-input-wrap.open').forEach(openInputWrap => {
            openInputWrap.classList.remove('open');
            const customArrow = openInputWrap.querySelector('.n1711-lk-teacher-main-content-practicework-content-section-head-middle-select-custom-for-arrow');
            if (customArrow) {
                customArrow.style.transform = '';
            }
        });
    });
});
// скрипт вкладки ПРАКТИЧЕСКИЕ ЗАДАНИЯ раскрывание "типа select" из div (конец)


// скрипт вкладки ПРАКТИЧЕСКИЕ ЗАДАНИЯ фильтры по типу все-непроверенные-новые-проверенные и по дате Одновременный (начало)
document.addEventListener('DOMContentLoaded', () => {
// скрипт открывания и закрывания списка учеников у группе
    const togglesOpenInformationGroup_practice = [
        { buttonId: "n1711-lk-teacher-main-content-practicework-content-section-head-left-1", blockId: "n1711-lk-teacher-main-content-practicework-content-section-open-1", sectionId: "n1711-lk-teacher-main-content-practicework-content-section-1" },
        { buttonId: "n1711-lk-teacher-main-content-practicework-content-section-head-left-2", blockId: "n1711-lk-teacher-main-content-practicework-content-section-open-2", sectionId: "n1711-lk-teacher-main-content-practicework-content-section-2" },
        { buttonId: "n1711-lk-teacher-main-content-practicework-content-section-head-left-3", blockId: "n1711-lk-teacher-main-content-practicework-content-section-open-3", sectionId: "n1711-lk-teacher-main-content-practicework-content-section-3" },
    ];
    // универсально, нужно просто добавить сверху новую группу в массив
    togglesOpenInformationGroup_practice.forEach(({ buttonId, blockId, sectionId }) => {
        const buttonOpenInformationGroup = document.getElementById(buttonId);
        const blockOpenInformationGroup = document.getElementById(blockId);
        const section = document.getElementById(sectionId);
        const imgOpenInformationGroup = buttonOpenInformationGroup.querySelector('.n1711-lk-teacher-main-content-practicework-content-section-head-left-img');
        if (buttonOpenInformationGroup && blockOpenInformationGroup && section) {
            buttonOpenInformationGroup.addEventListener("click", () => {
                if (blockOpenInformationGroup.style.height) {
                    section.style.gap = "0";
                    blockOpenInformationGroup.style.height = null;
                    blockOpenInformationGroup.style.opacity = "0";
                    blockOpenInformationGroup.style.transition = "height 0.5s ease-out, opacity 0.5s ease-out";
                    imgOpenInformationGroup.classList.remove('rotated');
                } else {
                    section.style.gap = "12px";
                    blockOpenInformationGroup.style.height = blockOpenInformationGroup.scrollHeight + "px";
                    blockOpenInformationGroup.style.opacity = "1";
                    blockOpenInformationGroup.style.transition = "height 0.5s ease-in, opacity 0.5s ease-in";
                    imgOpenInformationGroup.classList.add('rotated');
                }
            });
        }
    });
// скрипт открывания и закрывания списка учеников у группе
// фильтр
    // Function to close all blocks and track their state
    const closeAllBlocks_practice = () => {
        const openBlocks = [];
        togglesOpenInformationGroup_practice.forEach(({ blockId, sectionId }) => {
            const blockOpenInformationGroup = document.getElementById(blockId);
            const section = document.getElementById(sectionId);
            const buttonOpenInformationGroup = document.querySelector(`#${blockId} ~ .n1711-lk-teacher-main-content-practicework-content-section-head-left-img`);

            if (blockOpenInformationGroup && section) {
                if (blockOpenInformationGroup.style.height) {
                    openBlocks.push(blockId); // Track currently open blocks
                }
                section.style.gap = "0";
                blockOpenInformationGroup.style.height = null;
                blockOpenInformationGroup.style.opacity = "0";
                blockOpenInformationGroup.style.transition = "height 0.5s ease-out, opacity 0.5s ease-out";
                if (buttonOpenInformationGroup) {
                    buttonOpenInformationGroup.classList.remove('rotated');
                }
            }
        });
        return openBlocks;
    };
     // Function to restore open blocks
     const restoreOpenBlocks_practice = (openBlocks) => {
        togglesOpenInformationGroup_practice.forEach(({ blockId, sectionId }) => {
            const blockOpenInformationGroup = document.getElementById(blockId);
            const section = document.getElementById(sectionId);

            if (blockOpenInformationGroup && section && openBlocks.includes(blockId)) {
                section.style.gap = "12px";
                blockOpenInformationGroup.style.height = blockOpenInformationGroup.scrollHeight + "px";
                blockOpenInformationGroup.style.opacity = "1";
                blockOpenInformationGroup.style.transition = "height 0.5s ease-in, opacity 0.5s ease-in";
            }
        });
    };



    // Получаем элементы фильтров
    const dateFilters_practice = document.querySelectorAll('input[name="datechoice_practicework"]');
    const ratingFilters_practice = document.querySelectorAll('input[name="type_practicework"]');
    const _practice = document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-open-item-practice');
    
    // Функция для получения даты отзыва
    const getDate_practicework = (item) => {
        const dateText = item.querySelector('.n1711-lk-teacher-main-content-practice-content-section-open-item-content-author-description-date').textContent.trim();
        return new Date(dateText.split('.').reverse().join('-')); // Преобразуем в формат YYYY-MM-DD
    };
    // Функция для получения оценки отзыва
    const getRating_practicework = (item) => {
        return item.getAttribute('data-type'); 
    };
    // Функция фильтрации отзывов
    const filter_practice = () => {
        const openBlocks_practice = closeAllBlocks_practice(); // Track open blocks before filtering
        setTimeout(() => {
            const selectedDateFilter = document.querySelector('input[name="datechoice_practicework"]:checked').value;
            const selectedRatingFilter = document.querySelector('input[name="type_practicework"]:checked').value;
            const currentDate = new Date();
            _practice.forEach((item) => {
                const Date = getDate_practicework(item);
                const Rating = getRating_practicework(item);
                let dateMatches = false;
                let ratingMatches = false;
                // Проверяем фильтр по дате
                switch (selectedDateFilter) {
                    case 'all':
                        dateMatches = true;
                        break;
                    case 'day':
                        const dayDifference = (currentDate - Date) / (1000 * 3600 * 24);
                        dateMatches = dayDifference <= 1; // Если разница меньше или равна 1 дню
                        break;
                    case 'week':
                        const weekDifference = (currentDate - Date) / (1000 * 3600 * 24 * 7);
                        dateMatches = weekDifference <= 1; // Если разница меньше или равна 1 неделе
                        break;
                    case 'month':
                        const monthDifference = (currentDate.getFullYear() - Date.getFullYear()) * 12 + (currentDate.getMonth() - Date.getMonth());
                        dateMatches = monthDifference <= 1; // Если разница меньше или равна 1 месяцу
                        break;
                }
                // Проверяем фильтр по оценке
                if (selectedRatingFilter === 'all' || selectedRatingFilter === Rating) {
                    ratingMatches = true;
                }
                // Отображаем отзыв, если он подходит под оба фильтра
                if (dateMatches && ratingMatches) {
                    item.style.display = 'flex'; // Показываем отзыв
                } else {
                    item.style.display = 'none'; // Скрываем отзыв
                }
            });
        }, 500);
        // Perform filtering logic here
        setTimeout(() => {
            restoreOpenBlocks_practice(openBlocks_practice); // Restore only previously open blocks
        }, 1000); // Simulate delay for filtering logic
    };
    // Добавляем обработчики событий для фильтров
    dateFilters_practice.forEach((filter) => {
        filter.addEventListener('change', filter_practice);
    });
    ratingFilters_practice.forEach((filter) => {
        filter.addEventListener('change', filter_practice);
    });
    // Инициализация: применяем фильтры при загрузке страницы
    // filter_practice();
});
// скрипт вкладки ПРАКТИЧЕСКИЕ ЗАДАНИЯ фильтры по типу все-непроверенные-новые-проверенные и по дате Одновременный (конец)









// скрипт вкладки ОБРАЩЕНИЯ УЧЕНИКОВ для прокрутки скриншотов в обращении (начало)
document.addEventListener("DOMContentLoaded", () => {
    const containers = document.querySelectorAll('.n1711-lk-teacher-main-content-appeals-right-middle-appeal-content-screenshot');

    containers.forEach(container => {
        let isDown = false;
        let startX;
        let scrollLeft;

        container.addEventListener('mousedown', (e) => {
            isDown = true;
            container.classList.add('active');
            startX = e.pageX - container.offsetLeft;
            scrollLeft = container.scrollLeft;
        });

        container.addEventListener('mouseleave', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mouseup', () => {
            isDown = false;
            container.classList.remove('active');
        });

        container.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - container.offsetLeft;
            const walk = (x - startX) * 2; // Скорость прокрутки
            container.scrollLeft = scrollLeft - walk;
        });

        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            container.scrollLeft += e.deltaY; // Прокрутка по горизонтали
        });

    });
});
// скрипт вкладки ОБРАЩЕНИЯ УЧЕНИКОВ для прокрутки скриншотов в обращении (конец)



// скрипт вкладки ОБРАЩЕНИЯ УЧЕНИКОВ открывание обращения по id(начало)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("button_message_1").addEventListener("click", function () {
        // Скрываем img блок
        const imgBlock = document.getElementById("appeals_right_img");
        if (imgBlock) {
            imgBlock.style.display = "none";
        }
    
        // Показываем верхний блок
        const topBlock = document.getElementById("content_top_message_1");
        if (topBlock) {
            topBlock.style.display = "flex";
        }
    
        // Показываем нижний блок
        const bottomBlock = document.getElementById("content_bottom_message_1");
        if (bottomBlock) {
            bottomBlock.style.display = "flex";
        }
    });
    
});
// скрипт вкладки ОБРАЩЕНИЯ УЧЕНИКОВ открывание обращения (конец)

// скрипт вкладки ОБРАЩЕНИЯ УЧЕНИКОВ кнопка Закрыть обращение (начало)
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.n1711-lk-teacher-main-content-appeals-right-top-title-button').addEventListener('click', function() {
        const button = this;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 500);
    });
});
// скрипт вкладки ОБРАЩЕНИЯ УЧЕНИКОВ кнопка Закрыть обращение (конец)




// скрипт вкладки ОТЗЫВЫ УЧЕНИКОВ фильтры по типу положительные-нейтральные-отрицательные и по дате Одновременный (начало)
document.addEventListener('DOMContentLoaded', () => {
    // Получаем элементы фильтров
    const dateFilters = document.querySelectorAll('input[name="datechoice_reviews"]');
    const ratingFilters = document.querySelectorAll('input[name="type_reviews"]');
    const reviews = document.querySelectorAll('.n1711-lk-teacher-main-content-reviews-right-review');
    // Функция для получения даты отзыва
    const getReviewDate = (review) => {
        const dateText = review.querySelector('.n1711-lk-teacher-appeal-author-description').textContent.trim();
        return new Date(dateText.split('.').reverse().join('-')); // Преобразуем в формат YYYY-MM-DD
    };
    // Функция для получения оценки отзыва
    const getReviewRating = (review) => {
        return review.getAttribute('data-rating'); // Предполагается, что рейтинг хранится в атрибуте data-rating
    };
    // Функция фильтрации отзывов
    const filterReviews = () => {
        const selectedDateFilter = document.querySelector('input[name="datechoice_reviews"]:checked').value;
        const selectedRatingFilter = document.querySelector('input[name="type_reviews"]:checked').value;
        const currentDate = new Date();
        reviews.forEach((review) => {
            const reviewDate = getReviewDate(review);
            const reviewRating = getReviewRating(review);
            let dateMatches = false;
            let ratingMatches = false;
            // Проверяем фильтр по дате
            switch (selectedDateFilter) {
                case 'all':
                    dateMatches = true;
                    break;
                case 'day':
                    const dayDifference = (currentDate - reviewDate) / (1000 * 3600 * 24);
                    dateMatches = dayDifference <= 1; // Если разница меньше или равна 1 дню
                    break;
                case 'week':
                    const weekDifference = (currentDate - reviewDate) / (1000 * 3600 * 24 * 7);
                    dateMatches = weekDifference <= 1; // Если разница меньше или равна 1 неделе
                    break;
                case 'month':
                    const monthDifference = (currentDate.getFullYear() - reviewDate.getFullYear()) * 12 + (currentDate.getMonth() - reviewDate.getMonth());
                    dateMatches = monthDifference <= 1; // Если разница меньше или равна 1 месяцу
                    break;
            }
            // Проверяем фильтр по оценке
            if (selectedRatingFilter === 'all' || selectedRatingFilter === reviewRating) {
                ratingMatches = true;
            }
            // Отображаем отзыв, если он подходит под оба фильтра
            if (dateMatches && ratingMatches) {
                review.style.display = ''; // Показываем отзыв
            } else {
                review.style.display = 'none'; // Скрываем отзыв
            }
        });
    };
    // Добавляем обработчики событий для фильтров
    dateFilters.forEach((filter) => {
        filter.addEventListener('change', filterReviews);
    });
    ratingFilters.forEach((filter) => {
        filter.addEventListener('change', filterReviews);
    });
    // Инициализация: применяем фильтры при загрузке страницы
    filterReviews();
});
// скрипт вкладки ОТЗЫВЫ УЧЕНИКОВ фильтры по типу положительные-нейтральные-отрицательные и по дате Одновременный (конец)

// скрипт вкладки ОТЗЫВЫ УЧЕНИКОВ картинка на фоне при отсутсвии отзывов (начало)
document.addEventListener("DOMContentLoaded", function () {
    const reviewsContainer = document.querySelector(".n1711-lk-teacher-main-content-reviews-right-content");
    const backgroundImage = document.getElementById("lk_teacher_reviews_background");

    function updateBackgroundVisibility() {
        const hasReviews = reviewsContainer.querySelector(".n1711-lk-teacher-main-content-reviews-right-review") !== null;
        backgroundImage.style.display = hasReviews ? "none" : "flex";
    }

    // Наблюдатель за изменениями внутри reviewsContainer
    const observer = new MutationObserver(updateBackgroundVisibility);
    observer.observe(reviewsContainer, { childList: true, subtree: true });

    // Первоначальная проверка при загрузке страницы
    updateBackgroundVisibility();
});
// скрипт вкладки ОТЗЫВЫ УЧЕНИКОВ картинка на фоне при отсутсвии отзывов (конец)







// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ кнопки переключения сайт-почта-соо-тг (начало)
document.addEventListener('DOMContentLoaded', () => {
    const buttons_notifications= document.querySelectorAll('.n1711-lk-teacher-main-content-profile-left-notifications-content-right-button');

    buttons_notifications.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
        });
    });
});
// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ кнопки переключения сайт-почта-соо-тг (конец)



// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ редактирование инпутов (начало)
document.addEventListener("DOMContentLoaded", () => {
    const editables = [
        { buttonId: "edit-email", inputId: "input-email", outlineId: "outline-email", wrapId: "wrap-email" },
        { buttonId: "edit-phone", inputId: "input-phone", outlineId: "outline-phone", wrapId: "wrap-phone" }
    ];
    editables.forEach(({ buttonId, inputId, outlineId, wrapId}) => {
        const button = document.getElementById(buttonId);
        const input = document.getElementById(inputId);
        const outline = document.getElementById(outlineId);
        const wrap = document.getElementById(wrapId);

        if (button && input && outline) {
            button.addEventListener("click", () => {
                if (input.hasAttribute("readonly")) {
                    // Сделать поле редактируемым
                    input.removeAttribute("readonly");
                    input.classList.add("editable"); // Опционально: добавить класс для стилизации
                    outline.classList.add("outline-visible"); // Показать обводку при редактировании
                    input.focus(); // Фокус на поле для удобства пользователя

                    wrap.classList.add("editing");
                } else {
                    
                    // Сделать поле нередактируемым
                    input.setAttribute("readonly", "true");
                    input.classList.remove("editable"); // Убираем класс редактируемого состояния
                    outline.classList.remove("outline-visible"); // Убираем обводку

                    wrap.classList.remove("editing");
                }
            });
        }
    });

    const emailInput = document.getElementById("input-email");
    const emailWrap = document.getElementById("wrap-email");
    const emailConfirm = document.getElementById("edit-email-confirm");
    const emailCancel = document.getElementById("edit-email-cancel");
    const emailOutline = document.getElementById("outline-email");

    let previousEmailValue = emailInput.value;

    const validateEmail = (email) => /.+@.+\..+/.test(email);

    emailWrap.addEventListener("click", (event) => {
        if (event.target.id === "edit-email") {
            previousEmailValue = emailInput.value;
            emailInput.removeAttribute("readonly");
            emailInput.classList.add("editable");
            emailWrap.classList.add("editing");
            emailOutline.classList.add("outline-visible");
        }
    });

    emailConfirm.addEventListener("click", () => {
        const emailValue = emailInput.value;
        if (validateEmail(emailValue)) {
            alert("Email сохранён: " + emailValue);
            emailInput.setAttribute("readonly", "readonly");
            emailInput.classList.remove("editable");
            emailWrap.classList.remove("editing");
            emailOutline.classList.remove("outline-visible");
        } else {
            alert("Некорректный email. Проверьте формат.");
        }
    });

    emailCancel.addEventListener("click", () => {
        emailInput.value = previousEmailValue; 
        emailInput.setAttribute("readonly", "readonly");
        emailInput.classList.remove("editable");
        emailWrap.classList.remove("editing");
        emailOutline.classList.remove("outline-visible");
    });

    const phoneInput = document.getElementById("input-phone");
    const phoneWrap = document.getElementById("wrap-phone");
    const phoneConfirm = document.getElementById("edit-phone-confirm");
    const phoneCancel = document.getElementById("edit-phone-cancel");
    const phoneOutline = document.getElementById("outline-phone");

    let previousPhoneValue = phoneInput.value;

    const validatePhone = (phone) => /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/.test(phone);

    phoneInput.addEventListener("input", () => {
        let value = phoneInput.value.replace(/\D/g, "");
        if (value.startsWith("7")) {
            value = value.slice(1);
        }
        if (value.length > 0) {
            value = "+7(" + value;
        }
        if (value.length > 6) {
            value = value.slice(0, 6) + ")" + value.slice(6);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + "-" + value.slice(10);
        }
        if (value.length > 13) {
            value = value.slice(0, 13) + "-" + value.slice(13);
        }
        if (value.length > 16) {
            value = value.slice(0, 16);
        }
        phoneInput.value = value;
    });

    phoneWrap.addEventListener("click", (event) => {
        if (event.target.id === "edit-phone") {
            previousPhoneValue = phoneInput.value;
            phoneInput.removeAttribute("readonly");
            phoneInput.classList.add("editable");
            phoneWrap.classList.add("editing");
            phoneOutline.classList.add("outline-visible");
        }
    });

    phoneConfirm.addEventListener("click", () => {
        const phoneValue = phoneInput.value;
        if (validatePhone(phoneValue)) {
            alert("Телефон сохранён: " + phoneValue);
            phoneInput.setAttribute("readonly", "readonly");
            phoneInput.classList.remove("editable");
            phoneWrap.classList.remove("editing");
            phoneOutline.classList.remove("outline-visible");
        } else {
            alert("Некорректный номер телефона. Используйте формат +7(999)999-99-99.");
        }
    });

    phoneCancel.addEventListener("click", () => {
        phoneInput.value = previousPhoneValue;
        phoneInput.setAttribute("readonly", "readonly");
        phoneInput.classList.remove("editable");
        phoneWrap.classList.remove("editing");
        phoneOutline.classList.remove("outline-visible");
    });
});
// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ редактирование инпутов (конец)



// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ раскрывание select (начало)
document.addEventListener('DOMContentLoaded', () => {
    const selectWraps = document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-wrap');

    selectWraps.forEach(selectWrap => {
        const inputWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-input-wrap');
        const input = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-input');
        const optionsWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-option-wrap');
        const options = selectWrap.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option');
        const customArrow = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-custom-for-arrow');

        // Открытие/закрытие списка
        inputWrap.addEventListener('click', (e) => {
            e.stopPropagation();

            // Закрыть другие открытые списки
            document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option-wrap.open').forEach(openWrap => {
                if (openWrap !== optionsWrap) {
                    openWrap.classList.remove('open');
                }
            });

            // Снимаем стиль с других стрелок
            document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-input-wrap.open .n1711-lk-teacher-main-content-profile-select-custom-for-arrow').forEach(arrow => {
                if (arrow !== customArrow) {
                    arrow.style.transform = '';
                }
            });

            optionsWrap.classList.toggle('open');
            inputWrap.classList.toggle('open');

            // Добавляем или снимаем стиль поворота стрелки
            if (inputWrap.classList.contains('open')) {
                customArrow.style.transform = 'rotate(180deg)';
            } else {
                customArrow.style.transform = '';
            }
        });

        // Выбор пункта меню
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();

                // Устанавливаем текст выбранного пункта
                input.value = option.textContent;

                // Добавляем стиль синего текста для input
                input.classList.add('selected');

                // Закрываем список
                optionsWrap.classList.remove('open');
                inputWrap.classList.remove('open');
                customArrow.style.transform = '';
            });
        });
    });

    // Закрытие списка при клике вне
    document.addEventListener('click', () => {
        document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option-wrap.open').forEach(openWrap => {
            openWrap.classList.remove('open');
        });
        document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-input-wrap.open').forEach(openInputWrap => {
            openInputWrap.classList.remove('open');
            const customArrow = openInputWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-custom-for-arrow');
            if (customArrow) {
                customArrow.style.transform = '';
            }
        });
    });
});
// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ раскрывание select (конец)



// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ загрузка аватара и удаление (начало)
    // Функция для вызова input file
    function triggerFileInput() {
        document.getElementById("profileImageInput").click();
    }
    // Обновление изображения профиля
    function updateProfileImage(event) {
        const file = event.target.files[0];  // Получаем выбранный файл
        if (file) {
            const reader = new FileReader();  // Создаем объект FileReader
            reader.onload = function (e) {
                const imgElement = document.querySelector(".n1711-lk-teacher-main-content-profile-left-personal-info-content-top-img");
                imgElement.src = e.target.result;  // Обновляем источник изображения
            };
            reader.readAsDataURL(file);  // Читаем файл как Data URL
        }
    }
    // Сброс изображения профиля к значению по умолчанию
    function resetProfileImage() {
        const imgElement = document.querySelector(".n1711-lk-teacher-main-content-profile-left-personal-info-content-top-img");
        imgElement.src = "img/lk_teacher_avatar.png"; // Укажите путь к изображению по умолчанию
        document.getElementById("profileImageInput").value = ""; // Сбрасываем значение input
    }
// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ загрузка аватара и удаление (конец)

// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ перемешение блока Система при адаптиве (начало)
document.addEventListener('DOMContentLoaded', () => {
    function moveNotifications() {
        const notifications = document.querySelector('.n1711-lk-teacher-main-content-profile-left-system');
        const rightWrap = document.querySelector('.n1711-lk-teacher-main-content-profile-right-wrap');

        if (window.innerWidth < 1920) {
            // Переместить блок уведомлений внутрь rightWrap
            if (notifications.parentNode !== rightWrap) {
                rightWrap.insertBefore(notifications, rightWrap.firstChild);
            }
        } else {
            // Вернуть блок уведомлений обратно, если ширина больше 1920
            const originalParent = document.querySelector('.n1711-lk-teacher-main-content-profile-left');; // Замените на оригинальный родительский элемент
            if (notifications.parentNode === rightWrap) {
                originalParent.insertBefore(notifications, originalParent.children[1]);// Или используйте правильный родительский элемент
            }
        }
    }
    // Проверка при загрузке страницы
    moveNotifications();
    // Проверка при изменении размера окна
    window.addEventListener('resize', moveNotifications);
});
// скрипт вкладки ПРОФИЛЬ ПРЕПОДАВАТЕЛЯ перемешение блока Система при адаптиве (конец)







// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ по кнопке Создать событие - появление(начало)
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlaySchedule = document.getElementById('schedule-popup-overlay');
    const popupCloseSchedule = document.getElementById('schedule-popup-close');
    const startButtonsSchedule = document.querySelectorAll('.n1711-lk-teacher-main-title-schedule-right');
    // Функция для открытия всплывающего окна
    const openPopupSchedule = () => {
        popupOverlaySchedule.style.display = 'flex';
    };
    // Открытие всплывающего окна при нажатии на любую кнопку с классом "start"
    startButtonsSchedule.forEach(button => {
        button.addEventListener('click', openPopupSchedule);
    });
    // Закрытие всплывающего окна
    popupCloseSchedule.addEventListener('click', () => {
        popupOverlaySchedule.style.display = 'none';
    });
// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ по кнопке Создать событие - появление(конец) 

// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ клик по кнопкам Создать и Закрыть накладывает стиль clicked (начало)
    document.querySelector('.lk-teacher-schedule-popup-content-grade-button-cancel').addEventListener('click', function() {
        const button = this;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
            popupOverlaySchedule.style.display = 'none';
        }, 500);
    });
    document.querySelector('.lk-teacher-schedule-popup-content-grade-button-confirm').addEventListener('click', function() {
        const button = this;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 500);
    });

// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ клик по кнопкам Создать и Закрыть накладывает стиль clicked (конец)
});


// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ очищение инпутов (начало)
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-input-img").forEach(img => {
      img.addEventListener("click", function () {
        const input = this.closest("div").querySelector(".lk-teacher-schedule-popup-content-inputs-input");
        if (input) {
          input.value = ""; // Очищаем поле ввода
        }
      });
    });
});
// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ очищение инпутов (конец)


// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ добавления и удаления новых строк с Модули и Точки контроля (начало)
document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
      // Проверяем, кликнули ли на кнопку "+"
      if (event.target.closest(".lk-teacher-schedule-popup-content-inputs-button-plus-module")) {
        let wrapper = document.querySelector(".lk-teacher-schedule-popup-content-inputs-wrap-formodules");
        // Найдем нужный блок, содержащий "модуль:"
        let moduleTextBlock = Array.from(document.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-left-text"))
          .find(el => el.textContent.trim().startsWith("модуль:"));
        // Проверяем количество уже добавленных модулей
        let moduleCount = wrapper.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-down-wrap").length;
        if (moduleCount >= 5) return; // Если уже 5 модулей, не добавляем новый
        if (wrapper) {
          // Создаём новый элемент
          let newElement = document.createElement("div");
          newElement.classList.add("lk-teacher-schedule-popup-content-inputs-down-wrap");
          newElement.innerHTML = `
            <div class="lk-teacher-schedule-popup-content-inputs-select-wrap">
              <div class="n1711-lk-teacher-main-content-profile-select-input-wrap">
                <input readonly type="text" class="n1711-lk-teacher-main-content-profile-select-input" placeholder="выберите модуль">
                <div class="n1711-lk-teacher-main-content-profile-select-custom-for-arrow"></div>
              </div>
              <div class="n1711-lk-teacher-main-content-profile-select-option-wrap">
                <div class="n1711-lk-teacher-main-content-profile-select-option-overflow">
                  <div class="n1711-lk-teacher-main-content-profile-select-option">модуль 1</div>
                  <div class="n1711-lk-teacher-main-content-profile-select-option">модуль 2</div>
                  <div class="n1711-lk-teacher-main-content-profile-select-option">модуль 3</div>
                  <div class="n1711-lk-teacher-main-content-profile-select-option">модуль 4</div>
                  <div class="n1711-lk-teacher-main-content-profile-select-option">модуль 5</div>
                </div>
              </div>
            </div>
            <button class="lk-teacher-schedule-popup-content-inputs-button-minus-module">
                <img class="lk-teacher-schedule-popup-content-inputs-button-minus-module-img" src="img/lk_teacher_popup_input_minus.svg" alt="lk_teacher_popup_input_minus">
            </button>
          `;
          // Добавляем новый элемент внутрь обертки
          wrapper.appendChild(newElement);
          // **Повторно применяем логику селекта к новому элементу**
          initSelect(newElement);
        // Добавляем обработчик для кнопки "минус"
        newElement.querySelector(".lk-teacher-schedule-popup-content-inputs-button-minus-module").addEventListener("click", function () {
            wrapper.removeChild(newElement);
            checkModuleLimit(wrapper); // Проверяем и обновляем состояние кнопки добавления
            // updatePopupHeight();
            // console.log("asdasd");
        });
          // Проверяем и блокируем все кнопки, если уже 5 модулей
          checkModuleLimit(wrapper);
        }
      }
    });
  
    function checkModuleLimit(wrapper) {
      let moduleCount = wrapper.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-down-wrap").length;
      let addButtons = document.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-button-plus-module");
      addButtons.forEach(button => {
        if (moduleCount >= 5) {
          button.disabled = true;
          button.style.opacity = "0.5"; // Делаем кнопку визуально неактивной
          button.style.pointerEvents = "none"; // Запрещаем кликать
        } else {
          button.disabled = false;
          button.style.opacity = "1";
          button.style.pointerEvents = "auto"; // Восстанавливаем возможность кликать
        }
      });
    }
    // Функция для инициализации логики селекта (можно вызывать для новых элементов)
    function initSelect(parentElement = document) {
      const selectWraps = parentElement.querySelectorAll('.lk-teacher-schedule-popup-content-inputs-select-wrap');
      selectWraps.forEach(selectWrap => {
          const inputWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-input-wrap');
          const input = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-input');
          const optionsWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-option-wrap');
          const options = selectWrap.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option');
          const customArrow = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-custom-for-arrow');
          // Открытие/закрытие списка
          inputWrap.addEventListener('click', (e) => {
              e.stopPropagation();
              document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option-wrap.open').forEach(openWrap => {
                  if (openWrap !== optionsWrap) {
                      openWrap.classList.remove('open');
                  }
              });
              document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-input-wrap.open .n1711-lk-teacher-main-content-profile-select-custom-for-arrow').forEach(arrow => {
                  if (arrow !== customArrow) {
                      arrow.style.transform = '';
                  }
              });
              optionsWrap.classList.toggle('open');
              inputWrap.classList.toggle('open');
              if (inputWrap.classList.contains('open')) {
                  customArrow.style.transform = 'rotate(180deg)';
              } else {
                  customArrow.style.transform = '';
              }
          });
          // Выбор пункта меню
          options.forEach(option => {
              option.addEventListener('click', (e) => {
                  e.stopPropagation();
                  input.value = option.textContent;
                  input.classList.add('selected');
                  optionsWrap.classList.remove('open');
                  inputWrap.classList.remove('open');
                  customArrow.style.transform = '';
              });
          });
      });
    }
    // Запускаем логику для уже существующих элементов при загрузке страницы
    initSelect();
});

document.addEventListener("DOMContentLoaded", function () {
    // Функция для очистки полей
    function addClearInputListeners(parent = document) {
        parent.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-input-img").forEach(img => {
            img.addEventListener("click", function () {
                const inputFields = this.closest(".lk-teacher-schedule-popup-content-inputs-down").querySelectorAll(".lk-teacher-schedule-popup-content-inputs-input");
                inputFields.forEach(input => {
                    input.value = ""; // Очищаем поле ввода
                });
            });
        });
    }
    // Добавляем обработчики для уже существующих элементов
    addClearInputListeners();
    // Добавляем новый блок при клике на "+"
    document.addEventListener("click", function (event) {
        if (event.target.closest(".lk-teacher-schedule-popup-content-inputs-button-plus-dots")) {
            let wrapper = document.querySelector(".lk-teacher-schedule-popup-content-inputs-wrap-fordots");
            // Проверяем количество уже добавленных блоков
            let dotsCount = wrapper.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-down-wrap").length;
            if (dotsCount >= 5) return; // Если уже 5 блоков, не добавляем новый
            if (wrapper) {
                // Создаём новый элемент
                let newElement = document.createElement("div");
                newElement.classList.add("lk-teacher-schedule-popup-content-inputs-down-wrap");
                newElement.innerHTML = `
                    <div class="lk-teacher-schedule-popup-content-inputs-down">
                        <div class="lk-teacher-schedule-popup-content-inputs-down-input-wrap1">
                            <input type="date" class="lk-teacher-schedule-popup-content-inputs-input" placeholder="дд.мм.гггг чч:мм">
                            <img class="lk-teacher-schedule-popup-content-inputs-input-img" src="img/lk_teacher_popup_button_close.svg" alt="очистить">
                        </div>
                        <div class="lk-teacher-schedule-popup-content-inputs-down-input-wrap2">
                            <input type="text" class="lk-teacher-schedule-popup-content-inputs-input" placeholder="тема">
                            <img class="lk-teacher-schedule-popup-content-inputs-input-img" src="img/lk_teacher_popup_button_close.svg" alt="очистить">
                        </div>
                        <button class="lk-teacher-schedule-popup-content-inputs-button-minus-dots">
                            <img class="lk-teacher-schedule-popup-content-inputs-button-minus-dots-img" src="img/lk_teacher_popup_input_minus.svg" alt="lk_teacher_popup_input_minus">
                        </button>
                    </div>
                `;
                // Добавляем новый элемент внутрь обертки
                wrapper.appendChild(newElement);
                // Добавляем обработчики очистки для новых полей
                addClearInputListeners(newElement);
                // Добавляем обработчик для кнопки "минус"
                newElement.querySelector(".lk-teacher-schedule-popup-content-inputs-button-minus-dots").addEventListener("click", function () {
                    wrapper.removeChild(newElement);
                    checkDotsLimit(wrapper); // Проверяем и обновляем состояние кнопки добавления
                });
                // Проверяем и блокируем кнопку, если уже 5 блоков
                checkDotsLimit(wrapper);
            }
        }
    });
    function checkDotsLimit(wrapper) {
        let dotsCount = wrapper.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-down-wrap").length;
        let addButton = document.querySelector(".lk-teacher-schedule-popup-content-inputs-button-plus-dots");
        if (dotsCount >= 5) {
            addButton.disabled = true;
            addButton.style.opacity = "0.5"; // Визуально делаем кнопку неактивной
            addButton.style.pointerEvents = "none"; // Запрещаем кликать
        } else {
            addButton.disabled = false;
            addButton.style.opacity = "1";
            addButton.style.pointerEvents = "auto"; // Восстанавливаем кликабельность
        }
    }
});
// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ добавления и удаления новых строк с Модули и Точки контроля (конец)

// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ показывание полей в соотвествии с выбором радио (начало)
document.addEventListener("DOMContentLoaded", function () {
    const radioButtons = document.querySelectorAll("input[name='popup_create_event']");

    const popupContent = document.querySelector(".lk-teacher-schedule-popup-content-inputs");

    // Поля для каждого типа события
    const fieldsByEvent = {
        popup_lesson: ["группа:", "тема события:", "номер урока:", "модуль:", "подробности:", "дата и время:"],
        popup_homework: ["группа:", "тема задания:", "номер урока:", "модуль:", "подробности:", "дата и время:"],
        popup_practice: ["группа:", "тема практики:", "подробности:", "доп. куратор:", "модуль:", "точки контроля:"],
        popup_other: ["группа:", "тип события:", "название/тема:", "подробности:", "дата и время:"]
    };

    const allFields = document.querySelectorAll(".lk-teacher-schedule-popup-content-inputs-row");
    
    function updateFieldsVisibility() {
        const selectedEvent = document.querySelector("input[name='popup_create_event']:checked")?.id;

        if (!selectedEvent) return; // Выходим, если ничего не выбрано


        allFields.forEach(row => {
            const label = row.querySelector(".lk-teacher-schedule-popup-content-inputs-left-text-down");
            
            if (label) {
                const text = label.textContent.trim().toLowerCase();
                // // Проверяем конкретное значение выбранного типа события
                // if (selectedEvent === "popup_lesson" && fieldsByEvent.popup_lesson.includes(text)) {
                //     row.classList.remove("hidden");
                // } else if (selectedEvent === "popup_homework" && fieldsByEvent.popup_homework.includes(text)) {
                //     row.classList.remove("hidden");
                // } else if (selectedEvent === "popup_practice" && fieldsByEvent.popup_practice.includes(text)) {
                //     row.classList.remove("hidden");
                // } else if (selectedEvent === "popup_other" && fieldsByEvent.popup_other.includes(text)) {
                //     row.classList.remove("hidden");
                // } else {
                //     row.classList.add("hidden");
                // }

                if (fieldsByEvent[selectedEvent]?.includes(text)) {
                    row.classList.remove("hidden");
                } else {
                    row.classList.add("hidden");
                }
            }
        });
        updatePopupHeight();
    }
    function updatePopupHeight() {
        requestAnimationFrame(() => {
            popupContent.style.height = popupContent.scrollHeight + "px"; 
            
        });
    }

    // Отслеживание изменений в контенте (добавление/удаление элементов)
    const observer = new MutationObserver(() => {
        setTimeout(updatePopupHeight, 10); // Даем браузеру время обновить DOM
    });
    observer.observe(popupContent, { childList: true, subtree: true });

    // Также следим за изменениями размеров контента (например, изменение текста в инпутах)
    const resizeObserver = new ResizeObserver(updatePopupHeight);
    resizeObserver.observe(popupContent);

    // Слушаем изменения в радио-кнопках
    radioButtons.forEach(input => {
        input.addEventListener("change", () => {
            updateFieldsVisibility();
            updatePopupHeight();
        });
    });

    updateFieldsVisibility();
});
// скрипт всплывающего окна РАСПИСАНИЕ УРОКОВ показывание полей в соотвествии с выбором радио (конец)






// скрипт всплывающего окна ДОМАШНЕЕ ЗАДАНИЕ (начало) 
// появление (начало) 
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlayHomework = document.getElementById('homework-popup-overlay');
    const popupCloseHomework = document.getElementById('homework-popup-close');
    const startButtonsHomework = document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-open-item-background');
    // Функция для открытия всплывающего окна
    const openPopupHomework = () => {
        popupOverlayHomework.style.display = 'flex';
    };
    // Открытие всплывающего окна при нажатии на любую кнопку с классом "start"
    startButtonsHomework.forEach(button => {
        button.addEventListener('click', openPopupHomework);
    });
    // Закрытие всплывающего окна
    popupCloseHomework.addEventListener('click', () => {
        popupOverlayHomework.style.display = 'none';
    });
// появление (конец) 
// состояния clicked на полсек для кнопок завершить проверку и выйти без сохранения (начало)
    document.querySelector('.lk-teacher-homework-popup-content-grade-button-cancel').addEventListener('click', function() {
        const button = this;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
            popupOverlayHomework.style.display = 'none';
        }, 500);
    });
    document.querySelector('.lk-teacher-homework-popup-content-grade-button-confirm').addEventListener('click', function() {
        const button = this;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 500);
    });
// состояния clicked на полсек для кнопок завершить проверку и выйти без сохранения (конец)

// кнопка Завершить проверку активируется когда три инпута заполнены (начало)
    const deadlineInput = document.getElementById("deadline-input");
    const errorsInput = document.getElementById("errors-input");
    const gradeInput = document.getElementById("grade-input");
    const confirmButton = document.getElementById("confirm-button-popup");
    function checkFields() {
        if (deadlineInput.value && errorsInput.value && gradeInput.value) {
            confirmButton.classList.remove("disabled");
        } else {
            confirmButton.classList.add("disabled");
        }
    }
    document.querySelectorAll(".n1711-lk-teacher-main-content-profile-select-option").forEach(option => {
        option.addEventListener("click", function () {
            let inputField = this.closest(".n1711-lk-teacher-homework-popup-select-wrap").querySelector("input");
            inputField.value = this.textContent;
            checkFields();
        });
    });
// кнопка Завершить проверку активируется когда три инпута заполнены (конец)
});
// для раскрывания select-ов (начало)
    // повтор, разница в selectWraps
document.addEventListener('DOMContentLoaded', () => {
    const selectWraps = document.querySelectorAll('.n1711-lk-teacher-homework-popup-select-wrap');
    selectWraps.forEach(selectWrap => {
        const inputWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-input-wrap');
        const input = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-input');
        const optionsWrap = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-option-wrap');
        const options = selectWrap.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option');
        const customArrow = selectWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-custom-for-arrow');
        // Открытие/закрытие списка
        inputWrap.addEventListener('click', (e) => {
            e.stopPropagation();
            // Закрыть другие открытые списки
            document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option-wrap.open').forEach(openWrap => {
                if (openWrap !== optionsWrap) {
                    openWrap.classList.remove('open');
                }
            });
            // Снимаем стиль с других стрелок
            document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-input-wrap.open .n1711-lk-teacher-main-content-profile-select-custom-for-arrow').forEach(arrow => {
                if (arrow !== customArrow) {
                    arrow.style.transform = '';
                }
            });
            optionsWrap.classList.toggle('open');
            inputWrap.classList.toggle('open');
            // Добавляем или снимаем стиль поворота стрелки
            if (inputWrap.classList.contains('open')) {
                customArrow.style.transform = 'rotate(180deg)';
            } else {
                customArrow.style.transform = '';
            }
        });
        // Выбор пункта меню
        options.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                // Устанавливаем текст выбранного пункта
                input.value = option.textContent;
                // Добавляем стиль синего текста для input
                input.classList.add('selected');
                // Закрываем список
                optionsWrap.classList.remove('open');
                inputWrap.classList.remove('open');
                customArrow.style.transform = '';
            });
        });
    });
    // Закрытие списка при клике вне
    document.addEventListener('click', () => {
        document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-option-wrap.open').forEach(openWrap => {
            openWrap.classList.remove('open');
        });
        document.querySelectorAll('.n1711-lk-teacher-main-content-profile-select-input-wrap.open').forEach(openInputWrap => {
            openInputWrap.classList.remove('open');
            const customArrow = openInputWrap.querySelector('.n1711-lk-teacher-main-content-profile-select-custom-for-arrow');
            if (customArrow) {
                customArrow.style.transform = '';
            }
        });
    });
}); 
// для раскрывания select-ов (конец)
// скрипт всплывающего окна ДОМАШНЕЕ ЗАДАНИЕ (конец)


// скрипт всплывающего окна ПРАКТИЧЕСКОЕ ЗАДАНИЕ (начало) 
// появление
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlayPractice = document.getElementById('practice-popup-overlay');
    const popupClosePractice  = document.getElementById('practice-popup-close');
    const startButtonsPractice  = document.querySelectorAll('.n1711-lk-teacher-main-content-homework-content-section-open-item-background-practice');
    // Функция для открытия всплывающего окна
    const openPopupPractice = () => {
        popupOverlayPractice.style.display = 'flex';
    };
    // Открытие всплывающего окна при нажатии на любую кнопку с классом "start"
    startButtonsPractice.forEach(button => {
        button.addEventListener('click', openPopupPractice);
    });
    // Закрытие всплывающего окна
    popupClosePractice.addEventListener('click', () => {
        popupOverlayPractice.style.display = 'none';
    });
// появление

// состояния clicked на полсек для кнопок завершить проверку и выйти без сохранения
    document.querySelector('.lk-teacher-homework-popup-content-grade-button-cancel-practice').addEventListener('click', function() {
        const button = this;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
            popupOverlayPractice.style.display = 'none';
        }, 500);
    });
    document.querySelector('.lk-teacher-homework-popup-content-grade-button-confirm-practice').addEventListener('click', function() {
        const button = this;
        button.classList.add('clicked');
        setTimeout(() => {
            button.classList.remove('clicked');
        }, 500);
    });
// состояния clicked на полсек для кнопок завершить проверку и выйти без сохранения

// кнопка Завершить проверку активируется когда три инпута заполнены
    const deadlineInput = document.getElementById("deadline-input-practice");
    const errorsInput = document.getElementById("errors-input-practice");
    const gradeInput = document.getElementById("grade-input-practice");
    const confirmButton = document.getElementById("confirm-button-popup-practice");

    function checkFields() {
        if (deadlineInput.value && errorsInput.value && gradeInput.value) {
            confirmButton.classList.remove("disabled");
        } else {
            confirmButton.classList.add("disabled");
        }
    }
    document.querySelectorAll(".n1711-lk-teacher-main-content-profile-select-option").forEach(option => {
        option.addEventListener("click", function () {
            let inputField = this.closest(".n1711-lk-teacher-homework-popup-select-wrap").querySelector("input");
            inputField.value = this.textContent;
            checkFields();
        });
    });
// кнопка Завершить проверку активируется когда три инпута заполнены
});
// скрипт всплывающего окна ПРАКТИЧЕСКОЕ ЗАДАНИЕ (конец)









// скрипт всплывающего окна ЗАПУСК ТРАНСЛЯЦИИ-СТАРТ УРОКА-НАЧАТЬ УРОК (начало) 
document.addEventListener('DOMContentLoaded', () => {
    const popupOverlay = document.getElementById('menu-start-translation-popup-overlay');
    const popupClose = document.getElementById('menu-start-translation-popup-close');
    const button1 = document.querySelector('.n1711-lk-teacher-main-left-bottom-button');
    const startButtons = document.querySelectorAll('.n1711-lk-teacher-informationgroup-content-section-head-right.start');

    let cancelNavigation = false; // Флаг отмены перехода

    // Функция для открытия всплывающего окна
    const openPopup = (event) => {
        const button = event.currentTarget;

        if (button.classList.contains('disabled')) {
            return;
        }
        
        cancelNavigation = false; // Сбрасываем флаг перед началом ожидания
        popupOverlay.style.display = 'flex';

        setTimeout(() => {
            if (!cancelNavigation) {
                window.open("/translation/", "_blank");
                popupOverlay.style.display = 'none';
            }
        }, 3000);
    };

    // Открытие всплывающего окна при нажатии на button1
    button1.addEventListener('click', openPopup);

    // Открытие всплывающего окна при нажатии на любую кнопку с классом "start"
    startButtons.forEach(button => {
        button.addEventListener('click', openPopup);
    });

    // Закрытие всплывающего окна и отмена перехода
    popupClose.addEventListener('click', () => {
        cancelNavigation = true; // Устанавливаем флаг отмены
        popupOverlay.style.display = 'none';
    });
});

// скрипт всплывающего окна ЗАПУСК ТРАНСЛЯЦИИ-СТАРТ УРОКА-НАЧАТЬ УРОК (конец) 



// скрипт header (начало)
document.addEventListener('DOMContentLoaded', () => {
    // раскрывашка
    document.querySelectorAll(".n1711-lk-teacher-main-header-menu-option-down-nohover, .arrow-optional").forEach(button => {
        button.addEventListener("click", function () {
            let menu = document.querySelector(".n1711-lk-teacher-main-header-menu-option-open-wrap");
            let menuContent = document.querySelector(".n1711-lk-teacher-main-header-menu-option-open");
            let arrowOptional = document.querySelector(".arrow-optional");
            let arrowMain = document.querySelector(".arrow-main");
            let for_gap = document.querySelector(".n1711-lk-teacher-main-header-menu-option-down");
    
            if (menuContent.style.display === "none" || menuContent.style.width === "0px") {
                menuContent.style.display = "flex";
                arrowOptional.style.display = "flex";
                setTimeout(() => {
                    menuContent.style.width = "610px";
                    for_gap.style.gap = "4px";
                    arrowMain.style.transform = "rotate(90deg)";
                    arrowOptional.style.width = "16px";
                    setTimeout(() => {
                        menu.style.gap = "24px";
                        menuContent.style.opacity = "1";
                        arrowOptional.style.opacity = "1";
                    }, 500);
                }, 200);
            } else {
                arrowOptional.style.opacity = "0";
                menuContent.style.opacity = "0";
                menu.style.gap = "0";
                setTimeout(() => {
                    menuContent.style.width = "0";
                    for_gap.style.gap = "0";
                    arrowMain.style.transform = "rotate(270deg)";
                    arrowOptional.style.width = "0";
                    setTimeout(() => {
                        arrowOptional.style.display = "none";
                        menuContent.style.display = "none";
                    }, 500);
                }, 500);
            }
        });
    });
    // раскрывашка
    // кнопка Еще
    const moreButton = document.getElementById("more-button");
    const moreMenu = document.getElementById("more-menu");

    moreButton.addEventListener("click", function (event) {
        event.stopPropagation();
        moreMenu.style.display = moreMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function (event) {
        if (!moreButton.contains(event.target) && !moreMenu.contains(event.target)) {
            moreMenu.style.display = "none";
        }
    });
    // кнопка Еще
});
// скрипт header (конец)