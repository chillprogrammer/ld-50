import { AnimatedSprite, Rectangle, Sprite, Texture } from "pixi.js";
import { KeyManagerService } from "../../services/key-manager/key-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { Entity, TilesetInterface } from "./base-entity";

export class Player extends Entity {

    // Sprites
    private idleTextures: Texture[] = [Texture.EMPTY];
    private walkTextures: Texture[] = [Texture.EMPTY];
    private armSprite: Sprite = null;
    private swordSprite: Sprite = null;

    // Services
    private keyManagerService: KeyManagerService = ServiceInjector.getServiceByClass(KeyManagerService);

    // Variables
    private maxRadius: number = 0;
    public static PosX: number = 0;
    public static PosY: number = 0;
    public static SwordBounds: Rectangle = new Rectangle();


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
        this.loadSwordSprite();
        this.loadIdleSprite();
        this.loadWalkSprite();
        this.loadBaseSprite();
    }

    private loadBaseSprite(): void {
        this.sprite = new AnimatedSprite([Texture.EMPTY], true);
        this.sprite.position.set(0, 0)
        this.sprite.anchor.set(0.5, 1);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.scale.set(1, 1);
        this.sprite.play();
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

    private loadArmSprite(): void {
        this.armSprite = new Sprite(Texture.from("assets/art/arm.png"))
        this.armSprite.position.set(0, 0)
        this.armSprite.anchor.set(0.2, 1);
        this.armSprite.scale.set(1, 1);
        this.container.addChild(this.armSprite);
    }

    public loadSwordSprite(): void {

        this.swordSprite = new Sprite(Texture.from("assets/art/Sword.png"))
        this.swordSprite.position.set(10, 0)
        this.swordSprite.anchor.set(0.5, 1);
        this.swordSprite.scale.set(1.5, 1.5);
        this.armSprite.addChild(this.swordSprite);
    }

    public setMaxWalkingRadius(radius: number): void {
        this.maxRadius = radius;
    }

    private calculateArmAndSwordAngle(): void {
        const mousePos = this.graphicsManagerService.getRenderer().plugins.interaction.mouse.global;
        const playerPos: { x: number, y: number } = this.sprite.getBounds();

        const angle = Math.atan2((mousePos.y - playerPos.y), (mousePos.x - playerPos.x))
        this.armSprite.rotation = angle + Math.PI / 2;

        if (mousePos.x < playerPos.x) {
            this.sprite.scale.x = -1;
        } else {
            this.sprite.scale.x = 1;
            this.armSprite.scale.y = 1;
        }

        Player.SwordBounds = this.swordSprite.getBounds();
    }

    public update(delta: number): void {
        super.update(delta);

        if (this.isAlive) {
            this.calculateArmAndSwordAngle();

            let playerMoving = false;
            if (this.keyManagerService.isKeyPressed('w')) {
                this.moveUp();
                playerMoving = true;
            } else if (this.keyManagerService.isKeyPressed('s')) {
                this.moveDown();
                playerMoving = true;
            }
            if (this.keyManagerService.isKeyPressed('a')) {
                this.moveLeft();
                playerMoving = true;
            }
            else if (this.keyManagerService.isKeyPressed('d')) {
                this.moveRight();
                playerMoving = true;
            }

            if (!playerMoving && this.sprite.name !== 'idling') {
                this.sprite.textures = this.idleTextures;
                this.sprite.play();
                this.sprite.name = 'idling';
            } else if (playerMoving && this.sprite.name !== 'walking') {
                this.sprite.textures = this.walkTextures;
                this.sprite.play();
                this.sprite.name = 'walking';
            }
        }

        this.armSprite.position.set(this.sprite.position.x, this.sprite.position.y - this.sprite.height / 2);
        Player.PosX = this.sprite.position.x;
        Player.PosY = this.sprite.position.y;
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
        if (Math.sqrt(Math.pow(posX, 2) + Math.pow(posY, 2)) >= this.maxRadius - 15) {
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
    }

    private moveRight(): void {
        let newPosX = this.sprite.position.x + (this.movementSpeed * this.delta);
        if (!this.isPositionOutsideOfRadius(newPosX, this.sprite.position.y)) {
            this.sprite.position.x = newPosX;
        } else {
            this.placePlayerInsideArenaBoundary();
        }
    }


}