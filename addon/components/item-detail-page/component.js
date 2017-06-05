import Ember from 'ember';
import {itemClasses} from 'collections/utils/itemClasses';

export default Ember.Component.extend({
    store: Ember.inject.service(),
    session: Ember.inject.service(),
    constructedItem: null,
    didReceiveAttrs (){
        let type = this.get('item.type');
        this.set('constructedItem', itemClasses[type].create({
            session: this.get('session'),
            store : this.get('store'),
            item: this.get('item')
        }));
    }
});
