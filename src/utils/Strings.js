var languages = ['en', 'lv'];
var components = ['LoginPage', 'RegisterPage', 'StringsTest'];
const _ = require('lodash');
const translations = {};
for (let lang of languages) {
    for (let comp of components) {
        var translationKey = `${comp}.${lang}`;
        try {
            translations[translationKey] = require(`./../components/${comp}/strings/${lang}.json`);
        } catch (err) {
            translations[translationKey] = {};
            console.log('missing translation file for ', translationKey, err);
        }
    }
}


/**
 *
 * Strings is a real-time i18n system that pulls all strings for a page
 * from a language file in the component directory.
 *
 * @param comp {string} Component Name: the name of the folder in the components directory
 * @param lang {string} Language: an i18n key for the langugae of the reader; defaults to en (English).
 * @param seed {optional} a JSON block; useful if, for instance, you want to seed language from
 * a non-file source such as a database.
 *
 * @returns {Object} a map of key/value strings.
 */
const strings = (comp, lang = null, seed = null) => {
    var terms;
    if (seed) {
        translations[`${comp}.${lang}`] = seed;
        terms = seed;
    } else {
        terms = translations[`${comp}.${lang || 'en'}`];
    }
    const translate = (term, swap) => {
        var out = terms[term];
        if (!out) {
            return `(: ${term} :)`;
        }

        while (out.indexOf('@^') >= 0) {
            var dTerm = /@\^([\w]+)@/.exec(out);
            if (!dTerm) {
                break;
            }
            let tValue = translate(dTerm[1]);
            out = out.replace(dTerm[0], tValue);
        }

        if (swap) {
            for (let key in swap) {
                if (key && swap.hasOwnProperty(key)) {
                    let value = swap[key];
                    const re = `@${key.toUpperCase()}@`;
                    out = out.replace(new RegExp(re, 'g'), value);
                }
            }
        }
        return out;
    };

    return translate;
};

export default strings;
