import { Container, Sprite, Texture } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { Player } from "./player";

export class UI {

    private container: Container = null;

    private healthSprites: Sprite[] = [];
    private MAX_HEALTH_ICONS: number = 20;

    constructor() {
        this.init();
    }

    private init() {
        this.container = new Container();
        this.container.zIndex = 1008;
        this.createHealthbar();
    }

    private createHealthbar(): void {
        for (let i = 0; i < this.MAX_HEALTH_ICONS; i++) {
            let newHealthIcon: Sprite = null;
            let xPos = -GraphicsManagerService.INITIAL_WIDTH / 2 - 20;
            let yPos = -GraphicsManagerService.INITIAL_HEIGHT / 2 - 20;
            if (i % 2 === 0) {
                newHealthIcon = new Sprite(Texture.from('assets/art/Health_Left.png'))
            } else {
                newHealthIcon = new Sprite(Texture.from('assets/art/Health_Right.png'))
            }
            newHealthIcon.position.set(xPos + i * (11), yPos);
            this.healthSprites.push(newHealthIcon);
            this.container.addChild(this.healthSprites[i]);
        }
    }

    private createKillCount(): void {

    }

    private createTimeAlive(): void {

    }

    public update(delta: number) {
        this.setHealth();
    }

    setHealth() {
        const health = Player.playerEntity ? Player.playerEntity.getHealth() : 0;
        const maxHealth = Player.playerEntity.getMaxHealth();
        const healthIncrementChange = maxHealth / this.MAX_HEALTH_ICONS;
        let x = 0;
        for (let i = this.MAX_HEALTH_ICONS - 1; i >= 0; i--) {
            if (health < maxHealth - (healthIncrementChange * x)) {
                this.healthSprites[i].visible = false;
            } else {
                this.healthSprites[i].visible = true;
            }
            x++;
        }
    }

    public getContainer() { return this.container; }
}