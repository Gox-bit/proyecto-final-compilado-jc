import { Impo} from "react";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>🎮 Bienvenido a GameTracker</h1>
        <p>Organiza y haz seguimiento de tus videojuegos fácilmente.</p>
      </header>

      <section className="home-buttons">
        <button className="btn-primary">Ver Juegos</button>
        <button className="btn-secondary">Agregar Nuevo</button>
      </section>
    </div>
  );
}

export default Home;
