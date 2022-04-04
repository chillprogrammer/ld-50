import { AnimatedSprite, Container, MIPMAP_MODES, Rectangle, SCALE_MODES, Text, Texture } from "pixi.js";
import { Subscription } from "rxjs";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { KeyManagerService } from "../../services/key-manager/key-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { SoundManagerService } from "../../services/sound-manager/sound-manager.service";
import { TilesetInterface } from "../entities/base-entity";

/**
 * This object represents the Title Screen.
 */
export class TitleScreen {

    // Pixi.js
    private container: Container = null;
    public isDestroyed: boolean = false;

    // Title Text
    private titleColor: number = 0xb99223;
    private titleText: Text = null;
    private titleAngle: number = 0;
    private titleAngleDirection: boolean = false;
    private titleAngleMax: number = 2;
    private titleAngleSpeed: number = 0.05;

    // Click here to start Text
    private startText: Text = null;
    private startColor: number = 0xffffff;
    private startBlinkSpeed: number = 0.0125;
    private startBlinkAlpha: number = 0;
    private backgroundImage: AnimatedSprite = null;

    // Services
    private keyManagerService: KeyManagerService = ServiceInjector.getServiceByClass(KeyManagerService);
    private soundManagerService: SoundManagerService = ServiceInjector.getServiceByClass(SoundManagerService)

    // Toggles
    private isLeavingTitleScreen: boolean = false;

    // Sounds
    private SOUNDS = {
        Select: 'assets/sounds/Ludum_Dare_song_seamless_v1.ogg',



    }

    // Subscriptions
    private keyDownSubscription: Subscription = null;



    constructor() {
        this.init();
    }

    /**
     * Initializes the TitleScreen
     */
    init(): void {
        this.container = new Container();
        this.createBackgroundImage();
        this.loadSounds();
        this.createTitleText();
        this.createStartText();
        this.createSubscriptions();
    }

    /**
     * Subscribes to any Observables.
     */
    createSubscriptions(): void {
        this.keyDownSubscription = this.keyManagerService.getKeyDownSubject().subscribe((key: string) => this.keyPressed(key))
    }

    protected loadTileSetIntoMemory(params: TilesetInterface): Texture[] {
        let texture = Texture.from(`assets/art/${params.spritesheetName}`);
        let textureList: Texture[] = [];

        // Assign the list of textures to the texture array.
        const COLUMN_COUNT = params.columnCount;
        const TILE_WIDTH = params.tileWidth;
        const TILE_HEIGHT = params.tileHeight;
        const TILE_COUNT = params.tileCount;
        let row = 0;
        for (let i = 0; i < TILE_COUNT; ++i) {
            if (i % COLUMN_COUNT === 0 && i !== 0) {
                row++;
            }
            let rect = new Rectangle((i % (COLUMN_COUNT)) * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT);
            let tileTexture: Texture = new Texture(texture.baseTexture, rect);
            tileTexture.baseTexture.mipmap = MIPMAP_MODES.OFF;
            tileTexture.baseTexture.scaleMode = SCALE_MODES.NEAREST;
            textureList.push(tileTexture);
        }

        return textureList;
    }

    private createBackgroundImage(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 11,
            tileWidth: 960,
            tileHeight: 540,
            columnCount: 11,
            spritesheetName: "intro.png"
        }
        const textures = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        
        this.backgroundImage = new AnimatedSprite(textures, true);
        this.backgroundImage.position.set(0, 0);
        this.backgroundImage.loop = true;
        this.backgroundImage.animationSpeed = 0.08;
        this.backgroundImage.scale.set(1, 1);
        this.container.addChild(this.backgroundImage);
        this.backgroundImage.play();
    }

    /**
     * Unsubscribes to any Observables.
     */
    destroySubscriptions(): void {
        this.keyDownSubscription.unsubscribe();
    }

    /**
     * Cleanup method.
     * Destroys the container.
     */
    destroy(): void {
        this.isDestroyed = true;
        this.removeSounds();
        if (!this.startText.destroyed) {
            this.startText.destroy(true);
        }
        if (!this.titleText.destroyed) {
            this.titleText.destroy(true);
        }
        if (!this.container.destroyed) {
            this.container.destroy(true);
        }
        this.destroySubscriptions();
    }

    /**
     * Callback function for when a key was pressed down.
     * @param key Key that was pressed
     */
    private keyPressed(key: string) {
        console.log(`Key Pressed: ${key}`);
    }

    /**
     * Creates text for Title.
     */
    private createTitleText(): void {
        this.titleText = new Text("GLADIATOR GAME", { fontSize: 72, fill: this.titleColor, align: 'center', strokeThickness: 5 });
        this.titleText.resolution = 2; // Crisp text.
        this.titleText.anchor.set(0.5);
        this.titleText.position.set((GraphicsManagerService.INITIAL_WIDTH / 2), 150);
        this.container.addChild(this.titleText);
    }

    /**
     * Creates "- Press KEY to Start -" text.
     */
    private createStartText(): void {
        this.startText = new Text(`- Click Here to Start -`, { fontSize: 32, fill: this.startColor, align: 'center', strokeThickness: 2 });
        this.startText.interactive = true;
        this.startText.on('click', this.goToMainMenu.bind(this));
        this.startText.resolution = 2; // Crisp text.
        this.startText.anchor.set(0.5);
        this.startText.position.set((GraphicsManagerService.INITIAL_WIDTH / 2), GraphicsManagerService.INITIAL_HEIGHT - 100);
        this.container.addChild(this.startText);
    }

    /**
     * Load any sounds into memory
     */
    private loadSounds(): void {
        this.soundManagerService.addSound({
            src: this.SOUNDS.Select,
            autoplay: true,
            loop: true,
            volume: 0.5
        });

        this.soundManagerService.playSound(this.SOUNDS.Select)

    }

    /**
     * Unload any sounds from memory.
     */
    private removeSounds(): void {
        //this.soundManagerService.removeSound(this.SOUNDS.Select);
    }

    /**
     * Trigger the start of the game.
     */
    private goToMainMenu(): void {
        if (!this.isLeavingTitleScreen) {
            this.isLeavingTitleScreen = true;
            //(<SoundManagerService>ServiceInjector.getServiceByClass(SoundManagerService)).playSound(this.SOUNDS.Select)
            this.destroy();
        }
    }

    /**
     * Runs from the Main Game Loop
     * @param delta delta time
     */
    public update(delta: number): void {
        if (!this.titleText.destroyed) {
            this.updateTitleText(delta);
        }
        if (!this.startText.destroyed) {
            this.updateStartText(delta);
        }
    }

    /**
     *  Updates the title text.
     * @param delta delta time
     */
    private updateTitleText(delta: number): void {
        if (!this.titleAngleDirection) {
            this.titleAngle += this.titleAngleSpeed * delta;
            this.titleText.scale.set(this.titleText.scale.x+0.002*delta, this.titleText.scale.y+0.002*delta);
        } else {
            this.titleAngle -= this.titleAngleSpeed * delta
            this.titleText.scale.set(this.titleText.scale.x-0.002*delta, this.titleText.scale.y-0.002*delta);
        }

        if (this.titleAngle > this.titleAngleMax) {
            this.titleAngleDirection = !this.titleAngleDirection;
            this.titleAngle = this.titleAngleMax;
        } else if (this.titleAngle < -this.titleAngleMax) {
            this.titleAngleDirection = !this.titleAngleDirection;
            this.titleAngle = -this.titleAngleMax;
        }
        this.titleText.angle = this.titleAngle;
    }

    /**
     * Updates the fade of the Start Text.
     * @param delta 
     */
    private updateStartText(delta: number) {
        this.startBlinkAlpha += this.startBlinkSpeed * delta;
        if (this.startBlinkAlpha > 1) {
            this.startBlinkAlpha = 1;
            this.startBlinkSpeed *= -1;
        } else if (this.startBlinkAlpha < 0) {
            this.startBlinkAlpha = 0;
            this.startBlinkSpeed *= -1;
        }

        this.startText.alpha = this.startBlinkAlpha;
    }

    /**
     * 
     * @returns The container the TitleScreen is inside.
     */
    getContainer() { return this.container; }
}