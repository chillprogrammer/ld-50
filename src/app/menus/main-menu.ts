import { Container, Text } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { Button, ButtonInterface } from "../components/button";
import { InputBox, InputBoxInterface } from "../components/input";
import { Observable, Subject } from 'rxjs'

/**
 * Main menu. Self explanatory... idiot.
 */
export class MainMenu {

    // Services
    private graphicsManagerService: GraphicsManagerService = ServiceInjector.getServiceByClass(GraphicsManagerService);


    // Pixi.js
    private container: Container = null;

    // Messages
    private JOIN_WORLD: string = "Join World";
    private NAME: string = "Name"
    private ENTER_A_NAME: string = "Enter a name"
    // Defaults
    private DEFAULT_NAME: string = 'Joel';

    // UI elements
    private menuButtons: Button[] = [];
    private nameInput: InputBox = null;
    private nameEntryLabel: Text = null;

    // Emitters
    private startingGameSubject: Subject<any>;

    constructor() {
        this.init();
    }

    private init(): void {
        this.container = new Container();
        this.createButtons();
        this.createInputs();
        this.createText();
        this.graphicsManagerService.addChild(this.container);
        this.startingGameSubject = new Subject<any>();
    }

    public destroy(): void {
        this.startingGameSubject.complete();

        if (!this.nameEntryLabel.destroyed) {
            this.nameEntryLabel.destroy(true);
        }
        if (this.nameInput) {
            this.nameInput.destroy();
        }
        for (let button of this.menuButtons) {
            if (button) {
                button.destroy();
            }
        }
        this.container.destroy(true);
        this.container = null;
    }

    /**
     * 
     * @returns Observable that emits when the game is about to start.
     */
    public getStartingGameObservable(): Observable<any> {
        return this.startingGameSubject.asObservable();
    }

    private createText(): void {
        this.nameEntryLabel = new Text(`${this.ENTER_A_NAME}:`, { fontSize: 24, fill: 0xffffff, align: 'center', strokeThickness: 2 });
        this.nameEntryLabel.resolution = 2; // Crisp text.
        this.nameEntryLabel.anchor.set(0.5);
        const xPos = (GraphicsManagerService.INITIAL_WIDTH / 2);
        const yPos = (GraphicsManagerService.INITIAL_HEIGHT / 3);
        this.nameEntryLabel.position.set(xPos, yPos);
        this.container.addChild(this.nameEntryLabel);
    }

    private createInputs(): void {
        const INPUT_WIDTH = 340;
        const INPUT_HEIGHT = 50;
        const nameInputOptions: InputBoxInterface = {
            x: (GraphicsManagerService.INITIAL_WIDTH / 2) - (INPUT_WIDTH / 2),
            y: (GraphicsManagerService.INITIAL_HEIGHT / 3) + 15,
            w: INPUT_WIDTH,
            h: INPUT_HEIGHT,
            r: 5,
            defaultText: this.DEFAULT_NAME,
            placeholder: this.NAME,
            maxlen: 25,
            fontSize: 42,
            backColor: 0xDDDDDD,
            textColor: 0x222222,
            borderColor: 0x222222,
            startWithFocus: true
        }
        this.nameInput = new InputBox(nameInputOptions);
        this.container.addChild(this.nameInput.getContainer());
    }

    /**
     * Creates buttons on menu.
     */
    createButtons(): void {
        const BUTTON_WIDTH = 450;
        const BUTTON_HEIGHT = 50;
        const BUTTON_GAP = 30;
        const buttonOptions: ButtonInterface = {
            x: (GraphicsManagerService.INITIAL_WIDTH / 2) - (BUTTON_WIDTH / 2),
            y: (GraphicsManagerService.INITIAL_HEIGHT / 3) + ((BUTTON_GAP + BUTTON_HEIGHT) * 1.5),
            w: BUTTON_WIDTH,
            h: BUTTON_HEIGHT,
            r: 20,
            text: this.JOIN_WORLD,
            fontSize: 42,
            backColor: 0x555555,
            borderColor: 0xFFFFFF,
            textColor: 0xffffff,
            hoverColor: 0x555555,
            action: () => {
                this.joinGameClicked();
            }
        }
        let button = new Button(buttonOptions);
        this.container.addChild(button.getContainer());
        this.menuButtons.push(button);
    }

    /**
     * Start process of hosting game.
     */
    private joinGameClicked(): void {
        const name = this.nameInput.getText() ?? '';
        if (name.length > 0) {
            this.startingGameSubject.next(name);
        } else {
            console.error('Invalid name')
        }
    }

    /**
     * Runs from the Main Game Loop
     * @param delta delta time
     */
    public update(delta: number): void {

    }
}