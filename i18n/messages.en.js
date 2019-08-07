module.exports = {
  shortNames: [ 'en' ],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {

    date_format_short: '%d-%b-%Y',

    error_not_found: 'Sorry, we can\'t find your requested page',
    error_course_not_found: 'Sorry, there is no course with course code ',
    error_generic: 'Something went wrong on the server, please try again later.',

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Course analyses administration',

    lang_block_id: '1.272446',
    locale_text: 'Course information in English',
    site_name: 'Course information',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn '
    },
    header_main: {
      new: 'Publish new course analysis and course data',
      draft: 'Publish new course analysis and course data',
      published: 'Change published course analysis and course data',
      preview: 'Preview draft of course analysis and course data'
    },

    /** * PAGE 1 */
    header_choose_course_offering: 'Choose course offering',

    select_semester: 'Choose semester',
    header_analysis_menu: 'Choose course offering',
    label_start_date: 'Start date',

    //* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    intro_analysis_menu: 'Choose a semester and a course offering for the course analysis to be published (step 1 of 3). In the next step (2 of 3), course data will be fetched automatically for the selected semester and course offering. It is there possible to edit some of the course data and upload a course analysis document. Preview the table with the course data and course analysis that are about to be published in the last step (3 of 3). The course data with the course analysis will then be published on the page Course development and history.',
    intro_edit: 'In this step (2 of 3) course analysis and course memo are uploaded, changes to the chosen course offering is summarized and some of the course data are reviewed and adjusted if not correct.',
    intro_preview: 'In this step (3 of 3) a preview of the course analysis with course data is presented as it will be published on the page Course development and history. It is possible to go back to make adjustments, to save a draft or publish the information.',

    //* **** INTRO SELECT NEW, DRAFT, PUBLISHED */
    intro_new: 'The following administrative course instances have no course analysis and course data published. Select the instances which makes the course offering that the course analysis was made for. ',
    intro_draft: 'The following course offerings have saved drafts that are not yet published.',
    intro_published: 'The following course offerings have published course analysis. Choose the course offering to edit and to publish a new version.The following course offerings have published course analysisand course data.Choose the course offering to edit and re-publish.',

    /* **** EMPTY TEXT FOR NEW, DRAFT, PUBLISHED */
    new_empty: 'Course analysis and course data have been published for all course offerings this semester. Check published course analysis on the page Course development and history.',
    draft_empty: 'There are no saved drafts this semester',
    published_empty: 'There are no published course analysis and course data this semester.',

    not_authorized_course_offering: 'You can only preview this draft since you are not course responsible for this course offering.',
    not_authorized_publish_new: 'You are not course responsible for this instance and cannot select it.',

    /** ************ BUTTONS ****************** */
    btn_preview: 'Preview ',
    btn_add_analysis: 'Edit, upload',
    btn_cancel: 'Cancel',
    btn_save: 'Save draft',
    btn_publish: 'Publish',
    btn_back: 'Choose course offering',
    btn_back_edit: 'Edit, upload',
    btn_delete: 'Delete',
    btn_save_and_cancel: 'Save draft and cancel',
    btn_copy: 'Copy link to preview',

    /** ************ PAGE 2 FORM ************** */

    asterix_text: '* Data cannot be changed after published',

    header_semester: 'Semester: ', /** Visas i steg 2, följt av kursomgångens starttermin */
    header_course_offering: 'Course offering:', /** Visas i steg 2, följt av kursomgångens namn */
    header_upload: 'Upload', /** Visas i steg 2, rubrik för kolumn 1 */
    header_summarize: 'Summarize changes', /** Visas i steg 2, rubrik för kolumn 2 */
    header_check_data: 'Check fetched data', /** Visas i steg 2, rubrik för kolumn 3 */
    header_review_fetched_data: 'Review fetched course data',
    // header_course_offering: 'Upload course analysis and edit course data for:',
    header_programs: 'Compulsory within programme',
    header_rounds: 'Administrative course instances included in the course offering',
    header_examiners: 'Examiner ',
    // header_employees: 'Kursansvarig, Examinator ',
    header_responsibles: 'Course responsible',
    header_registrated: 'Number of first registered students',
    header_examination: 'Examination',
    header_examination_comment: 'Examination comments',
    header_examination_grade: 'Graduation rate',
    header_course_changes_comment: 'Changes of the course before this course offering',
    header_analysis_edit_comment: 'Comments to changes in course data or course analysis after published.',
    header_upload_file: 'Course analysis (only as PDF file format)',
    header_upload_file_pm: 'Course memo (only as PDF file format)',
    header_more_information: 'More information', // ?
    header_publish_dates: 'Date of published course analysis with course data', // ?
    header_results: 'Results', // ?

    last_change_date: 'Last time changed: ',
    no_changes: 'No changes since first published',
    published_first_time: 'Published first time: ',

    link_syllabus: 'Course syllabus ', /** Followed by ([giltighetstermin år] – [sista giltighetstermin år]) */
    link_pm: 'Course memo',
    link_analysis: 'Course anlaysis ', /** Followed by [dd/mm/yyyy] */

    /** draft_empty: 'Det finns inga sparade utkast för vald termin', */
    /** published_empty: 'There are no published course analysis and course data this semester.', */
    /** new_empty: 'Course analysis and course data are published for all course offerings this semester', */

    /** ************ ALERTS ************** */
    alert_no_rounds_selected: 'Choose a course offering or administrative course instances below before you click on "Review" or "Edit, upload".',
    alert_no_rounds: 'Course analysis and course data are published for all course offerings this semester',
    alert_no_published: 'There are no published course analysis and course data this semester.',
    alert_saved_draft: 'A draft of course analysis and course data have been saved',
    alert_empty_fields: 'All mandatory fields must contain information before proceeding to Review and publish.',
    alert_uploaded_file: 'Selected file has been uploaded',
    alert_not_pdf: 'The specified file could not be uploaded. The file format must be PDF.',

    /** ************ MODALS ************** */

    info_publish: {
      header: 'To be aware of before publishing!',
	    body: `The following fields cannot be changed after the information is published: <br/>
        <li> Examiner</li>
        <li> Course responsible</li>
        <li> Number of first registered students</li>
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
    info_copy_link: {
      header: 'Copy link to saved draft',
	    body: 'Copy link below, paste it and send the link to the person you want to review the draft.',
      btnCancel: 'Close'
    },
    info_cancel: {
      header: 'To be aware of before cancelling!',
	    body: 'Unsaved changes will be lost if you cancel the publishing of course analysis <br/>  <br/> Do you want to cancel?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, cancel'
    },
    info_delete: {
      header: 'To be aware of before deleting this draft!',
      body: 'Deleting the draft cannot be undone. The draft draft will be lost. <br/><br/> Do you want do delete this draft?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, delete'
    },

    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Info',
      body: 'Choose what semester the course offering started. If the course offering stretched over several semesters then choose the first semester.',
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
      body: 'The examiners of the course at the time of the course offering. Examiners are administrated in Kopps.',
      btnCancel: 'Close'
    },

    info_responsibles: {
      header: 'Info',
      body: 'All the course responsibles for all the administrative course instances that are included in the course offering. Course responsibles are administrated in Kopps.',
      btn_close: 'Close'
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
    },
    info_registrated: {
      header: 'Info',
      body: 'Number of first registration students are defined as the number of first registration students on all the administrative course instances that are included in the course offering. Admitted students that have not been registered shall not be counted. Neither shall registered students that have been re-registered from a previous administrative course instance be counted. Number of registered students is calculated based on information fetched from Ladok.',
      btnCancel: 'Close'
    },

    /** Nya texter */
    header_progress_select: '1. Choose course offering', /** Ersätter bilden, ska vara understruket med blå linje om användaren är i detta steg */
    header_progress_edit_upload: '2. Edit course data and upload course analysis', /** Ersätter bilden, ska vara understruket med blå linje om användaren är i detta steg */
    header_progress_review: '3. Review and publish', /** Ersätter bilden, ska vara understruket med blå linje om användaren är i detta steg */

    info_published: {
      header: 'Course analysis and course data have been published',
      /** semester: 'Semester:', /** Följt av kursomgångens starttermin */
      /** course_round: 'Course offering:', /** Följt av kursomgångens namn */
      body: 'View results on the page:' /** Följt av länk till sidan "Course development and history */
    },
    info_draft_saved: {
      header: 'A draft of course analysis and course data have been saved',
      /** semester: 'Semester:', /** Följt av kursomgångens starttermin */
      /** course_round: 'Course offering:', /** Följt av kursomgångens namn */
      body: 'Copy link to draft of publish from the page:' /** Följt av länk till steg 1, "Publish new course analysis and course data" */
    },
    info_draft_deleted: {
      header: 'Draft of course analysis and course data have been deleted'
      /** semester: 'Semester:', /** Följt av kursomgångens starttermin */
      /** course_round: 'Course offering:', /** Följt av kursomgångens namn */
      /** Länk till steg 1, "Publish new course analysis and course data" */

      // error_mandantory_fields: 'All mandatory fields must contain information before proceeding to Review and publish.',

    },
    //* **** PREVIEW **********
    header_course_round: 'Course round ',
    table_headers_with_popup: {
      examiners: { header: 'Examiners', popoverText: 'The examiners of the course at the time for the course offering. Examiners are administrated in Kopps.' },
      examShortAndLongStrArr: { header: 'Examination', popoverText: 'Form of examinataion for the course offering.' },
      alterationText: { header: 'Changes of the course before this course offering', popoverText: 'Summarized changes made to the course before this particular course offering.' },
      examinationGrade: { header: 'Result', popoverText: 'Graduation rate is defined as the number of passed first registration students on the whole course divided by the number of registered student (as defined above) after the first ordinary examination after the end date of the course offering. Graduation rate is not calculated for each examination session in the course examination set. Neither is it recalculated after each following re-examination. Graduation rate is calculated based on information fetched from Ladok.' },
      responsibles: { header: 'Responsible', popoverText: 'All the course responsibles for the all the administrative course instances that are included in the course offering. Course responsibles are administrated in Kopps.' },
      registeredStudents: { header: 'Students', popoverText: 'Number of registered students are defined as the number of first registration students on all the administrative course instances that are included in the course offering. Admitted students that have not been registered shall not be counted. Neither shall registered students that have been re-registered from a previous administrative course instance counted. Number of registered students is calculated based on information fetched from Ladok.' }
    },
    extra_kopps_info: {
      commentExam: { header: 'Examination comments', popoverText: 'Examination comments for the course offering examination.' },
      programmeCodes: { header: 'Compulsory within programme', popoverText: '' },
      analysisName: { header: 'Administrative course instances included in the course offering', popoverText: 'All the administrative course instances that was included in the course offering. Students are admitted to an administrative course instance. Degree program students and non-programme students are admitted to different administrative course instances but may be educated in the same course offering. A course offering is thereby the practical realisation of the course with a common start date, common pace, common timetable etc. for all students. Several administrative course instances are grouped to one course offering' }
    },
    extra_dates_and_comments: {
      header_publishing_dates: 'Published date',
      // alt_alla: 'It is possible to upload new versions of course analysis and course memos and rewrite changes to this course offering. Look at comments about the purpose of the new versions in this field',
      publishedDate: 'Published first time',
      changedAfterPublishedDate: 'Last time changed',
      commentChange: 'Comments to changes in course data or course analysis after publishing',
      no_date_last_changed: 'No changes since first published.'
    },
    header_more_info: 'More information',
    no_course_analys: 'Course analyses with course data is not available yet.',
    // no_pdf_document: 'not found',
    popover_more_info: 'More information',
    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn '
    }
  }
}
