import Ember from 'ember';

export default Ember.Component.extend({
    data: Ember.computed('layout', function(){
        let dataSource = this.get('layout.data');
        return this.get('model.settings').data[dataSource];
    }),
    searchQuery: '',
    actions: {
        search(){
            this.get('changeRoute')('collection.search', this.get('model.id'));
        }
    },
    containerStyle: Ember.computed('branding.colors', function() {
       return Ember.String.htmlSafe("background-color: " + this.get('branding.colors.background') + "; color: " + this.get('branding.colors.backgroundText'));
   }),
   logoStyle: Ember.computed('branding.logo', function() {
      return Ember.String.htmlSafe("background-image: url(" + this.get('branding.logo.url') + "); height: " + this.get('branding.logo.height'));
    })
});
