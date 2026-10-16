
export default function BookingSteps() {
  return (
    <section className="booking-progress">
      <div className="progress-title">
        <span>ЗАПИСЬ ОНЛАЙН</span>
        <strong>Шаг 3 из 5</strong>
      </div>

      <ol className="steps">
        <li className="step completed">
          <span className="step-number">✓</span>
          <span>Мастер</span>
        </li>

        <li className="step completed">
          <span className="step-number">✓</span>
          <span>Услуга</span>
        </li>

        <li className="step current">
          <span className="step-number">✓</span>
          <span>Дата и время</span>
        </li>

        <li className="step">
          <span className="step-number">4</span>
          <span>Контакты</span>
        </li>

        <li className="step">
          <span className="step-number">5</span>
          <span>Подтверждение</span>
        </li>
      </ol>
    </section>
  );
}
