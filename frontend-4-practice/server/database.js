
// Демонстрационная база данных барбершопа «Ф.О.Р.М.А».

export const database = {
  // Сегодняшняя дата для проверки календаря.
  // Месяцы нумеруются с нуля.
  today: {
    day: 17,
    month: 9,
    year: 2026
  },

  // Расписание для чётных дней.
  slotsEvenDay: [
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "12:00", available: true },
    { time: "13:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
    { time: "17:00", available: true }
  ],

  // Расписание для нечётных дней.
  slotsOddDay: [
    { time: "10:00", available: false },
    { time: "11:00", available: true },
    { time: "12:00", available: true },
    { time: "13:00", available: true },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: false },
    { time: "17:00", available: true }
  ]
};
