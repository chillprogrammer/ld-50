import { Container, Text, Graphics } from "pixi.js";

/**
 * Basic Button component. Has color wow!
 */
export class Button {

    // Parameters
    private xPos: number = 0;
    private yPos: number = 0;
    private width: number = 0;
    private height: number = 0;
    private text: string = '';
    private fontSize: number = 0;
    private backColor: number = 0x000000;
    private textColor: number = 0x000000;
    private hoverColor: number = 0x000000;
    private clickFunction: Function = null;
    private roundness = 0;
    private borderColor: number = undefined;

    // Pixi.js
    private container: Container = null;
    private base: Graphics = null;
    private gText: Text = null;

    constructor(parameters: ButtonInterface) {
        this.xPos = parameters.x;
        this.yPos = parameters.y;
        this.width = parameters.w;
        this.height = parameters.h;
        this.roundness = parameters.r;
        this.text = parameters.text;
        this.fontSize = parameters.fontSize;
        this.backColor = parameters.backColor;
        this.textColor = parameters.textColor;
        this.hoverColor = parameters.hoverColor ? parameters.hoverColor : this.backColor;
        this.borderColor = parameters.borderColor;
        this.clickFunction = parameters.action;
        this.init();
    }

    /**
     * Initializes the button based on the constructor parameters.
     */
    private init(): void {
        this.container = new Container();
        this.container.interactive = true;
        this.container.buttonMode = true;
        this.createBaseButton();
        this.createText();
    }

    /**
     * Creates base button for container.
     */
    private createBaseButton(): void {
        this.base = new Graphics();
        this.base.beginFill(this.backColor);
        this.base.position.set(this.xPos, this.yPos);
        this.base.drawRoundedRect(0, 0, this.width, this.height, this.roundness);
        this.base.endFill();

        if (this.borderColor) {
            this.base.lineStyle(4, this.borderColor);
            this.base.drawRoundedRect(0, 0, this.width, this.height, this.roundness);
        }

        if (this.clickFunction) {
            this.container.on('click', () => { this.clickFunction() });
        }
        this.container.on('mouseover', () => { this.hoverFunction(true) });
        this.container.on('mouseout', () => { this.hoverFunction(false) });
        this.container.addChild(this.base);
    }

    hoverFunction(mouseover: boolean): void {
        if (mouseover) {
            this.base.tint = this.hoverColor;
        } else {
            this.base.tint = 0xFFFFFF;
        }
    }

    /**
     * Creates text for container.
     */
    private createText(): void {
        this.gText = new Text(this.text, { fontSize: this.fontSize, fill: this.textColor, align: 'center', strokeThickness: 2 });
        this.gText.resolution = 2; // Crisp text.
        this.gText.anchor.set(0.5);
        this.gText.position.set(this.xPos + (this.width / 2), this.yPos + (this.height / 2));
        this.container.addChild(this.gText);
    }

    /**
     * Destroys the container.
     */
    public destroy(): void {
        this.gText.destroy(true);
        this.base.destroy(true);
        this.container.destroy(true);
    }

    /**
     * 
     * @returns The container the Button is inside.
     */
    getContainer() { return this.container; }
}

export interface ButtonInterface {
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    text: string,
    fontSize: number,
    backColor: number,
    textColor: number,
    borderColor?: number,
    hoverColor?: number,
    action?: Function
}