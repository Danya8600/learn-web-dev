
export const TIMES = [
  "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00"
];

// Сравниваем календарные даты без учёта времени.
export function compareDates(first, second) {
  const a = new Date(
    first.getFullYear(),
    first.getMonth(),
    first.getDate()
  );

  const b = new Date(
    second.getFullYear(),
    second.getMonth(),
    second.getDate()
  );

  return a.getTime() - b.getTime();
}

// Формируем сетку месяца и блокируем прошедшие даты.
export function buildCalendarGrid(year, month, today) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const count = new Date(year, month + 1, 0).getDate();
  const cells = Array(offset).fill(null);

  for (let day = 1; day <= count; day++) {
    cells.push({
      day,
      disabled: compareDates(
        new Date(year, month, day),
        today
      ) < 0
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

// Демонстрационное расписание вместо данных сервера.
export function getSlots(date) {
  let occupiedTimes;

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

// Форматируем дату на русском языке.
export function formatDate(date, options) {
  const value = new Intl.DateTimeFormat("ru-RU", options).format(date);
  return value[0].toUpperCase() + value.slice(1);
}
