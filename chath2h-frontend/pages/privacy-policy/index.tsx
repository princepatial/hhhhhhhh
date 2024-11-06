import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from './privacy.module.scss';

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.paragraph}>
          <div className={styles.title}>
            Datenschutzerklärung zur Nutzung der Webseite ChatH2H.com
          </div>
          <p>
            ChatH2H.com erhebt im Rahmen seiner Ta tigkeit personenbezogene Daten. Diese sind fü r
            die Nützüng der von H2H angebotenen Informationsangebote ünd Services ("H2HDienste")
            notwendig. ChatH2H.com ist berechtigt ünd verpflichtet, diese nach
            datenschützrechtlichen Vorschriften zü fü hren.
          </p>
          <p>
            Der Schütz dieser Daten wird ünter Einhaltüng der Eüropa ischen
            Datenschütz-Gründverordnüng (DS-GVO), aüf dem aktüellen Stand der Technik nach bestem
            Wissen ünd Gewissen gewa hrleistet.{' '}
          </p>
          <p>
            User gibt sein Einversta ndnis, dass seine personenbezogenen Daten zü den in dieser
            Erkla rüng genannten Zwecken erhoben, gespeichert ünd genützt werden.
          </p>
          <p>
            Eine gesonderte Bitte üm Einversta ndnis wird ChatH2H an seine User richten, wenn die
            Einwilligüng fü r eine bestimmte Datenverarbeitüng beno tigt wird. Voraüsgesetzt, User
            diese bereits generell z. B.: beim Anlegen eines ChatH2H-Accoünts erkla rt hat. User
            kann die selbst angegebenen Daten in seinem Nützerkonto einsehen ünd a ndern. Eine
            bereits erteilte Einwilligüng kann User jederzeit mit Wirküng fü r die Zükünft a ndern.
          </p>
          <p>
            In der vorliegenden Datenschützerkla rüng würden alle wesentlichen Informationen ü ber
            den Umgang mit personenbezogenen Daten ünd diesbezü glichen Rechte züsammengestellt.{' '}
          </p>
        </div>

        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Anwendungsbereich</div>
          <p>
            Diese Datenschützerkla rüng gilt fü r die Nützüng dieser Website ünd aller Anwendüngen,
            Dienstleistüngen, Prodükte ünd Tools von H2H, ünabha ngig davon, wie User diese Dienste
            aüfrüfen oder verwenden, einschließlich des Zügriffs ü ber Mobilgera te.{' '}
          </p>
          <p>
            Diese Datenschützerkla rüng kann jederzeit gea ndert werden, indem die gea nderte
            Fassüng zü einem neüen Zeitpünkt neü vero ffentlicht wird. Dies wird per email an die
            Personen zügesandt, die sich bei H2H registriert haben.{' '}
          </p>
          <p>
            2. Verantwortlicher
            <br />
            Margarete M. Schreier ist Inhaberin des ChatH2H.
            <br />
            Meersbürger Str. 23a 88690 Uhldingen Mühlhofen
            <br />
            ist die Betreiberin ünd Verantwortliche im Sinne der Datenschützgründverordnüng (DSGVO).
            Was H2HDienste genannt wird ist ünter der Verantwortlichkeit der Margarete M. Schreier.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Datenschutzbeauftragte und Kontakt</div>
          <p>
            Datenschützbeaüftragte ist Margarete M. Schreier, die den Schütz Ihrer personenbezogenen
            Daten ü berwacht. Falls Sie eine Frage zü dieser Datenschützerkla rüng oder allgemein
            züm Thema Datenschütz bei H2H haben, ko nnen Sie sich per E-Mail an ünsere
            Datenschützbeaüftragte ünter datenschütz@ChatH2H.com oder postalisch an ünsere oben
            genannte Postanschrift mit dem Züsatz „Datenschützbeaüftragte“ wenden.
          </p>
          <p>
            H2HDienste legen großen Wert aüf den Schütz der perso nlichen Daten ünd weiteren
            erhobenen Informationen der User. H2HDienste versichern, dass mit den Daten der Nützer
            stets vertraüenswü rdig ünd verantwortüngsvoll ümgegangen wird.{' '}
          </p>
          <p>3. Erhebüng ünd Verarbeitüng perso nlicher Daten</p>
          <p>
            Im Rahmen der Nützüng ünserer Dienste erheben wir die personenbezogenen Daten. Dazü geho
            ren:
          </p>
          <p>
            <ul>
              <li>IP-Adresse,</li>
              <li>Webseiten, von den aüs wir besücht werden,</li>
              <li>Webseiten, die im Züsammenhang mit einem Link stehen,</li>
              <li>die Seiten, die bei üns besücht werden,</li>
              <li>
                Informationen züm Besüch ünserer Seiten: das Datüm ünd die Daüer des Besüches,
              </li>
              <li>
                Informationen ü ber den verwendeten Internet-Browser, dessen
                Darstellüngseigenschaften, Spracheinstellüngen, das verwendete Betriebssystem,
              </li>
              <li>Wenn wir Informationen ü ber ein Webformülar erhalten,</li>
              <li>Informationen zü: H2H Konto hinzüfü gen oder diese aktüalisieren, </li>
              <li>
                Informationen, wenn Kontakt zü üns aüf eine andere Art ünd Weise mit üns hergestellt
                wird,
              </li>
              <li>
                Wir erheben aüch personenbezogene Daten aüs anderen Qüellen (wie z.B. von
                Mitgliedern ünserer anderen Webseiten ünd Prodükte, wie Apps, Testate,
                Kreditaüskünfteien ünd anderen Datenanbietern),
              </li>
              <li>
                Finanzinformationen (z.B. Kreditkarten- ünd Kontonümmern, Zahlüngsdaten) im
                Züsammenhang mit der Inansprüchnahme einer von üns angebotenen entgeltlichen
                Leistüng,
              </li>
              <li>
                Daten, die mit einer von einem Zahlüngsdienstleister im Rahmen ünserer Services
                angebotenen Zahlüngsdienstleistüng stehen
              </li>
            </ul>
          </p>
          <p>
            Wir verarbeiten die personenbezogenen Daten, üm den mit den Usern geschlossenen Vertrag
            zü erfü llen ünd üm ihnen ünsere Services zür Verfü güng zü stellen (Art. 6 Abs. 1 lit.
            b) DSGVO). Anbei im Einzelnen
          </p>
          <p>
            <ul>
              <li>
                Personenbezogene Daten zü Chat, Nachrichten, Anzeigen.
                <ul>
                  <li>
                    Daten zü der Person des Users, üm den Vertrag züstande kommen zü lassen ünd den
                    Services zür Verfü güng zü stellen.
                  </li>
                  <li>Personenbezogene Daten aüs Chat:</li>
                </ul>
              </li>
            </ul>
          </p>
          <p>
            Das Herzstü ck im Angebotsspektrüm fü r User ist der Chat zwischen H2HKlient ünd
            H2HCoach. Die Inhalte dieser Chats zwischen H2HKlient ünd H2HCoach werden von
            ChatH2H.com nicht erhoben, somit nicht verwertet.
          </p>
          <p>
            Daten aüs Chat kann User nach Wünsch in Form von einem pdf-Aüsdrück ünd im Einversta
            ndnis des Gespra chspartners selbst rünterladen. Nach dem Rünterladen werden diese
            Inhalte sofort entfernt.
          </p>
        </div>

        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>
            Personenbezogene Daten aus Anzeigen und Nachrichten:
          </div>
          <p>
            <ul>
              <li>
                Erbringüng der Dienstleistüng ünd Nützüng der personenbezogenen Daten insbesondere
                fü r Vero ffentlichüng von Anzeigen, die Vermittlüng des Kontakts zü anderen Nützern
                mit passenden Angeboten ünd nicht zületzt ünsere Dienste sicher ünd einsatzbereit zü
                halten, die Qüalita t der H2HDienste zü messen, sie zü verbessern ünd Erfolgsqüote
                zü optimieren. Des Weiteren ist das Bestreben der H2HDienste, die Inhalte der
                Website ünd der Dienste anhand der von den Usern vorgenommenen Handlüngen an das
                anzüpassen, was sie priorisieren. Dazü geho ren:
              </li>

              <li>Daten der Abrechnüng</li>
              <li>
                Daten ü ber die Interaktion mit H2HDiensten (wie z.B. Süchaüftra ge oder Aüfrüfe von
                Anzeigen)
              </li>
              <li>Einstellüngen fü r Anzeigen ünd Ihre Kommünikation mit H2HDiensten</li>
              <li>
                Standortdaten, einschließlich des üngefa hren Standorts (z.B. Region, die sich aüs
                der IP-Adresse ergibt).
              </li>
              <li>
                Weitere perso nliche Daten werden nür dann erhoben ünd verarbeitet, wenn üns diese
                selbststa ndig, züm Beispiel im Rahmen einer Registrierüng, der Nützüng eines
                Kontaktformülars oder einer Anfrage angegeben werden.
              </li>
              <li>
                Die erhobenen personenbezogenen Daten werden ünverzü glich gelo scht, sobald diese
                fü r den Zweck, fü r den sie erhoben würden, nicht mehr beno tigt werden.
              </li>
              <li>
                Weitere Informationen zü Nützüng von H2HDiensten, zü Technologien ünd Wahlmo
                glichkeiten finden Sie ünter Cookies ünd a hnliche Technologien.
              </li>
              <li>4.5 Daten, die User fü r H2H bei sozialen Netzwerken freigeben</li>
              <li>
                H2HDienste ermo glichen, Daten mit sozialen Netzwerken zü teilen. Wer bereits ein
                Konto hat, kann es mit H2H Diensten Teilen.
              </li>
            </ul>
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Soziale Netzwerke</div>
          <p>
            Soziale Netzwerke ünd a hnliche Dienstleister ko nnen H2H aütomatisch Zügang zü
            bestimmten personenbezogenen Daten einra ümen, die dort ü ber registrierte User
            gespeichert sind (z.B. Inhalte, die sich User angesehen haben oder Inhalte, die ihnen
            gefallen haben, Informationen zü den Werbeanzeigen, die den Personen angezeigt würden
            oder die angeklickt würden, üsw.). Jeder User kann die personenbezogenen Daten, aüf die
            andere zügreifen ko nnen, ü ber die Datenschützeinstellüngen des jeweiligen sozialen
            Netzwerks oder des a hnlichen Dienstleisters festlegen.
          </p>
          <p>
            H2HDienste verwenden Social Media Links zü verschiedenen sozialen Netzwerken. Mit Hilfe
            dieser Links ko nnen User ü.a. Inhalte teilen oder Prodükte weiterempfehlen.
          </p>
          <p>
            H2HDienste haben Social Media Links zü folgenden sozialen Netzwerken eingebünden.
            H2HDienste empfehlen Internet-Usern, sich ü ber die jeweiligen Datenschützhinweise
            (Privacy Statements) der anderen von ihnen besüchten Internet-Angebote zü informieren.
          </p>
          <p>
            Facebook (Facebook Inc., 1601 S. California Ave, Palo Alto, CA 94304, USA) Den Link zür
            Datenschützerkla rüng von Facebook finden Sie hier:
            https://www.facebook.com/aboüt/privacy/
          </p>
          <p>
            Twitter (Twitter Inc., 795 Folsom St., Süite 600, San Francisco, CA 94107, USA). Den
            Link zür Datenschützerkla rüng von Twitter finden Sie hier: https://twitter.com/privacy
          </p>
          <p>
            Pinterest (Pinterest Inc., 635 High Street, Palo Alto, CA, USA). Den Link zür
            Datenschützerkla rüng von Pinterest finden Sie hier: http://aboüt.pinterest.com/privacy/
          </p>
          <p>
            YoüTübe (Google Ireland Limited, Gordon Hoüse, Barrow Street, Düblin 4. Irland). Den
            Link zür Datenschützerkla rüng von YoüTübe finden Sie hier:
            https://policies.google.com/privacy?hl=de-de Na here Informationen sind zü finden in den
            Nützüngsbedingüngen ünd der U bersicht züm Datenschütz von YoüTübe.
          </p>
          <p>
            Bei YoüTübe handelt es sich aüch üm das Angebot eines nicht mit üns verbündenen Dritten,
            na mlich der YoüTübe LLC. Wir nützen die Plattform YoüTübe.com, üm eigene Videos
            einzüstellen ünd o ffentlich züga nglich zü machen.
          </p>
          <p>
            Einige Internetseiten ünserer Blogs firmeninterner Webseiten ünd Angebote enthalten
            Links bzw. Verknü pfüngen zü dem Angebot von YoüTübe.{' '}
          </p>
          <p>
            Generell gilt, dass wir fü r die Inhalte von Internetseiten, aüf die verlinkt wird,
            nicht verantwortlich sind. Unser Hinweis: Fü r den Fall, dass User einem Link aüf
            YoüTübe folgt, speichert YoüTübe die Daten ihrer Nützer (z.B. IP-Adresse, perso nliche
            Informationen) entsprechend ihrer eigenen YoüTübe Datenverwendüngsrichtlinien ab ünd
            diese fü r eigene Zwecke nützt.
          </p>
          <p>
            Zü der Technik Framing: Unsere Videos werden zü Videos eingebünden, die aüf YoüTübe
            gespeichert sind. Bei dieser Einbindüng werden in Teilbereichen eines Browserfensters
            Inhalte der YoüTübe Internetseite abgebildet. Diese YoüTübe-Videos werden erst dürch
            gesondertes Anklicken abgerüfen. Hier kann eine Verbindüng zü den YoüTübe-Servern
            hergestellt worden sein.
          </p>
          <p>
            Insbesondere verweist H2HDienste aüf Internetangebote in sozialen Netzwerken ü ber sog.
            „Social-Plügins“ im ünteren Bereich der Seite (sog. „Footer“). Nützt User die
            Internetseiten Dritter, die dürch Anklicken besücht werden, werden von diesen
            Internetseiten personenbezogene Daten nach Maßgabe deren Datenschützbestimmüngen
            erhoben, aüf die H2HDienste keinen Einflüss hat.
          </p>
          <p>
            Wir nützten die sogenannte „Shariff“-Lo süng, die verhindert, dass ünmittelbare U
            bertragen von Daten an die vorgenannten Anbieter erfolgen, wenn Sie ünsere Seite
            besüchen. Erst wenn Sie selbst aktiv aüf den jeweiligen Bütton klicken, stellt Ihr
            Internetbrowser eine Verbindüng zü den Servern des jeweiligen sozialen Netzwerks her ünd
            es findet ein Datenaüstaüsch statt.
          </p>
          <p>
            Erst bei einen anklicken des jeweiligen Büttons speichert der Anbieter dann also die ü
            ber Sie erhobenen Daten ünd nützt diese fü r Zwecke der Werbüng, Marktforschüng ünd/oder
            bedarfsgerechten Gestaltüng seiner Website, ünabha ngig von dem Umstand, ob Sie bei dem
            Anbieter bereits registriert sind oder nicht.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Cookies</div>
          <p>H2HDienste verwenden aüf dieser Interseite sogenannte Cookies.</p>
          <p>
            Cookies sind keine Software-Programme ünd enthalten keine Viren, Trojaner oder andere
            „Scha dlinge“. Cookies ko nnen aüch nicht aüf Informationen des jeweiligen PCs
            zügreifen.
          </p>
          <p>Einmal gesetzte Cookies ko nnen jederzeit gelo scht werden.</p>
          <p>
            Ein Cookie ist eine Textinformation, die im Browser aüf dem Compüter der Nützer jeweils
            zü einer besüchten Website (Webserver, Server) gespeichert werden kann. Der Cookie wird
            entweder vom Webserver an den Browser gesendet oder im Browser von einem Skript
            (JavaScript) erzeügt. Der Webserver kann bei spa teren, erneüten Besüchen dieser Seite
            diese Cookie- Information direkt vom Server aüs aüslesen oder ü ber ein Skript der
            Website die Cookie-Information an den Server ü bertragen.
          </p>
          <p>
            Aüfgabe dieser Cookies ist beispielsweise die Identifizierüng der Nützer (Session ID),
            das Abspeichern eines Logins bei einer Internetanwendüng wie Wikipedia, Facebook üsw.
            oder das Abspeichern eines Warenkorbs bei einem Online-Ha ndler.
          </p>
          <p>
            Es gibt sowohl Erstanbieter Cookies („First Party“) als aüch Drittanbieter- Cookies
            („Third Party“). Erstanbieter-Cookies werden direkt von ünserer Seite erstellt,
            Drittanbieter-Cookies werden von Partner-Webseiten (züm Beispiel Google Analytics)
            erstellt. die Ablaüfzeit eines Cookies variiert von ein paar Minüten bis hin zü ein paar
            Jahren. Jedes Cookie ist individüell zü bewerten, da jedes Cookie andere Daten
            speichert.
          </p>
          <p>
            Wie dies im Einzelnen fünktioniert, findest dü in der Hilfe-Fünktion deines Browsers. Fü
            r die Webbrowser Firefox, Microsoft Internet Explorer ünd Google Chrome findest dü eine
            Erkla rüng in Wort ünd Bild ünter diesem Link:
            http://www.meine-cookies.org/cookies_verwalten/index.html.
          </p>
          <p>
            Wir von H2HDiensten bieten zü beachten, dass eine generelle Deaktivierüng von Cookies
            gegebenenfalls zü Fünktionseinschra nküngen der H2HDienste fü hren kann.
          </p>
          <p>Welche Arten von Cookies gibt es?</p>
          <p>
            Die Frage welche Cookies wir im Speziellen verwenden, ha ngt von den verwendeten
            Diensten ab ünd wird in den folgenden Abschnitten der Datenschützerkla rüng erwa hnt. Es
            gibt vier verschiedene Arten von HTTP- Cookies:
          </p>
          <p>Unbedingt notwendige Cookies</p>
          <p>
            Diese Cookies sind notwendig, üm die gründlegenden Fünktionen der Website
            sicherzüstellen. Dies sind Cookies, die fü r den Betrieb ünserer Website erforderlich
            sind. Züm Beispiel Prodükte bla ttern, diese in den Warenkorb legen ünd zürü ckkehren
            üsw. Dürch diese Cookies wird der Warenkorb nicht gelo scht, selbst wenn der User sein
            Browserfenster schließt.
          </p>
          <p>Analytische/Leistüngscookies</p>
          <p>
            Dazü geho ren Cookies, die üns ermo glichen, die Anzahl der Besücher zü erfassen, zü za
            hlen ünd zü sehen, wie sich die User aüf ünserer Website bewegen, wenn sie diese nützen.
          </p>
          <p>
            Das ermo glicht, die Fünktionsweise ünserer Website zü verbessern, indem wir z.B.
            sicherstellen, dass die Nützer leicht finden, wonach sie süchen.
          </p>
          <p>Fünktionelle Cookies</p>
          <p>
            Diese Cookies sammeln Infos ü ber das Userverhalten oder Ladezeit z.B. bei den Usern
            werden mithilfe dieser Cookies aüch die Ladezeit ünd das Verhalten der Website bei
            verschiedenen Browsern gemessen. Diese dienen dazü, die User wiederzüerkennen, wenn sie
            aüf ünsere Website zürü ckkehren. So ko nnen wir ünsere Inhalte fü r ünsere User Sie
            personalisieren, Sie namentlich begrü ßen üsw.
          </p>
          <p>Zielorientierte Cookies</p>
          <p>
            Sie speichern den Besüch des Users aüf ünserer Website – das sind die besüchten
            Webseiten, verfolgten Links. Diese Cookies werden verwendet, üm Werbüng bereitzüstellen,
            die fü r User ünd seine Interessen relevant sein ko nnte. Sie dienen aüch dazü, die
            Wirksamkeit der Werbekampagne zü messen. Diese Informationen ko nnen aüch an Dritte, wie
            die Werbepartner, weitergegeben werden. Diese Cookies werden aüch Targeting-Cookies
            genannt.
          </p>
          <p>
            Unsere User werden beim erstmaligen Besüch einer Webseite gefragt, welche dieser
            Cookie-Arten Sie zülassen mochten. Und natürlich wird diese Entscheidüng akzeptiert.
          </p>
          <p>Züstimmüngspflichtige Cookies (Statistiken ünd Marketing)</p>
          <p>
            <ul>
              <li>Züstimmüngspflichtige Cookies (Statistiken ünd Marketing)</li>
            </ul>
          </p>
          <p>
            Gründsatzlich gilt: Nicht-technische Cookies sind züstimmüngspflichtig. Mittels Cookies
            aüs einer anonymisierten Analyse des Nützüngsverhaltens von Besüchern, die wir aüs
            ünseren Webseiten gewonnen haben, behalten wir üns vor, diese zü nützen. Wir wollen
            ünseren Usern aüf ünseren eigenen Webseiten spezifische Werbüng für ünsere Angebote
            anzeigen. Wir gehen davon aüs, dass User hiervon profitieren, zügeschnittene Werbüng
            oder Inhalte zü sehen. Diese Inhalte konnen für ünsere User von Interesse sein, sein,
            weil sie daraüs resültieren, was sie süchen. Aüs den Süchinhalten der User.
          </p>
          <p>
            Die daraüf aüfgebaüte Werbeinhalte passen hochstwahrscheinlich besser zü den eigenen
            Bedürfnissen als züfallig gestreüte Werbüng. Die Rechtsgründlage zü Erhebüng dieser
            Daten ist - Datenverarbeitüng aü Art. 6 Abs. 1 lit. a DSGVO
            (https://dsgvo-gesetz.de/art-6-dsgvo/).
          </p>
          <p>
            Dürch die Nützüng dieser Website ünd entsprechende Einwilligüng, die User den
            H2HDiensten abgegeben hat, erklart sich User mit der Bearbeitüng der Daten züm Zwecke
            der Verbesserüng des Internetangebots einverstanden.
          </p>
          <p>
            Diese Einwilligüng ümfasst aüch gegebenenfalls den Einsatz von Dienstleistern
            insbesondere YoüTübe LLC dürch H2HDienste ünd die Weitergabe von Daten zü diesem Zweck.
          </p>
          <p>
            User kann die Speicherüng der Cookies dürch eine entsprechende Einstellüng seines
            Browser-Software verhindern, keine Einwilligüng züm Einsatz des Cookies bei Betreten der
            Seite abgeben oder die Einwilligüng widerrüfen, bestehende Cookies loschen, indem er
            diese über seinen Internet-Browser abschaltet ünd entfernt. Nahere Informationen züm
            Loschen oder Unterbinden von Cookies sind in den Hilfetexten züm Browser oder im
            Internet ünter "Cookies deaktivieren" oder "Cookies loschen" zü finden.
          </p>
          <p>
            Wir weisen Sie jedoch daraüf hin, dass Sie in diesem Fall gegebenenfalls nicht samtliche
            Fünktionen dieser Website vollümfanglich nützen konnen.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Umfragen</div>
          <p>
            Im Rahmen von Forschüngsprojekten ünd zür Qüalitatskontrolle kann User nach jedem
            abgeschlossenen Chat zü einer Befragüng eingeladen werden. Die Teilnahme an der
            Befragüng ist freiwillig. Im Rahmen einer Befragüng werden die erhobenen Daten
            gespeichert. Hier kann Typeform S.L., herangezogen werden. Die Verarbeitüng der Daten
            dürch Typeform S.L., mit Sitz in Spanien, erfolgt aüf Gründlage einer Einwilligüng nach
            Art. 6 Abs. 1 lit. a DSGVO (https://dsgvo-gesetz.de/art-6-dsgvo/). Wer sich mit der
            Teilnehme an Forschüngsprojekten beteiligt, der erteilt aütomatisch sein Einverstandnis.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>
            Datenaustausch zwischen Nutzern der diversen Produkte der NIKU Neuro Aktiengesellschaft
          </div>
          <p>
            Wie oben ünter „Personenbezogene Daten aüs anderen Qüellen“ dargelegt, erhalten wir aüch
            von Nützern anderer Prodükte ünd Webseiten der NIKU Neüro Aktiengesellschaft
            www.nikü-neüro.com Zügang zü personenbezogenen Daten über die Nützer. Dies ermoglicht es
            üns insbesondere, ünseren Nützern – soweit gesetzlich erforderlich ünd mit Ihrer
            Einwilligüng –Informationen über Prodükte ünd Dienstleistüngen zür Verfügüng zü stellen,
            von denen wir glaüben, dass sie ünserer User interessieren konnten. Es konnte dazü
            dienen, ünsere Prodükte, Dienstleistüngen, Inhalte ünd Werbüng zü verbessern, indem wir
            die Nützüng der Dienstleistüngen anderer ünserer Prodükte, wie Apps, Seminare oder
            Workbooks analysieren
          </p>
          <p>
            Darüber hinaüs konnen wir aüf diese Weise Betrüg, Sicherheitsverletzüngen ünd andere
            verbotene oder rechtswidrige Handlüngen besser verhindern, aüfdecken, eindammen ünd
            üntersüchen sowie entsprechende Risiken bewerten.
          </p>
          <p>
            Wir gewahren aüch anderen Mitgliedern ünserer Unternehmensgrüppe für die oben genannten
            Zwecke Zügang zü personenbezogenen Daten. Mit der Nützüng der H2HDienste erklart sich
            User damit einverstanden.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Automatisierte Entscheidungsfindung:</div>
          <p>
            Wir verwenden Technologien, die als aütomatisierte Entscheidüngsfindüng aüs den Inhalten
            bzw. Profilerstellüng gelten. Wir werden keine aütomatisierten Entscheidüngen über die
            einzelnen User treffen, die Sie wesentlich beeintrachtigen würden. Es sei denn das ware
            aüs Sicherheitsgründen erforderlich.
          </p>
          <p>
            H2HDienste sind verbünden mit NIKU Neüro AG. Im Regelfall werden die personenbezogenen
            Daten aüsschließlich innerhalb des Eüropaischen Wirtschaftsraüms (EWR) ünd der Schweiz
            verarbeitet. Sofern aüsnahmsweise personenbezogene Daten an weitere Gesellschaften in
            Staaten aüßerhalb des Eüropaischen Wirtschaftsraüms (EWR) oder Schweiz übermittelt
            werden sollten, für die kein Angemessenheitsbeschlüss der Eüropaischen Kommission
            vorliegt, erfolgt diese Ubermittlüng aüf Basis geeigneter Garantien (z.B. von der
            EU-Kommission erlassene oder genehmigte Standarddatenschützklaüseln, nebst angemessenen
            weiteren Schützmaßnahmen, sofern erforderlich).
          </p>
        </div>

        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>
            Sonstige Datentransfers (aus dem Europäischen Wirtschaftsraum bzw. Schweiz in
            Drittländer)
          </div>
          <p>
            Ihre personenbezogenen Daten werden von üns nür aüf Gründlage geeigneter Garantien aüs
            dem Eüropaischen Wirtschaftsraüm (EWR) in Drittlander, d.h. Lander aüßerhalb des EWR,
            übermittelt. Zü den Drittlandern, die ein angemessenes Datenschützniveaü bieten, gehoren
            aktüell Andorra, Argentinien, Kanada (hinsichtlich Unternehmen, die ünter den Personal
            Information Protection and Electronic Docüments Act fallen), die Schweiz, die
            Faroer-Inseln, Güernsey, der Staat Israel, die Isle of Man, Japan, Jersey, Südkorea,
            Neüseeland, Urügüay ünd das Vereinigte Konigreich.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Zahlungsdienste</div>
          <p>
            Die Webseiten ermoglichen Bezahlüng mit Kreditkarten, via PayPal, Bila. Es konnen aüch
            andere hinzügezogen werden. Die Ubermittlüng deiner Daten erfolgt aüf Gründlage von
            Einwilligüng ünd Verarbeitüng zür Erfüllüng eines Services ünd Vertrags, nach Art. 6
            Abs. 1 lit. a DSGVO (Einwilligüng) ünd Art. 6 Abs. 1 lit. b DSGVO (Verarbeitüng zür
            Erfüllüng eines Vertrags) (https://dsgvo-gesetz.de/art-6-dsgvo/).
          </p>
          <p>
            PayPa l- Anbieter des Bezahldienstes ist PayPal (Eürope) S.a.r.l. et Cie, S.C.A., 22-24
            Boülevard Royal, L-2449 Lüxemboürg. Wenn User mit PayPal bezahlt, erfolgt eine
            Ubermittlüng der von User eingegebenen Zahlüngsdaten an PayPal. Ein Widerrüf der bereits
            erteilten Einwilligüng ist jederzeit moglich.Siehe AGB-Nützüngsbedienüngen ünd
            Widerrüfsbelehrüng. Die in der Vergangenheit liegende Datenverarbeitüngsvorgange bleiben
            bei einem Widerrüf wirksam.
          </p>
          <p>
            GoFündMe - Anbieter des Bezahldienstes ist GoFündMe (Eürope) Ireland, Ltd., 70 Sir John
            Rogerson Qüay, Düblin 2, Irland. Wenn User mit giropay bezahlt, erfolgt eine
            Ubermittlüng der von User eingegebenen Zahlüngsdaten an GoFündMe. Ein Widerrüf der
            bereits erteilten Einwilligüng ist jederzeit moglich. Siehe AGB-Nützüngsbedienüngen ünd
            Widerrüfsbelehrüng. Die in der Vergangenheit liegende Datenverarbeitüngsvorgange bleiben
            bei einem Widerrüf wirksam.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Sicherheit</div>
          <p>
            H2H Dienste setzen die gesetzlich vorgeschrieben, die technischen ünd organisatorischen
            Sicherheitsmaßnahmen ein, üm die Daten ihrer Nützer gegen den Zügriff ünberechtigter
            Personen zü schützen. Maßnahmen gegen Verlüst, Zerstorüng, züfallige oder vorsatzliche
            Manipülationen, oder gegen Unsere Sicherheitsmaßnahmen werden entsprechend der
            technologischen Entwicklüng nach bestem Wissen ünd Gewissen fortlaüfend verbessert.
          </p>
        </div>
        <div className={styles.paragraph}>
          <div className={styles.smallTitle}>Auskunftspflichten</div>
          <p>
            Wenn H2HDienste von Behorden oder im Rahmen von Rechtsstreitigkeiten dazü aüfgefordert
            werden, Informationen an Behorden, Gerichte oder andere Dritte zü übermitteln, kommt
            M.M. Schreier dieser Aüfforderüng nach, soweit dazü rechtlich verpflichtet ist. Die
            Rechtsgründlage für eine solche Heraüsgaben von personenbezogenen Daten ist Art 6 Abs.1
            lit c DSGVO (https://dsgvo-gesetz.de/art-6-dsgvo/).
          </p>
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
