import Ember from 'ember';

export default Ember.Component.extend({
    tagName: null,
    classNameBindings: ['rowSelected:item-row-selected'],
    cardView: true,
    item: null,
    selected: false,
    rowSelected: Ember.computed('organizeMode', 'item.selected', function(){
        return this.get('organizeMode') ? this.get('item.selected') : false;
    }),
    actions : {
        markSelected (item) {
            this.get('item').toggleProperty('selected');
            this.sendAction('toggleSelectedList', this.get('item.selected'), item);
        }
    }
});
