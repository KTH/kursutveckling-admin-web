module.exports = {
  shortNames: [ 'en' ],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {
    /**
     * General stuff
     */
    date_format_short: '%d-%b-%Y',

    /**
     * Error messages
     */

    error_not_found: 'Sorry, we can\'t find your requested page',
    error_course_not_found: 'Sorry, there is no course with course code ',
    error_generic: 'Something went wrong on the server, please try again later.',

    /**
     * Message keys
     */
    service_name: 'kurs ',

    lang_block_id: '1.272446',
    locale_text: 'Course information in English',
    site_name: 'Course information',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    progressImage: {
      first: 'stegvis_1_en',
      edit: 'stegvis_2_en',
      preview: 'stegvis_3_en'
    },

    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn '
    },

    header_main_new: 'Publish new course analysis with course data',
    header_main_published: 'Change published course analysis with course data',

    header_choose_course_offering: 'Choose course offering',

    select_semester: 'Choose term',

    //* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    intro_analysis_menu: 'Choose a term and a course offering for the course analysis to be published (step 1 of 3). In the next step (2 of 3), course data will be fetched automatically for the selected term and course offering. It is there possible to edit some of the course data and upload a course analysis document. Preview the table with the course data and course analysis that are about to be published in the last step (3 of 3). The course data with the course analysis will then be published on the page Course development and history.',
    intro_edit: 'In this step (2 of 3) course analysis and course memo are uploaded, changes to the chosen course offering is summarized and some of the course data are reviewed and adjusted if not correct.',
    intro_preview: 'In this step (3 of 3) a preview of the course analysis with course data is presented as it will be published on the page Course development and history. It is possible to go back to make adjustments, to save a draft or publish the information.',

    //* **** INTRO SELECT NEW, DRAFT, PUBLISHED */
    intro_new: 'Följande kurstillfällen saknar publicerad kursanalys/ kursdata. Markera en eller flera som ingår i kursomgången: ',
    intro_draft: 'The following course offerings have saved drafts that are not yet published.',
    intro_published: 'The following course offerings have published course analysis. Choose the course offering to edit and to publish a new version.',

    /* **** EMPTY TEXT FOR NEW, DRAFT, PUBLISHED */
    new_empty: 'Det finns inga ej påbörjade kurstillfällen för vald termin',
    draft_empty: 'Det finns inga sparade utkast för vald termin',
    published_empty: 'Det finns ingen publicerad kursutveckling för vald termin',

    /** ************ BUTTONS ****************** */
    btn_preview: 'Preview ',
    btn_back_edit: ' Edit, upload',
    btn_cancel: 'Cancel',
    btn_save: ' Save draft',
    btn_publish: 'Publish',
    btn_back: 'Choose course offering',
    btn_delete: 'Delete',
    btn_save_and_cancel: 'Save draft and cancel',

    /** ************ PAGE 2 FORM ************** */
    add_file: 'Drag and drop the file here <span class="filepond--label-action"> or click here to browse </span>',
    asterix_text: '* Data cannot be changed after published',
    not_authorized_course_offering: 'You are not course responsible for this course offering and cannot select it.',
    // asterix_text_2: '** Går ej att redigera inlagd information från Kopps',

    header_review_fetched_data: 'Review fetched course data',
    header_upload: 'Upload',

    header_programs: 'Compulsory within programme',
    header_rounds: 'Administrative course instances included in the course offering',
    header_examiners: 'Examiner ',
    // header_employees: 'Kursansvarig, Examinator ',
    header_responsibles: 'Course responsible',
    header_registrated: 'Number of registered students',
    header_examination: 'Examination',
    header_examination_comment: 'Examination comments',
    header_examination_grade: 'Graduation rate',
    header_course_changes_comment: 'Changes of the course before this course offering',
    header_analysis_edit_comment: 'Comments to changes in course data or course analysis after published.',
    header_upload_file: 'Course analysis',
    header_upload_file_pm: 'Course memo',
    header_more_information: 'More information', // ?
    header_publish_dates: 'Date of published course analysis with course data', // ?
    header_results: 'Results', // ?

    last_change_date: 'Last time changed: ',
    no_changes: 'No changes since first published',
    published_first_time: 'Published first time: ',

    link_syllabus: 'Course syllabus ', /** Followed by ([giltighetstermin år] – [sista giltighetstermin år]) */
    link_pm: 'Course memo',
    link_analysis: 'Course anlaysis ', /** Followed by [dd/mm/yyyy] */

    draft_empty: 'Det finns inga sparade utkast för vald termin',
    published_empty: 'There are no published course analysis with course data this term.',
    new_empty: 'Det finns inga ej påbörjade kurstillfällen för vald termin',

    alert_no_rounds_selected: 'Du måste välja en kursomgång/ kurstillfälle nedan, innan du klickar på knapp "Granska" eller "Redigera".',
    alert_no_rounds: 'Den här kursen har inga kursomgångar',

    /** ************ MODALS ************** */

    info_publish: {
      header: 'To be aware of before publishing!',
      body: `The following fields cannot be changed after the information is published: <br/>
        <li> Examiner</li>
        <li> Course responsible</li>
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

    info_delete: {
      header: 'Are you sure you want to delete the draft?',
      info_delete_body_row_1: 'You have chosen: ~Term: ~Course offering: ~<br/><br/>Do you want to delete the draft?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, delete'
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
