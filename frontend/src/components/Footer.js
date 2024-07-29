import React from "react";
import "../styles/Footer.css"; // Assurez-vous de créer et styliser ce fichier CSS

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section about">
          <h3>À propos de nous</h3>
          <p>
            Bienvenue sur notre site. Nous vous offrons une plateforme pour lire
            et apprécier une variété de romans. Restez à l'écoute pour plus de
            mises à jour.
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
            <li>
              <a href="/contact">Contactez-nous</a>
            </li>
          </ul>
        </div>
        <div className="footer-section contact">
          <h3>Contactez-nous</h3>
          <p>Email : info@example.com</p>
          <p>Téléphone : +123 456 7890</p>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Votre Société. Tous droits réservés.
      </div>
    </footer>
  );
};

export default Footer;
