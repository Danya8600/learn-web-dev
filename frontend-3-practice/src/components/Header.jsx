
export default function Header() {
  return (
    <header className="header">
      <a className="brand" href="#">
        <span className="brand-icon">F</span>

        <span className="brand-text">
          <span className="brand-name">Ф.О.Р.М.А</span>
          <span className="brand-subtitle">БАРБЕРШОП</span>
        </span>
      </a>

      <nav className="main-nav">
        <a href="#">Услуги</a>
        <a href="#">Мастера</a>
        <a href="#">Отзывы</a>
        <a href="#">Контакты</a>
      </nav>

      <a className="header-button" href="#">Запись</a>
    </header>
  );
}
