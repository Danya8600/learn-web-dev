
import { buildCalendarGrid, formatDate } from "../data/date";

export default function Calendar({
  year,
  month,
  selectedDate,
  today,
  onDaySelect,
  onMonthChange
}) {
  const cells = buildCalendarGrid(year, month, today);

  const monthName = formatDate(
    new Date(year, month, 1),
    { month: "long" }
  );

  const canGoBack = new Date(year, month, 1) >
    new Date(today.getFullYear(), today.getMonth(), 1);

  // Показываем выделение только в месяце выбранной записи.
  function isSelectedDay(day) {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  }

  return (
    <section className="calendar-card">
      <div className="calendar-header">
        <h2>{monthName.toUpperCase()} {year}</h2>

        <div className="calendar-controls">
          <button
            type="button"
            aria-label="Предыдущий месяц"
            disabled={!canGoBack}
            onClick={() => onMonthChange(-1)}
          >
            ‹
          </button>

          <button
            type="button"
            aria-label="Следующий месяц"
            onClick={() => onMonthChange(1)}
          >
            ›
          </button>
        </div>
      </div>

      <div className="weekdays">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(day => (
          <span key={day}>{day}</span>
        ))}
      </div>

      <div className="calendar-days">
        {cells.map((cell, index) => {
          if (cell === null) {
            return (
              <span
                className="empty-day"
                key={`empty-${index}`}
              />
            );
          }

          const selected = isSelectedDay(cell.day);

          return (
            <button
              type="button"
              key={cell.day}
              className={`day ${selected ? "selected" : ""}`}
              disabled={cell.disabled}
              aria-pressed={selected}
              onClick={() => onDaySelect(cell.day)}
            >
              {cell.day}
            </button>
          );
        })}
      </div>
    </section>
  );
}
