
// Сравнивает две даты без учёта часов и минут.
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

// Строит сетку календаря с понедельника.
export function buildCalendarGrid(year, month, today) {
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = Array(offset).fill(null);

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);

    cells.push({
      day,
      disabled: compareDates(date, today) < 0
    });
  }

  while (cells.length % 7 !== 0) {
    cells.push(null);
  }

  return cells;
}

// Преобразует дату в удобочитаемый русский формат.
export function formatDate(date, options) {
  const result = new Intl.DateTimeFormat("ru-RU", options).format(date);
  return result.charAt(0).toUpperCase() + result.slice(1);
}
