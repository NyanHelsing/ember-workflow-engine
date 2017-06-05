import Ember from 'ember';

export default Ember.Component.extend({
    newItemNode: Ember.Object.create(),
    store: Ember.inject.service(),
    searchGuid: '',
    searchFilter: '',
    loadingItem: false,
    showAddItemDetails: false,
    findItemError: null,
    results: null,
    showResults: false,
    displayItemType: Ember.computed('type', function(){
        return this.get('type') === 'node' ? 'projects' : this.get('type') + 's';
    }),
    recordType: Ember.computed('type', function() {
        var collectionType = this.get('type');
        return (collectionType === 'project' || collectionType === 'preprint') ? 'node' : collectionType;
    }),

    clearFilters(){
        this.set('searchGuid', '');
        this.set('searchFilter', '');
    },
    clearView(){
        this.set('loadingItem', false);
        this.set('showAddItemDetails', false);
        this.set('findItemError', null);
        this.set('results', null);
        this.set('showResults', false);
    },
    buildNodeObject (item){
        this.get('newItemNode').setProperties({
            title:  item.get('title'),
            description: item.get('description'),
            type: this.get('type'), // set by the app based on selection of tab
            source_id: item.get('id'),
            link: item.get('links.html')
        });
    },
    didUpdateAttrs () {
        this.clearView();
        this.clearFilters();
    },
    actions: {
        findNode () {
            if(!this.get('searchGuid')){
                return;
            }
            this.clearView();
            this.set('loadingItem', true);
            // We need to add type variable here because there is no model for project in ember-osf but 'node
            let type = this.get('type') === 'project' ? 'node' : this.get('type');
            this.get('store').findRecord(type, this.get('searchGuid')).then(item => {
                if(this.get('type') === 'preprint'){
                    item.get('node').then(node => {
                        item.set('title', node.get('title'));
                        this.buildNodeObject(node);
                    });
                } else {
                    this.buildNodeObject(item);
                }
                this.set('showAddItemDetails', true);
                this.set('loadingItem', false);
            }).catch(error => {
                this.clearView();
                this.clearFilters();
                this.set('findItemError', error.errors);
            });

        },
        addItem(node){
            if(node){
                this.buildNodeObject(node);
            }
            let nodeObject = this.get('newItemNode');
            let item = this.get('store').createRecord('item', {
                title: nodeObject.get('title'),
                type: nodeObject.get('type'),
                metadata: '',
                status: 'pending',
                url: nodeObject.get('link'),
                source_id: nodeObject.get('source_id'),
                collection : this.get('model')
            });
            item.save().then(() => {
                this.get('transition')('collection.browse', this.get('model.id'));
            });
            this.clearView();
            this.clearFilters();
        },
        searchNode () {
            let filterText = this.get('searchFilter');
            if(!filterText){
                return;
            }
            this.clearView();
            this.set('loadingItem', true);
            let filter = {};
            filter['filter[title]'] = filterText;
            if(this.get('type') === 'preprint'){
                filter['filter[preprint]'] = true;
            }
            this.get('store').query(this.get('recordType'), filter).then(results => {
                this.set('results', results);
                this.set('loadingItem', false);
                this.set('showResults', true);
            }).catch(error => {
                this.clearView();
                this.clearFilters();
                this.set('findItemError', error.errors);
            });
        },
        enterPressSearch(){
            this.get('actions').searchNode.call(this);
        },
        enterPressGuid(){
            this.get('actions').findNode.call(this);
        }
    }

});
