import { GodrayFilter } from "@pixi/filter-godray";
import { Container, Graphics } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { Player } from "../entities/player";

/**
 * This represents the map for all entities to spawn on
 */
export class GameMap {

    // Pixi.js
    private container: Container = null;

    // Map
    private arenaObject: ArenaInterface = null;

    // Arena Circle
    private arenaCircle: Graphics = null;

    // Services
    private graphicsManagerService: GraphicsManagerService = ServiceInjector.getServiceByClass(GraphicsManagerService);

    // Entities
    private player: Player = null;

    private godrayFilter: GodrayFilter = null;


    constructor() {
        // Default arena settings
        this.arenaObject = {
            radius: 270,
            difficulty: 1
        }

        this.init();
    }



    private init(): void {
        this.container = new Container();
        this.godrayFilter = new GodrayFilter();
        this.godrayFilter.time = 0;
        this.godrayFilter.lacunarity = 4.5
        this.godrayFilter.gain = 0.3;
        console.log(this.godrayFilter.lacunarity);
        this.container.filters = [this.godrayFilter];
        this.createArenaCircle();
        this.createPlayer();
    }

    private createPlayer(): void {
        this.player = new Player();
        this.container.addChild(this.player.getContainer());
    }

    private createArenaCircle(): void {
        this.arenaCircle = new Graphics();
        this.arenaCircle.beginFill(0xd1bdc3);
        this.arenaCircle.position.set(GraphicsManagerService.INITIAL_WIDTH / 2, GraphicsManagerService.INITIAL_HEIGHT / 2);
        this.arenaCircle.drawCircle(0, 0, this.arenaObject.radius);
        this.arenaCircle.endFill();
        this.arenaCircle.lineStyle(4, 0x000000);
        this.arenaCircle.drawCircle(0, 0, this.arenaObject.radius);
        this.container.addChild(this.arenaCircle);
    }


    /**
     * 
     * @returns The container the Button is inside.
     */
    getContainer() { return this.container; }


    /**
     * Destroys the entire map and all entities inside of it.
     */
    public destroy(): void {
        this.container.destroy(true);
    }

    private updateGodrays(delta: number): void {
        const increment = 0.005 * delta;
        this.godrayFilter.time += increment;
        if (this.godrayFilter.time >= 500) {
            this.godrayFilter.time = 0;
        }
    }

    /**
     * Runs from the Main Game Loop
     * @param delta delta time
     */
    public update(delta: number): void {
        // TODO - add update logic
        this.updateGodrays(delta);
    }
}

interface ArenaInterface {
    radius: number,
    difficulty: number
}