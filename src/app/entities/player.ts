import { AnimatedSprite } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { Entity, TilesetInterface } from "./base-entity";

export class Player extends Entity {

    // Idle Sprite
    private idleSprite: AnimatedSprite = null;

    constructor() {
        super();
        this.init();
    }

    /**
     * Initialize player class
     */
    private init(): void {
        this.health = 100;
        this.maxHealth = 100;
        this.shield = 50;
        this.speed = 5;

        this.loadIdleSprite();
        this.loadBaseSprite();
    }

    private loadBaseSprite(): void {
        this.sprite = this.idleSprite;
        this.container.addChild(this.sprite);
    }

    private loadIdleSprite(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 8,
            tileWidth: 32,
            tileHeight: 47,
            columnCount: 8,
            spritesheetName: "gladiator-idle.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.idleSprite = new AnimatedSprite(textureList, true);
        this.sprite = this.idleSprite;
        this.sprite.position.set(GraphicsManagerService.INITIAL_WIDTH / 2, GraphicsManagerService.INITIAL_HEIGHT / 2)
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }
}