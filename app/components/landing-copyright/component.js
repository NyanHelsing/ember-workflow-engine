import Ember from 'ember';

export default Ember.Component.extend({
    data: Ember.computed('layout', function(){
        let dataSource = this.get('layout.data');
        return this.get('model.settings').data[dataSource];
    }),
});
