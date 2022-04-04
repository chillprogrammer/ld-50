import { AnimatedSprite, Texture } from "pixi.js";
import { Entity } from "./base-entity";

export class Pedestrian extends Entity {

    constructor() {
        super();
        this.init();
    }

    public init(): void {
        this.isAlive = true;
        this.sprite = new AnimatedSprite([Texture.from('assets/art/Pedestrian.png')], false);
        this.container.addChild(this.sprite);
        this.sprite.anchor.set(0.5, 1);
        this.sprite.scale.set(1, 1);
    }
}