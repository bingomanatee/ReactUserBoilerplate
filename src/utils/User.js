const PROVIDER_UNKNOWN = 'unknown';
const PROVIDER_PASSWORD = 'password';

const emailToName = email => email.replace(/\.[\w]{2,4}$/, '').replace('@', ' from ');

class User {
    constructor(data) {
        this.id = null;
        this.provider = PROVIDER_UNKNOWN;
        this.image = null;
        this.email = null;

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
        if (identity.email) {
            this.email = identity.email;
        }

        if (identity.profileImageURL) {
            this.image = identity.profileImageURL;
        }
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

            default:
                throw new Error('unknown provider: ', +pProv);
                break;
        }
    }

    get id() {
        return _id;
    }

    set id(pId) {
        this._id = pId;
    }
}

export default User;
