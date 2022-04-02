import { Container, Text, Ticker, Graphics, InteractionEvent, Rectangle, Texture } from "pixi.js";
import { Subscription } from "rxjs";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { KeyManagerService } from "../../services/key-manager/key-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";

/**
 * Class represents an input field.
 */
export class InputBox {
    // Parameters
    private text: string = '';
    private xPos: number = 0;
    private yPos: number = 0;
    private width: number = 0;
    private height: number = 0;
    private fontSize: number = 0;
    private backColor: number = 0x000000;
    private textColor: number = 0x000000;
    private borderColor: number = 0x000000;
    private roundness = 0;
    private borderWidth: number = 3;
    private placeholder: string = '';
    private maxlen: number = 999;

    //Toggles
    public focusInside: boolean = false;

    // Services
    private graphicsManager: GraphicsManagerService = ServiceInjector.getServiceByClass(GraphicsManagerService);
    private keyManager: KeyManagerService = ServiceInjector.getServiceByClass(KeyManagerService);

    // Subscriptions
    private keyDownSubscription: Subscription = null;
    private clickedAnywhereOnScreenSubscription: Subscription = null;

    // Border
    private blinkSpeed: number = 0.035;
    private blinkTick: number = 0;

    // Pixi.js
    private container: Container = null;
    private base: Graphics = null;
    private gText: Text = null;
    private gPlaceholderText: Text = null;
    private ticker: Ticker = null;
    private border: Graphics = null;

    constructor(parameters: InputBoxInterface) {
        this.xPos = parameters.x;
        this.yPos = parameters.y;
        this.width = parameters.w;
        this.height = parameters.h;
        this.roundness = parameters.r;
        this.text = parameters.defaultText ?? '';
        this.placeholder = parameters.placeholder ?? '';
        this.maxlen = parameters.maxlen;
        this.fontSize = parameters.fontSize;
        this.backColor = parameters.backColor;
        this.textColor = parameters.textColor;
        this.borderColor = parameters.borderColor;
        this.focusInside = parameters.startWithFocus ?? false;
        this.init();
    }

    /**
     * Initializes the button based on the constructor parameters.
     */
    private init(): void {
        // Listens for clicks anywhere on the stage.
        this.clickedAnywhereOnScreenSubscription = this.graphicsManager.getClickObservable().subscribe((ev: InteractionEvent) => {
            this.clickedAnywhereOnStage(ev);
        });

        this.container = new Container();

        this.createMask();

        this.container.interactive = true;
        this.container.cursor = 'text';
        this.createBase();
        this.createPlaceholderText();
        this.createText();
        this.createCursor();
        this.ticker = new Ticker();
        this.ticker.add((delta) => { this.update(delta) });
        this.ticker.start();

        this.keyDownSubscription = this.keyManager.getKeyDownSubject().subscribe((key: string) => {
            if (!this.focusInside) {
                return;
            }

            if (key === 'Backspace') {
                if (this.text.length > 0) {
                    this.text = this.text.substring(0, this.text.length - 1);
                }
            } else {
                if (key.length === 1) {
                    if (key === ' ') {
                        this.text += ' ';
                    } else {
                        this.text += key;
                    }
                    this.limitTextLength();
                }
            }
        });
    }

    /**
     * Possibly substrings the text to ensure it fits within the Input.
     */
    private limitTextLength(): void {
        if (this.gText.width > this.base.width - this.fontSize) {
            this.text = this.text.substring(0, this.text.length - 1);
        }
    }

    /**
     * Creates mask that limits the view of text to be within the input.
     */
    private createMask(): void {
        const graphics = new Graphics();
        graphics.beginFill(0xFF3300);
        graphics.drawRoundedRect(this.xPos, this.yPos, this.width, this.height, this.roundness);
        graphics.endFill();
        this.container.mask = graphics;
        this.container.addChild(graphics)
    }

    /**
     * Runs when the stage is clicked anywhere.
     * The click could be in this input, or outside of it.
     * @param ev event when stage is clicked
     */
    private clickedAnywhereOnStage(ev: InteractionEvent) {

        // If the click was NOT in this instance of an Input, then we focusOut.
        if (ev.target !== this.container) {
            this.focusInside = false;
            this.blinkTick = 0;
            this.border.visible = false;
        }
    }

    /**
     * Creates base button for container.
     */
    private createBase(): void {
        this.base = new Graphics();
        this.base.beginFill(this.backColor);
        this.base.position.set(this.xPos, this.yPos);
        this.base.drawRoundedRect(0, 0, this.width, this.height, this.roundness * 2);
        this.base.endFill();
        this.container.on('click', (ev: InteractionEvent) => {
            if (!this.focusInside) {
                this.focusInside = true;
                this.border.visible = true;
                this.blinkTick = 0;
            }
        });

        this.container.addChild(this.base);
    }

    /**
     * Creates text for container.
     */
    private createText(): void {
        this.gText = new Text(this.text, { fontSize: this.fontSize, fill: this.textColor, align: 'center' });
        this.gText.resolution = 2; // Crisp text.
        this.gText.anchor.set(0.5, 0.5);
        this.gText.position.set(this.xPos + this.width / 2, this.yPos + this.height / 2);
        this.container.addChild(this.gText);
    }

    /**
     * Creates placholder text for container.
     */
    private createPlaceholderText(): void {
        this.gPlaceholderText = new Text(this.placeholder, { fontSize: this.fontSize, fill: this.textColor, align: 'center' });
        this.gPlaceholderText.resolution = 2; // Crisp text.
        this.gPlaceholderText.anchor.set(0.5, 0.5);
        this.gPlaceholderText.position.set(this.xPos + this.width / 2, this.yPos + this.height / 2);
        this.gPlaceholderText.tint = this.textColor;
        this.gPlaceholderText.alpha = 0.35;
        this.container.addChild(this.gPlaceholderText);
    }

    /**
     * Creates border for container.
     */
    private createCursor(): void {
        this.border = new Graphics();
        this.border.position.set(this.xPos + this.borderWidth / 2, this.yPos + this.borderWidth / 2);
        this.border.visible = false;
        this.border.lineStyle(this.borderWidth, this.borderColor);
        this.border.drawRoundedRect(0, 0, this.width - this.borderWidth, this.height - this.borderWidth, this.roundness);
        this.container.addChild(this.border);
    }

    /**
     * Creates border for container.
     */
    public setBorderColor(color: number): void {
        // Remove old border
        this.container.removeChild(this.border);

        // Set color, and create new border.
        this.borderColor = color;
        this.createCursor();
    }

    /**
     * The text that is currently in the input.
     * @returns string
     */
    public getText(): string {
        return this.text;
    }

    /**
     * Runs each tick.
     * @param delta delta time
     */
    private update(delta: number) {
        if (this.text.length > this.maxlen) {
            this.text = this.text.substring(0, this.maxlen);
        }
        this.gText.text = this.text;
        this.gPlaceholderText.visible = this.text.length === 0;
        this.gText.visible = this.text.length > 0;
        if (this.focusInside) {
            this.blinkBorder(delta);
        }
    }

    /**
     * function used to update the cursor blinking animation and position.
     * @param delta delta time
     */
    private blinkBorder(delta: number): void {
        this.blinkTick += this.blinkSpeed * delta;
        if (this.blinkTick > 1) {
            this.blinkTick = 0;
            this.border.visible = !this.border.visible;
        }
    }

    /**
     * Destroys the container.
     */
    public destroy(): void {
        this.keyDownSubscription.unsubscribe();
        this.clickedAnywhereOnScreenSubscription.unsubscribe();
        this.ticker.destroy();
        this.gText.destroy(true);
        this.gPlaceholderText.destroy(true);
        this.border.destroy(true);
        this.base.destroy(true);
        (this.container.mask as Container).destroy(true);
        this.container.destroy(true);
    }

    /**
     * 
     * @returns The container the Button is inside.
     */
    getContainer() { return this.container; }
}

export interface InputBoxInterface {
    x: number,
    y: number,
    w: number,
    h: number,
    r: number,
    defaultText?: string,
    placeholder?: string,
    maxlen?: number,
    fontSize: number,
    backColor: number,
    textColor: number,
    borderColor: number,
    startWithFocus?: boolean
}