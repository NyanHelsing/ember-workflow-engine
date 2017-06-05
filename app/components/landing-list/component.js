import Ember from 'ember';

export default Ember.Component.extend({
    data: Ember.computed('layout', function(){
        let dataSource = this.get('layout.data');
        return this.get('model.settings').data[dataSource];
    }),
    buttonStyle: Ember.computed('branding.colors', function() {
       return Ember.String.htmlSafe("background-color: " + this.get('branding.colors.primary'));
     })
});
