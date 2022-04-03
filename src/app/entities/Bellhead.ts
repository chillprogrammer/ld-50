import * as PIXI from "pixi.js"
import { AnimatedSprite, Texture } from "pixi.js";
import { Entity, TilesetInterface } from "./base-entity";
import { Player } from "./player";

export class Bellhead extends Entity {

    public velocity: PIXI.Point;
    private walkTextures: Texture[] = [Texture.EMPTY];
    private attackTextures: Texture[] = [Texture.EMPTY];

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

        this.loadBaseSprite();
        this.loadWalkSprite();
        this.loadAttackSprite();
        this.loadDeathSounds();
    }

    private loadBaseSprite(): void {
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.container.addChild(this.sprite);
        this.sprite.position.set(0, -250);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.15;
        this.sprite.anchor.set(0.58, 1);
        this.sprite.scale.set(1, 1);

    }

    private loadAttackSprite(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 12,
            tileWidth: 128,
            tileHeight: 112,
            columnCount: 12,
            spritesheetName: "Bellhead_Attack.png"
        }
        this.attackTextures = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
    }

    private loadWalkSprite(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 12,
            tileWidth: 128,
            tileHeight: 112,
            columnCount: 12,
            spritesheetName: "Bellhead_Walk.png"
        }
        this.walkTextures = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.sprite.textures = this.walkTextures;
        this.sprite.play();
    }

    private loadDeathSounds(): void {
        this.deathSounds = [
            'assets/sounds/british_its_just_a_flesh_wound.wav',
            'assets/sounds/stupid_ahh.wav',


        ]
    }

    public takeDamage(): void {
        if (this.damageCooldown <= 0 && this.isAlive && !this.attacking) {
            super.takeDamage();

            const xDirection: number = this.sprite.position.x - Player.PosX;
            const yDirection: number = this.sprite.position.y - Player.PosY;
            this.sprite.position.set(
                xDirection >= 0 ? this.sprite.position.x + 25 : this.sprite.position.x - 25,
                yDirection >= 0 ? this.sprite.position.y + 25 : this.sprite.position.y - 25
            );
        }
    }

    public attack(): void {
        if (this.attackCooldown <= 0) {
            this.attackCooldown = 500;
            super.attack();
            this.sprite.textures = this.attackTextures;
            this.sprite.onLoop = () => {
                this.attacking = false;
                this.sprite.textures = this.walkTextures;
                this.sprite.play();

            }
            this.sprite.play();
        }
    }


    update(delta: number): void {

        super.update(delta);

        if (this.isAlive) {
            let xPos = this.sprite.position.x;
            let yPos = this.sprite.position.y;
            if (Math.abs(xPos - Player.PosX) < this.agroDistance && Math.abs(yPos - Player.PosY) < this.agroDistance && !this.attacking) {
                this.attack();
            }

            if (!this.attacking) {
                if (this.sprite.position.x < Player.PosX) {
                    let xPos = this.sprite.position.x;
                    let yPos = this.sprite.position.y;
                    this.sprite.position.set(xPos + this.velocity.x * delta, yPos);
                    if (Math.abs(xPos - Player.PosX) > 0.5) {
                        this.sprite.scale.set(-1, 1);
                    }
                } else {

                    let xPos = this.sprite.position.x;
                    let yPos = this.sprite.position.y;
                    this.sprite.position.set(xPos - this.velocity.x * delta, yPos);
                    if (Math.abs(xPos - Player.PosX) > 0.5) {
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

            if (!this.attacking && this.sprite.name !== 'walking') {
                this.sprite.textures = this.walkTextures;
                console.log("here")
                this.sprite.play();
                this.sprite.name = 'walking';
            }

        }


    }
}
