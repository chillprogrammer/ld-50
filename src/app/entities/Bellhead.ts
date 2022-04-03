import * as PIXI from "pixi.js"
import {AnimatedSprite} from "pixi.js";
import { TestScheduler } from "rxjs/testing";
import {GraphicsManagerService} from "../../services/graphics-manager/graphics-manager.service";
import {Entity, TilesetInterface} from "./base-entity";
import {Player} from "./player";

export class Bellhead extends Entity {

    private idleSprite : AnimatedSprite = null;

    public velocity : PIXI.Point;


    // Variables
    private maxRadius : number = 0;

    constructor() {
        super();
        this.init();
    }

    /**
     * Initialize enemy class
     */
    private init(): void {
        this.health = 1000;
        this.maxHealth = 1000;
        this.shield = 50;
        this.speed = 0.2;
        this.isAlive = true;


        this.velocity = new PIXI.Point(this.speed, this.speed);

        this.loadWalkSprite();
        this.loadBaseSprite();
    }

    private loadBaseSprite(): void {
        this.sprite = this.idleSprite;
        this.container.addChild(this.sprite);
    } 

    private loadWalkSprite(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 12,
            tileWidth: 128,
            tileHeight: 112,
            columnCount: 12,
            spritesheetName: "Bellhead_Walk.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.idleSprite = new AnimatedSprite(textureList, true);
        this.sprite = this.idleSprite;
        this.sprite.position.set(0, -250);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.15;
        this.sprite.anchor.set(0.58, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }


    update(delta : number): void {

        super.update(delta);

        if (this.isAlive) {
            if (this.sprite.position.x < Player.PosX) {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos + this.velocity.x * delta, yPos);
                if(Math.abs(xPos - Player.PosX) > 0.5) {
                    this.sprite.scale.set(-1, 1);
                }
            } else {

                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos - this.velocity.x * delta, yPos);
                if(Math.abs(xPos - Player.PosX) > 0.5) {
                    this.sprite.scale.set(1, 1);
                }
            }

            if (this.sprite.position.y < Player.PosY) {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos, yPos + this.velocity.y * delta);

            } else {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos, yPos - this.velocity.y * delta);

            }
            


        }


    }
}
