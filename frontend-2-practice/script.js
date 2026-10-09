
document.addEventListener("DOMContentLoaded", () => {

  // 1. Данные и DOM-элементы

  const calendarTitle = document.querySelector(".calendar-header h2");
  const calendarGrid = document.querySelector(".calendar-days");
  const timeTitle = document.querySelector(".time-card h2");
  const timeGrid = document.querySelector(".time-grid");
  const bottomBar = document.querySelector(".selected-info");

  const [prevButton, nextButton] =
    document.querySelectorAll(".calendar-controls button");

  // Убираем время, чтобы сравнивать только даты.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Временные слоты для демонстрационного расписания.
  const TIMES = [
    "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00"
  ];


  // 2. Состояние календаря

  // Храним текущий месяц, выбранную дату, время и доступные слоты.
  const state = {
    currentMonth: today.getMonth(),
    currentYear: today.getFullYear(),
    selectedDay: today.getDate(),
    selectedTime: null,
    slots: []
  };


  // 3. Функции для работы с датами

  // Сравнивает две даты без учёта часов и минут.
  function compareDates(date1, date2) {
    const first = new Date(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );

    const second = new Date(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );

    return first.getTime() - second.getTime();
  }

  // Запрещает выбирать даты раньше сегодняшней.
  function isDateSelectable(day, month, year, minDate) {
    const date = new Date(year, month, day);
    return compareDates(date, minDate) >= 0;
  }

  // Формирует ячейки месяца с учётом начала недели с понедельника.
  function buildCalendarGrid(year, month, minDate) {
    const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];

    // Добавляем пустые ячейки перед первым числом месяца.
    for (let i = 0; i < firstWeekday; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push({
        day,
        disabled: !isDateSelectable(day, month, year, minDate)
      });
    }

    // Дополняем последнюю неделю до семи ячеек.
    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }

  // Возвращает выбранную дату из текущего состояния.
  function getSelectedDate() {
    return new Date(
      state.currentYear,
      state.currentMonth,
      state.selectedDay
    );
  }

  // Имитирует занятость мастера, пока нет данных с сервера.
  function getSlots(date) {
    let occupiedTimes;

    // 10 октября все слоты заняты для проверки альтернативного сценария.
    if (
      date.getFullYear() === 2026 &&
      date.getMonth() === 9 &&
      date.getDate() === 10
    ) {
      occupiedTimes = TIMES;
    } else if (
      date.getDate() % 3 === 0 ||
      date.getDate() % 4 === 0
    ) {
      occupiedTimes = ["11:00", "13:00"];
    } else {
      occupiedTimes = ["10:00", "16:00"];
    }

    return TIMES.map(time => ({
      time,
      occupied: occupiedTimes.includes(time)
    }));
  }

  // Форматирует дату на русском языке.
  function formatDate(date, options) {
    const result = new Intl.DateTimeFormat("ru-RU", options).format(date);
    return result.charAt(0).toUpperCase() + result.slice(1);
  }


  // 4. Отрисовка и обработчики событий

  // Перестраивает календарь и выделяет выбранный день.
  function renderCalendar() {
    const { currentYear, currentMonth, selectedDay } = state;

    const monthName = formatDate(
      new Date(currentYear, currentMonth, 1),
      { month: "long" }
    );

    calendarTitle.textContent =
      `${monthName.toUpperCase()} ${currentYear}`;

    const cells = buildCalendarGrid(
      currentYear,
      currentMonth,
      today
    );

    calendarGrid.innerHTML = cells.map(cell => {
      if (cell === null) {
        return '<span class="empty-day"></span>';
      }

      const { day, disabled } = cell;
      const selected = day === selectedDay;

      return `
        <button
          type="button"
          class="day ${selected ? "selected" : ""}"
          data-day="${day}"
          aria-pressed="${selected}"
          ${disabled ? "disabled" : ""}
        >${day}</button>
      `;
    }).join("");

    // Стрелка назад недоступна в текущем месяце.
    const currentMonthStart = new Date(
      currentYear, currentMonth, 1
    );

    const todayMonthStart = new Date(
      today.getFullYear(), today.getMonth(), 1
    );

    prevButton.disabled = currentMonthStart <= todayMonthStart;
  }

  // Обновляет расписание для выбранной даты.
  function renderTimeSlots() {
    const date = getSelectedDate();

    timeTitle.textContent = formatDate(date, {
      weekday: "long",
      day: "numeric",
      month: "long"
    });

    state.slots = getSlots(date);

    // Сбрасываем время, если выбранный слот больше не доступен.
    const selectedIsAvailable = state.slots.some(slot =>
      slot.time === state.selectedTime && !slot.occupied
    );

    if (!selectedIsAvailable) {
      state.selectedTime = null;
    }

    timeGrid.innerHTML = state.slots.map(slot => {
      const selected =
        !slot.occupied && slot.time === state.selectedTime;

      return `
        <button
          type="button"
          class="time-slot ${slot.occupied ? "occupied" : ""} ${selected ? "selected" : ""}"
          data-time="${slot.time}"
          aria-pressed="${selected}"
          ${slot.occupied ? "disabled" : ""}
        >
          <span>${slot.time}</span>
          ${slot.occupied ? "<small>Занято</small>" : ""}
        </button>
      `;
    }).join("");
  }

  // Показывает текущий выбор пользователя под календарём.
  function updateBottomBar() {
    const date = getSelectedDate();

    const formattedDate = formatDate(date, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const time = state.selectedTime || "время не выбрано";

    bottomBar.textContent =
      `Вы выбрали: ${formattedDate} · ${time} · Дмитрий · 60 минут`;
  }

  // Общая перерисовка после изменения даты или месяца.
  function render() {
    renderCalendar();
    renderTimeSlots();
    updateBottomBar();
  }

  // Обрабатывает выбор дня и сбрасывает ранее выбранное время.
  function onDayClick(event) {
    const button = event.target.closest("button[data-day]");

    if (!button || button.disabled) return;

    const day = Number(button.dataset.day);

    if (day === state.selectedDay) return;

    state.selectedDay = day;
    state.selectedTime = null;

    render();
  }

  // Выбирает только свободный слот и обновляет интерфейс.
  function onTimeSlotClick(event) {
    const button = event.target.closest("button[data-time]");

    if (!button || button.disabled) return;

    const time = button.dataset.time;

    const slot = state.slots.find(item => item.time === time);

    if (!slot || slot.occupied) return;

    state.selectedTime = time;

    renderTimeSlots();
    updateBottomBar();
  }

  // Переключает месяц, не позволяя перейти к прошедшим месяцам.
  function setUpMonthNavigation(direction) {
    const nextMonth = new Date(
      state.currentYear,
      state.currentMonth + direction,
      1
    );

    const firstAvailableMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (nextMonth < firstAvailableMonth) return;

    state.currentMonth = nextMonth.getMonth();
    state.currentYear = nextMonth.getFullYear();

    const isCurrentMonth =
      state.currentMonth === today.getMonth() &&
      state.currentYear === today.getFullYear();

    // При переходе выбираем первый день или сегодняшнюю дату.
    state.selectedDay = isCurrentMonth ? today.getDate() : 1;
    state.selectedTime = null;

    render();
  }


  // 5. Инициализация

  // Подключаем события один раз, даже если содержимое сеток меняется.
  function init() {
    calendarGrid.addEventListener("click", onDayClick);
    timeGrid.addEventListener("click", onTimeSlotClick);

    prevButton.addEventListener("click", () => {
      setUpMonthNavigation(-1);
    });

    nextButton.addEventListener("click", () => {
      setUpMonthNavigation(1);
    });

    render();
  }

  init();
});
