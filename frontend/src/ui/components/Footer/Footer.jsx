import "@styles/Components/Footer/Footer.css";
import logo from "@assets/img/logofooter.png";
import iconFacebook from "@assets/img/iconFacebook.svg";
import iconInstagram from "@assets/img/iconInstagram.svg";
import iconTwitter from "@assets/img/iconTwitter.svg";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-section about">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="Olimpo AutoPeças" />
          </Link>
          <p className="footer-about-text">
            As melhores peças automotivas para o seu veículo. Qualidade e
            confiança em um só lugar.
          </p>
          <div className="social-icons">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={iconFacebook} alt="Facebook" />
            </a>
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src={iconInstagram} alt="Instagram" />
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
              <img src={iconTwitter} alt="Twitter" />
            </a>
          </div>
        </div>

        <div className="footer-section links">
          <div className="links-column">
            <h4>Informação</h4>
            <ul>
              <li>
                <Link to="/Error">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/Error">Segurança</Link>
              </li>
              <li>
                <Link to="/Error">Blog</Link>
              </li>
              <li>
                <Link to="/Error">Trabalhe conosco</Link>
              </li>
              <li>
                <Link to="/Pedidos">Meus Pedidos</Link>
              </li>
            </ul>
          </div>
          <div className="links-column">
            <h4>Categorias</h4>
            <ul>
              <li>
                <Link to="/ProductList">Frenagem</Link>
              </li>
              <li>
                <Link to="/ProductList">Filtros</Link>
              </li>
              <li>
                <Link to="/ProductList">Motor</Link>
              </li>
              <li>
                <Link to="/ProductList">Freio</Link>
              </li>
              <li>
                <Link to="/ProductList">Acessórios</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-section contact">
          <h4>Contato</h4>
          <address>
            Av. Santos Dumont, 1510 - 1 andar
            <br />
            Aldeota, Fortaleza - CE
            <br />
            60150-161
          </address>
          <a href="tel:+558540028922" className="phone-link">
            (85) 4002-8922
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} Olimpo AutoPeças | Todos os Direitos
          Reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
