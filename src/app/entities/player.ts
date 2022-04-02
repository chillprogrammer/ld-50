import { AnimatedSprite } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { KeyManagerService } from "../../services/key-manager/key-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { Entity, TilesetInterface } from "./base-entity";

export class Player extends Entity {

    // Idle Sprite
    private idleSprite: AnimatedSprite = null;

    // Services
    private keyManagerService: KeyManagerService = ServiceInjector.getServiceByClass(KeyManagerService);

    // Variables
    private maxRadius: number = 0;
    public static PosX: number = 0; 
    public static PosY: number = 0; 

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
        this.isAlive = true;

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

    public setMaxWalkingRadius(radius: number): void {
        this.maxRadius = radius;
    }

    public update(delta: number): void {
        super.update(delta);

        console.log(this.sprite.position)

        if (this.isAlive) {
            if (this.keyManagerService.isKeyPressed('w')) {
                this.moveUp();
            } else if (this.keyManagerService.isKeyPressed('s')) {
                this.moveDown();
            } else {
                //Camera.velocity.y = 0;
            }
            if (this.keyManagerService.isKeyPressed('a')) {
                this.moveLeft();
            }
            else if (this.keyManagerService.isKeyPressed('d')) {
                this.moveRight();
            } else {
                //Camera.velocity.x = 0;
            }

            Player.PosX = this.sprite.position.x;
            Player.PosY = this.sprite.position.y;
        }
    }

    private moveUp(): void {
        this.sprite.position.y -= this.movementSpeed * this.delta;
        /*let newPosY = this.sprite.position.y - this.movementSpeed * this.delta;
        if (Math.abs(newPosY) >= (GraphicsManagerService.INITIAL_HEIGHT / 2) - this.maxRadius) {
            newPosY = (GraphicsManagerService.INITIAL_HEIGHT / 2) - this.maxRadius;
        }
        this.sprite.position.y = newPosY;
        */
    }
    private moveDown(): void {
        this.sprite.position.y += this.movementSpeed * this.delta;
    }
    private moveLeft(): void {
        this.sprite.position.x -= this.movementSpeed * this.delta;
    }
    private moveRight(): void {
        this.sprite.position.x += this.movementSpeed * this.delta;
    }
    


}