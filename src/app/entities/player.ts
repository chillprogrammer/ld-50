import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { KeyManagerService } from "../../services/key-manager/key-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { Entity, TilesetInterface } from "./base-entity";

export class Player extends Entity {

    // Idle Sprite
    private idleSprite: AnimatedSprite = null;

    // Arm Sprite
    private armSprite: Sprite = null;

    // Services
    private keyManagerService: KeyManagerService = ServiceInjector.getServiceByClass(KeyManagerService);

    // Variables
    private maxRadius: number = 0;

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

        this.loadArmSprite();
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
        this.sprite.position.set(0, 0)
        this.sprite.anchor.set(0.5, 1);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadArmSprite(): void {
        this.armSprite = new Sprite(Texture.from("assets/art/arm.png"))
        this.armSprite.position.set(0, 0)
        this.armSprite.anchor.set(0.5, 0.5);
        this.armSprite.scale.set(1, 1);
        this.container.addChild(this.armSprite);
    }

    public setMaxWalkingRadius(radius: number): void {
        this.maxRadius = radius;
    }

    public update(delta: number): void {
        super.update(delta);

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
        }

        this.armSprite.position.set(this.sprite.position.x, this.sprite.position.y - this.sprite.height/2);
    }

    private placePlayerInsideArenaBoundary(): void {
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

    private isPositionOutsideOfRadius(posX: number, posY: number): boolean {
        console.log(Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2)));
        console.log(`${posX} ${posY}`);
        if (Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2)) >= this.maxRadius-15) {
            return true;
        }
        return false;
    }

    private moveUp(): void {
        let newPosY = this.sprite.position.y - (this.movementSpeed * this.delta);
        if (!this.isPositionOutsideOfRadius(this.sprite.position.x, newPosY)) {
            this.sprite.position.y = newPosY;
        } else {
            this.placePlayerInsideArenaBoundary();
        }
    }

    private moveDown(): void {
        let newPosY = this.sprite.position.y + (this.movementSpeed * this.delta);
        if (!this.isPositionOutsideOfRadius(this.sprite.position.x, newPosY)) {
            this.sprite.position.y = newPosY;
        } else {
            this.placePlayerInsideArenaBoundary();
        }
    }

    private moveLeft(): void {
        let newPosX = this.sprite.position.x - (this.movementSpeed * this.delta);
        if (!this.isPositionOutsideOfRadius(newPosX, this.sprite.position.y)) {
            this.sprite.position.x = newPosX;
        } else {
            this.placePlayerInsideArenaBoundary();
        }
        this.sprite.scale.x = -1;
        this.armSprite.scale.x = -1;
    }

    private moveRight(): void {
        let newPosX = this.sprite.position.x + (this.movementSpeed * this.delta);
        if (!this.isPositionOutsideOfRadius(newPosX, this.sprite.position.y)) {
            this.sprite.position.x = newPosX;
        } else {
            this.placePlayerInsideArenaBoundary();
        }
        this.sprite.scale.x = 1;
        this.armSprite.scale.x = 1;
    }


}