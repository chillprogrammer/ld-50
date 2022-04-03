import { AnimatedSprite, Container, MIPMAP_MODES, Rectangle, SCALE_MODES, Texture } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";

/**
 * The base Entity class.
 */
export class Entity {

    public isDestroyed: boolean = false;

    // Variables
    protected health: number;
    protected maxHealth: number;
    protected shield: number;
    protected speed: number;
    public isAlive: boolean;
    protected movementSpeed: number;
    protected damageCooldown: number = 0;

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
        if (this.damageCooldown <= 0) {
            this.damageCooldown = 3;
            this.health -= 10;
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


    /**
     * Runs each tick.
     * @param delta delta time
     */
    public update(delta: number) {
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
        }

        if (this.damageCooldown > 0) {
            this.damageCooldown--;
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