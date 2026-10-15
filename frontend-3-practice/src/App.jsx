
import { useState } from "react";

import Header from "./components/Header";
import BookingSteps from "./components/BookingSteps";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";
import Footer from "./components/Footer";

import { getSlots } from "./data/date";

export default function App() {
  const [today] = useState(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  });

  // Просматриваемый месяц хранится отдельно от выбранной даты.
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  // Выбранная дата и время записи.
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState(() => getSlots(today));

  // При выборе другого дня обновляем дату и расписание.
  function handleDaySelect(day) {
    const date = new Date(currentYear, currentMonth, day);

    if (date < today) return;
    if (date.getTime() === selectedDate.getTime()) return;

    setSelectedDate(date);
    setSelectedTime(null);
    setSlots(getSlots(date));
  }

  // Разрешаем выбирать только свободные слоты.
  function handleTimeSelect(time) {
    const available = slots.some(slot =>
      slot.time === time && !slot.occupied
    );

    if (available) {
      setSelectedTime(time);
    }
  }

  // Переключаем отображаемый месяц без сброса выбранной записи.
  function handleMonthChange(direction) {
    const target = new Date(
      currentYear,
      currentMonth + direction,
      1
    );

    const currentMonthStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (target < currentMonthStart) return;

    setCurrentMonth(target.getMonth());
    setCurrentYear(target.getFullYear());
  }

  return (
    <div className="page">
      <Header />
      <BookingSteps />

      <main className="main">
        <section className="date-section">
          <p className="section-label">
            ШАГ 3 · ДАТА И ВРЕМЯ
          </p>

          <h1>Найдём удобное время</h1>

          <p className="section-description">
            Расписание Дмитрия · комплекс «Стрижка + борода» · 60 минут.
          </p>

          <div className="schedule">
            <Calendar
              year={currentYear}
              month={currentMonth}
              selectedDate={selectedDate}
              today={today}
              onDaySelect={handleDaySelect}
              onMonthChange={handleMonthChange}
            />

            <TimeSlots
              date={selectedDate}
              slots={slots}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
            />
          </div>

          <BookingBottomBar
            date={selectedDate}
            selectedTime={selectedTime}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
