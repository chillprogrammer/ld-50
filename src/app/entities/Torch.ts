import * as PIXI from "pixi.js"
import { AnimatedSprite } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { Entity, TilesetInterface } from "./base-entity";


 export class Torch extends Entity {
    private torchSprite: AnimatedSprite = null;
    private torchSprite2: AnimatedSprite = null;
    private torchSprite3: AnimatedSprite = null;
    private torchSprite4: AnimatedSprite = null;
    private torchSprite5: AnimatedSprite = null;
    private torchSprite6: AnimatedSprite = null;
    private torchSprite7: AnimatedSprite = null;
    private torchSprite8: AnimatedSprite = null;

    constructor() {
        super();
        this.init();
    }

    private init(): void {
        
        this.loadIdleSprite1();
        this.loadIdleSprite2();
        this.loadIdleSprite3();
        this.loadIdleSprite4();
        this.loadIdleSprite5();
        this.loadIdleSprite6();
        this.loadIdleSprite7();
        this.loadIdleSprite8();
        this.loadBaseSprite();
    }

    private loadBaseSprite(): void {
        this.sprite = this.torchSprite;
        this.container.addChild(this.sprite);

        this.sprite = this.torchSprite2;
        this.container.addChild(this.sprite);

        this.sprite = this.torchSprite3;
        this.container.addChild(this.sprite);

        this.sprite = this.torchSprite4;
        this.container.addChild(this.sprite);

        this.sprite = this.torchSprite5;
        this.container.addChild(this.sprite);

        this.sprite = this.torchSprite6;
        this.container.addChild(this.sprite);

        this.sprite = this.torchSprite7;
        this.container.addChild(this.sprite);

        this.sprite = this.torchSprite8;
        this.container.addChild(this.sprite);
    }

    private loadIdleSprite1(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite2 = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite2;
        this.sprite.position.set(215, -200);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadIdleSprite2(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite;
        this.sprite.position.set(120, -285);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadIdleSprite3(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite3 = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite3;
        this.sprite.position.set(-120, -285);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadIdleSprite4(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite4 = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite4;
        this.sprite.position.set(-215, -200);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadIdleSprite5(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite5 = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite5;
        this.sprite.position.set(212, 122);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadIdleSprite6(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite6 = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite6;
        this.sprite.position.set(-212, 122);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadIdleSprite7(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite7 = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite7;
        this.sprite.position.set(-119, 200);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }

    private loadIdleSprite8(): void {
        const tilesetInterface: TilesetInterface = {
            tileCount: 4,
            tileWidth: 64,
            tileHeight: 64,
            columnCount: 4,
            spritesheetName: "Torch.png"
        }
        const textureList = this.loadTileSetIntoMemory(tilesetInterface) ?? [];
        this.torchSprite8 = new AnimatedSprite(textureList, true);
        this.sprite = this.torchSprite8;
        this.sprite.position.set(119, 200);
        this.sprite.loop = true;
        this.sprite.animationSpeed = 0.2;
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
        this.sprite.play();
    }


    


 }