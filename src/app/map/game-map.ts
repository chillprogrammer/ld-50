import { Container } from "pixi.js";
import { ServiceInjector } from "../../services/service-injector.module";
import { WebService } from "../../services/web-service/web.service";

/**
 * This represents the map for all entities to spawn on
 */
export class GameMap {

    // Pixi.js
    private container: Container = null;

    // Map
    private mapObject: MapInterface = null;

    // Services
    private webService: WebService = ServiceInjector.getServiceByClass(WebService);

    /**
     * Destroys the entire map and all entities inside of it.
     */
    public destroy(): void {
        this.container.destroy(true);
    }

    /**
     * Runs from the Main Game Loop
     * @param delta delta time
     */
    public update(delta: number): void {
        // TODO - add update logic
    }
}

interface MapInterface {
    width: number,
    height: number
}