import * as PIXI from "pixi.js"
import { AnimatedSprite, Texture } from "pixi.js";
import { Entity, TilesetInterface } from "./base-entity";
import { Player } from "./player";

export class Enemy extends Entity {

    private idleTextures: Texture[] = [Texture.EMPTY];
    private walkTextures: Texture[] = [Texture.EMPTY];

    public velocity: PIXI.Point;


    // Variables
    private maxRadius: number = 0;

    constructor() {
        super();
        this.init();
    }

    /**
     * Initialize enemy class
     */
    private init(): void {
        this.health = 100;
        this.maxHealth = 100;
        this.shield = 50;
        this.speed = .5;

        this.speed = Math.random()*1.2 + 0.2;
        if(this.speed >= 1.4) {
            this.speed = 1.4;
        }
        this.isAlive = true;


        this.velocity = new PIXI.Point(this.speed, this.speed);

        this.loadIdleSprite();
        this.loadWalkSprite();
        this.loadBaseSprite();
    }

    private loadBaseSprite(): void {
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.sprite.position.set(0, -260)
        this.sprite.anchor.set(0.5, 1);
        this.sprite.loop = true;
        this.sprite.animationSpeed = this.speed/3;
        this.sprite.scale.set(1, 1);
        this.sprite.play();
        this.sprite.tint = parseInt(`0x${Math.floor(Math.random() * 16777215).toString(16)}`);
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
        this.idleTextures = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
    }

    private loadWalkSprite() {
        const tilesetInterface: TilesetInterface = {
            tileCount: 8,
            tileWidth: 32,
            tileHeight: 47,
            columnCount: 8,
            spritesheetName: "Glad_Walk.png"
        }
        this.walkTextures = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
    }

    public setMaxWalkingRadius(radius: number): void {
        this.maxRadius = radius;
    }

    update(delta: number): void {

        super.update(delta);

        if (this.isAlive) {
            let moving = false;

            if (this.sprite.position.x < Player.PosX) {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos + this.velocity.x * delta, yPos);
                if (Math.abs(xPos - Player.PosX) > 0.5) {
                    this.sprite.scale.set(1, 1);
                    moving = true;
                }
            } else {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos - this.velocity.x * delta, yPos);
                if (Math.abs(xPos - Player.PosX) > 0.5) {
                    this.sprite.scale.set(-1, 1);
                    moving = true;
                }
            }

            if (this.sprite.position.y < Player.PosY) {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos, yPos + this.velocity.y * delta);
                if (Math.abs(yPos - Player.PosY) > 2.0) {
                    moving = true;
                }
            } else {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos, yPos - this.velocity.y * delta);
                if (Math.abs(yPos - Player.PosY) > 2.0) {
                    moving = true;
                }
            }

            if (!moving && this.sprite.name !== 'idling') {
                this.sprite.textures = this.idleTextures;
                this.sprite.play();
                this.sprite.name = 'idling';
            } else if (moving && this.sprite.name !== 'walking') {
                this.sprite.textures = this.walkTextures;
                this.sprite.play();
                this.sprite.name = 'walking';
            }

        }






    }
}
