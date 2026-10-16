
import { formatDate } from "../data/date";

export default function BookingBottomBar({ date, selectedTime }) {
  const dateText = formatDate(date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  });

  return (
    <>
      <p className="selected-info" aria-live="polite">
        Вы выбрали: {dateText} · {selectedTime || "время не выбрано"} · Дмитрий · 60 минут
      </p>

      <div className="actions">
        <button type="button" className="button button-secondary">
          ← Назад
        </button>

        <button type="button" className="button button-primary">
          Выбрать время →
        </button>
      </div>
    </>
  );
}
