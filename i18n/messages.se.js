module.exports = {
  shortNames: ['sv', 'se'],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%Y-%m-%d',
    language_link_lang_en: 'English',

    /**
     * Error messages
     */

    error_not_found: 'Tyvärr kunde vi inte hitta sidan du efterfrågade',
    error_generic: 'Något gick fel på servern, var god försök igen senare',
    /**
     * Authentication message
     */

    contact_support: 'Kontakta',
    for_questions: 'vid frågor.',
    friendly_message_have_not_rights: 'Du saknar behörighet att använda Om kursens administrationsverktyg',
    message_have_not_rights: `Du saknar behörighet att använda Om kursens administrationsverktyg. Behörighet ges per automatik till de som är inlagda som examinator, kursansvarig eller lärare för kursen i Kopps.`,
    message_have_not_rights_link_pre_text: 'Det är möjligt att',
    message_have_not_rights_link_href:
      'https://intra.kth.se/utbildning/systemstod/om-kursen/behorighet-for-om-kursen-1.1051642',
    message_have_not_rights_link_text: 'beställa administratörsbehörighet till Om kursens administrationsverktyg',
    message_have_not_rights_link_after_text:
      'Beställningen behöver göras av Utbildningsadministrativt Ansvarig (UA) på skolan, eller av närmsta chef i samråd med UA.',

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Administrera Om kursen',

    lang_block_id: '1.272446',
    locale_text: 'Denna sida på svenska',

    site_name: 'Administrera Om kursen',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'VT ',
      2: 'HT ',
    },

    header_main: {
      new: 'Publicera ny kursanalys och kursdata',
      draft: 'Publicera ny kursanalys och kursdata',
      published: 'Ändra publicerad kursanalys och kursdata',
      preview: 'Förhandsgranska sparat utkast av kursanalys och kursdata',
    },

    /** ***** PAGE 1 - ANALYSIS MENU */

    select_semester: 'Välj termin',
    header_analysis_menu: 'Välj kursomgång',
    label_start_date: 'Startdatum',

    //* **** PROGRESS BAR  */
    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    pagesProgressBar: [
      {
        title: 'Välj kursomgång',
        intro:
          'Börja med att välja termin och kursomgång för den kursanalys som ska publiceras (steg 1 av 3). I nästa steg (2 av 3) kommer kursdata för kursen att hämtas automatiskt från Ladok och Kopps för den termin och kursomgång som valts. Det finns sedan möjlighet att redigera viss kursdata samt ladda upp kursanalysen. I sista steget (3 av 3) ges möjlighet att först granska och sedan publicera tabellen med kursanalys och all kursdata på sidan Kursens utveckling.',
      },
      {
        title: 'Redigera kursdata och ladda upp kursanalys',
        intro:
          'I detta steg (2 av 3) ska kursanalys laddas upp, förändringar för vald kursomgång summeras samt kursdata kontrolleras och vid behov justeras. I nästa steg granskas all kursdata innan publicering.',
      },
      {
        title: 'Granska och publicera',
        intro: '',
      },
    ],

    //* **** Spinner  */

    spinner_loading_file: 'Laddar upp filen...',
    spinner_loading_ladok: '',

    /* **** INTRO SELECT NEW, DRAFT, PUBLISHED */
    intro_new:
      'Följande kurstillfällen saknar publicerad kursanalys/kursdata. Markera en eller flera som ingår i kursomgången: ',
    intro_draft: 'Följande kursomgångar har sparade utkast som ännu ej publicerats: ',
    intro_published:
      'Följande kursomgångar har publicerad kursanalys och kursdata. Välj den kursomgång nedan som du vill du vill ändra och sedan publicera om: ',

    /* **** EMPTY TEXT FOR NEW, DRAFT, PUBLISHED */
    draft_empty: 'Det finns inga sparade utkast för vald termin',
    published_empty: 'Det finns ingen publicerad kursutveckling för vald termin',
    new_empty:
      'Kursanalys och kursdata har publicerats för samtliga kursomgångar den valda terminen. Kontrollera publicerad kursanalys på sidan Kursens utveckling',

    not_authorized_course_offering: 'Du kan endast granska detta utkast då du inte kursansvarig för kursomgången.',
    not_authorized_publish_new: 'Du är inte kursansvarig för detta kurstillfälle och kan därför inte välja det.',

    /** ************ BUTTONS ****************** */
    btn_preview: 'Granska',
    btn_add_analysis: ' Redigera, ladda upp',
    btn_cancel: 'Avbryt',
    btn_save: 'Spara utkast',
    btn_publish: 'Publicera',
    btn_back: 'Välj kursomgång',
    btn_back_edit: 'Redigera, ladda upp',
    btn_delete: 'Radera',
    btn_save_and_cancel: 'Spara utkast och avsluta',
    btn_copy: 'Kopiera länk till utkast',

    /** ************ PAGE 2 FORM ************** */
    header_semester: 'Termin' /** Visas i steg 2, följt av kursomgångens starttermin */,
    header_course_offering: 'Kursomgång' /** Visas i steg 2, följt av kursomgångens namn */,

    header_upload: 'Ladda upp kursanalys' /** Visas i steg 2, rubrik för kolumn 1 */,
    header_summarize: 'Summera förändringar' /** Visas i steg 2, rubrik för kolumn 2 */,
    header_check_data: 'Kontrollera hämtat data' /** Visas i steg 2, rubrik för kolumn 3 */,

    header_mandatory_fields: '* Obligatoriska uppgifter',
    header_programs: 'Obligatorisk inom program',
    header_rounds: 'Kurstillfällen som ingår',
    header_examiners: 'Examinator *',
    header_employees: 'Kursansvarig, Examinator ',
    header_responsibles: 'Kursansvarig *',
    header_registrated: 'Antal förstagångsregistrerade studenter *',
    header_examination: 'Form av examination',
    header_examination_comment: 'Kommentar till examination',
    header_examination_grade: 'Examinationsgrad *',
    header_course_changes_comment: 'Förändringar som har införts till den här kursomgången (max 2000 tecken)',
    header_analysis_edit_comment: 'Kommentar till ändringar av publicerad kursanalys eller kursdata *',
    header_upload_file: 'Kursanalys (endast i fil-formatet PDF) *',
    header_upload_file_date: 'Publiceringsdatum för kursanalys',
    last_change_date: 'Senaste ändring:',
    header_copy_link: 'Kopiera länk till senast sparat utkast',
    header_end_date: 'För slutdatum',
    header_result: 'Resultat',

    link_syllabus: 'Kursplan',
    link_syllabus_empty: 'Länk syns inte vid granskning',
    link_analysis: { label_analysis: 'Kursanalys', no_added_doc: 'Ingen kursanalys tillagd' },
    link_memo: { label_memo: 'Kurs-PM', no_added_doc: 'Saknas ett publicerat kurs-PM' },

    original_values_are: 'De ursprungliga värdena är',
    and: 'och',
    /** ************ ALERTS ************** */
    alert_no_course_memo_header: 'Komplettera efteråt med de Kurs-PM som saknas',
    alert_no_course_memo_info: `Efter att du avslutat här kan du publicera kurs-PM för dessa kurstillfällen i: 
      Administrera Om kursen. Då kommer kurs-PM att visas på sidorna: Kursens utveckling och Kurs-PM.`,
    alert_no_rounds_selected:
      'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knapp "Redigera, ladda upp".',
    alert_no_rounds: 'Det finns redan publicerade kursanalyser för alla kursomgångar denna termin.',
    alert_no_published: 'Det finns ingen publicerad kursanalys och kursdata denna termin',
    alert_different_end_dates:
      'Valda kurstillfällen har olika slutdatum. Kursanalys ska publiceras för kurstillfällen i samma kursomgång.' /* GRÄDDEN PÅ SEMLAN */,
    alert_saved_draft: 'Utkast för kursanalys och kursdata har sparats',
    alert_empty_fields: 'Du behöver fylla i obligatoriska fält för att gå vidare till Granska och publicera.',
    alert_over_max_fields: {
      alterationText: 'Fältet Summera förändringar innehåller för många tecken.',
      default: 'Fält innehåller för många tecken.',
    },
    alert_uploaded_file: 'Vald fil har laddas upp och fått nytt namn',
    alert_not_pdf: 'Vald fil kunde inte laddas upp. Filen måste vara av typen PDF.',
    alert_graduation_rate_fields_updated: 'Ett eller båda fälten för examinationsgrad har manuellt uppdaterats.',
    alert_graduation_rate_cant_be_calculated:
      'Antal förstagångsregistrerade studenter och examinationsgrad kan inte räknas ut automatiskt för denna kursomgång.',

    /** ************ MODALS ************** */
    aria_label_close_icon: 'Stäng',

    info_copy_link: {
      header: 'Kopiera länk till sparat utkast',
      body: 'Kopiera länken nedan, klistra in och skicka länken till den person som du vill ska granska utkastet.',
      btnCancel: 'Stäng',
    },
    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `Publicering kommer att ske på sidan Kursens utveckling.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera',
    },
    info_cancel: {
      header: 'Att tänka på innan du avbryter!',
      body: `Osparade ändringar kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt avbryta',
    },
    info_delete: {
      header: 'Att tänka på innan du raderar utkastet!',
      body: `Radera utkast kan inte ångras. Utkastet kommer att försvinna.
        <br/>  
        <br/> 
            Vill du fortsätta att radera utkast?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt radera',
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Välj termin',
      body: 'Välj vilken termin kursomgången startade. Om kursomgången sträcker sig över flera terminer; välj kursomgångens starttermin.',
      btnCancel: 'Close',
    },
    info_choose_course_offering: {
      header: 'Välj kursomgång',
      body: 'Välj alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle. Programstudenter, betalande studenter och fristående studenter antas till olika kurstillfällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång. Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång, kurs-PM utformas per kurstillfälle och kursanalys genomförs per kursomgång.',
      btnCancel: 'Close',
    },

    info_examination_grade: {
      header: 'Examinationsgrad i procent (%)',
      body: 'Examinationsgrad är antal förstagångsregistrerade studenter som godkänts på hela kursomgången vid valt slutdatum dividerat med antal förstagångsregistrerade på kursomgången i procent (%). Examinationsgrad hämtas automatiskt från Ladok för kursomgångar med starttermin VT 2017 och senare baserat på kursomgångens slutdatum. Vissa kurser har ett examinationsdatum efter kursomgångens slut vilket gör att examinationsgraden blir 0. Det är därför möjligt att ange ett eget slutdatum som är efter examinationsdatumet och låta systemet räkna om examinationsgraden. Det är också möjligt att ange examinationsgrad manuellt. Examinationsgrad redovisas inte för respektive delmoment i examinationen. Examinationsgrad beräknas inte heller om efter efterföljande omtentor.',
      btnCancel: 'Close',
    },

    info_end_date: {
      header: 'Sludatum',
      body: 'Slutdatum som låg till grund för beräknad examinationsgrad.',
      btnCancel: 'Close',
    },

    info_examiners: {
      header: 'Examinator',
      body: 'Examinator för kurs vid gällande kursomgång. Examinatorer administreras i Kopps.',
      btnCancel: 'Close',
    },

    info_responsibles: {
      header: 'Kursansvarig',
      body: 'Samtliga kursansvariga för de kurstillfällen som ingår i kursomgången. Kursansvariga administreras i Kopps.',
      btn_close: 'Close',
    },

    info_edit_comments: {
      header: 'Ändringar av publicerad kursanalys eller kursdata',
      body: 'Då det är möjligt att ladda upp nya versioner av kursanalys och kursdata är det viktigt att ange vilka förändringar som är gjorda och syftet med ändringarna.',
      btnCancel: 'Close',
    },

    info_upload_course_analysis: {
      header: 'Ladda upp kursanalys',
      body: 'Ladda upp den senaste versionen av kursanalysen för kursomgången.',
      btnCancel: 'Close',
    },
    info_upload_course_analysis_date: {
      header: 'Publiceringsdatum för kursanalys',
      body: 'Ange datum för dagen då kursanalysen publiceras. Låt det automatiskt angivna datumet gälla om kursanalysen publiceras för en nyligen avslutad kursomgång. Om kursanalysen redan har varit publicerad, ange datumet då den ursprungligen blev publicerad.',
      btnCancel: 'Close',
    },
    info_course_changes_comment: {
      header: 'Summera förändringar till kursen',
      body: 'Summerade förändringar som har införts till den här kursomgången. Syftet med att publicera förändringar som infördes till kursen innan kursomgångens start är att visa på hur kursen förbättras och utvecklas över tid. Kursomgångarnas alla dokumenterade förändringar visar på vilka utvecklingssteg kursen har genomgått.',
      btnCancel: 'Close',
    },
    info_registrated: {
      header: 'Antal förstagångsregistrerade studenter',
      body: 'Siffran avser antal förstagångsregistrerade studenter på de kurstillfällen som ingår i kursomgången. Antal förstagångsregistrerade studenter hämtas automatiskt från Ladok för kursomgångar med startdatum VT 2017 och senare. Det är möjligt att ange examinationsgrad manuellt. Studenter som antagits men som inte registrerats ska inte räknas in. Inte heller registrerade studenter som omregistrerats från ett annat kurstillfälle på samma kurs ska räknas in. Beräkningen görs på kursomgångens starttermin.',
      btnCancel: 'Close',
    },

    // PREVIEW PAGE
    info_manually_edited: '* Kursdata har registrerats manuellt',
    header_more_info: 'Ytterligare data om kursanalysen',
    header_course_round: 'Kursomgång',
    table_headers_with_popup: {
      examiners: {
        header: 'Examinator',
        popoverText: 'Examinator för kurs vid gällande kursomgång. Examinatorer administreras i Kopps.',
      },
      examRounds: { header: 'Examination', popoverText: 'Form av examination vid gällande kursomgång.' },
      alterationText: {
        header: 'Förändringar som har införts till den här kursomgången',
        popoverText: 'Summerade förändringar som har införts till den här kursomgången.',
      },
      examinationGrade: {
        header: 'Resultat',
        popoverText:
          'Examinationsgrad är antal förstagångsregistrerade studenter som godkänts på hela kursomgången efter första examinationstillfället efter kursomgångensslut dividerat med antal förstagångsregistrerade på kursomgången. Examinationsgrad redovisas inte för respektive delmoment i examinationen. Examinationsgrad beräknas inte heller om efter efterföljande omtentor.',
      },
      responsibles: {
        header: 'Kursansvarig',
        popoverText:
          'Samtliga kursansvariga för de kurstillfällen som ingår i kursomgången. Kursansvariga administreras i Kopps.',
      },
      registeredStudents: {
        header: 'Studenter',
        popoverText:
          'Antal förstagångsregistrerade på de kurstillfällen som ingår i kursomgången. Studenter som antagits men som inte registrerats ska inte räknas in. Inte heller registrerade studenter som omregistrerats från ett annat kurstillfälle på samma kurs ska räknas in.',
      },
    },
    extra_kopps_info: {
      no_added: 'Ingen information tillagd',
      commentExam: {
        header: 'Kommentar till examination',
        popoverText: 'Kommentar till form av examination vid gällande kursomgång.',
      },
      programmeCodes: { header: 'Obligatorisk inom program', popoverText: '' },
      analysisName: {
        header: 'Kursanalysen gäller för följande kursomgångar',
        popoverText:
          'Alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle. Programstudenter, betalande studenter och fristående studenter antas till olika kurstillfällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång. Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång, kurs-PM utformas per kurstillfälle och kursanalys genomförs per kursomgång.',
      },
    },
    extra_dates_and_comments: {
      no_added: 'Ingen information tillagd',
      header_publishing_dates: 'Datum för publicering',
      publishedDate: 'Publicerad första gången',
      changedAfterPublishedDate: 'Senaste ändrad',
      commentChange: 'Kommentar till gjorda ändringar',
      no_date_last_changed: 'ej ändrad efter publicering',
    },
  },
}
