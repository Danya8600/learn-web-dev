
import { formatDate } from "../data/date";

export default function TimeSlots({
  date,
  slots,
  selectedTime,
  status,
  error,
  onTimeSelect,
  onRetry
}) {
  const dateText = formatDate(date, {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  return (
    <section className="time-card">
      <h2>{dateText}</h2>
      <p>Свободные слоты</p>

      {status === "loading" && (
        <p className="slot-status" role="status">
          Загрузка слотов...
        </p>
      )}

      {status === "error" && (
        <div className="slot-error" role="alert">
          <p>{error}</p>

          <button
            type="button"
            className="retry-button"
            onClick={onRetry}
          >
            Повторить
          </button>
        </div>
      )}

      {status === "success" && (
        <div className="time-grid">
          {slots.length === 0 ? (
            <p className="empty-slots">
              Нет доступного расписания на эту дату.
            </p>
          ) : (
            slots.map(slot => {
              const selected =
                !slot.occupied &&
                selectedTime === slot.time;

              return (
                <button
                  type="button"
                  key={slot.time}
                  className={`time-slot ${slot.occupied ? "occupied" : ""} ${selected ? "selected" : ""}`}
                  disabled={slot.occupied}
                  aria-pressed={selected}
                  onClick={() => onTimeSelect(slot.time)}
                >
                  <span>{slot.time}</span>
                  {slot.occupied && <small>Занято</small>}
                </button>
              );
            })
          )}
        </div>
      )}
    </section>
  );
}
