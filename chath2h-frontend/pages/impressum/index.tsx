import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './impressum.module.scss';

export default function ImpressumPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>Impressum</div>
      <div className={styles.paragraph}>
        <div>Meersburger Straße 23 A</div>
        <div>D 88690 Uhldingen Mühlhofen</div>
        <div>Webseite: www.chath2h.com/de</div>
        <div>Email: meg@chath2h.com</div>
        <div>Vertretungsberechtigte Personen</div>
        <div>Verantwortlich gemäß §55 Abs. 2 RStV</div>
        <div>Margit M. Schreier</div>
        <div>USt-IdNr.: DE201745667</div>
      </div>
      <div className={styles.paragraph}>
        <div className={styles.title}>Bildnachweise, VideoClips:</div>
        <div>unsplash, pixabay, freepik, pngwing, gettyimages, istockphoto, stockadobe</div>
        <div>
          Der Autor übernimmt keinerlei Gewähr hinsichtlich der inhaltlichen Richtigkeit,
          Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen.
          Haftungsansprüche gegen den Autor wegen Schäden materieller oder immaterieller Art, welche
          aus dem Zugriff oder der Nutzung bzw. Nichtnutzung der veröffentlichten Informationen,
          durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, sind
          ausgeschlossen. Alle Angebote sind unverbindlich. Der Autor behält es sich ausdrücklich
          vor, Teile der Seiten oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern,
          zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.
        </div>
      </div>
      <div className={styles.paragraph}>
        <div className={styles.title}>Haftung für Links:</div>
        <div>
          Verweise und Links auf Webseiten Dritter liegen außerhalb unseres Verantwortungsbereichs.
          Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Der Zugriff und die Nutzung
          solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.
        </div>
      </div>
      <div className={styles.paragraph}>
        <div className={styles.title}>Urheberrechte:</div>
        <div>
          Die Urheber- und alle anderen Rechte an Inhalten, Bildern, Fotos oder anderen Dateien auf
          der Website gehören ausschließlich der Inhaberin M. M. Schreier oder den speziell
          genannten Rechtsinhabern. Für die Reproduktion jeglicher Elemente ist die schriftliche
          Zustimmung der Urheberrechtsträger im Voraus einzuholen.
        </div>
      </div>
      <div className={styles.paragraph}>
        <div className={styles.title}>Sozialen Medien:</div>
        <div>
          <ul>
            <li><a href="https://www.linkedin.com/in/margit-m-schreier-ba5461198/" target="_blank">Linkedin</a></li>
            <li><a href="https://www.facebook.com/ChatH2H/" target="_blank">Facebook</a></li>
            <li><a href="https://www.instagram.com/chath2h_/" target="_blank">Instagram</a></li>
            <li><a href="https://twitter.com/ChatH2H" target="_blank">X (früher Twitter)</a></li>
            <li><a href="https://t.me/ChatH2H" target="_blank">Telegram</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
