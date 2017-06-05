import Ember from 'ember';

var settings = {
  sections: [
    {
      title: 'subject-picker',
      settings: {
        subjects: []
      }
    }
  ],
  values: {
    'subject-picker': {},
    'contributors': {}
  }
};

export default Ember.Route.extend({

    model() {
        return {
            submission_form_name: 'Preprints Submission Form',
            sections: [
                'upload',
                'disciplines',
                'basic info',
                'authors',
                'submit'
            ],
            initial_state: {
                upload_section: {
                    state: ['unsaved', 'editing'],
                    value: undefined
                },
                disciplines_section: {
                    state: ['disabled'],
                    value: undefined
                },
                basic_info_section: {
                    state: ['disabled'],
                    value: undefined
                },
                authors_section: {
                    state:  ['disabled'],
                    value: undefined
                },
                submit_button: {
                    state: ['disabled'],
                    value: undefined
                },
                preprint_file_upload_widget: {
                    state: ['undefined'],
                    value: undefined
                },
                preprint_title_widget: {
                    state: ['undefined'],
                    value: undefined
                },
                save_upload_section_widget: {
                    state: ['undefined'],
                    value: undefined
                },
                subject_picker_widget: {
                    state: ['undefined'],
                    value: undefined
                }
            },
            actions: [{
                type: 'create_widget',
                parameters: {
                    widget_component: 'file-uploader',
                    description: 'Choose the preprint file to upload',
                    section: 'upload',
                    output: 'preprint_file_data'
                },
                output: 'preprint_file_upload_widget',
                conditions: [{
                    all: [{
                        parameter: 'upload_section',
                        state: 'unsaved',
                    }, {
                        parameter: 'preprint_file_upload_widget',
                        state: 'undefined'
                    }]
                }]
            }, {
                type: 'create_widget',
                parameters: {
                    widget_component: 'text-field',
                    description: 'Enter the title for this preprint',
                    section: 'upload',
                    output: 'preprint_file_name'
                },
                output: 'preprint_title_widget',
                conditions: [{
                    all: [{
                        parameter: 'preprint_title_widget',
                        state: 'undefined',
                    }, {
                        parameter: 'preprint_file_data',
                        state: 'defined',
                    }, {
                        parameter: 'upload_section',
                        state: 'editing',
                    }],
                }]
            }, {
                type: 'create_widget',
                parameters: {
                    widget_component: 'button-widget',
                    description: 'Save this section',
                    section: 'upload',
                    output: 'upload_section'
                },
                output: 'save_upload_section_widget',
                conditions: [{
                    all: [{
                        parameter: 'save_upload_section_widget',
                        state: 'undefined',
                    }, {
                        parameter: 'preprint_file_data',
                        state: 'defined',
                    }, {
                        parameter: 'preprint_file_name',
                        state: 'defined'
                    }, {
                        parameter: 'upload_section',
                        state: 'editing',
                    }],
                }]
            }, {
                type: 'create_widget',
                parameters: {
                    widget_component: 'subject-picker',
                    description: 'Save this section',
                    section: 'disciplines',
                    output: 'selected_subjects'
                },
                output: 'subject_picker_widget',
                conditions: [{
                    all: [{
                        parameter: 'subject_picker_widget',
                        state: 'undefined',
                    }],
                }]
            }]
        };
    },

    setupController(controller, model) {
        controller.set('form_config', model);
        controller.set('actions', model.actions);
        controller.set('sections', model.sections);
        controller.set('state', model.initial_state);
        controller.run_update()
    }

});
