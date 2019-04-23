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
    header_main: 'GRANSKA REDIGERA KURSUTVECKLING',
    header_add_round: 'Välj/ lägg till kursomgång',
    header_draft: 'Sparade utkast (ej publicerade):',
    header_added_rounds: 'Välj en redan tillagd kursomgång',
    header_published: 'Publicerade',
    header_new: 'Eller lägg till en ny kursomgång',
    header_select_rounds: 'Ej påbörjade kurstillfällen (välj en eller flera):',
    select_semester: 'Välj start-termin:',
    edit_content: 'Redigera innehåll',

    info_only_preview: 'Endast granskning då du inte är Kursansvarig eller Examinator',
    info_can_edit: 'Du kan även redigera, då du har rollen Examinator eller Kursansvarig)',

    btn_preview: 'Granska',
    btn_add_analysis: 'Lägg till och fortsätt till Redigera',
    btn_cancel: 'Avbryt',
    btn_save: 'Spara utkats',
    btn_publish: 'Publicera',
    btn_back: 'Tillbaka',
    btn_back_edit: 'Tillbaka till redigering',

    header_programs: 'Obligatorisk inom program',
    header_rounds: 'Kurstillfällen som ingår',
    header_examiners: 'Examinator ',
    header_employees: 'Kursansvarig, Examinator ',
    header_responsibles: 'Kursansvarig',
    header_registrated: 'Antal reg. Studenter',
    header_examination: 'Form av examination och när den utförs',
    header_examination_comment: 'Kommentar till examinationsgrad',
    header_examination_grad: 'Examinationsgrad',
    header_course_changes_comment: 'Förändringar som införts i årets kurs',
    header_analysis_edit_comment: 'Kommentar till ändringar',
    header_upload_file: 'Ladda upp analysfil',
    header_upload_file_pm: 'Ladda upp PM fil',

    link_syllabus: 'Kursplan',
    link_analysis: 'Kursanalys',
    link_pm: 'Kurs-PM'

  }
}
