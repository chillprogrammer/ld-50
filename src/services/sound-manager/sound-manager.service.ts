import { Howl } from "howler";

/**
 * Service used for managing sound files.
 */
export class SoundManagerService {

    private soundList: SoundInterface[] = [];

    addSound(parameters: AddSoundOptions): void {
        if (this.soundList.filter(element => element.src === parameters.src)) {
            var sound = new Howl({
                src: [parameters.src],
                autoplay: parameters.autoplay,
                loop: parameters.loop,
                volume: parameters.volume,
                onend: parameters.onend ? parameters.onend.bind(this) : null
            });
            this.soundList.push({
                src: parameters.src,
                sound: sound
            })
        }
    }

    playSound(src: string): void {
        const filteredSoundList: SoundInterface[] = this.soundList.filter(element => element.src === src);
        if (filteredSoundList.length > 0) {
            filteredSoundList[0].sound.play();
        } else {
            console.error(`sound: ${src} doesn't exist`)
        }
    }

    removeSound(src: string): void {
        this.soundList = this.soundList.filter(element => element.src !== src)
    }
}

export interface AddSoundOptions {
    src: string,
    autoplay: boolean,
    loop: boolean,
    volume: 0.5,
    onend?: Function
}

interface SoundInterface {
    src: string,
    sound: Howl
}