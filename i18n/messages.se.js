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

    lang_block_id: '1.272446',
    locale_text: 'Administrera kursutveckling på svenska',

    site_name: 'Kursutveckling Admin',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    progressImage: {
      first: 'stegvis_1_sv',
      edit: 'stegvis_2_sv',
      preview: 'stegvis_3_sv'
    },

    course_short_semester: {
      1: 'VT ',
      2: 'HT '
    },

    header_main_new: 'Publicera ny kursanalys med kursdata',
    header_main_published: 'Ändra publicerad kursanalys med kursdata',

    header_select_semester: 'Välj termin',
    select_semester: 'Välj termin',
    header_analysis_menu: 'Välj kursomgång',
    label_start_date: 'Startdatum',
    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    intro_analysis_menu: 'Börja med att välja termin och kursomgång för den kursanalys som ska publiceras (steg 1 av 3). I nästa steg (2 av 3) kommer kursdata för kursen att hämtas automatiskt från Ladok och Kopps för den termin och kursomgång som valts,det finns sedan möjlighet att redigera viss kursdata samt ladda upp kursanalysen. I sista steget (3 av 3) ges möjlighet att först granska och sedan publicera tabellen med kursanalys och all kursdata på sidan Kursens utveckling och historik.',
    intro_edit: 'Redigera, ladda upp kuranalys med kursdata (steg 2 av 3)',
    intro_preview: 'In this step (3 of 3) a preview of the course analysis with course data is presented as it will be published on the page Course development and history. It is possible to go back to make adjustments, to save a draft or publish the information.',

    /* **** INTRO SELECT NEW, DRAFT, PUBLISHED */
    intro_new: 'Följande kurstillfällen saknar publicerad kursanalys/ kursdata. Markera en eller flera som ingår i kursomgången: ',
    intro_draft: 'Följande kursomgångar har sparade utkast som ännuej publicerats: ',
    intro_published: 'Följande kursomgångar har publicerad kursanalys med kursdata. Välj den kursomgång nedan som du vill du vill ändra och sedan publicera om: ',

    /* **** EMPTY TEXT FOR NEW, DRAFT, PUBLISHED */
    draft_empty: 'Det finns inga sparade utkast för vald termin',
    published_empty: 'Det finns ingen publicerad kursutveckling för vald termin',
    new_empty: 'Det finns inga ej påbörjade kurstillfällen för vald termin',

    /** ************ BUTTONS ****************** */
    btn_preview: 'Granska',
    btn_add_analysis: ' Redigera, ladda upp',
    btn_cancel: 'Avbryt',
    btn_save: 'Spara utkast',
    btn_publish: 'Publicera',
    btn_back: 'Välj kursomgång',
    btn_back_edit: 'Till redigering',
    btn_delete: 'Radera',

    /** ************ PAGE 2 FORM ************** */
    add_file: 'Dra och droppa filen här <span class="filepond--label-action"> eller klicka för att välja fil </span>',
    not_authorized_course_offering: 'Du är inte kursansvarig för denna kursomgång och kan därför inte välja den.',
    asterix_text: '* Kommer inte att kunna ändras efter publicering',

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
    header_upload_file: 'Ladda upp analys',
    header_upload_file_pm: 'Ladda upp PM',
    last_change_date: 'Senaste ändring:',

    link_syllabus: 'Kursplan',
    link_analysis: 'Kursanalys',
    link_pm: 'Kurs-PM',

    alert_no_rounds_selected: 'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knapp "Redigera, ladda upp".',
    alert_no_rounds: 'Den här kursen har inga kursomgångar',
    alert_no_published: 'Det finns ingen publicerad kursanalys och kursdata denna termin',

    /** ************ MODALS ************** */
    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `Följande fält kommer inte att kunna ändras efter publicering: <br/>
      <li> Examinator</li>
      <li> Kursansvarig,</li>
      <li> Antal reg. Studenter</li>
      <li> Examinationsgrad</li>
      <br/>  
      <br/> 
        Vill du fortsätta att publicera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt publicera'
    },
    info_cancel: {
      header: 'Att tänka på innan du avbryter!',
      body: `Osparade ändringar kommer att försvinna om du avbryter. 
      <br/>  
      <br/> 
            Vill du fortsätta att avbryta?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt avbryta'
    },
    info_delete: {
      header: 'Att tänka på innan du XXX!',
      body: `XXXXXX. 
      <br/>  
      <br/> 
            Vill du fortsätta att radera?`,
      btnCancel: 'Nej, gå tillbaka',
      btnConfirm: 'Ja, fortsätt radera'
    },
    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Info',
      body: 'Välj vilken termin kursomgångenstartade. Om kursomgångensträcker sig över flera termer välj första terminen.',
      btnCancel: 'Close'
    },
    info_choose_course_offering: {
      header: 'Info',
      body: 'Välj alla kurstillfällen som ingick i kursomgången. Studenter är antagna till ett kurstillfälle Programstudenter, betalande studenter och fristående studenter antas till olika kurstill fällen men kan utbildas i samma kursomgång. Kurstillfällen ska alltså grupperas ihop till en kursomgång.Kursomgången är ett praktiskt genomförande av en kurs. Kursomgången har en gemensam starttidpunkt, gemensam kurstakt och normalt gemensam undervisning för en studentgrupp. Schemat läggs per kursomgång,kurs-PM utformas per kursomgång och kursanalys genomförs per kursomgång.',
      btnCancel: 'Close'
    },

    info_examination_grade: {
      header: 'Info',
      body: 'Examinationsgrad är antal förstagångsregistrerade studenter som godkänts på hela kursomgången efter första examinationstillfället efter kursomgångensslut dividerat med antal förstagångsregistrerade på kursomgången. Examinationsgrad redovisas inte för respektive delmoment i examinationen. Examinationsgrad beräknas inte heller om efter efterföljande omtentor.',
      btnCancel: 'Close'
    },

    info_examiners: {
      header: 'Info',
      body: 'Examinator för kurs och vid gällande kursomgång. Examinatorer administreras i Kopps.',
      btnCancel: 'Close'
    },

    info_responsibles: {
      header: 'Info',
      body: 'Samtligakursansvariga för de kurstillfällen som ingår i kursomgången. Kursansvariga administreras i Kopps.',
      btn_close: 'Close'
    },

    info_edit_comments: {
      header: 'Info',
      body: 'Då det är möjligt att ladda upp nya versioner av kursanalys och kursdata är det viktigt att ange vilka förändringar som är gjorda och syftet med ändringarna.',
      btnCancel: 'Close'
    },

    info_upload_course_analysis: {
      header: 'Info',
      body: 'Ladda upp den senaste versionen av kursanalysen förkursomgången.',
      btnCancel: 'Close'
    },

    info_upload_course_memo: {
      header: 'Info',
      body: 'Ladda upp den senaste versionen av kurs-PM för kursomgången.',
      btnCancel: 'Close'
    },

    info_course_changes_comment: {
      header: 'Info',
      body: 'Summera förändringar som har införts till den här kursomgången',
      btnCancel: 'Close'
    },
    info_registrated: {
      header: 'Info',
      body: 'Antal förstagångsregistrerade på de kurstillfällen som ingår i kursomgången.Studenter som antagits men som inte registrerats ska inte räknas in. Inte heller registrerade studenter som omregistrerats från ett annat kurstillfälle påsamma kurs ska räknas in.',
      btnCancel: 'Close'
    }
  }
}
