
import { useEffect, useRef, useState } from "react";

import Header from "./components/Header";
import BookingSteps from "./components/BookingSteps";
import Calendar from "./components/Calendar";
import TimeSlots from "./components/TimeSlots";
import BookingBottomBar from "./components/BookingBottomBar";
import Footer from "./components/Footer";

import { fetchToday, fetchSlots } from "./api";

// Проверяет дату, полученную от сервера.
function parseServerDate({ day, month, year }) {
  if (
    !Number.isInteger(day) ||
    !Number.isInteger(month) ||
    !Number.isInteger(year)
  ) {
    throw new Error("Некорректный формат даты");
  }

  const date = new Date(year, month, day);

  if (
    date.getDate() !== day ||
    date.getMonth() !== month ||
    date.getFullYear() !== year
  ) {
    throw new Error("Некорректная дата");
  }

  return date;
}

export default function App() {
  // 1. Состояние календаря и выбранной записи

  const [today, setToday] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [currentMonth, setCurrentMonth] = useState(null);
  const [currentYear, setCurrentYear] = useState(null);

  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);

  // 2. Состояния запросов

  const [todayStatus, setTodayStatus] = useState("loading");
  const [todayError, setTodayError] = useState("");

  const [slotsStatus, setSlotsStatus] = useState("loading");
  const [slotsError, setSlotsError] = useState("");

  const [todayRetry, setTodayRetry] = useState(0);
  const [slotsRetry, setSlotsRetry] = useState(0);

  // Используется для защиты от устаревших ответов.
  const slotsRequestId = useRef(0);

  // 3. Загрузка сегодняшней даты

  useEffect(() => {
    let cancelled = false;

    async function loadToday() {
      try {
        const data = await fetchToday();

        if (cancelled) return;

        const date = parseServerDate(data);

        setToday(date);
        setSelectedDate(date);

        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());

        setTodayError("");
        setTodayStatus("success");
      } catch {
        if (cancelled) return;

        setTodayError(
          "Не удалось загрузить дату с сервера."
        );
        setTodayStatus("error");
      }
    }

    loadToday();

    return () => {
      cancelled = true;
    };
  }, [todayRetry]);

  // 4. Загрузка слотов для выбранного дня

  useEffect(() => {
    if (!selectedDate) return;

    let cancelled = false;
    const requestId = ++slotsRequestId.current;

    async function loadSlots() {
      const dateParams = {
        day: selectedDate.getDate(),
        month: selectedDate.getMonth(),
        year: selectedDate.getFullYear()
      };

      try {
        const data = await fetchSlots(dateParams);

        // Старый ответ не должен заменить актуальное расписание.
        if (
          cancelled ||
          requestId !== slotsRequestId.current
        ) {
          return;
        }

        if (
          !data ||
          !data.date ||
          data.date.day !== dateParams.day ||
          data.date.month !== dateParams.month ||
          data.date.year !== dateParams.year ||
          !Array.isArray(data.slots)
        ) {
          throw new Error("Некорректный ответ сервера");
        }

        // Преобразуем available в occupied для нашего компонента.
        const receivedSlots = data.slots.map(slot => {
          if (
            typeof slot.time !== "string" ||
            typeof slot.available !== "boolean"
          ) {
            throw new Error("Некорректный формат слота");
          }

          return {
            time: slot.time,
            occupied: !slot.available
          };
        });

        setSlots(receivedSlots);
        setSlotsError("");
        setSlotsStatus("success");
      } catch {
        if (
          cancelled ||
          requestId !== slotsRequestId.current
        ) {
          return;
        }

        setSlots([]);
        setSlotsError(
          "Не удалось загрузить свободное время."
        );
        setSlotsStatus("error");
      }
    }

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [selectedDate, slotsRetry]);

  // 5. Обработчики действий пользователя

  // При выборе нового дня сбрасываем время и запрашиваем слоты.
  function handleDaySelect(day) {
    const date = new Date(currentYear, currentMonth, day);

    if (date < today) return;
    if (date.getTime() === selectedDate.getTime()) return;

    slotsRequestId.current++;

    setSelectedDate(date);
    setSelectedTime(null);
    setSlots([]);

    setSlotsStatus("loading");
    setSlotsError("");
  }

  // Выбирать можно только свободные слоты после загрузки.
  function handleTimeSelect(time) {
    if (slotsStatus !== "success") return;

    const available = slots.some(slot =>
      slot.time === time && !slot.occupied
    );

    if (available) {
      setSelectedTime(time);
    }
  }

  // Просмотр другого месяца не сбрасывает выбранную запись.
  function handleMonthChange(direction) {
    const target = new Date(
      currentYear,
      currentMonth + direction,
      1
    );

    const firstAvailableMonth = new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    if (target < firstAvailableMonth) return;

    setCurrentMonth(target.getMonth());
    setCurrentYear(target.getFullYear());
  }

  // Повторяем запрос сегодняшней даты.
  function retryToday() {
    setTodayError("");
    setTodayStatus("loading");
    setTodayRetry(value => value + 1);
  }

  // Повторяем запрос слотов, не меняя выбранную дату.
  function retrySlots() {
    slotsRequestId.current++;

    setSlots([]);
    setSlotsError("");
    setSlotsStatus("loading");
    setSlotsRetry(value => value + 1);
  }

  // 6. Отображение страницы

  return (
    <div className="page">
      <Header />
      <BookingSteps />

      <main className="main">
        <section className="date-section">
          {todayStatus === "loading" ? (
            <div className="request-state" role="status">
              Загрузка...
            </div>
          ) : todayStatus === "error" ? (
            <div className="request-state" role="alert">
              <p>{todayError}</p>

              <button
                type="button"
                className="retry-button"
                onClick={retryToday}
              >
                Повторить
              </button>
            </div>
          ) : (
            <>
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
                  status={slotsStatus}
                  error={slotsError}
                  onTimeSelect={handleTimeSelect}
                  onRetry={retrySlots}
                />
              </div>

              <BookingBottomBar
                date={selectedDate}
                selectedTime={selectedTime}
              />
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
