import * as PIXI from "pixi.js"
import { AnimatedSprite } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { Entity, TilesetInterface } from "./base-entity";
import { Player } from "./player";

export class Enemy extends Entity {

    private idleSprite: AnimatedSprite = null;

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
        this.speed = 1;
        this.isAlive = true;

        
        this.velocity = new PIXI.Point(this.speed, this.speed); 

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

    update(delta: number) : void{

        super.update(delta);

        if (this.isAlive) {
            if (this.sprite.position.x < Player.PosX) {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos + this.velocity.x * delta,yPos);
           } else {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos - this.velocity.x * delta,yPos);
           }
           
           if (this.sprite.position.y < Player.PosY) {
            let xPos = this.sprite.position.x;
            let yPos = this.sprite.position.y;
            this.sprite.position.set(xPos,yPos + this.velocity.y * delta);
           } else {
            let xPos = this.sprite.position.x;
            let yPos = this.sprite.position.y;
            this.sprite.position.set(xPos,yPos - this.velocity.y * delta);
           }
           
           /*if (this.sprite.position.x > Player.PosX) {
                let xPos = this.sprite.position.x;
                let yPos = this.sprite.position.y;
                this.sprite.position.set(xPos + this.velocity.x * delta,yPos);
           } */

           
       } 
                
            
            
        
        /*let xPos = this.sprite.position.x;
        let yPos = this.sprite.position.y;
        this.sprite.position.set(xPos + this.velocity.x * delta, yPos + (this.velocity.y - 1) * delta); */

        
        

    }
}
