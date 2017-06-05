import Ember from 'ember';


export default Ember.Component.extend({

    buttonString: 'Save',

    actions: {
        pressButton() {
            this.attrs.action();
        }
    }

});
