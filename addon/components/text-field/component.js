import Ember from 'ember';


export default Ember.Component.extend({

    textFieldValueObserver: Ember.observer('textFieldValue', function() {

        this.attrs.saveParameter({
            state: ['defined'],
            value: this.get('textFieldValue')
        })

    }),

});
