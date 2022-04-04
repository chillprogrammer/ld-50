import { Container, Sprite, Text, Texture } from "pixi.js";
import { Subject } from "rxjs";
import { Button, ButtonInterface } from "../components/button";

export class GameOverScreen {

    // Pixi.js
    private container: Container = new Container();
    private endSprite: Sprite = null;
    private retryButton: Button = null;
    private text: Text = null;

    public retrySubject: Subject<any> = new Subject();

    constructor() {
        this.createEndScreen();
    }

    private createEndScreen(): void {
        this.endSprite = new Sprite(Texture.from('assets/art/end.png'));
        this.endSprite.anchor.set(0.5, 0.5);
        this.endSprite.scale.set(1.2, 1.2);
        this.endSprite.position.set(0, -50);
        this.container.addChild(this.endSprite);
        this.container.zIndex = 1005;
        this.container.visible = false;

        const BUTTON_WIDTH = 450;
        const BUTTON_HEIGHT = 50;
        const buttonParameters: ButtonInterface = {
            x: 0,
            y: 120,
            w: BUTTON_WIDTH,
            h: BUTTON_HEIGHT,
            r: 20,
            text: 'Retry',
            fontSize: 42,
            backColor: 0x555555,
            borderColor: 0xFFFFFF,
            textColor: 0xffffff,
            hoverColor: 0x555555,
            action: () => {
                this.retrySubject.next(null);
            }
        }
        this.retryButton = new Button(buttonParameters);
        this.retryButton.getContainer().zIndex = 1006;
        this.container.addChild(this.retryButton.getContainer());

        this.text = new Text(`You fought well, but death was inevitable.`, { fontSize: 32, fill: 0xffffff, align: 'center', strokeThickness: 2 });
        this.text.resolution = 2; // Crisp text.
        this.text.anchor.set(0.5);
        this.text.position.set(-200, -260);
        this.container.addChild(this.text);
    }

    public getContainer(): Container { return this.container; }
}