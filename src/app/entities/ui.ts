import * as PIXI from "pixi.js"
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { Entity, TilesetInterface } from "./base-entity";
import { Container, Graphics, NineSlicePlane, Sprite, Texture } from "pixi.js";
import { Player } from "./player";

export class UI {

    private container: Container = null;

    private sprite: PIXI.Sprite;

    constructor() {
        this.init();
    }

    private init() {
        this.sprite = new Sprite();
        this.sprite = new Sprite(Texture.from('assets/art/Health_full.png'))
        this.sprite.anchor.set(0.5);
        this.container.addChild(this.sprite);

        this.sprite = new Sprite();
        this.sprite = new Sprite(Texture.from('assets/art/Health_full.png'))
        this.sprite.anchor.set(0.6);
        this.container.addChild(this.sprite);

        this.sprite = new Sprite();
        this.sprite = new Sprite(Texture.from('assets/art/Health_full.png'))
        this.sprite.anchor.set(0.7);
        this.container.addChild(this.sprite);

        this.sprite = new Sprite();
        this.sprite = new Sprite(Texture.from('assets/art/Health_full.png'))
        this.sprite.anchor.set(0.8);
        this.container.addChild(this.sprite);

        this.sprite = new Sprite();
        this.sprite = new Sprite(Texture.from('assets/art/Health_full.png'))
        this.sprite.anchor.set(0.9);
        this.container.addChild(this.sprite);



    }

    setHealth() {
        
        if (Player.playerEntity.getHealth() <= 80 && Player.playerEntity.getHealth() >= 60 ) {
            
        } else if (Player.playerEntity.getHealth() > 25) {
            this.sprite.tint = 0xEED202;
        }
        else if (Player.playerEntity.getHealth() > 0) {
            this.sprite.tint = 0xFF0000;
        }
        if (Player.playerEntity.getHealth() <= 0) {
            this.sprite.width = 300;
            this.sprite.tint = 0x000000;
        }
    }
}