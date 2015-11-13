var languages = ['en'];
var components = ['LoginPage', 'RegisterPage'];
import store from '../stores/Store';
const translations = {};
for (let lang of languages) {
    for (let comp of components) {
        translations[`${comp}.${lang}`] = require(`./../components/${comp}/strings/${lang}.json`);
    }
}

/**
 *
 * Strings is a real-time i18n system that pulls all strings for a page
 * from a language file in the component directory.
 *
 * @param comp {string} Component Name: the name of the folder in the components directory
 * @param lang {string} Language: an i18n key for the langugae of the reader; defaults to en (English).
 * @param strings {optional} a JSON block; useful if, for instance, you want to seed language from
 * a non-file source such as a database.
 *
 * @returns {Object} a map of key/value strings.
 */
const strings = (comp, lang = null , strings = null) => {
    if (strings) {
        translations[`${comp}.${lang}`] = strings;
        return strings;
    }
    return translations[`${comp}.${lang || store.getState().lang || 'en'}`];
};

export default strings;
