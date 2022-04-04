import { Container, Sprite, Texture, Text } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { Entity } from "./base-entity";
import { Player } from "./player";

export class UI {

    private container: Container = null;

    private healthSprites: Sprite[] = [];
    private MAX_HEALTH_ICONS: number = 20;
    private killCountText: Text = null;

    constructor() {
        this.init();
    }

    private init() {
        this.container = new Container();
        this.container.zIndex = 1008;
        this.createHealthbar();
        this.createKillCount();
    }

    private createKillCount(): void {
        this.killCountText = new Text(`Kill Count: 0`, { fontSize: 32, fill: 0xffffff, align: 'center', strokeThickness: 2 });
        this.killCountText.resolution = 2; // Crisp text.
        let xPos = -GraphicsManagerService.INITIAL_WIDTH / 2 - 25;
        let yPos = -GraphicsManagerService.INITIAL_HEIGHT / 2;
        this.killCountText.position.set(xPos, yPos);
        this.container.addChild(this.killCountText);
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
            newHealthIcon.anchor.set(0.5);
            newHealthIcon.position.set(xPos + i * (11), yPos);
            this.healthSprites.push(newHealthIcon);
            this.container.addChild(this.healthSprites[i]);
        }
    }

    private createTimeAlive(): void {

    }

    public update(delta: number) {
        this.setHealth();
        this.setKillCount();
    }

    setKillCount(): void {
        const count = Entity.DeathCount;
        this.killCountText.text = `Kill Count: ${count}`;
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