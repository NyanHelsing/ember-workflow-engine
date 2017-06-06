import Ember from 'ember';
import layout from './template'

export default Ember.Component.extend({

    layout,

    actions: {

        uploadFile: function(ev) {

            const reader = new FileReader();
            const file_handle = ev.target.files[0];
            const saveParameter = this.attrs.saveParameter
            const filename_parts = ev.currentTarget.value.split('\\')
            const filename = filename_parts[filename_parts.length - 1];
            const parameters = this.attrs.widget.value.parameters;

            saveParameter(parameters.fileName, {
                value: filename,
                state: ['defined']
            });

            reader.onloadend = function(ev) {
                saveParameter(parameters.fileData, {
                    value: ev.target.result,
                    state: ['defined']
                });
            };

            reader.readAsBinaryString(file_handle);

        }
    }

});
