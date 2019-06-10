module.exports = {
  shortNames: [ 'sv', 'se' ],
  longNameSe: 'Svenska',
  longNameEn: 'Swedish',
  messages: {
    /**
       * General stuff
       */
    date_format_short: '%d/%m/%Y',

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

    progressImage: {
      first: 'stegvis_1_sv',
      edit: 'stegvis_2_sv',
      preview: 'stegvis_3_sv'
    },

    /** header_main: 'Administrera kursanalys med kursdata', */
    /** header_select_semester: 'Välj först termin',
        header_add_round: 'Välj först termin',
        header_draft: 'Välj bland sparade utkast',
        header_added_rounds: 'Välj en tidigare tillagd kursomgång',
        header_published: 'Välj bland publicerade',
        header_new: 'Lägg till ny',
        header_select_rounds: 'Lägg till ny', */
    /** header_edit_content: 'Redigera innehåll (steg 2 av 3) ', */
    /** header_analysis_menu: 'Välj kursomgång för kursanalys (steg 1 av 3)', */
    /** header_preview_content: 'Granska (steg 3 av 3)', */
    /**	intro_analysis_menu_1: 'Välj kursomgång nedan för vilken du vill administrera kursutveckling för.', */
    /** intro_analysis_menu_2: 'Det kan vara en tidigare tillagd kursomgång i form av ett utkast som du vill granska och kanske publicera eller en redan publicerad
        kursomgång som du vill redigera. Du kan även lägga till kursutveckling för en ny kursomgång, välj då vilka kurstillfällen som kursomgången
        består av. Utkast hittar du på denna sida och publicerad kursutveckling hittar du på sidan ', */
    /** select_semester: 'Välj termin', */
    /** intro_new: 'Följande kurstillfällen saknar publicerad kursanalys/ kursdata. Markera en eller flera som ingår i kursomgången: ', */



    /** info_only_preview: 'Endast granskning då du inte är Kursansvarig eller Examinator', */
    /** info_can_edit: 'Du kan även redigera, då du har rollen Examinator eller Kursansvarig)', */

    /** btn_preview: 'Granska', */
    /** btn_add_analysis: ' Redigera', */
    /** btn_cancel: 'Avbryt', */
    /** btn_save: 'Spara utkast', */
    /** btn_publish: 'Publicera', */
    /** btn_back: 'Välj kursomgång', */
    /** btn_back_edit: 'Till redigering', */
    /** btn_delete: 'Radera', */

    /** add_file: 'Dra och droppa filen här <span class="filepond--label-action"> eller klicka för att välja fil </span>', */

    /** asterix_text: '* Kommer inte att kunna ändras efter publicering', */
    /** asterix_text_2: '** Går ej att redigera inlagd information från Kopps', */

    /** header_programs: 'Obligatorisk inom program', */
    /** header_rounds: 'Kurstillfällen som ingår', */
    /** header_examiners: 'Examinator ', */
    /** header_employees: 'Kursansvarig, Examinator ', */
    /** header_responsibles: 'Kursansvarig', */
    /** header_registrated: 'Antal reg. Studenter', */
    /** header_examination: 'Form av examination', */
    /** header_examination_comment: 'Kommentar till examination', */
    /** header_examination_grade: 'Examinationsgrad', */
    /** header_course_changes_comment: 'Förändringar som införts i årets kurs', */
    /** header_analysis_edit_comment: 'Kommentar till ändringar', */
    /** header_upload_file: 'Ladda upp analys', */
    /** header_upload_file_pm: 'Ladda upp PM', */
    /** last_change_date: 'Senaste ändring:', */

    /** link_syllabus: 'Kursplan', */
    /** link_analysis: 'Kursanalys', */
    /** link_pm: 'Kurs-PM', */

    /** draft_empty: 'Det finns inga sparade utkast för vald termin', */
    /** published_empty: 'Det finns ingen publicerad kursutveckling för vald termin', */
    /** new_empty: 'Det finns inga ej påbörjade kurstillfällen för vald termin', */
    /** alert_no_rounds_selected: 'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knapp "Granska" eller "Redigera".', */

    intro_link: 'Course development and history',

    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn '
    },

    /**
    * Step 1 - Publish new course analysis with course data
    */

    header_main_publish_new: 'Publish new course analysis with course data',
    header_main_edit: 'Change published course analysis with course data',
    /** [kurskod] [kursbenämning] [poäng] credits */
    /** 1.	Choose course offering, 2.	Edit course data and upload course analysis, 3.	Preview and publish */

    intro_step_1: 'Choose a term and a course offering for the course analysis to be published (step 1 of 3). In the next step (2 of 3), course data will be fetched automatically for the selected term and course offering. It is there possible to edit some of the course data and upload a course analysis document. Preview the table with the course data and course analysis that are about to be published in the last step (3 of 3). The course data with the course analysis will then be published on the page Course development and history.',
    select_semester: 'Choose term',
    info_select_semester: {
      header: 'Info',
      body: 'Choose what term the course offering started. If the course offering stretched over several terms then choose the first term.',
      btn_close: 'Close'
    },
    select_term_default_value: 'Choose term',
    header_choose_course_offering: 'Choose course offering',
    info_choose_course_offering: {
      header: 'Info',
      body: 'Choose all the administrative course instances that was included in the course offering. Students are admitted to an administrative course instance. Degree program students and non-programme students are admitted to different administrative course instances but may be educated in the same course offering. A course offering is thereby the practical realisation of the course with a common start date, common pace, common timetable etc. for all students. Several administrative course instances are grouped to one course offering.',
      btn_close: 'Close'
    },
    header_saved_drafts: 'The following course offerings have saved drafts that are not yet published.',
    /** List of saved drafts with the following format Autumn 2018-1 (Start date dd/mm/yyyy, [utbildningsspråk]) */
    header_administrative_course_instances: 'The following administrative course instances have no course analysis with course data published. Select the instances which makes the course offering that the course analysis was made for.',
    new_empty: 'There are no administrative course instances to choose.',
    header_published: 'The following course offerings have published course analysis. Choose the course offering to edit and to publish a new version.',
    published_empty: 'There are no published course analysis with course data this term.',

    btn_copy_link: 'Copy link',
    btn_cancel: 'Cancel',
    btn_add_analysis: 'Edit, upload ', /** Followed by arrow point to the right */
    alert_no_rounds_selected: 'Select at least one administrative course instance before clicking on the button “Edit, upload”.',
    alert_no_rounds_selected: 'This course has no administrative course instances',


    /**
    * Step 2 - Upload, summarize and adjust
    */

    /** header_main_publish_new: 'Publish new course analysis with course data', */
    /** header_main_edit: 'Change published course analysis with course data', */
    /** [kurskod] [kursbenämning] [poäng] credits */
    /** 1.	Choose course offering, 2.	Edit course data and upload course analysis, 3.	Preview and publish */

    intro_step_2: 'In this step (2 of 3) course analysis and course memo are uploaded, changes to the chosen course offering is summarized and some of the course data are reviewed and adjusted if not correct.',

    header_upload: 'Upload',
    header_upload_course_analysis: 'Course analysis',
    info_upload_course_analysis: {
      header: 'Info',
      body: 'Upload the latest version of the course analysis for the course offering.',
      btn_close: 'Close'
    },
    add_file: 'Drag and drop the file here <span class="filepond--label-action"> or click here to browse </span>',
    header_upload_file_pm: 'Course memo',
    info_upload_course_memo: {
      header: 'Info',
      body: 'Upload the latest version of the course memo for the course offering.',
      btn_close: 'Close'
    },
    header_summarize_changes: 'Summarize changes',
    header_course_changes_comment: 'Changes of the course before this course offering',
    info_course_changes_comment: {
      header: 'Info',
      body: 'Summarize the changes made to the course before this particular course offering.',
      btn_close: 'Close'
    },
    header_review_fetched_data: 'Review fetched course data',
    asterix_text: '* Data cannot be changed after published',
    header_registrated: 'Number of registered students',
    info_registrated: {
      header: 'Info',
      body: 'Number of registered students are defined as the number of first registration students on all the administrative course instances that are included in the course offering. Admitted students that have not been registered shall not be counted. Neither shall registered students that have been re-registered from a previous administrative course instance counted. Number of registered students is calculated based on information fetched from Ladok.',
      btn_close: 'Close'
    },
    header_examination_grade: 'Graduation rate',
    info_examination_grade: {
      header: 'Info',
      body: 'Graduation rate is defined as the number of passed first registration students on the whole course divided by the number of registered student (as defined above) after the first ordinary examination after the end date of the course offering. Graduation rate is not calculated for each examination session in the course examination set. Neither is it recalculated after each following re-examination. Graduation rate is calculated based on information fetched from Ladok.',
      btn_close: 'Close'
    },
    header_examiners: 'Examiners',
    info_examiners: {
      header: 'Info',
      body: 'The examiners of the course at the time for the course offering. Examiners are administrated in Kopps.',
      btn_close: 'Close'
    },
    header_responsibles: 'Course responsibles',
    info_examiners: {
      header: 'Info',
      body: 'All the course responsibles for the all the administrative course instances that are included in the course round. Course responsibles are administrated in Kopps.',
      btn_close: 'Close'
    },
    header_analysis_edit_comment: 'Comments to changes in course data or course analysis after published.',
    info_edit_comments: {
      header: 'Info',
      body: 'It is possible to upload new versions of course analysis and course memos and rewrite changes to this course offering. Comment the purpose of the new versions in this field.',
      btn_close: 'Close'
    },
    btn_back: 'Choose course offering', /** Preceeded by a left arrow */
    /** btn_cancel: 'Cancel', */
    btn_save: ' Save draft',
    btn_preview: 'Preview ', /** Followed by a right pointing arrow */


    /**
    * Step 3 - Preview
    */

    /** header_main_publish_new: 'Publish new course analysis with course data', */
    /** header_main_edit: 'Change published course analysis with course data', */
    /** [kurskod] [kursbenämning] [poäng] credits */
    /** 1.	Choose course offering, 2.	Edit course data and upload course analysis, 3.	Preview and publish */

    intro_step_3: 'In this step (3 of 3) a preview of the course analysis with course data is presented as it will be published on the page Course development and history. It is possible to go back to make adjustments, to save a draft or publish the information.',
    /** [året för kursomgångens startermin] */
    /** [lista av kurstillfällen enligt format ovan] */
    link_syllabus: 'Course syllabus ', /** Followed by ([giltighetstermin år] – [sista giltighetstermin år]) */
    link_pm: 'Course memo',
    link_analysis: 'Course anlaysis ', /** Followed by [dd/mm/yyyy] */
    header_responsibles: 'Course responsible',
    header_examiners: 'Examiner',
    header_students: 'Students',
    header_examination: 'Examination',
    header_results: 'Results',
    /** header_course_changes_comment: 'Changes of the course before this course offering', */
    header_more_information: 'More information',
    header_examination_comment: 'Examination comments',
    header_programs: 'Compulsory within programme',
    header_rounds: 'Administrative course instances included in the course offering',
    header_publish_dates: 'Date of published course analysis with course data',
    published_first_time: 'Published first time: ', /** [datum för första publicering] */
    last_change_date: 'Last time changed: ', /** [datum för senaste ändring] eller... */
    no_changes: 'No changes since first published',
    /** header_analysis_edit_comment: 'Comments to changes in course data or course analysis after published', */
    btn_back_edit: ' Edit, upload', /** Preceeded by a left pointing arrow */
    /**btn_cancel: 'Cancel', */
    btn_delete: 'Delete',
    btn_close: 'Close',
    btn_save_and_cancel: 'Save draft and cancel',
    btn_publish: 'Publish',


    /**
    * Modals and notifications
    */

    info_publish: {
      header: 'To be aware of before publishing!',
      body: `The following fields cannot be changed after the information is published: <br/>
  
        <li> Compulsory within programme</li>
        <li> Examiner</li>
        <li> Course responsible</li>
        <li> Examination</li>
        <li> Examination comment</li>
        <li> Number of registered students</li>
        <li> Graduation rate</li>
        <br/>  
        <br/> 
          The information will be published on the page Course development and history
        <br/> 
        <br/> 
        Do you want to publish?`,
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, publish'
    },

    notification_publish: {
      header: 'Course analysis and course data is now published',
      notification_publish_body_row_1: 'Term: ', /** Followed by chosen term */
      notification_publish_body_row_2: 'Course offering: ',
      notification_publish_body_row_3: 'View published course analysis and course data: ' /** Followed by link to the page Course development and history, key "intro_link" */
    },

    info_delete: {
      header: 'Are you sure you want to delete the draft?',
      info_delete_body_row_1: 'You have chosen:',
      info_delete_body_row_2: 'Term: ', /** Followed by chosen term */
      info_delete_body_row_3: 'Course offering: ', /** Followed by list of administrative course offerings (kurstillfällen) */
      info_delete_body_row_4: '<br/><br/>Do you want to delete the draft?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, delete'
    },

    notification_delete: {
      header: 'Draft of course analysis and course data has been deleted',
      notification_delete_body_row_1: 'Term: ', /** Followed by chosen term */
      notification_delete_body_row_2: 'Course offering: ', /** Followed by list of administrative course offerings (kurstillfällen) */
      notification_delete_body_row_3: ''/** Link to the page Publish new course analysis and course data */
    },

    info_cancel: {
      header: 'To be aware of before cancelling!',
      body: `Unsaved changes will be lost if you cancel the publishing of course analysis 
        <br/>  
        <br/> 
              Do you want to cancel?`,
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, delete'
    },

    notification_draft_saved: {
      header: 'A draft of course analysis and course data has been saved',
      notification_draft_saved_body_row_1: 'Term: ', /** Followed by chosen term */
      notification_draft_saved_body_row_2: 'Course offering: ', /** Followed by list of administrative course offerings (kurstillfällen) */
      notification_draft_saved_body_row_3: 'View draft: ' /** Link to the page Publish new course analysis and course data */
    }
  }
}


