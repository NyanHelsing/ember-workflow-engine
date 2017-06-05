import Ember from 'ember';


function updateState() {
    console.log('updating state');
    const state = this.get('state')
    this.get('actions').forEach((action) => {

        function condition_dispatcher(condition) {

            // Check if its a regular condition
            if (condition.parameter !== undefined) {
                // actualy check the condition is met;
                // the parameter has to have the given state.
                if (state[condition.parameter] === undefined) {
                    state[condition.parameter] = {};
                }
                if (state[condition.parameter].state === undefined) {
                    state[condition.parameter].state = [];
                }
                const parameter_state = state[condition.parameter].state
                // check that the state exists for this item
                return parameter_state.some((state_item) => state_item === condition.state)
            }

            // Check if its an 'all' composite condition
            if (condition.all !== undefined &&
                condition.all.constructor === Array
            ) {
                // if any conditions fail, the whole check fails.
                return check_all(condition.all);
            }

            // Check if its an 'any' composite condition
            if (condition.any !== undefined &&
                condition.any.constructor === Array
            ) {
                // if any conditions are met, the whole check passes.
                return check_any(condition.any);
            }

            // Check if its a 'none' composite condition
            if (condition.none !== undefined &&
                condition.none.constructor ===Array
            ) {
                // if any conditions are met, the whole check fails.
                return !check_any(condition.none);
            }

            return false;

        }

        function check_all(conditions) {
            // if any conditions fail, the whole check fails.
            return !conditions.some(function(condition) {
                return !condition_dispatcher(condition);
            });
        }

        function check_any(conditions) {
            // if any conditions are met, the whole check passes.
            return action.conditions.some(condition_dispatcher)
        }

        // check if the action can fire.
        const may_fire = check_all(action.conditions);
        if (!may_fire) { return; }

        // action may fire
        this.set('state.'+action.output, {
            value: this.get(action.type).call(this, (action.parameters)),
            state: ['defined']
        });
    });
}

export default Ember.Controller.extend({
    addMethod: 'select', // 'select' or 'create'
    methodSelected: false,
    type: Ember.computed('model.settings', function() {
        var collectionType = this.get('model.settings.collectionType') || 'project';
        return collectionType.toLowerCase();
    }),

    widgets: [],

    create_widget(parameters) {
        debugger;
        this.get('widgets').pushObject(parameters);
        return parameters;
    },

    run_update: function () {
        updateState.call(this);
    },

    //save_section: function(section) {
    //    return function() {
    //        widgets.filter((widget) => {
    //            return widget.section == section;
    //        }).map(widget) => {
    //            return this.get('state.' + widget.output);
    //        });
    //    };
    //}

    //widgetActions: Ember.computed('widgets.@each.actions', function() {
    //   return this.get('widgets').map((widget) => {
    //        widget._action = this.get(widget.action).apply(this, widget.
    //    });
    //}),

    //refresh() {

    //},


    saveParameter(state, parameter, value) {
        state[parameter] = value;
        debugger;
        updateState.call(this);
        //this.get('refresh')();
    },
    saveSubjects(currentSubjects, subjectMap, disciplineChanged) {
      // Update section data
      let model = this.get('model');
        // Current subjects saved so UI can be restored in case of failure
      if (disciplineChanged) {
          this.set('model', 'subjects', subjectMap);
          //model.save()
          //    .then(() => {
          //        this.send('next', this.get('_names.1'));
          //    })
          //    .catch(() => {
          //        model.set('subjects', currentSubjects);
          //        this.get('toast').error(this.get('i18n').t('submit.disciplines_error'));
          //    });
      } else {
          this.send('next', this.get('_names.1'));
      }
    },

    actions: {

        updateProperty(oldValue, newValue) {
            this.set(oldValue, newValue);
            this.set('methodSelected', true); // Change view to show the methods
        },

        transition(name, id) {
            this.transitionToRoute(name, id);
        },

    }

});
