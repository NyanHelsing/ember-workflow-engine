import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({

    layout,

    didReceiveAttrs() {
        this.set('widgetClasses', this.attrs.widget.value.css_classes)
    },

    buttonString: 'Save',

    widgetClasses: ['section-submit-button'],
    widgetClassString: Ember.computed('widgetClasses', function() {
        let classArr = this.get('widgetClasses')
        if (classArr === undefined ||
            classArr.constructor !== Array
        ) {
            classArr = [];
        }
        return classArr.join(' ');
    }),

    actions: {
        async pressButton() {
            const parameters = this.attrs.widget.value.parameters;
            this.attrs.saveParameter(parameters.parameter, {
                value: await this.get('action')(this),
                state: ['defined']
            });
        }
    }

});
