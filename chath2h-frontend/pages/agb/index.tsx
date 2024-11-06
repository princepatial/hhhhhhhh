import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import styles from '../help/helpCenter.module.scss';
import classNames from 'classnames';
import Link from 'next/link';
import stylesAgb from './agb.module.scss';

export default function AgbPage() {
  return (
    <div className={classNames(styles.container, stylesAgb.container)}>
      <div className={classNames(styles.helpContent, stylesAgb.agbContent)}>
        <div className={styles.topText}>
          <h1 className={stylesAgb.title}>Nutzungsbedingungen zu</h1>
          <div className={stylesAgb.text}>
            <div>www.ChatH2H.com</div>
            <span>Stand: [09/2023]</span>
          </div>

          <ol className={styles.liNone}>
            <h2 className={stylesAgb.title}>Die Grundidee</h2>
            <li>
              Jeder Mensch hat Erfahrungen und Kenntnisse, die er weitergeben kann. Sehr viele
              Menschen hören gerne zu, helfen anderen und leisten Beistand. Die gleichen Menschen
              haben Bedürfnisse und sind erfreut, wenn andere ihnen helfen.
            </li>
            <li>
              Es geht nicht um eine professionelle Beratung, vielmehr um Beistand und um den „Guten
              Rat“ während einer emotionalen Verstimmung aufgrund der individuell erlebten
              Erfahrungen. Jeder Nutzer tritt in 2 Rollen auf: einerseits als H2HCoach und
              andererseits als H2HKlient.
            </li>
            <li>
              Die Kontaktaufnahme zwischen H2HKlient und H2HCoach erfolgt über einen individuellen
              Chat mit selbst ausgewählten H2HCoach. Mit diesen H2HCoach erfolgt die digitale
              Online-Kommunikation.
            </li>
            <li>H2HKleint entlohnt den H2HCoach mit Token.</li>
          </ol>

          <ol>
            <h2 className={stylesAgb.title}>Grundsatz</h2>
            <li>
              ChatH2H ist reiner Bereitsteller digitaler Kommunikationswege (Access Service
              Provider) und anderer Dienste und stellt als solcher die technische Verfügbarkeit der
              Webseite zur Verfügung. ChatH2H hat keine Kenntnis über den Inhalt der Chats und
              Kommunikationen zwischen den Usern. Welche personenbezogenen Daten erhoben werden,
              kann in dem Bereich Cookies zustimmen oder ablehnen eingesehen werden. Mehr dazu siehe
              Datenschutzerklärung.
            </li>
          </ol>
        </div>
        <ol>
          <h4>Allg. Informationen, Widerrufsrecht</h4>
          <ul className={styles.liNone}>
            <li>
              Die Webseite ChatH2H.com informiert hiermit über Nutzungsbedingungen und
              Widerrufrecht. Um die hier anwendbaren Dienste zu erfassen (lokale und mobile
              Anwendungen, Services und Tols, etc.) wird her „H2H-Dienste“ genannt.
            </li>
            <li>
              Die Allgemeinen Nutzungsbedingungen (im Folgenden „Nutzungsbedingungen“),
              Widerrufabelehrung und die H2H-Dienste werden ausschließlich in deutscher Sprache zur
              Verfügung gestellt. Sie beinhalten die grundlegenden Regeln für die Nutzung der
              H2H-Dienste. Davon abweichende Geschäftsbedingungen des Nutzers finden keine
              Anwendung.
            </li>
            <li>
              Wer die H2H-Dienste als Verbraucher nutzt und kostenpflichtige Verträge abschließt,
              der hat ein gesetzliches Widerrufsrecht. Belehrung:
            </li>
          </ul>
        </ol>

        <div className={stylesAgb.sheetPaper}>
          <ol>
            <h4 className={classNames(stylesAgb.center, stylesAgb.h4)}>Widerrufsrecht</h4>
            <li>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
              widerrufen.
            </li>
            <li>
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses. Um Ihr
              Widerrufsrecht auszuüben, müssen Sie uns (E-Mail: service@ChatH2H.com) mittels einer
              eindeutigen Erklärung (z.B.: ein mit der Post versandter Brief oder eine E-Mail)
              informieren, diesen Vertrag zu widerrufen. Dies muss vor dem Ablauf der Widerrufsfrist
              geschehen.
            </li>
          </ol>

          <ol>
            <h4 className={stylesAgb.center}>Widerrufsrecht</h4>
            <li>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
              erhalten haben, ggfls. einschließlich der Lieferkosten unverzüglich und spätestens
              binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren
              Widerruf dieses einen Vertrags bei uns eingegangen ist. Für diese Rückzahlung
              verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion
              eingesetzt haben. Bei Lieferungen wird grundsätzlich der Preis der Standartlieferung
              rückerstattet.
            </li>
            <li>
              Bei Dienstleistungen, die während der Widerrufsfrist begonnen haben, haben Sie uns
              einen angemessenen Betrag zu zahlen. Was verbraucht ist, wird nicht erstattet. Gemeint
              ist der Anteil der bereits erbrachten Dienstleistungen im Vergleich zum Gesamtumfang
              der im Vertrag vorgesehenen Dienstleistungen entspricht. Ausschlaggebend ist hier der
              Zeitpunkt zu dem Sie uns von der Ausübung des Widerrufsrechts unterrichten.
            </li>
          </ol>

          <ol>
            <h4 className={stylesAgb.center}>Besondere Hinweise:</h4>
            <li>
              Ihr Widerrufsrecht erlischt vorzeitig, wenn Sie die geschuldete Dienstleistung
              vollständig aufgebraucht haben. Dies betrifft auch Verträge über Dienstleistungen
              sowie Verträge über die Lieferung von digitalen Inhalten, die sich nicht auf einem
              körperlichen Datenträger befinden. Sie erlischt auch dann, wenn Sie mit der Ausführung
              der Dienstleistung erst begonnen haben, nachdem Sie dazu Ihre ausdrückliche Zustimmung
              gegeben haben und Ihre Kenntnis davon bestätigt haben, dass Ihr Widerrufsrecht bei
              vollständiger Vertragserfüllung durch uns erlischt.
            </li>
          </ol>
        </div>

        <ol>
          <h4>Nutzungsbedingungen Leistungsbeschreibung</h4>
          <ul className={styles.liNone}>
            <li>
              Die H2HDienste bestehen unter anderem in:
              <ul className={styles.liDisc}>
                <li>der Bereitstellung der Möglichkeit zu Anzeigenschaltung</li>
                <li>
                  der Bereitstellung adäquater Kommunikationswege für H2HKlient und H2HCoah im
                  Hinblick auf eine digitale Inanspruchnahme der Kommunikation mittels Chats.
                </li>
                <li>
                  der Bereitstellung adäquater Kommunikationswege für H2HKlient und H2HCoah im
                  Hinblick auf Terminvereinbarung mittels Nachrichtenzustellung
                </li>
                <li>
                  der zur Verfügungstellung von Token – einer Belohnungsmaßnahme von H2HKlient für
                  H2HCoach
                </li>
                <li>
                  er Bereitstellung von Onlineinhalten (z.B.: Workbooks, Entspannungsmaterialien,
                  Arbeitsblätter).
                </li>
              </ul>
            </li>
            <li className={stylesAgb.listNumeric}>
              Beschreibung:
              <ol className={styles.liDecimal}>
                <li>
                  Im Mittelpunkt steht die Möglichkeit, einen Chat mit einem ausgewählten Nutzer
                  durchzuführen. Dabei bietet:
                  <ol className={styles.liDecimal}>
                    <li>H2HKlient einen H2HCoach, um zu chatten, oder</li>
                    <li>H2HCoach bietet einem H2HKlienten an, ihm bei seinem Problem zu helfen.</li>
                  </ol>
                </li>

                <li>
                  Um das zu realisieren, nutzt User den Online-Service der H2HDienste, über den
                  jeder User Inserate erstellen und veröffentlichen kann. Inserate sind aus Texten
                  und Bildern - Angebote und Gesuche (im Folgenden „Anzeigen“ genannt).
                  <ol className={styles.liDecimal}>
                    <li>
                      Des Weiteren kann jeder User die veröffentlichten Anzeigen, auch die der
                      anderen User einsehen. Folgende Anzeigen werden veröffentlicht und können
                      eingesehen werden:
                      <ul className={classNames(styles.liLowerAlpha, stylesAgb.listNumericCancel)}>
                        <li>
                          H2HKlient stellt eine Anzeige in Form von Darstellung seiner Bedürfnisse –
                          angelehnt an Kategorien, die das Portal zur Verfügung stellt
                        </li>
                        <li>
                          H2HCoach bietet den Chat an, um H2HKlient bei seinem Problem zu helfen.
                        </li>
                      </ul>
                    </li>
                    <li>
                      Möglich ist auch der Austausch elektronischer Nachrichten zwischen Inserenten
                      und Interessenten.
                    </li>
                    <li>
                      Weitere Möglichkeiten für den User sind: Nachrichten erstellen, versenden und
                      empfangen.
                    </li>
                  </ol>
                </li>
                <li>H2HKlient entlohnt den H2HCoach mit Token (Mehr zu Token siehe 1.3).</li>
                <li>
                  Weitere Möglichkeiten für den User sind: Nachrichten erstellen, versenden und
                  empfangen.
                </li>
              </ol>
            </li>
            <li>
              H2H ermöglicht es den Nutzern, die Suchergebnisse anhand verschiedener Kriterien zu
              sortieren (bspw. Sprache, Datum). Darüber hinaus werden in den Suchergebnissen auch
              Anzeigen angezeigt, für deren hervorgehobene Darstellung (z.B. als Top-Anzeige) sich
              der jeweilige Anbieter zur Zahlung einer zusätzlichen Gebühr bereit erklärt hat. Mehr
              Informationen zu den möglichen Optionen zur hervorgehobenen Darstellung im Rahmen der
              Anzeigendarstellung finden Sie hier.
            </li>
            <li>H2H ist selbst kein Anbieter der jeweils mit den Anzeigen beworbenen Themen.</li>
          </ul>
        </ol>

        <ol>
          <h4>Bewerbung der Seiten</h4>
          <li>
            H2H veröffentlicht und bewirbt Seiten der ChatH2H.com selbst und durch dritte. Das
            können Anzeigen oder Ausschnitte im Portal sein, in Apps oder mittels Emails. Des
            Weiteren können klassische Werbemaßnahmen erfolgen, wie z.B.: in Print-, Funk- und
            Fernsehe oder in anderen Medien.
          </li>
          <li>
            ChatH2H.com ermöglicht auch Dritten, ihre Angebote und Dienstleistungen über die
            H2H-Dienste zu bewerben. Dies führt dazu, dass ChatH2H zur Unterstützung dieser
            Aktivitäten auch Dritten Zugang zu den über die H2H-Dienste veröffentlichten Daten,
            Informationen und Inhalten zur Verfügung stellt.
          </li>
          <li>
            Der User gestattet ChatH2H.com die Verwendung seiner Anzeigen zum Zwecke der Bewerbung
            und Steigerung der Reichweite der H2H-Dienste.
          </li>
          <li>
            Der User gestattet ChatH2H.com Übersetzungen zum Zwecke der Einbindung der übersetzten
            Anzeigen in fremdsprachige Angebote.
          </li>
        </ol>

        <ol>
          <h4>Tokenisierung</h4>
          <li>Chat-Kommunikationen auf dieser Plattform sind stets H2HToken-Pflichtig.</li>
          <li>
            Jeder User erhält zum Beginn 100 H2HToken. Jeder User kann weitere H2HToken erhalten,
            sobald er als H2HCoach fungiert. Und jeder User kann seine Tokens ausgeben, sobald er
            einen Chat für sich beansprucht. (siehe Grundidee).
          </li>
          <li>
            Die Belohnung mit H2HToken während eines Chats erfolgt in den ersten 15 Minuten einmalig
            und danach im Minutentakt. Je weitere 1 Minute wird mit 1 H2HToken entlohnt.
          </li>
        </ol>

        <ol>
          <h4>Die Vereinbarung: H2HKlient und H2HCoach</h4>
          <li>
            Die Vereinbarung besteht im Verhältnis H2HKlient und H2HCoach und der Inhalt des Chats
            wird ausschließlich und nur im Verhältnis zwischen H2HKlient und H2HCoach erbracht.
            Rechte und Pflichten sowie Ansprüche aus einem Chat und darin erteilten Auskünften
            bestehen daher auch ausschließlich zwischen H2HKlient und H2HCoach.
          </li>
          <li>Sowohl H2HKlient als auch H2HCoach können zu jeder Zeit das Chat beenden.</li>
          <li>
            ChatH2H ist kein Experten-Chat. Chats dienen dem Erfahrungsaustausch, Beistand und der
            gegenseitigen menschlichen Zuwendung und werden mit internehmen H2HToken entlohnt.
            Eigenverantwortung gilt bei allen Themen aus den vorgeschlagenen Kategorien.
          </li>
        </ol>

        <ol>
          <h4>Nutzungsausschluss</h4>
          <li>
            Der mentale Beistand über die Plattform H2HCoach ist nicht dazu geeignet und bestimmt,
            eine Therapie/Behandlung bei psychischen Erkrankungen zu ersetzen. Wir empfehlen den
            Nutzern im Bedarfsfall einen Arzt oder fachlich geeigneten Berater zu konsultieren.
          </li>
          <li>
            Der Dienst von ChatH2H ist nicht als Ersatz für konkret angezeigte und gegebenenfalls
            ärztlich empfohlene bzw. angeordnete medizinische und psychotherapeutische Beratungen
            und Dienstleistungen zu verstehen. User erklärt sich durch diese Nutzungsbedingungen
            damit einverstanden, den Chat-Dienst nicht für konkret medizinische Zwecke zu nutzen.
            Hiermit wird ausdrücklich darauf hingewiesen:
          </li>
          <li>
            ChatH2H bietet keine medizinischen oder psychotherapeutischen Leistungen an und ist in
            akuten psychischen und medizinischen Krisen- oder Notsituationen nichtgeeignet.
            Insbesondere bei dem Auftreten von Krankheitssymptomen, konkreten körperlichen oder
            psychischen Leiden sollte die ärztliche Hilfe aufgesucht werden. Bitte kontaktieren Sie
            umgehend Ihren Arzt per Telefon oder wenden Sie sich an eine Krisen-Notrufnummer des
            jeweiligen Landes.
          </li>
        </ol>

        <ol>
          <h4>Nutzeraccount und Chat-Nutzung</h4>
          <li>
            Alle registrierten Nutzer erhalten zeitlich unbefristet einen eigenen Nutzeraccount.
          </li>
          <li>
            Im Zuge der Registrierung auf der Plattform ist die Eingabe eines individuellen, frei
            wählbaren Benutzernamens (Phantasiename, Pseudonym etc.) sowie eines unseren
            Passwortrichtlinien entsprechenden frei wählbaren Passwortes erforderlich.
            Nutzeraccounts und sämtliche damit verbundenen Token, andere Werte und Inhalte können
            nicht auf Dritte übertragen werden. Benutzername und Passwort sind streng vertraulich zu
            behandeln und dürfen Dritten nicht zugänglich gemacht werden. Haben User den Verdacht,
            dass das Passwort einem Dritten bekannt geworden ist, müssen sie unverzüglich Passwort
            wechseln und ChatH2H verständigen, damit das Account ggfls. gesperrt werden kann. Im
            Missbrauchsfall haftet User nach Maßgabe der von ihm aufgewendeten Sorgfalt.
          </li>
          <li>
            Bei H2HCoach-Anzeigen erscheint nicht der Registrationsname. H2HCoach-Anzeigen schreibt
            User mit seinem eigenen Vornamen.
          </li>
          <li>
            Bei Klient-Anzeigen erscheint kein Name. In H2HKlient-Anzeigen schreibt User sein
            Anliegen.
          </li>
          <li>
            Der Nutzer hat insbesondere für Zwecke sämtlicher Korrespondenz zwischen ihm und einen
            anderen User eine gültige E-Mail-Adresse anzugeben und stimmt zu, rechtserhebliche
            Mitteilungen an diese EMail-Adresse zu empfangen. Mit der Registrierung, Einrichtung
            eines Nutzeraccounts sowie Inanspruchnahme der Services erklärt sich der Nutzer mit der
            Erhebung, Verarbeitung und Nutzung seiner personenbezogenen Daten in Entsprechung mit
            den Datenschutzbestimmungen von ChatH2H einverstanden. Genaue Informationen zur
            Datenverarbeitung finden sich in der Datenschutzerklärung von ChatH2H
          </li>
          <li>
            Mit der Registrierung, der Einrichtung eines Nutzeraccounts und der Verwendung der
            Services bestätigt der H2H User dass sie nach den Bestimmungen des anwendbaren Rechts
            für die vereinbarungsgemäße Nutzung der Services ausreichend geschäftsfähig ist.
          </li>
          <li>
            Personen unter 16 Jahren können die Services nur dann nutzen, sofern bei Einrichtung des
            Nutzeraccounts die Zustimmung durch einen
          </li>
          <li>
            Erziehungsberechtigten erfolgt. ChatH2H.com behält sich vor, Zustimmung des
            Erziehungsberechtigten einzufordern.
          </li>
          <li>
            H2HKlienten können die H2HCoach bewerten. Es ist streng untersagt, falsche Bewertungen
            abzugeben.
          </li>
          <li>
            Sollte H2HCoach oder H2HKlient im Zuge eines ChatH2Hs zur Ansicht gelangen, dass:
            <ul className={styles.liDisc}>
              <li>
                es einer weitergehenden persönlichen Hilfe bedarf, für welche diese Plattform nicht
                geeignet ist, oder
              </li>
              <li>
                der ChatH2H nicht zielführend ist (zB bei Beleidigungen oder wenn sich eine der
                Teilnehmer nicht verstanden fühlt) wird ChatH2H unterbrochen.
              </li>
              <li>
                Kommt es zu schweren Beleidigungen, Drohungen oder ähnlich, dann besteht die
                Möglichkeit, diesen Umstand zu melden.
              </li>
            </ul>
          </li>
          <li>Es besteht kein Anspruch auf Chat.</li>
          <li>
            User können ihren Account jederzeit löschen. Das Konto und alle dazu gespeicherten Daten
            des Users werden spätestens sechs Monate nach Vertragsbeendigung gelöscht. Dies gilt
            nicht für Daten, zu deren Aufbewahrung H2H gesetzlich verpflichtet ist oder an der
            Aufbewahrung ein berechtigtes Interesse hat. Dies kann der Fall sein, um nach einer
            berechtigten Sperrung ein erneutes Anmelden zu verhindern.
          </li>
          <li>
            H2H behält sich außerdem das Recht vor, Accounts mit unvollständigen Registrierungsdaten
            und Accounts, die für einen Zeitraum von mindestens 12 Monaten inaktiv waren,
            unwiderruflich zu löschen. H2H wird den Nutzer mindestens 30 Tage vor Löschung des
            Nutzerkontos entsprechend per E-Mail benachrichtigen.
          </li>
          <li>
            Für die vollständige Nutzung der H2H-Dienste, insbesondere für das Einstellen von
            Anzeigen, das Anzeigen bestimmter Kontaktdaten von Inserenten und den Austausch
            elektronischer Nachrichten mit anderen Nutzern, ist eine Registrierung des Nutzers bei
            H2H erforderlich. Voraussetzung für eine Registrierung ist, dass es sich bei dem Nutzer
            um eine natürliche Person, juristische Person oder Personengesellschaft handelt. Ist der
            Nutzer minderjährig, darf er sich nur mit Zustimmung der Erziehungsberechtigten bei H2H
            registrieren. H2H behält sich in diesem Fall vor, die Erbringung von Leistungen von der
            Vorlage eines Nachweises der Zustimmung der Erziehungsberechtigten abhängig zu machen.
          </li>
          <li>
            Der Nutzer ist verpflichtet, die bei der Registrierung von H2H erhobenen Daten
            wahrheitsgemäß und vollständig anzugeben. Bei einer Änderung der Daten nach erfolgter
            Registrierung ist der Nutzer verpflichtet, die Daten unverzüglich im passwortgeschützten
            Nutzerbereich der H2H-Dienste selbst zu aktualisieren.
          </li>
          <li>
            Mit dem Absenden des Registrierungsformulars gibt der Nutzer ein Angebot auf den
            Abschluss einer Nutzungsvereinbarung mit H2H ab, mit dem er die Geltung der
            Nutzungsbedingungen akzeptiert sowie die Kenntnisnahme der Datenschutzerklärung erklärt.
            Akzeptiert H2H die Registrierung, erhält der Nutzer eine Bestätigungs-E-Mail mit einem
            personalisierten Link. Mit Zugang der Bestätigungs-E-Mail kommt zwischen H2H und dem
            Nutzer ein Vertrag über die Nutzung der H2H-Dienste (im Folgenden „Nutzungsvertrag“)
            zustande. Um die Registrierung abzuschließen, muss der Nutzer den mit der
            Bestätigungs-E-Mail mitgeteilten Link aufrufen und so seine E-Mail-Adresse verifizieren.
            Ein Anspruch auf Abschluss eines Nutzungsvertrages besteht nicht.
          </li>
          <li>
            Mit erfolgreicher Registrierung wird für den Nutzer ein Nutzerkonto angelegt, auf das er
            mit Hilfe seiner E-Mail-Adresse und seines bei der Registrierung gewählten Passwortes
            zugreifen kann. Das Passwort kann vom Nutzer jederzeit über den passwortgeschützten
            Nutzerbereich geändert werden. Es ist vom Nutzer geheim zu halten und vor dem Zugriff
            durch unbefugte Dritte geschützt aufzubewahren. Stellt der Nutzer fest oder hegt er den
            Verdacht, dass seine Zugangsdaten von einem Dritten unbefugt genutzt werden, hat er dies
            H2H unverzüglich mitzuteilen und sein Passwort unverzüglich zu ändern.
          </li>
          <li>
            Jeder Nutzer darf sich für die private Nutzung und für eine gewerbliche bzw.
            freiberufliche Nutzung (“gewerbliche Nutzer”) der H2H-Dienste jeweils nur einmal bei den
            H2H-Diensten registrieren. Nutzerkonten sind nicht übertragbar.
          </li>
          <li>
            H2H kann die Nutzung bestimmter Funktionen der H2H-Dienste oder den Umfang, in dem
            einzelne Funktionen genutzt werden können, von der Erfüllung zusätzlicher
            Voraussetzungen, z. B. der Angabe zusätzlicher Daten, einer Prüfung und Verifizierung
            der Daten des Nutzers, der Nutzungsdauer, der Art der Nutzung (privat/gewerblich), dem
            bisherigen Zahlungsverhalten des Nutzers und/oder der Vorlage bestimmter Nachweise
            abhängig machen.
          </li>
          <li>
            H2H behält ferner sich vor, zwecks Verbesserung des Nutzererlebnisses neue oder
            veränderte Funktionen und Features beschränkt auf bestimmte Nutzergruppen zu testen,
            soweit dies den Nutzern unter Berücksichtigung der berechtigten Interessen von H2H
            zumutbar ist. Dies kann zu unterschiedlichen Darstellungen bei verschiedenen Nutzern
            führen.
          </li>
          <li>
            Der Nutzer erhält auf seiner Nutzerprofilseite eine Übersicht der von ihm
            veröffentlichten Anzeigen. Zudem erhält er Informationen über seine
            Aktivitätsindikatoren und kann Änderungen an seinen Einstellungen, Präferenzen und Daten
            vornehmen.
          </li>
          <li>
            Im Rahmen der H2H-Dienste hat H2H Zugang zu verschiedenen Informationen über Nutzer,
            einschließlich personenbezogener Daten. Hierzu gehören insbesonderesolche Informationen,
            die Nutzer im Rahmen der H2H-Dienste an H2H übermitteln (z.B. Kontakt- oder
            Anzeigeninformationen) sowie solche, die bei der Erbringung und Abwicklung der
            H2H-Dienste generiert werden (z.B. Bewertungen, Aktivitätsindikatoren oder
            Kommunikation). Nutzer erhalten über den H2H-Dienst Informationen, die für die
            Erbringung des H2H-Dienstes erforderlich sind (insbesondere die Nachrichten und
            Kontaktinformationen eines interessierten Käufers). Nutzer haben über den Bereich
            “Meins” zudem Zugang zu wichtigen von ihnen übermittelten Informationen (insbesondere
            unter Nachrichten, Anzeigen und Einstellungen).
          </li>
          <li>
            H2H stellt bestimmten Nutzergruppen Analysedaten zu ihren Aktivitäten und zu den von
            ihnen eingestellten Anzeigen zur Verfügung. H2H gibt die Inserate einschließlich der
            hierin enthaltenen Informationen über Nutzer sowie andere Informationen aus den
            H2H-Diensten nur dann an Dritte weiter bzw. stellt Dritten einen Zugang zu diesen
            Informationen zur Verfügung, sofern das für die Erbringung des H2H- Dienstes
            erforderlich (wie z.B. zur Steigerung der Reichweite im Falle der Bewerbung des
            H2H-Dienstes und der Veröffentlichung der Inserate über Dritte gemäß § 1 Nr. 7 dieser
            Nutzungsbedingungen) oder H2H hierzu gesetzlich oder vertraglich berechtigt ist.
          </li>
          <li>
            Über die Verarbeitung personenbezogener Daten durch H2H einschließlich der Übermittlung
            an Dritte und den Rechten des Nutzers als Betroffener informiert H2H in der
            Datenschutzerklärung.
          </li>
        </ol>

        <ol>
          <h4>Datenschutz</h4>
          <li>
            Detaillierte Informationen zur Erhebung, Verarbeitung und Nutzung personenbezogener
            Daten des Users, die im Zusammenhang mit der Registrierung, der Durchführung der
            Nutzungsvereinbarung und der Nutzung der H2H-Dienste stehen, sind in der
            Datenschutzerklärung von H2H einzusehen.
          </li>
        </ol>

        <ol>
          <h4>Änderung der Nutzungsbedingungen und der Services</h4>
          <li>
            Unsere Dienste werden ständig weiterentwickelt. Es kann daher sein, dass sich die
            Dienste/Services in ihrem Umfang und in ihrer Funktionalität verändern. Die aktuelle
            Fassung der Nutzungsbedingungen ist jederzeit auf der Website unter&nbsp;
            <Link className={stylesAgb.link} href="/agb" target="_blank">
              https://ChatH2H.com/agb
            </Link>
            &nbsp;abrufbar.
          </li>
          <li>
            Sollte ChatH2H die Nutzungsbedingungen ändern und/oder ergänzen, insbesondere dann, wenn
            die Dienste bzw. Services erweitert werden oder Gesetzesänderungen dies erfordern, gilt
            das Folgende.
          </li>
          <li>
            Auf die Änderungen und/oder Ergänzungen werden User jeweils durch eine entsprechende
            Änderungsmitteilung an die von den Usern für Korrespondenzzwecke mitgeteilte
            E-Mail-Adresse und/oder beim Log-In auf der Website aufmerksam gemacht.
          </li>
          <li>
            Die Zustimmung zu den Änderungen und/oder Ergänzungen gilt als erteilt, sofern die User
            der Änderung nicht innerhalb von 6 Wochen nach Zugang der Änderungsmitteilung
            schriftlich (per E-Mail) widersprechen. ChatH2H wird die User mit der
            Änderungsmitteilung auf die Folgen eines unterlassenen Widerspruchs hinweisen.
          </li>
          <li>
            Widersprechen User den mitgeteilten Änderungen und/oder Ergänzungen, wird das Account
            zum nächstmöglichen Kündigungstermin beendet. User haben sodann die Möglichkeit, ihren
            Nutzeraccount zu löschen. Die verbliebenen Tokens werden nicht monetär vergütet. Sie
            können eigefroren werden, sobald der User das wünscht und hierzu seine email adresse zur
            Sicherheit hinterlässt. Sollte User seinen Account wieder aufleben wollen, dann kann er
            seine H2HTokens wieder nutzen. Sollte User sein Account inkl. seiner Emailadresse
            löschen, dann gelten die H2HTokens als verfallen.
          </li>
        </ol>

        <ol>
          <h4>Datenverschlüsselung</h4>
          <li>
            ChatH2H legt größten Wert auf einen vertraulichen Umgang mit Nutzerdaten. Jede direkte
            Kommunikation zwischen H2HKlient für H2HCoach erfolgt verschlüsselt, sodass ChatH2H.com
            – als Betreiber der Plattform – keinen Zugang zu diesen Kommunikationsinhalten der
            ChatH2Hs hat. Sichergestellt wird diese verbindliche Vertraulichkeit durch ein
            Verschlüsselungssystem (im Folgenden die „ChatH2H- Verschlüsselung“). Durch die
            ChatH2HVerschlüsselung wird den H2HKlient für H2HCoach bereits im Zuge der Registrierung
            auf der Plattform ein individueller (Zugangs-)Code /-schlüssel (der „Nutzerschlüssel“)
            zugewiesen. Jede direkte Kommunikation zwischen H2HKlient für H2HCoach erfolgt sodann
            ausschließlich mittels ChatH2H-Verschlüsselung, wodurch der vertrauliche Austausch
            sichergestellt werden kann.
          </li>
          <li>
            Mehr Information zur Verwendung und Verarbeitung der Daten findet sich in der
            Datenschutzerklärung (abrufbar unter ChatH2H.com/PrivacyPolicy/)
          </li>
        </ol>

        <ol>
          <h4>Rechte an Inhalten / Haftung für Inhalte</h4>
          <li>
            Unter „Inhalte“ sind sämtliche Informationen und Daten aber auch Medien, wie zum
            Beispiel Videos, Musik, Töne, Texte, Fotos, Bilder, Grafiken, Zeichnungen, Software,
            Hyperlinks etc. zu verstehen, die auf der Plattform zur Verfügung gestellt werden oder
            die die User selbst auf die Plattform hochladen („Userinhalte“).
          </li>
          <li>
            Die Rechte an Inhalten, die den Usern zur Verfügung gestellt werden (einschließlich des
            Designs und Layouts und des Programmcodes der Website und der Services), liegen allein
            beim Inhaber des ChatH2H.com. Die Rechte an Inhalten, die User hochladen liegen bei
            jeweiligen Personen bei Dritten. Das entzieht sich der Kenntnis der ChatH2H.com Inhaber.
          </li>
          <li>
            ChatH2H erteilt den registrierten Usern das beschränkte, nicht-exklusive, nicht
            übertragbare und nicht unterlizenzierbare Recht, die zur Verfügung gestellten Inhalte
            ausschließlich im Rahmen der Services und für den privaten Gebrauch zu nutzen. Die User
            sind nicht berechtigt, die zur Verfügung gestellten Inhalte über den bestimmungsgemäßen
            privaten Gebrauch hinaus für andere Zwecke zu nutzen.
          </li>
          <li>
            ChatH2H leistet keine Gewähr dafür, dass die Inhalte richtig, aktuell, fehlerfrei, im
            Einklang mit allen anwendbaren gesetzlichen Bestimmungen und/oder frei von Rechten
            Dritter sind.
          </li>
          <li>
            Die Gewährleistung und Haftung von ChatH2H.com für Schäden im Zusammenhang mit Inhalten
            ist deshalb, soweit gesetzlich zulässig, ausgeschlossen.
          </li>
          <li>
            Streng untersagt ist: Das Einstellen von Anzeigen, Texten, Bildern oder sonstigen
            Inhalten, die gegen diese Nutzungsbedingungen, gesetzliche Bestimmungen, gegen die guten
            Sitten oder Rechte Dritter verstoßen, ist untersagt. Des Weiteren ist es verboten
            Inhalte einzustellen, die gegen urheber-, marken- und wettbewerbsrechtliche Vorschriften
            verstoßen.
          </li>
          <li>
            Insbesondere ist es verboten, gegen gesetzliche Bestimmungen zum Jugendschutz zu
            verstoßen. Auch unwahre Angaben, verbotene Inhalte oder Inhalte, die irreführend sind,
            führen zur sofortigen Schließung des Accounts. Die H2HToken verfallen in diesem Fall.
          </li>
        </ol>

        <ol>
          <h4>10. Haftung Sonstiges</h4>
          <li>
            Die in den H2H-Diensten veröffentlichten Anzeigen und sonstigen Inhalte von Nutzern
            geben nicht die Meinung von H2H wieder und werden von H2H nicht auf ihre Rechtmäßigkeit,
            Richtigkeit und Vollständigkeit überprüft.
          </li>
          <li>
            H2H übernimmt keine Gewähr für die Richtigkeit und Vollständigkeit der in den Anzeigen
            enthaltenen Angaben und auch keine Gewähr für die Qualität, Sicherheit oder
            Rechtmäßigkeit der von H2HKlienten angebotenen Chat-Bedarf oder Dienstleistungen seitens
            H2HCoach.
          </li>
          <li>Eine weitergehende Haftung von H2H ist ausgeschlossen.</li>
          <li>
            Soweit die Haftung von H2H ausgeschlossen oder beschränkt ist, gilt dies auch zugunsten
            der persönlichen Haftung ihrer gesetzlichen Vertreter, leitenden Angestellten und
            sonstigen Erfüllungsgehilfen.
          </li>
        </ol>

        <ol>
          <h4>Haftung des Users</h4>
          <li>
            User stellt ChatH2H.com von sämtlichen Ansprüchen frei. Dies betrifft Ansprüche, die aus
            Anzeigen bzw. Inhalten entstehen, die sich aus der Nutzung der H2H-Dienste ergeben und
            geltend gemacht werden. Dies gilt auch für Dritte, wegen einer Verletzung ihrer Rechte,
            die sich aus User Anzeigen ergeben.
          </li>
          <li>
            ChatH2H trägt keine Kosten, die sich beim User durch Nutzung der H2H-Dienste ergeben.
            ChatH2H trägt keine Kosten der Verfahren, die sich aus Rechtsverstößen ergeben, die sich
            beim User aufgrund der Nutzung von H2H-Diensten ergeben – keine Kosten für
            Rechtsverteidigung einschließlich sämtlicher Gerichts- und Anwaltskosten in gesetzlicher
            Höhe.
          </li>
          <li>
            Es besteht kein Anspruch auf Freistellung, wenn der Nutzer die Rechtsverletzung nicht zu
            vertreten hat.
          </li>
          <li>
            Der Nutzer ist verpflichtet, H2H im Falle einer Inanspruchnahme durch Dritte auf
            Anforderung unverzüglich wahrheitsgemäß und vollständig alle Informationen zur
            Verteidigung zur Verfügung zu stellen, die für die Prüfung der Ansprüche und eine
            Verteidigung dagegen erforderlich sind.
          </li>
          <li>Eine über diese Regelungen hinausgehende Haftung des Nutzers bleibt unberührt.</li>
        </ol>

        <ol>
          <h4>Besondere Pflichten des Users</h4>
          <li>
            User ist verpflichtet, Handlungen zu unterlassen, die den sicheren Betrieb der H2H-
            Dienste gefährden, andere Nutzer belästigen oder gegen Bestimmungen verstoßen. Das
            könnten Handlungen sein, zum Beispiel:
            <ul className={styles.liDisc}>
              <li>
                Spam-produktion, Viren oder andere Technologien, die die Infrastruktur der
                H2H-Dienste einer übermäßigen Belastung auszusetzen,
              </li>
              <li>
                Spam-produktion, Viren oder andere Technologien, die die H2H-Dienste oder die
                Interessen bzw. das Eigentum anderer Nutzer schädigen könnten,
              </li>
              <li>E-Mail-Werbung,</li>
              <li>SMS-Werbung,</li>
              <li>Kettenbriefe oder andere belästigende Inhalte,</li>
              <li>
                Maßnahmen, die auf andere Weise das Funktionieren der H2H-Dienste zu stören oder zu
                gefährden,
              </li>
              <li>
                Inhalte von H2H zu vervielfältigen, öffentlich zugänglich zu machen, zu verbreiten,
                oder zu bearbeiten
              </li>
              <li>
                Inhalte von H2H in einer Art und Weise zu nutzen, die über die bestimmungsgemäße
                Nutzung der H2H-Dienste hinausgeht.
              </li>
            </ul>
          </li>

          <li>
            Es ist ausdrücklich verboten:
            <ul className={styles.liDisc}>
              <li>
                Informationen, insbesondere E-Mail-Adressen oder Rufnummern auszutauschen – Es ist
                kein Dating Portal. ChatH2H ist dafür da, um sich gegenseitig zu helfen,
              </li>
              <li>Daten über andere Nutzer zu sammeln bzw. zu verwenden,</li>
              <li>den Zugriff auf die H2H-Dienste zu verhindern oder einzuschränken.</li>
              <li>
                Crawler, Spider, Scraper oder andere automatisierte Mechanismen zu nutzen, um auf
                die H2H-Dienste zuzugreifen und Inhalte zu sammeln,
              </li>
              <li>
                die Anzeigen, Chat´s Inhalte oder Inhalte Dritter ohne deren vorherige Einwilligung
                zu vervielfältigen, öffentlich zugänglich zu machen, zu verbreiten, zu bearbeiten
                oder sonst in einer Art und Weise zu nutzen, die über die bestimmungsgemäße Nutzung
                der H2H-Dienste hinausgeht.
              </li>
            </ul>
          </li>
        </ol>

        <ol>
          <h4>Gewährleistungs- und Haftungsausschluss</h4>
          <li>
            Die bereitgestellten Dienste von ChatH2H wurden und werden mit größter Sorgfalt
            erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ChatH2H
            keine Haftung übernehmen. ChatH2H.com haftet für sich oder seine Erfüllungsgehilfen nur
            für Schäden, die aufgrund grober Fahrlässigkeit oder Vorsatz entstehen; diesfalls
            richtet sich die Haftung nach den anwendbaren gesetzlichen Bestimmungen. Die Haftung für
            Schäden aufgrund leichter Fahrlässigkeit, sowie für Folgeschäden, entgangene Gewinne,
            Datenverlust oder sonstige indirekte oder mittelbare Schäden ist ausgeschlossen.
          </li>
          <li>
            Die Chatvereinbarung besteht im Verhältnis H2HKlient und H2HCoach und die Durchführung
            wird ausschließlich und nur im Verhältnis zwischen H2HKlient und H2HCoach erbracht. Eine
            Haftung von ChatH2H.com für alle Ansprüche, die sich ausder zwischen H2HKlient und
            H2HCoach Chatvereinbarung ergeben, ist ausgeschlossen.
          </li>
          <li>
            ChatH2H haftet in keiner Weise für Benutzerinhalte wie Chatverläufe. Der Nutzer ist
            allein für die Sicherung persönlichen Benutzerinhalte verantwortlich. ChatH2H übernimmt
            keine Haftung für das Löschen, die Beschädigung oder das Versäumnis, Benutzerinhalte zu
            speichern, die durch die Nutzung des Dienstes gepflegt oder übertragen werden, mit
            Ausnahme der Haftung, die nach geltendem Recht erforderlich ist.
          </li>
          <li>
            Die Nutzung des Dienstes von ChatH2H erfolgt ausdrücklich auf eigenes Risiko.
            Produktbeschreibungen gelten nicht als garantiert, es sei denn, dies wurde separat
            schriftlich vereinbart. ChatH2H übernimmt keine Garantie dafür, dass der Service zur
            Erreichung bestimmter Interessen verwendet werden kann.
          </li>
          <li>
            ChatH2H weist Nutzer ausdrücklich darauf hin, dass etwaige Übungen und Empfehlungen, die
            im Rahmen der erbrachten Dienste vorgestellt werden, für durchschnittlich gesunde und
            körperlich und geistig belastbare Personen ausgelegt sind und Nutzer etwaige
            Empfehlungen oder Hilfestellungen selbst auf eigene Verantwortung umsetzen.
          </li>
          <li>
            Die Haftungsbeschränkungen gelten für vertragliche und außervertragliche Ansprüche.
          </li>
          <li>
            Im Rahmen der Services können Hyperlinks zu Websites Dritter enthalten sein. Wenn der
            Nutzer auf Websites Dritter zugreift, geschieht das auf eigene Verantwortung. Solche
            Websites unterliegen nicht der Kontrolle von ChatH2H.com und der Nutzer akzeptiert
            hiermit, dass ChatH2H nicht für Inhalte, Funktionalität, Informationen, Richtigkeit und
            Rechtmäßigkeit oder sonstige Aspekte solcher externen Websites verantwortlich ist. Die
            Einbeziehung solcher Hyperlinks bedeutet in keinster Weise, dass ChatH2H.com die
            jeweiligen Websites unterstützt oder mit deren Betreibern in irgendeiner Weise in
            Verbindung steht. ChatH2H.com übernimmt keine Haftung für Schäden oder Verluste, die dem
            Nutzer durch oder im Zusammenhang mit der Nutzung solcher Hyperlinks oder der durch
            diese Hyperlinks referenzierten, externen Websites entstehen.
          </li>
          <li>
            ChatH2H.com kann nicht gewährleisten, dass der Zugang zur Plattform jederzeit ohne
            Unterbrechung und fehlerfrei möglich ist. ChatH2H.com haftet nicht für kurzfristige
            Unterbrechungen, Veränderungen oder Beendigung der Services oder bestimmter
            Funktionalitäten.
          </li>
          <li>
            ChatH2H.com haftet nicht für Störungen bzw. Beeinträchtigungen, die nicht in der Sphäre
            von ChatH2H liegen. Der Nutzer ist daher für eine regelmäßige
          </li>
          <li>
            Aktualisierung der von ihm verwendeten Software, die regelmäßige Datensicherung, einen
            zeitgemäßen Virenschutz und effektive Firewall-Systeme verantwortlich.
          </li>
          <li>
            Für Qualitätsmängel und Verbindungsabbrüche, die ihre Ursache außerhalb des technischen
            Einflussbereiches von ChatH2H.com haben und deren Eintritt ChatH2H auch nicht zu
            vertreten hat, wird keine Gewährleistung übernommen.
          </li>
        </ol>

        <ol>
          <h4>Entgelt, Zahlungsbedingungen</h4>
          <li>ChatH2H hat interne Belohnungselemente in Form von H2HToken. Siehe Tokenisierung.</li>
          <li>
            Das eröffnet dem User die Möglichkeit, seine Bedürfnisse zu inserieren, „Guten Rat“ zu
            bekommen, H2HCoach dafür zu belohnen und seine Arbeit zu würdigen. Nach dem Verbrauch
            der zum Beginn erhaltenen 100 Token kann User weitere H2HToken kaufen.
          </li>
          <li>
            User bezahlen Token mittels Zahlungsmittel (Kreditkarte, Paypal, Sofortüberweisung,
            etc).
          </li>
          <li>
            Im Zuge der Registrierung auf der Plattform erklären sich User mit dem Serviceentgelt,
            dem zugrundeliegenden Preismodell sowie den Zahlungsbedingungen von ChatH2H.com
            einverstanden.
          </li>
        </ol>

        <ol>
          <h4>Beschwerdemanagement</h4>
          <li>
            Kundenzufriedenheit steht bei ChatH2H an erster Stelle. Sollten User aus welchem Grund
            auch immer mit den Leistungen unzufrieden sein, können sie sich jederzeit an
            support@ChatH2H.com wenden.
          </li>
          <li>
            Support von ChatH2H.com ist für jeden Nutzer kostenfrei. Dies erstreckt sich auf die
            Einreichung von Beschwerden und anderen Anfragen. Nicht jede Beschwerde, Vorschläge oder
            Anfrage wird individuell beantwortet. Sinnvolle Anregungen können zu Erweiterung des
            ChatH2Hs führen, werden jedoch weder vergütet, noch erheben den Anspruch an Anteile.
          </li>
          <li>
            Für gewerbliche Nutzer wird Beschwerdemanagementsystem eingereicht. Hier werden
            eingereichte Beschwerden geprüft, erforderliche Maßnahmen ergriffen und die betroffenen
            Nutzer informiert. Dies wird innerhalb von einem angemessenen Zeitrahmen erfolgen.
          </li>
        </ol>

        <ol>
          <h4>Schlussbestimmungen Anwendung</h4>
          <li>
            Auf die Nutzungsbedingungen, den Nutzungsvertrag und alle darauf basierenden
            Vereinbarungen zwischen H2H und dem User findet ausschließlich das Recht der
            Bundesrepublik Deutschland Anwendung. Ausschließlicher Gerichtsstand ist, soweit
            gesetzlich zulässig, das sachlich und örtlich zuständige Gericht in Stuttgart. Die
            Vertragssprache ist Deutsch.
          </li>
          <li>
            Für Klagen gegen Verbraucher im Sinne des KSchG, die ihren Wohnsitz oder gewöhnlichen
            Aufenthalt im Inland haben oder im Inland beschäftigt sind, gilt der Gerichtsstand, in
            dessen Sprengel die Verbraucher ihren Wohnsitz, gewöhnlichen Aufenthalt oder den Ort der
            Beschäftigung haben.
          </li>
          <li>Die Anwendung des UN-Kaufrechts (CISG) ist ausgeschlossen.</li>
          <li>
            H2H ist weder bereit noch verpflichtet, an Streitbeilegungsverfahren mit Verbrauchern
            vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Abs. 1 Nr. 1 VSBG).
          </li>
          <li>
            Sollten einzelne Bestimmungen dieser Nutzungsbedingungen ganz oder teilweise nichtig
            oder unwirksam sein oder werden, so wird dadurch die Wirksamkeit der übrigen
            Bestimmungen nicht berührt. An die Stelle von nicht einbezogenen oder unwirksamen
            Bestimmungen dieser Nutzungsbedingungen tritt das Gesetzesrecht. Sofern solches
            Gesetzesrecht im jeweiligen Fall nicht zur Verfügung steht (Regelungslücke) oder zu
            einem untragbaren Ergebnis führen würde, werden dieParteien in Verhandlungen darüber
            eintreten, anstelle der nicht einbezogenen oder unwirksamen Bestimmung eine wirksame
            Regelung zu treffen, die ihr wirtschaftlich möglichst nahe kommt.
          </li>
        </ol>

        <ol>
          <h4>Sonstiges</h4>
          <li>
            Änderungen und/oder Ergänzungen dieser Nutzungsbedingungen bedürfen der Schriftform.
          </li>
          <li>
            Dies gilt auch für ein Abgehen des Schriftformerfordernisses. E-Mail gilt als
            Schriftform; Mitteilungen von ChatH2H.com an User erfolgen an die von Usern bei
            Registrierung oder im Zuge einer Aktualisierung des Nutzeraccounts angegebenen E-
            Mail-Adresse.
          </li>
        </ol>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'en', ['common']))
  }
});
