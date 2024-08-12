import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>À propos de nous</h3>
          <p>
            Bienvenue sur notre site. Nous vous offrons une plateforme pour lire
            et apprécier une variété de romans directement traduits en français.
            Restez à l'écoute pour plus de mises à jour.
          </p>
        </div>
        <div className="footer-section links">
          <h3>Liens utiles</h3>
          <ul>
            <li>
              <a href="/privacy-policy">Politique de confidentialité</a>
            </li>
            <li>
              <a href="/terms-conditions">Termes et conditions</a>
            </li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contactez-nous par mail</h3>
          <p>
            <a href="mailto:mazurjerome42@gmail.com" className="contact-link">
              <i className="fas fa-envelope"></i>
            </a>
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} NovelFrancais.fr. Tous droits
        réservés.
      </div>
    </footer>
  );
};

export default Footer;
