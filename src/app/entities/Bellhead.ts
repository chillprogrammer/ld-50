import * as PIXI from "pixi.js"
import { AnimatedSprite, Sprite, Texture } from "pixi.js";
import { Entity, TilesetInterface } from "./base-entity";
import { Player } from "./player";

export class Bellhead extends Entity {

    public velocity: PIXI.Point;
    private walkTextures: Texture[] = [Texture.EMPTY];
    private attackTextures: Texture[] = [Texture.EMPTY];

    private shockwaveSprite: AnimatedSprite;

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
        this.loadShockwaveSprite();
    }

    private loadShockwaveSprite(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 5,
            tileWidth: 128,
            tileHeight: 32,
            columnCount: 5,
            spritesheetName: "Shockwave.png"
        }
        const shockwaveTextures = this.loadTileSetIntoMemory(tilesetInterface) ?? [];

        this.shockwaveSprite = new AnimatedSprite(shockwaveTextures, true);
        this.shockwaveSprite.loop = false;
        this.shockwaveSprite.animationSpeed = 0.15;
        this.shockwaveSprite.anchor.set(0.5, 0.5);
        this.shockwaveSprite.scale.set(2, 3);
    }

    private loadBaseSprite(): void {
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.container.addChild(this.sprite);
        this.sprite.position.set(0, -250);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.15;
        this.sprite.anchor.set(0.58, 0.8);
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
        setTimeout(() => {
            if (this.attackCooldown <= 0) {
                super.attack();
                this.attackCooldown = 250;


                this.sprite.textures = this.attackTextures;
                this.sprite.onLoop = () => {
                    if (this.sprite.textures === this.attackTextures) {
                        this.attacking = false;
                        this.sprite.textures = this.walkTextures;
                        this.sprite.play();
                    }
                }

                this.sprite.onFrameChange = (frame: number) => {
                    if (this.sprite.textures === this.attackTextures) {
                        if (frame === 7) {
                            this.playShockwave();
                        }
                    }
                }

                this.sprite.play();
            }
        }, 500);
    }

    private playShockwave(): void {
        this.shockwaveSprite.position.set(this.sprite.position.x, this.sprite.position.y-10);
        this.shockwaveSprite.visible = true;
        this.container.addChild(this.shockwaveSprite);
        this.shockwaveSprite.gotoAndPlay(0);
        this.shockwaveSprite.onComplete = () => {
            this.shockwaveSprite.visible = false;
            this.container.removeChild(this.shockwaveSprite);
        }
    }

    private isCollidingWithPlayer(sprite: Sprite): boolean {
        const ab = Player.playerSprite.getBounds();
        const bb = sprite.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    private checkPlayerDamageFromShockwave(): void {
        if (this.shockwaveSprite.visible) {
            if (this.isCollidingWithPlayer(this.shockwaveSprite)) {
                Player.playerEntity.takeDamage(20);
            }
        }
    }

    update(delta: number): void {
        super.update(delta);

        this.checkPlayerDamageFromShockwave();

        if (this.isAlive) {
            let xPos = this.sprite.position.x;
            let yPos = this.sprite.position.y;
            if (Math.abs(xPos - Player.PosX) < this.agroDistance && Math.abs(yPos - Player.PosY) < this.agroDistance && !this.attacking) {
                this.attack();
            }


            if (!Player.playerIsAlive) {
                return;
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
