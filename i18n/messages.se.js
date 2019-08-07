module.exports = {
  shortNames: [ 'sv', 'se' ],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%Y-%m-%d',

    /**
     * Error messages
     */

    error_not_found: 'Tyvärr kunde vi inte hitta sidan du efterfrågade',
    error_course_not_found: 'Tyvärr så finns det ingen kurs med kurskod ',
    error_generic: 'Något gick fel på servern, var god försök igen senare',

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Administrera kursutveckling',

    lang_block_id: '1.272446',
    locale_text: 'Administrera kursutveckling på svenska',

    site_name: 'Kursutveckling Admin',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'VT ',
      2: 'HT '
    },

    header_main: {
      new: 'Publicera ny kursanalys och kursdata',
      draft: 'Publicera ny kursanalys och kursdata',
      published: 'Ändra publicerad kursanalys och kursdata',
      preview: 'Förhandsgranska sparat utkast av kursanalys och kursdata'
    },
    //* **** PROGRESS BAR  */
    header_progress_select: '1. Välj kursomgång', /** Ersätter bilden, ska vara understruket med blå linje om användaren är i detta steg */
    header_progress_edit_upload: '2. Redigera kursdata och ladda upp kursanalys', /** Ersätter bilden, ska vara understruket med blå linje om användaren är i detta steg */
    header_progress_review: '3. Granska och publicera', /** Ersätter bilden, ska vara understruket med blå linje om användaren är i detta steg */

    /** ***** PAGE 1 - ANALYSIS MENU */

    header_select_semester: 'Välj termin',
    select_semester: 'Välj termin',
    header_analysis_menu: 'Välj kursomgång',
    label_start_date: 'Startdatum',

    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    intro_analysis_menu: 'Börja med att välja termin och kursomgång för den kursanalys som ska publiceras (steg 1 av 3). I nästa steg (2 av 3) kommer kursdata för kursen att hämtas automatiskt från Ladok och Kopps för den termin och kursomgång som valts. Det finns sedan möjlighet att redigera viss kursdata samt ladda upp kursanalysen. I sista steget (3 av 3) ges möjlighet att först granska och sedan publicera tabellen med kursanalys och all kursdata på sidan Kursens utveckling och historik.',
    intro_edit: 'I detta steg (2 av 3) så laddas kursanalys och kurs-PM upp, förändringar för vald kursomgång summeras samt en del av kursdata kontrolleras och vid behov justeras när inte stämmer. I nästa steg granskas all kursdata innan publicering.',
    intro_preview: 'I detta steg (3 av 3) visas hur kursanalys och kursdata kommer att se ut på sidan Kursens utveckling och historik. Här finns möjlighet att gå tillbaka för att redigera ytterligare, spara som utkast eller publicera direkt.',

    /* **** INTRO SELECT NEW, DRAFT, PUBLISHED */
    intro_new: 'Följande kurstillfällen saknar publicerad kursanalys/kursdata. Markera en eller flera som ingår i kursomgången: ',
    intro_draft: 'Följande kursomgångar har sparade utkast som ännu ej publicerats: ',
    intro_published: 'Följande kursomgångar har publicerad kursanalys och kursdata. Välj den kursomgång nedan som du vill du vill ändra och sedan publicera om: ',

    /* **** EMPTY TEXT FOR NEW, DRAFT, PUBLISHED */
    draft_empty: 'Det finns inga sparade utkast för vald termin',
    published_empty: 'Det finns ingen publicerad kursutveckling för vald termin',
    new_empty: 'Kursanalys och kursdata har publicerats för samtliga kursomgångar den valda terminen. Kontrollera publicerad kursanalys på sidan Kursens utveckling och historik',

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
    asterix_text: '* Kommer inte att kunna ändras efter publicering',

    header_semester: 'Termin:', /** Visas i steg 2, följt av kursomgångens starttermin */
    header_course_offering: 'Kursomgång:', /** Visas i steg 2, följt av kursomgångens namn */

    header_upload: 'Ladda upp', /** Visas i steg 2, rubrik för kolumn 1 */
    header_summarize: 'Summera förändringar', /** Visas i steg 2, rubrik för kolumn 2 */
    header_check_data: 'Kontrollera hämtat data', /** Visas i steg 2, rubrik för kolumn 3 */

    header_programs: 'Obligatorisk inom program',
    header_rounds: 'Kurstillfällen som ingår',
    header_examiners: 'Examinator ',
    header_employees: 'Kursansvarig, Examinator ',
    header_responsibles: 'Kursansvarig',
    header_registrated: 'Antal förstagångsregistrerade studenter',
    header_examination: 'Form av examination',
    header_examination_comment: 'Kommentar till examination',
    header_examination_grade: 'Examinationsgrad',
    header_course_changes_comment: 'Förändringar som har införts till den här kursomgången',
    header_analysis_edit_comment: 'Kommentar till ändringar',
    header_upload_file: 'Kursanalys (endast i fil-formatet PDF)',
    header_upload_file_pm: 'Kurs-pm (endast i fil-formatet PDF)',
    last_change_date: 'Senaste ändring:',

    link_syllabus: 'Kursplan',
    link_analysis: 'Kursanalys',
    link_pm: 'Kurs-PM',

    alert_no_rounds_selected: 'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knapp "Redigera, ladda upp".',
    alert_no_rounds: 'Den här kursen har inga opublicerade kursomgångar denna termin',
    alert_no_published: 'Det finns ingen publicerad kursanalys och kursdata denna termin',
    alert_saved_draft: 'Utkast för kursanalys och kursdata har sparats',
    alert_empty_fields: 'Du behöver fylla i obligatoriska fält för att gå vidare till Granska och publicera.',
    alert_uploaded_file: 'Vald fil har laddatas upp',
    alert_not_pdf: 'Vald fil kunde inte laddas upp. Filen måste vara av typen PDF.',

    /** ************ MODALS ************** */
    info_copy_link: {
      header: 'Kopiera länk till sparat utkast',
      body: 'Kopiera länken nedan, klistra in och skicka länken till den person som du vill ska granska utkastet.',
      btnCancel: 'Stäng'
    },
    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `Följande fält kommer inte att kunna ändras efter publicering: <br/>
        <li> Examinator</li>
        <li> Kursansvarig</li>
        <li> Antal förstagångsregistrerade studenter</li>
        <li> Examinationsgrad</li>
        <br/>  
        <br/> 
        Publicering kommer att ske på sidan Kursens utveckling och historik.
        <br/>
        <br/>
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera'
    },
    info_cancel: {
      header: 'Att tänka på innan du avbryter!',
      /** selected: 'Du har valt...', /** */
      /** semester: 'Termin:', /** Följt av kursomgångens starttermin */
      /** course_round: 'Kursomgång:', /** Följt av kursomgångens namn */
      body: `Osparade ändringar kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt avbryta'
    },
    info_delete: {
      header: 'Att tänka på innan du raderar utkastet!',
      body: `Radera utkast kan inte ångras. Utkastet kommer att försvinna.
        <br/>  
        <br/> 
            Vill du fortsätta att radera utkast?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt radera'
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Info',
      body: 'Välj vilken termin kursomgången startade. Om kursomgången sträcker sig över flera terminer; välj kursomgångens starttermin.',
      btnCancel: 'Close'
    },
    info_choose_course_offering: {
      header: 'Info',
      body: 'Välj alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle. Programstudenter, betalande studenter och fristående studenter antas till olika kurstillfällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång. Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång, kurs-PM utformas per kursomgång och kursanalys genomförs per kursomgång.',
      btnCancel: 'Close'
    },

    info_examination_grade: {
      header: 'Info',
      body: 'Examinationsgrad är antal förstagångsregistrerade studenter som godkänts på hela kursomgången efter första examinationstillfället efter kursomgångensslut dividerat med antal förstagångsregistrerade på kursomgången. Examinationsgrad redovisas inte för respektive delmoment i examinationen. Examinationsgrad beräknas inte heller om efter efterföljande omtentor.',
      btnCancel: 'Close'
    },

    info_examiners: {
      header: 'Info',
      body: 'Examinator för kurs vid gällande kursomgång. Examinatorer administreras i Kopps.',
      btnCancel: 'Close'
    },

    info_responsibles: {
      header: 'Info',
      body: 'Samtliga kursansvariga för de kurstillfällen som ingår i kursomgången. Kursansvariga administreras i Kopps.',
      btn_close: 'Close'
    },

    info_edit_comments: {
      header: 'Info',
      body: 'Då det är möjligt att ladda upp nya versioner av kursanalys och kursdata är det viktigt att ange vilka förändringar som är gjorda och syftet med ändringarna.',
      btnCancel: 'Close'
    },

    info_upload_course_analysis: {
      header: 'Info',
      body: 'Ladda upp den senaste versionen av kursanalysen för kursomgången.',
      btnCancel: 'Close'
    },

    info_upload_course_memo: {
      header: 'Info',
      body: 'Ladda upp den senaste versionen av kurs-pm för kursomgången.',
      btnCancel: 'Close'
    },
    info_course_changes_comment: {
      header: 'Info',
      body: 'Summera förändringar som har införts till den här kursomgången',
      btnCancel: 'Close'
    },
    info_registrated: {
      header: 'Info',
      body: 'Antal förstagångsregistrerade på de kurstillfällen som ingår i kursomgången. Studenter som antagits men som inte registrerats ska inte räknas in. Inte heller registrerade studenter som omregistrerats från ett annat kurstillfälle på samma kurs ska räknas in.',
      btnCancel: 'Close'
    },

    info_published: {
	  header: 'Kursanalys och kursdata har publicerats',
      /** semester: 'Termin:', /** Följt av kursomgångens starttermin */
	  /** course_round: 'Kursomgång:', /** Följt av kursomgångens namn */
	  body: 'Se resultat på sidan:' /** Följt av länk till sidan Kursens utveckling och historik */
    },
    info_draft_saved: {
	  header: 'Utkast för kursanalys och kursdata har sparats',
      /** semester: 'Termin:', /** Följt av kursomgångens starttermin */
	  /** course_round: 'Kursomgång:', /** Följt av kursomgångens namn */
	  body: 'Kopiera länk till utkast eller publicera från sidan:' /** Följt av länk till steg 1, Välj kursomgång */
    },
    info_draft_deleted: {
	  header: 'Utkast för kursanalys och kursdata har raderats'
      /** semester: 'Termin:', /** Följt av kursomgångens starttermin */
	  /** course_round: 'Kursomgång:', /** Följt av kursomgångens namn */
	  /** Länk till steg 1, Välj kursomgång */
    },

    // PREVIEW PAGE
    header_course_round: 'Kursomgång',
    table_headers_with_popup: {
      examiners: { header: 'Examinator', popoverText: 'Examinator för kurs vid gällande kursomgång. Examinatorer administreras i Kopps.' },
      examShortAndLongStrArr: { header: 'Examination', popoverText: 'Form av examination vid gällande kursomgång.' },
      alterationText: { header: 'Förändringar som har införts till den här kursomgången', popoverText: 'Summerade förändringar som har införts till den här kursomgången.' },
      examinationGrade: { header: 'Resultat', popoverText: 'Examinationsgrad är antal förstagångsregistrerade studenter som godkänts på hela kursomgången efter första examinationstillfället efter kursomgångensslut dividerat med antal förstagångsregistrerade på kursomgången. Examinationsgrad redovisas inte för respektive delmoment i examinationen. Examinationsgrad beräknas inte heller om efter efterföljande omtentor.' },
      responsibles: { header: 'Kursansvarig', popoverText: 'Samtliga kursansvariga för de kurstillfällen som ingår i kursomgången. Kursansvariga administreras i Kopps.' },
      registeredStudents: { header: 'Studenter', popoverText: 'Antal förstagångsregistrerade på de kurstillfällen som ingår i kursomgången. Studenter som antagits men som inte registrerats ska inte räknas in. Inte heller registrerade studenter som omregistrerats från ett annat kurstillfälle på samma kurs ska räknas in.' }
    },
    extra_kopps_info: {
      commentExam: { header: 'Kommentar till examination', popoverText: 'Kommentar till form av examination vid gällande kursomgång.' },
      programmeCodes: { header: 'Obligatorisk inom program', popoverText: '' },
      analysisName: { header: 'Kurstillfällen som ingår i kursomgång', popoverText: 'Alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle. Programstudenter, betalande studenter och fristående studenter antas till olika kurstillfällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång. Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång, kurs-PM utformas per kursomgång och kursanalys genomförs per kursomgång.' }
    },
    extra_dates_and_comments: {
      header_publishing_dates: 'Datum för publicering',
      publishedDate: 'Publicerad första gången',
      changedAfterPublishedDate: 'Senaste ändrad',
      commentChange: 'Kommentar till gjorda ändringar',
      no_date_last_changed: 'ej ändrad efter publicering'
    }
  }
}
