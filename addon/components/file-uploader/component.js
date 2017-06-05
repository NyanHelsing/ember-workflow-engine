import Ember from 'ember';
//import ENV from 'analytics-dashboard/config/environment';

function getToken() {
    const session = window.localStorage['ember_simple_auth:session'];
    if (session) {
        const token = JSON.parse(session)['authenticated'];
        if ('attributes' in token) {
            return token['attributes']['accessToken'];
        }
        return token;
    }
}

export default Ember.Component.extend({

    actions: {

        uploadFile: function(target) {

            const saveParameter = this.attrs.saveParameter;
            const reader = new FileReader();
            const f = event.target.files[0];
            const uri = "https://files.osf.io/v1/resources/h8d72/providers/osfstorage/?kind=file&name=" + f.name;
            const message = this.get('message');
            const parameter = this.get('message.response');
            const caxe = this.get('message.caxe');

            const refresh = this.attrs.refresh;
            const store = this.get("store");

            reader.onloadend = function(e) {
                saveParameter({
                    state: ['defined'],
                    value: e.target.result
                });
                /*const xhr = new XMLHttpRequest();
                xhr.open("PUT", uri, true);
                xhr.withCredentials = true;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState == 4 && xhr.status >= 200 && xhr.status < 300) {
                        debugger;
                        this.attrs.output = {
                            state: ['defined'],
                            value: JSON.parse(xhr.responseText).data.links.download
                        }
                        refresh();
                    }
                };
                xhr.send(e.target.result);*/
            };

            reader.readAsBinaryString(f);
        },

        associateResource: async function(resourceIdentifier) {
        }

    }

});
