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

    example_message_key: 'Här är en svensk översättning på en label',

    button_label_example: 'Klicka här för att skicka data till servern!',

    field_text_example: 'Data att skicka till API',

    field_label_get_example: 'Min datamodell(Svar från api anrop GET): ',
    field_label_post_example: 'Min datamodell(Svar från api anrop POST): ',

    lang_block_id: '1.272446',
    locale_text: 'Kursinformation på svenska',

    site_name: 'Kursinformation',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'VT ',
      2: 'HT '
    },
    header_main: 'Granska och redigera kursutveckling',
    header_select_semester: 'Välj/ lägg till kursomgång',
    header_add_round: 'Välj/ lägg till kursomgång',
    header_draft: 'Sparade utkast',
    header_added_rounds: 'Välj en tidigare tillagd kursomgång',
    header_published: 'Publicerade',
    header_new: 'Eller lägg till en ny kursomgång',
    header_select_rounds: 'Ej påbörjade kurstillfällen (välj en eller flera):',
    select_semester: 'Välj termin',
    edit_content: 'Redigera innehåll',

    info_only_preview: 'Endast granskning då du inte är Kursansvarig eller Examinator',
    info_can_edit: 'Du kan även redigera, då du har rollen Examinator eller Kursansvarig)',

    btn_preview: 'Granska',
    btn_add_analysis: ' Redigera',
    btn_cancel: 'Avbryt',
    btn_save: 'Spara utkats',
    btn_publish: 'Publicera',
    btn_back: 'Välj kursomgång',
    btn_back_edit: 'Tillbaka till redigering',
    btn_delete: 'Radera',

    add_file: 'Dra och droppa filen här <span class="filepond--label-action"> eller klicka för att välja fil </span>',

    asterix_text: '* Kommer inte att kunna ändras efter publicering',

    header_programs: 'Obligatorisk inom program',
    header_rounds: 'Kurstillfällen som ingår',
    header_examiners: 'Examinator ',
    header_employees: 'Kursansvarig, Examinator ',
    header_responsibles: 'Kursansvarig',
    header_registrated: 'Antal reg. Studenter',
    header_examination: 'Form av examination',
    header_examination_comment: 'Kommentar till examinationsgrad',
    header_examination_grade: 'Examinationsgrad',
    header_course_changes_comment: 'Förändringar som införts i årets kurs',
    header_analysis_edit_comment: 'Kommentar till ändringar',
    header_upload_file: 'Ladda upp analysfil',
    header_upload_file_pm: 'Ladda upp PM fil',
    last_change_date: 'Senaste ändring:',

    link_syllabus: 'Kursplan',
    link_analysis: 'Kursanalys',
    link_pm: 'Kurs-PM',

    draft_empty: 'Det finns inga sparade utkast för vald termin',
    published_empty: 'Det finns ingen publicerad kursutveckling för vald termin',
    new_empty: 'Det finns inga ej påbörjade kurstillfällen för vald termin',

    alert_no_rounds_selected: 'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knapp "Granska" eller "Redigera".',

    info_publish: {
      header: 'Att tänka på innan du publicerar!',
      body: `Följande fält kommer inte att kunna ändras efter publicering: <br/>

      <li> Obligatorisk inom program</li>
      <li> Examinator</li>
      <li> Kursansvarig,</li>
      <li> Antal reg. Studenter</li>
      <li> Form av examination och när den utförs</li>
      <li> Examinationsgrad</li>
      <li> Kommentar till examinationsgrad</li>
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
    }
  }
}
