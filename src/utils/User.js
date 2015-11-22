const PROVIDER_UNKNOWN = 'unknown';
const PROVIDER_PASSWORD = 'password';
const PROVIDER_FACEBOOK = 'facebook';
const PROVIDER_TWITTER = 'twitter';
import http from '../core/HttpClient';
const emailToName = email => email.replace(/\.[\w]{2,4}$/, '').replace('@', ' from ');

class User {
    constructor(data) {
        this.id = null;
        this.provider = PROVIDER_UNKNOWN;
        this.description = null;
        this.image = null;
        this.email = null;
        this.facebookToken = null;
        this.facebookAccessToken = null;

        if (data) {
            if (data.uuid) {
                this.id = data.uuid;
            }

            if (data.provider) {
                this.provider = data.provider;
            }

            if (data[this.provider]) {
                this.setIdentity(data[this.provider]);
            }
        }
    }

    setIdentity(identity) {
        switch (this.provider) {
            case PROVIDER_PASSWORD:
                if (identity.email) {
                    this.email = identity.email;
                }

                if (identity.profileImageURL) {
                    this.image = identity.profileImageURL;
                }
                break;

            case PROVIDER_FACEBOOK:

                if (identity.profileImageURL) {
                    this.image = identity.profileImageURL;
                }

                if (identity.displayName) {
                    this.name = identity.displayName;
                }

                if (identity.accessToken) {
                    this.facebookAccessToken = identity.accessToken;
                }
                if (identity.token) {
                    this.facebookToken = identity.token;
                }
                break;

            case PROVIDER_TWITTER:
                if (identity.username) {
                    this.name = identity.username;
                }

                if (identity.displayName) {
                    this.displayName = identity.displayName;
                }

                if (identity.profileImageURL) {
                    this.image = identity.profileImageURL;
                }

                if (identity.id_str) {
                    this.id = identity.id_str;
                }
                if (identity.cachedUserProfile) {
                    var cup = identity.cachedUserProfile;

                    if (cup.description) {
                        this.description = cup.description;
                    }
                }
                break;

            default:
                console.log('cannot identify provider ', this.provider);
        }

    }

    set description(d) {
        this._description = d;
    }

    get description() {
        return this._description;
    }

    set name(pName) {
        this._name = pName;
    }

    get name() {
        if (this._name) {
            return this._name;
        }

        if (this.email) {
            return emailToName(this.email);
        }

        return '--name unnown--';
    }

    set displayName(pName) {
        this._displayName = pName;
    }

    get displayName() {
        if (this._displayName) {
            return this._displayName;
        }

        return this.name;
    }

    set image(pImage) {
        this._image = pImage;
    }

    get image() {
        return this._image;
    }

    get provider() {
        return this._provider;
    }

    set provider(pProv) {
        switch (pProv) {
            case PROVIDER_UNKNOWN:
                this._provider = pProv;
                break;

            case PROVIDER_PASSWORD:
                this._provider = pProv;
                break;

            case PROVIDER_TWITTER:
                this._provider = pProv;
                break;

            case PROVIDER_FACEBOOK:
                this._provider = pProv;
                break;

            default:
                throw new Error('unknown provider: ', pProv);
        }
    }

    get id() {
        return this._id;
    }

    set id(pId) {
        this._id = pId;
    }
}

export default User;

/*
 { provider: 'twitter',
 uid: 'twitter:106869885',
 twitter:
 { id: '106869885',
 accessToken: '106869885-ufOK7s6tTkGGO9IJ9ZJqFnViv2NbEb8icgB0Cueg',
 accessTokenSecret: 'QzR8XktHBY6iyqRGDLA9ogKalbWAeDUmbW8Esvd9P2gUM',
 displayName: 'Dave Edelhart',
 username: 'david_edelhart',
 cachedUserProfile:
 { id: 106869885,
 id_str: '106869885',
 name: 'Dave Edelhart',
 screen_name: 'david_edelhart',
 location: 'SF / Bay Area',
 profile_location: null,
 description: 'I\'m the web developer your girlfriend wished you were. OKCupid says I\'m Arrogant, Dominant and Aggressive. Fuck OKCupid.',
 url: 'http://t.co/x6EzIfp8G2',
 entities: [Object],
 protected: false,
 followers_count: 86,
 friends_count: 227,
 listed_count: 7,
 created_at: 'Wed Jan 20 23:17:20 +0000 2010',
 favourites_count: 82,
 utc_offset: -28800,
 time_zone: 'Pacific Time (US & Canada)',
 geo_enabled: true,
 verified: false,
 statuses_count: 5349,
 lang: 'en',
 status: [Object],
 contributors_enabled: false,
 is_translator: false,
 is_translation_enabled: false,
 profile_background_color: '022330',
 profile_background_image_url: 'http://pbs.twimg.com/profile_background_images/378800000055883828/afb5d362a8953b3a2357efde3849cd74.jpeg',
 profile_background_image_url_https: 'https://pbs.twimg.com/profile_background_images/378800000055883828/afb5d362a8953b3a2357efde3849cd74.jpeg',
 profile_background_tile: true,
 profile_image_url: 'http://pbs.twimg.com/profile_images/1575708065/twitprofile_normal.jpg',
 profile_image_url_https: 'https://pbs.twimg.com/profile_images/1575708065/twitprofile_normal.jpg',
 profile_link_color: '0084B4',
 profile_sidebar_border_color: 'FFFFFF',
 profile_sidebar_fill_color: 'C0DFEC',
 profile_text_color: '333333',
 profile_use_background_image: true,
 has_extended_profile: false,
 default_profile: false,
 default_profile_image: false,
 following: false,
 follow_request_sent: false,
 notifications: false,
 suspended: false,
 needs_phone_verification: false },
 profileImageURL: 'https://pbs.twimg.com/profile_images/1575708065/twitprofile_normal.jpg' },
 token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6InR3aXR0ZXI6MTA2ODY5ODg1IiwicHJvdmlkZXIiOiJ0d2l0dGVyIn0sImlhdCI6MTQ0Nzk0MDYzMn0.Ps7otlSiSwPA8Uj4n0pyxm2j84XhkHp3AmuQlafiRHs',
 auth: { uid: 'twitter:106869885', provider: 'twitter' },
 expires: 1448027032 }

 */
