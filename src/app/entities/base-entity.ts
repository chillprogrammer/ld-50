import { Howl } from "howler";
import { AnimatedSprite, Container, MIPMAP_MODES, Point, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { SoundManagerService } from "../../services/sound-manager/sound-manager.service";

/**
 * The base Entity class.
 */
export class Entity {

    public isDestroyed: boolean = false;
    protected hasEnteredArena: boolean = false;

    // Variables
    protected health: number;
    protected maxHealth: number;
    protected shield: number;
    protected speed: number;
    public isAlive: boolean;
    protected movementSpeed: number;
    protected damageCooldown: number = 0;
    protected static maxRadius: number = 0;

    protected deathSounds: string[] = [];
    protected damageSounds: string[] = [];

    private bloodTextures: Texture[] = [
        Texture.from('assets/art/blood.png'),
        Texture.from('assets/art/blood2.png'),
        Texture.from('assets/art/blood3.png'),
        Texture.from('assets/art/blood4.png'),
        Texture.from('assets/art/blood5.png')
    ];

    // Pixi.js
    public sprite: AnimatedSprite = null;
    protected container: Container = null;

    // Service
    protected graphicsManagerService: GraphicsManagerService = ServiceInjector.getServiceByClass(GraphicsManagerService);
    protected soundManagerService: SoundManagerService = ServiceInjector.getServiceByClass(SoundManagerService);

    protected velocity: Point;

    // Updates
    protected delta: number = 0;

    /**
     * Creates a default Entity object
     */
    constructor() {
        this.health = 100;
        this.maxHealth = 100;
        this.shield = 0;
        this.speed = 5;
        this.isAlive = false;
        this.movementSpeed = 2;

        this.container = new Container();
    }


    public static setMaxWalkingRadius(radius: number): void {
        Entity.maxRadius = radius;
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

    public takeDamage(): void {
        if (this.isAlive) {
            if (this.damageCooldown <= 0) {
                this.sprite.tint = 0xff0000;
                this.damageCooldown = 20;
                this.health -= 50;

                if (this.health > 0) {
                    const damageSound = this.damageSounds[this.damageSounds.length * Math.random() | 0];
                    this.soundManagerService.playSound(damageSound);
                }
            }
        }
    }

    protected death(): void {
        if (this.deathSounds.length > 0) {
            const deathSound = this.deathSounds[this.deathSounds.length * Math.random() | 0];
            this.soundManagerService.playSound(deathSound);
        }
    }

    /**
     * Destroys the entity, it's sprite, and all the rest of it.
     */
    public destroy(): void {
        this.isDestroyed = true;
    }

    /**
     * 
     * @returns Health
     */
    public getHealth(): number { return this.health; }

    /**
     * 
     * @returns Max Health
     */
    public getMaxHealth(): number { return this.maxHealth; }

    /**
     * 
     * @returns Shield
     */
    public getShield(): number { return this.shield; }

    /**
     * 
     * @returns Speed
     */
    public getSpeed(): number { return this.speed; }

    protected placeEntityInsideArenaBoundary(): void {
        if (this.hasEnteredArena) {
            while (this.isPositionOutsideOfRadius(this.sprite.position.x, this.sprite.position.y)) {
                if (this.sprite.position.x > 0) {
                    this.sprite.position.x--;
                } else {
                    this.sprite.position.x++
                }

                if (this.sprite.position.y > 0) {
                    this.sprite.position.y--;
                } else {
                    this.sprite.position.y++
                }
            }
        }
    }

    protected isPositionOutsideOfRadius(posX: number, posY: number): boolean {
        if (Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2)) >= Entity.maxRadius - 15) {
            return true;
        }
        this.hasEnteredArena = true;
        return false;
    }

    /**
     * Runs each tick.
     * @param delta delta time
     */
    public update(delta: number) {
        if (this.isPositionOutsideOfRadius(this.sprite.position.x, this.sprite.position.y)) {
            this.placeEntityInsideArenaBoundary();
        }
        // TODO - enter update logic
        this.delta = delta;
        if (this.isAlive) {
            this.container.zIndex = this.sprite.position.y + GraphicsManagerService.INITIAL_HEIGHT / 2;
        }

        if (this.health <= 0 && this.isAlive) {
            this.isAlive = false;
            this.sprite.textures = this.bloodTextures;
            this.sprite.gotoAndStop(Math.floor((Math.random() + 1) * 4));
            this.container.zIndex = 0;
            this.death();
        }

        if (this.damageCooldown > 0) {
            this.damageCooldown--;
        } else {
            this.sprite.tint = 0xffffff;
        }
    }

    /**
     * 
     * @returns The container the Button is inside.
     */
    getContainer() { return this.container; }
}

export interface TilesetInterface {
    spritesheetName: string,
    columnCount: number
    tileWidth: number,
    tileHeight: number,
    tileCount: number
}