
import { formatDate } from "../data/date";

export default function TimeSlots({
  date,
  slots,
  selectedTime,
  onTimeSelect
}) {
  return (
    <section className="time-card">
      <h2>
        {formatDate(date, {
          weekday: "long",
          day: "numeric",
          month: "long"
        })}
      </h2>

      <p>Свободные слоты</p>

      <div className="time-grid">
        {slots.map(slot => (
          <button
            type="button"
            key={slot.time}
            className={`time-slot ${slot.occupied ? "occupied" : ""} ${selectedTime === slot.time ? "selected" : ""}`}
            disabled={slot.occupied}
            aria-pressed={selectedTime === slot.time}
            onClick={() => onTimeSelect(slot.time)}
          >
            <span>{slot.time}</span>
            {slot.occupied && <small>Занято</small>}
          </button>
        ))}
      </div>
    </section>
  );
}
