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
    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    intro_analysis_menu: 'Välj kursomgång för kursanalys med kursdata (steg 1 av 3). Kursdata för kursen kommer att hämtas från Ladok och Kopps för den termin och kursomgång som du väljer nedan. Kursdata kommer, tillsammans med den kursanalys som du laddar upp i nästa steg, visas i en tabell under motsvarande år på sidan Kursens utveckling och historik',
    intro_edit: 'Redigera, ladda upp kuranalys med kursdata (steg 2 av 3)',
    intro_preview: 'In this step (3 of 3) a preview of the course analysis with course data is presented as it will be published on the page Course development and history. It is possible to go back to make adjustments, to save a draft or publish the information.',

    /* **** INTRO SELECT NEW, DRAFT, PUBLISHED */
    intro_new: 'Följande kurstillfällen saknar publicerad kursanalys/ kursdata. Markera en eller flera som ingår i kursomgången: ',
    intro_draft: 'Följande kursomgångar har ett sparat utkast. Välj kursomgång för att arbeta vidare med utkastet: ',
    intro_published: 'Följande kursomgångar har publicerad kursanalys med kursdata. Välj den kursomgång nedan som du vill du vill ändra och sedan publicera om: ',

    /* **** EMPTY TEXT FOR NEW, DRAFT, PUBLISHED */
    draft_empty: 'Det finns inga sparade utkast för vald termin',
    published_empty: 'Det finns ingen publicerad kursutveckling för vald termin',
    new_empty: 'Det finns inga ej påbörjade kurstillfällen för vald termin',

    /** ************ BUTTONS ****************** */
    btn_preview: 'Granska',
    btn_add_analysis: ' Redigera',
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
    header_registrated: 'Antal reg. Studenter',
    header_examination: 'Form av examination',
    header_examination_comment: 'Kommentar till examination',
    header_examination_grade: 'Examinationsgrad',
    header_course_changes_comment: 'Förändringar som införts i årets kurs',
    header_analysis_edit_comment: 'Kommentar till ändringar',
    header_upload_file: 'Ladda upp analys',
    header_upload_file_pm: 'Ladda upp PM',
    last_change_date: 'Senaste ändring:',

    link_syllabus: 'Kursplan',
    link_analysis: 'Kursanalys',
    link_pm: 'Kurs-PM',

    alert_no_rounds_selected: 'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knapp "Redigera, ladda upp".',
    alert_no_rounds: 'Den här kursen har inga kursomgångar',

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
      body: 'Choose what term the course offering started. If the course offering stretched over several terms then choose the first term.',
      btnCancel: 'Close'
    },
    info_choose_course_offering: {
      header: 'Info',
      body: 'Choose all the administrative course instances that was included in the course offering. Students are admitted to an administrative course instance. Degree program students and non-programme students are admitted to different administrative course instances but may be educated in the same course offering. A course offering is thereby the practical realisation of the course with a common start date, common pace, common timetable etc. for all students. Several administrative course instances are grouped to one course offering.',
      btnCancel: 'Close'
    },

    info_registrated: {
      header: 'Info',
      body: 'Number of registered students are defined as the number of first registration students on all the administrative course instances that are included in the course offering. Admitted students that have not been registered shall not be counted. Neither shall registered students that have been re-registered from a previous administrative course instance counted. Number of registered students is calculated based on information fetched from Ladok.',
      btnCancel: 'Close'
    },

    info_examination_grade: {
      header: 'Info',
      body: 'Graduation rate is defined as the number of passed first registration students on the whole course divided by the number of registered student (as defined above) after the first ordinary examination after the end date of the course offering. Graduation rate is not calculated for each examination session in the course examination set. Neither is it recalculated after each following re-examination. Graduation rate is calculated based on information fetched from Ladok.',
      btnCancel: 'Close'
    },

    info_examiners: {
      header: 'Info',
      body: 'The examiners of the course at the time for the course offering. Examiners are administrated in Kopps.',
      btnCancel: 'Close'
    },

    info_edit_comments: {
      header: 'Info',
      body: 'It is possible to upload new versions of course analysis and course memos and rewrite changes to this course offering. Comment the purpose of the new versions in this field.',
      btnCancel: 'Close'
    },

    info_upload_course_analysis: {
      header: 'Info',
      body: 'Upload the latest version of the course analysis for the course offering.',
      btnCancel: 'Close'
    },

    info_upload_course_memo: {
      header: 'Info',
      body: 'Upload the latest version of the course memo for the course offering.',
      btnCancel: 'Close'
    },

    info_course_changes_comment: {
      header: 'Info',
      body: 'Summarize the changes made to the course before this particular course offering.',
      btnCancel: 'Close'
    }
  }
}
