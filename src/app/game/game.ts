import { Subscription } from "rxjs";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { MessageService } from "../../services/message-service/message.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { GameMap } from "../map/game-map";
import { MainMenu } from "../menus/main-menu";
import { TitleScreen } from "../menus/title-screen";

export class Game {

    // Title Screen
    private titleScreen: TitleScreen = null;

    // Main Menu
    private mainMenu: MainMenu = null;

    // GameMap
    private gameMap: GameMap = null;

    // Services
    private graphicsManagerService: GraphicsManagerService = ServiceInjector.getServiceByClass(GraphicsManagerService);


    // Subscriptions
    private startingGameSubscription: Subscription;


    init(): void {
        // Sets the main game loop
        this.graphicsManagerService.setMainLoop(this.update.bind(this));

        // Title Screen
        this.createTitleScreen();
        //this.createMainMenu();
    }

    /**
     * Creates and displays the TitleScreen
     */
    createTitleScreen(): void {
        this.titleScreen = new TitleScreen();
        this.graphicsManagerService.addChild(this.titleScreen.getContainer())
    }

    /**
     * Creates the main menu
     */
    createMainMenu(): void {
        this.mainMenu = new MainMenu();
    }

    /**
     * Destroys the main menu.
     */
    destroyMainMenu(): void {
        this.mainMenu.destroy();
        this.mainMenu = null;
        this.startingGameSubscription.unsubscribe();
    }

    /**
     * Starts the game.
     */
    startGame(): void {
        console.log(`Starting game`);
        this.gameMap = new GameMap();
        this.graphicsManagerService.addChild(this.gameMap.getContainer())
    }

    /**
     * The main loop
     */
    private update(delta: number): void {
        this.updateTitleScreen(delta);
        this.updateMainMenu(delta);
        this.updateGameMap(delta);
    }

    /**
     * Update the Title Screen every tick (if it is displaying).
     * @param delta delta time
     */
    private updateTitleScreen(delta: number): void {

        // Update TitleScreen
        if (this.titleScreen) {
            this.titleScreen.update(delta);

            // Check if TitleScreen has been destroyed already. If so then clean up the reference and load the Main Menu.
            if (this.titleScreen.isDestroyed) {
                this.titleScreen.destroy();
                this.titleScreen = null;
                this.startGame();
            }
        }

    }

    /**
     * Update the Main Menu every tick (if it is displaying).
     * @param delta delta time
     */
    private updateMainMenu(delta: number): void {
        if (this.mainMenu) {
            this.mainMenu.update(delta);
        }
    }

    /**
     * Update the GameMap every tick (if it is displaying).
     * @param delta delta time
     */
    private updateGameMap(delta: number): void {
        if (this.gameMap) {
            this.gameMap.update(delta);
        }
    }

}