import Ember from 'ember';
import NavbarAuthDropdown from 'ember-osf/components/navbar-auth-dropdown/component';


/**
 * Display the login dropdown on the navbar
 *
 * Sample usage:
 * ```handlebars
 * {{navbar-auth-dropdown
 *   loginAction=loginAction
 *   redirectUrl=redirectUrl}}
 * ```
 *
 * @class navbar-auth-dropdown
 */
export default NavbarAuthDropdown.extend({
    gravatarUrl: Ember.computed('session.data.authenticated.user', function() {
        let userData = this.get('session.data.authenticated.user');
        let imgLink = userData.gravatar;
        return imgLink ? `${imgLink}&s=25` : '';
    }),
    userName: Ember.computed('session.data.authenticated.user', function() {
        let userData = this.get('session.data.authenticated.user');
        if (userData) {
            return `${userData.first_name} ${userData.last_name}`;
        }
    }),
    actions: {
        logout() {
            this.get('session').invalidate().catch(() => window.location.href = 'http://localhost:4200/');
        }
    }
});
