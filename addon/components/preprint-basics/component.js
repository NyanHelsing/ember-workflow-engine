import Ember from 'ember';
import layout from './template';
import fixSpecialChar from 'ember-osf/utils/fix-special-char';
import { validator, buildValidations } from 'ember-cp-validations';

// Form data and validations
const BasicsValidations = buildValidations({
    basicsAbstract: {
        description: 'Abstract',
        validators: [
            validator('presence', true),
            validator('length', {
                // currently min of 20 characters -- this is what arXiv has as the minimum length of an abstract
                min: 20,
                max: 5000
            })
        ]
    },
    basicsDOI: {
        description: 'DOI',
        validators: [
            validator('format', {
                // Simplest regex- try not to diverge too much from the backend
                regex: /\b(10\.\d{4,}(?:\.\d+)*\/\S+(?:(?!["&\'<>])\S))\b/,
                allowBlank: true,
                message: 'Please use a valid {description}'
            })
        ]
    }
});

function doiRegexExec(doi) {
    //Strips url out of inputted doi, if any.  For example, user input this DOI: https://dx.doi.org/10.12345/hello. Returns 10.12345/hello.
    // If doi invalid, returns doi.
    const doiRegex = /\b(10\.\d{4,}(?:\.\d+)*\/\S+(?:(?!["&\'<>])\S))\b/;
    if (doi) {
        const doiOnly = doiRegex.exec(doi);
        return doiOnly !== null ? doiOnly[0] : doi;
    }
    return doi;

}

/* Does not support editing */
export default Ember.Component.extend(BasicsValidations, {
    editMode: true,
    uploadValid: Ember.computed.alias('nodeLocked'), // Once the node has been locked (happens in step one of upload section), users are free to navigate through form unrestricted
    abstractValid: Ember.computed.alias('validations.attrs.basicsAbstract.isValid'),
    doiValid: Ember.computed.alias('validations.attrs.basicsDOI.isValid'),
    // Must have year and copyrightHolders filled if those are required by the licenseType selected
    licenseValid: false,

    // Basics fields that are being validated are abstract, license and doi (title validated in upload section). If validation added for other fields, expand basicsValid definition.
    basicsValid: Ember.computed.and('abstractValid', 'doiValid', 'licenseValid'),
    basicsAbstract:  Ember.computed('node.description', function() {
        let node = this.get('node');
        return node ? node.get('description') : null;
    }),
    // Pending tags
    basicsTags: Ember.computed('node', function() {
        const node = this.get('node');
        return node ? node.get('tags').map(fixSpecialChar) : Ember.A();
    }),
    basicsDOI: null,
    basicsLicense: null,
    actions: {
        addTag(tag) {
            this.get('basicsTags').pushObject(tag);
        },
        removeTag(tag) {
            this.get('basicsTags').removeObject(tag);
        },
        applyLicenseToggle(apply) {
            this.set('applyLicense', apply);
        },
        discardBasics() {
            // Discards changes to basic fields. (No requests sent, front-end only.)
            this.set('basicsTags', []);
            this.set('basicsAbstract', '');
            this.set('basicsDOI', null);
            this.set('basicsLicense', null);
        },
        preventDefault(e) {
            e.preventDefault();
        },
        stripDOI() {
            // Replaces the inputted doi link with just the doi itself
            let basicsDOI = this.get('basicsDOI');
            this.set('basicsDOI', doiRegexExec(basicsDOI));
        },
        editLicense(basicsLicense, licenseValid) {
           this.setProperties({
               basicsLicense,
               licenseValid
           });
           this.set('initialLicenseChangeMade', true);
       },
       saveBasics() {
            // Saves the description/tags on the node and the DOI on the preprint, then advances to next panel
            if (!this.get('basicsValid')) {
                return;
            }

            this.get('action')(this).then((result) => {
                this.attrs.saveParameter(this.attrs.widget.value.parameters.basicInfo ,{
                    value: this.get('basicsAbstract'),
                    state: ['defined']
                });
                this.set('editMode', false);
                this.attrs.closeSection(this.get('name'));
            });

            // Promise.all([
            //     node.save(),
            //     model.save()
            // ])
            //     .then(() => this.send('next', this.get('_names.2')))
            //     // If save fails, do not transition
            //     .catch(() => {
            //         this.get('toast').error(
            //             this.get('i18n').t('submit.basics_error')
            //         );
            //
            //         model.setProperties({
            //             licenseRecord: currentLicenseRecord,
            //             license: currentLicenseType,
            //             doi: currentDOI,
            //         });
            //
            //         node.setProperties({
            //             description: currentAbstract,
            //             tags: currentTags,
            //             license: currentNodeLicenseType,
            //             nodeLicense: currentNodeLicenseRecord,
            //         });
            //
            //         return Promise.all([
            //             node.save(),
            //             model.save()
            //         ]);
            //     });
        },
    }
});
