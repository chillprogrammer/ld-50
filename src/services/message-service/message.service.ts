import * as MESSAGES from './messages.json';

/**
 * Reads language message based on language code.
 */
export class MessageService {

    // i.e. EN, ES, DE, etc...
    private localeCode: string = '';

    constructor() {
        this.init();
    }

    /**
     * Initialization logic runs upon object construction.
     */
    private init(): void {
        this.setDefaultLocale();
    }

    /**
     * Sets locale based on browser.
     * If no locale is found, then English is used by default.
     */
    setDefaultLocale(): void {
        try {
            this.localeCode = ((navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.language).toUpperCase().substring(0, 2);
        } catch (err) {
            console.error('Cannot detect default locale. Using English.')
        }
        console.info(`Defaulting locale: ${this.localeCode}`)
    }

    /**
     * Returns the message in whatever language is selected.
     * Defaults to English if the locale has no translation.
     * Defaults to the passed messageID if no such messageID exists.
     * @param messageID The key in messages.json e.g. "INVALID_LOBBY_CODE"
     * @returns 
     */
    public getMessage(messageID: string): string {
        let translatedMessage: string = null;
        const messageTranslations: any = (<any>MESSAGES)[messageID];

        if (messageTranslations) {
            translatedMessage = messageTranslations[this.localeCode] ?? messageTranslations['EN'];
        }
        return translatedMessage ?? messageID;
    }
}