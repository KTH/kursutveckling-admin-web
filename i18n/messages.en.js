module.exports = {
  shortNames: ['en'],
  longNameSe: 'Engelska',
  longNameEn: 'English',
  messages: {
    date_format_short: '%d-%b-%Y',

    error_not_found: "Sorry, we can't find your requested page",
    error_generic: 'Something went wrong on the server, please try again later.',
    contact_support: 'Contact',
    for_questions: 'for questions',
    friendly_message_have_not_rights: 'Missing permission to use About the course administration tool.',
    look_at_list_of_kopps_admin:
      'If you want to know who is the Kopps administrator at your school, look at the list here:',
    message_have_not_rights: `Missing permission to use About the course administration tool. Permission is automatically granted to those who are registered in KOPPS as an examiner, course coordinator or teacher for the course.`,

    /**
     * Message keys
     */
    service_name: 'kurs ',
    title: 'Course analysis administration',

    lang_block_id: '1.272446',
    locale_text: 'Course information in English',
    site_name: 'Course information',
    host_name: 'KTH',
    page_student: 'STUDENT PÅ KTH',
    page_course_programme: 'KURS- OCH PROGRAMKATALOGEN',

    course_short_semester: {
      1: 'Spring ',
      2: 'Autumn ',
    },
    header_main: {
      new: 'Publish new course analysis and course data',
      draft: 'Publish new course analysis and course data',
      published: 'Change published course analysis and course data',
      preview: 'Preview draft of course analysis and course data',
    },

    /** * PAGE 1 */
    header_choose_course_offering: 'Choose course offering',

    select_semester: 'Choose semester',
    header_analysis_menu: 'Choose course offering',
    label_start_date: 'Start date',

    //* **** PROGRESS BAR  */
    /* **** INTRO TEXT FOR ANALYSIS MENUE, EDIT, PREVIEW */
    pagesProgressBar: [
      {
        title: 'Choose course offering',
        intro:
          'Choose a semester and a course offering for the course analysis to be published (step 1 of 3). In the next step (2 of 3), course data will be fetched automatically for the selected semester and course offering. It is there possible to edit some of the course data and upload a course analysis document. Preview the table with the course data and course analysis that are about to be published in the last step (3 of 3). The course data with the course analysis will then be published on the page Course development.',
      },
      {
        title: 'Edit course data and upload course analysis',
        intro:
          'In this step (2 of 3) course analysis shall be uploaded, changes to the chosen course offering is summarized and some of the course data are reviewed and adjusted.',
      },
      {
        title: 'Review and publish',
        intro: '',
      },
    ],

    //* **** INTRO SELECT NEW, DRAFT, PUBLISHED */
    intro_new:
      'The following administrative course instances have no course analysis and course data published. Select the instances which makes the course offering that the course analysis was made for. ',
    intro_draft: 'The following course offerings have saved drafts that are not yet published.',
    intro_published:
      'The following course offerings have published course analysis. Choose the course offering to edit and to publish a new version.The following course offerings have published course analysisand course data.Choose the course offering to edit and re-publish.',

    /* **** EMPTY TEXT FOR NEW, DRAFT, PUBLISHED */
    new_empty:
      'Course analysis and course data have been published for all course offerings this semester. Check published course analysis on the page Course development and history.',
    draft_empty: 'There are no saved drafts this semester',
    published_empty: 'There are no published course analysis and course data this semester.',

    not_authorized_course_offering:
      'You can only preview this draft since you are not course coordinator for this course offering.',
    not_authorized_publish_new: 'You are not course coordinator for this instance and cannot select it.',

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

    asterix_text: 'Data cannot be changed after published',

    header_mandatory_fields: '* Mandatory fields',
    header_semester: 'Semester: ' /** Visas i steg 2, följt av kursomgångens starttermin */,
    header_course_offering: 'Course offering:' /** Visas i steg 2, följt av kursomgångens namn */,
    header_upload: 'Upload' /** Visas i steg 2, rubrik för kolumn 1 */,
    header_summarize: 'Summarize changes' /** Visas i steg 2, rubrik för kolumn 2 */,
    header_check_data: 'Check fetched data' /** Visas i steg 2, rubrik för kolumn 3 */,
    header_review_fetched_data: 'Review fetched course data',
    header_programs: 'Compulsory within programme',
    header_rounds: 'Administrative course instances included in the course offering',
    header_examiners: 'Examiner *',
    header_responsibles: 'Course coordinator *',
    header_registrated: 'Number of first registered students *',
    header_examination: 'Examination',
    header_examination_comment: 'Examination comments',
    header_examination_grade: 'Graduation rate *',
    header_course_changes_comment: 'Changes of the course before this course offering',
    header_analysis_edit_comment: 'Comments to changes in course data or course analysis after published *',
    header_upload_file: 'Course analysis (only as PDF file format) *',
    header_upload_file_date: 'Publish date of course analysis *',
    header_more_information: 'More information', // ?
    header_publish_dates: 'Date of published course analysis with course data', // ?
    header_results: 'Results', // ?
    header_copy_link: 'Copy link to last saved draft',
    header_end_date: 'Per end date',
    header_result: 'Result',

    last_change_date: 'Last time changed: ',
    no_changes: 'No changes since first published',
    published_first_time: 'Published first time: ',

    link_syllabus: 'Course syllabus ' /** Followed by ([giltighetstermin år] – [sista giltighetstermin år]) */,
    link_syllabus_empty: 'Link not available in preview',
    link_analysis: { label_analysis: 'Course analysis', no_added_doc: 'No course analysis added' },
    link_memo: { label_memo: 'Course memo', no_added_doc: 'Missing a published course memo' },

    original_values_are: 'The original values are',
    and: 'and',

    /** ************ ALERTS ************** */
    alert_no_course_memo_header: 'Complete afterwards with the missing course memo',
    alert_no_course_memo_info: `After you have finished here, you can publish the course memo for these course offerings in: Administrate About course information. The published course memo will be displayed on pages: Course development and Course memo.`,
    alert_no_rounds_selected:
      'Choose a course offering or administrative course instances below before you click on "Review" or "Edit, upload".',
    alert_no_rounds: 'Course analysis and course data are published for all course offerings this semester',
    alert_no_published: 'There are no published course analysis and course data this semester.',
    alert_different_end_dates:
      'Selected administrative course instances have different end dates. Select the instances that were included in the same course offering.' /* GRÄDDEN PÅ SEMLAN */,
    alert_saved_draft: 'A draft of course analysis and course data have been saved',
    alert_empty_fields: 'All mandatory fields must contain information before proceeding to Review and publish.',
    alert_uploaded_file: 'Selected file has been uploaded and been given a new file name',
    alert_not_pdf: 'The specified file could not be uploaded. The file format must be PDF.',
    alert_graduation_rate_fields_updated: 'One or both of the graduation rate fields have been manually updated.',
    alert_graduation_rate_cant_be_calculated:
      'Number of first registered students and graduation rate can’t be automatically calculated for this course offering.',
    /** ************ MODALS ************** */
    aria_label_close_icon: 'Close',

    info_publish: {
      header: 'To be aware of before publishing!',
      body: `The information will be published on the page Course development
        <br/> 
        <br/> 
        Do you want to publish?`,
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, publish',
    },
    info_copy_link: {
      header: 'Copy link to saved draft',
      body: 'Copy link below, paste it and send the link to the person you want to review the draft.',
      btnCancel: 'Close',
    },
    info_cancel: {
      header: 'To be aware of before cancelling!',
      body: 'Unsaved changes will be lost if you cancel the publishing of course analysis <br/>  <br/> Do you want to cancel?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, cancel',
    },
    info_delete: {
      header: 'To be aware of before deleting this draft!',
      body: 'Deleting the draft cannot be undone. The draft draft will be lost. <br/><br/> Do you want do delete this draft?',
      btnCancel: 'No, go back',
      btnConfirm: 'Yes, delete',
    },

    /** **** INFO BUTTONS ***** */
    info_select_semester: {
      header: 'Choose semester',
      body: 'Choose what semester the course offering started. If the course offering stretched over several semesters then choose the first semester.',
      btnCancel: 'Close',
    },
    info_choose_course_offering: {
      header: 'Choose course offering',
      body: 'Choose all the administrative course instances that was included in the course offering. Students are admitted to an administrative course instance. Degree program students and non-programme students are admitted to different administrative course instances but may be educated in the same course offering. A course offering is thereby the practical realisation of the course with a common start date, common pace, common timetable etc. for all students. Several administrative course instances are grouped to one course offering.',
      btnCancel: 'Close',
    },

    info_registrated: {
      header: 'First time registered students',
      body: 'Number of first registration students are defined as the number of first registration students on all the administrative course instances that are included in the course offering. The number is fetched automatically from Ladok for course offerings with a start semester from Spring 2017 and later. It is possible to enter number of first registration students manually. Admitted students that have not been registered shall not be counted. Neither shall registered students that have been re-registered from a previous administrative course instance be counted. Number of registered students is counted on the start semester of the course offering.',
      btnCancel: 'Close',
    },

    info_examination_grade: {
      header: 'Graduation rate in percent (%)',
      body: 'Graduation rate is defined as the number of passed first registration students on the whole course by entered end date divided by the number of registered students (as defined above) on the course offering in percent (%). The number is fetched automatically from Ladok for course offerings with a start semester from Spring 2017 and later based on the end date of the course offering. It is possible to recalculate graduation rate based on a manually entered end date. It is also possible to enter graduation rate manually. In that case end date is not relevant. Graduation rate is not calculated for each examination session in the course examination set. Neither is it recalculated after each following re-examination. Graduation rate is calculated based on information fetched from Ladok.',
      btnCancel: 'Close',
    },

    info_examiners: {
      header: 'Examiners',
      body: 'The examiners of the course at the time of the course offering. Examiners are administrated in Kopps.',
      btnCancel: 'Close',
    },

    info_responsibles: {
      header: 'Course coordinators',
      body: 'All the course coordinators for all the administrative course instances that are included in the course offering. Course coordinators are administrated in Kopps.',
      btn_close: 'Close',
    },

    info_end_date: {
      header: 'End Date',
      body: 'End date used for the calculated examination grade.',
      btnCancel: 'Close',
    },

    info_edit_comments: {
      header: 'Comments to changes',
      body: 'It is possible to upload new versions of course analysis and rewrite changes to this course offering. Comment the purpose of the new versions in this field.',
      btnCancel: 'Close',
    },
    info_upload_course_analysis: {
      header: 'Upload course analysis',
      body: 'Upload the latest version of the course analysis for the course offering.',
      btnCancel: 'Close',
    },
    info_upload_course_analysis_date: {
      // Semlan
      header: 'Publish date of course analysis',
      body: 'The date of when the course analysis is published. Leave the automatically proposed date if the course analysis is published for a recently finished course offering. If the course analysis has previously been published, use the date when it was originally published.',
      btnCancel: 'Close',
    },
    info_course_changes_comment: {
      header: 'Summarize changes to the course',
      body: 'Summarized changes made to the course before this particular course offering. The purpose of publishing changes made to the course is to show the improvements of the course over time. All changes documented to the course offerings gives an overview of the improvement steps of the course.',
      btnCancel: 'Close',
    },

    info_published: {
      header: 'Course analysis and course data have been published',
      body: 'View results on the page:' /** Följt av länk till sidan "Course development*/,
    },
    info_draft_saved: {
      header: 'A draft of course analysis and course data have been saved',
      body: 'Copy link to draft of publish from the page:' /** Följt av länk till steg 1, "Publish new course analysis and course data" */,
    },
    info_draft_deleted: {
      header: 'Draft of course analysis and course data have been deleted',
    },
    //* **** PREVIEW **********
    info_manually_edited: '* Course data has been registered manually',
    header_course_round: 'Course round ',
    table_headers_with_popup: {
      examiners: {
        header: 'Examiners',
        popoverText:
          'The examiners of the course at the time for the course offering. Examiners are administrated in Kopps.',
      },
      examRounds: { header: 'Examination', popoverText: 'Form of examinataion for the course offering.' },
      alterationText: {
        header: 'Changes of the course before this course offering',
        popoverText: 'Summarized changes made to the course before this particular course offering.',
      },
      examinationGrade: {
        header: 'Result',
        popoverText:
          'Graduation rate is defined as the number of passed first registration students on the whole course divided by the number of registered student (as defined above) after the first ordinary examination after the end date of the course offering. Graduation rate is not calculated for each examination session in the course examination set. Neither is it recalculated after each following re-examination. Graduation rate is calculated based on information fetched from Ladok.',
      },
      responsibles: {
        header: 'Coordinator',
        popoverText:
          'All the course coordinators for the all the administrative course instances that are included in the course offering. Course coordinators are administrated in Kopps.',
      },
      registeredStudents: {
        header: 'Students',
        popoverText:
          'Number of registered students are defined as the number of first registration students on all the administrative course instances that are included in the course offering. Admitted students that have not been registered shall not be counted. Neither shall registered students that have been re-registered from a previous administrative course instance counted. Number of registered students is calculated based on information fetched from Ladok.',
      },
    },
    extra_kopps_info: {
      no_added: 'No information inserted',
      commentExam: {
        header: 'Examination comments',
        popoverText: 'Examination comments for the course offering examination.',
      },
      programmeCodes: { header: 'Compulsory within programme', popoverText: '' },
      analysisName: {
        header: 'Administrative course instances included in the course offering',
        popoverText:
          'All the administrative course instances that was included in the course offering. Students are admitted to an administrative course instance. Degree program students and non-programme students are admitted to different administrative course instances but may be educated in the same course offering. A course offering is thereby the practical realisation of the course with a common start date, common pace, common timetable etc. for all students. Several administrative course instances are grouped to one course offering',
      },
    },
    extra_dates_and_comments: {
      no_added: 'No information inserted',
      header_publishing_dates: 'Published date',
      publishedDate: 'Published first time',
      changedAfterPublishedDate: 'Last time changed',
      commentChange: 'Comments to changes in course data or course analysis after publishing',
      no_date_last_changed: 'No changes since first published.',
    },
    header_more_info: 'More information',
    no_course_analys: 'Course analysis with course data is not available yet.',
    popover_more_info: 'More information',
  },
}
