import Ember from 'ember';
import layout from './template';

export default Ember.Component.extend({
    layout,
    description: "Enter a title for the preprint.",

    didReceiveAttrs: function() {
        this.set('description', this.attrs.description);
    },

    textFieldValueObserver: Ember.observer('textFieldValue', function() {
        const saveParameter = this.attrs.saveParameter;
        const parameters = this.attrs.widget.value.parameters;
        saveParameter(parameters.output, {
            state: ['defined'],
            value: this.get('textFieldValue')
        });
    }),

});
