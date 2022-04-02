import { Container, Text } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";

export class ErrorScreen {

    // Parameters
    private errorText: string = ''
    private errorCode: string = '';

    // Configurable variables
    private fontSize: number = 42;
    private textColor: number = 0xFF0000;
    private helpfulMessage: string = '';

    // Graphics
    private container: Container = null;
    private gErrorText: Text = null;

    constructor(options: ErrorScreenOptions) {
        this.errorText = options.errorText ?? 'Error occurred. Try refreshing.';
        this.errorCode = options.errorCode ?? '50';
        this.helpfulMessage = options.helpfulMessage ?? '';
    }

    /**
     * Runs all initialization code.
     */
    public init(): void {
        this.createErrorMessage();
    }

    /**
     * Creates the graphics.
     */
    private createErrorMessage(): void {
        this.container = new Container();
        let textToDisplay = this.errorCode ? `ERR CODE ${this.errorCode}: ${this.errorText}\n\n${this.helpfulMessage}` : `ERROR: ${this.errorText}\n\n${this.helpfulMessage}`;
        this.gErrorText = new Text(textToDisplay, { fontSize: this.fontSize, fill: this.textColor, align: 'center' });
        this.gErrorText.anchor.set(0.5);
        this.gErrorText.position.set(GraphicsManagerService.INITIAL_WIDTH / 2, GraphicsManagerService.INITIAL_HEIGHT / 2);
        this.container.addChild(this.gErrorText);
    }

    /**
     * Destroys the graphics. Must have called init() first.
     */
    public destroy(): void {
        this.gErrorText.destroy(true);
        this.container.destroy(true);
    }

    /**
     * 
     * @returns The container the ErrorScreen is inside.
     */
    getContainer() { return this.container; }
}

export interface ErrorScreenOptions {
    errorText?: string,
    errorCode?: string,
    helpfulMessage?: string
}