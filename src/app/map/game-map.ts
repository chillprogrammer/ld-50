import { GodrayFilter } from "@pixi/filter-godray";
import { Container, Graphics, NineSlicePlane, Sprite, Texture } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { Bellhead } from "../entities/Bellhead";
import { Enemy } from "../entities/enemy";
import { Player } from "../entities/player";
import { Torch } from "../entities/Torch";


/**
 * This represents the map for all entities to spawn on
 */
export class GameMap {

    // Pixi.js
    private container: Container = null;

    // Map
    private arenaObject: ArenaInterface = null;

    // Arena Circle
    private arenaCircle: Sprite = null;
    private arenaWallColumnsTop: Sprite = null;
    private arenaWallColumnsBottom: Sprite = null;
    private arenaStands: Sprite = null;
    private arenaBackground: Sprite = null;

    // Services
    private graphicsManagerService: GraphicsManagerService = ServiceInjector.getServiceByClass(GraphicsManagerService);

    // Entities
    private player: Player = null;
    private enemy: Enemy = null;
    private bellhead: Bellhead = null;
    private torch: Torch = null;

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
        this.container.position.x = GraphicsManagerService.INITIAL_WIDTH / 2;
        this.container.position.y = GraphicsManagerService.INITIAL_HEIGHT / 2;
        this.container.scale.set(0.88);
        this.container.position.y += 35
        this.godrayFilter = new GodrayFilter();
        this.godrayFilter.time = 14;
        this.godrayFilter.lacunarity = 2.2
        this.godrayFilter.gain = 0.5;
        this.container.filters = [this.godrayFilter];
        this.createArenaBackground();
        this.createArenaCircle();
        this.createWallColumnsTop();
        this.createBellhead();
        this.createPlayer();
        this.createWallColumnsBottom();
        this.createArenaStands();
        this.createTorch();
    }

    private createPlayer(): void {
        this.player = new Player();
        this.player.setMaxWalkingRadius(this.arenaObject.radius);
        this.container.addChild(this.player.getContainer());
    }

    private createEnemy(): void {
        this.enemy = new Enemy();
        this.container.addChild(this.enemy.getContainer());
    }

    private createBellhead(): void {
        this.bellhead = new Bellhead();
        this.container.addChild(this.bellhead.getContainer());
    }

    private createTorch(): void {
        this.torch = new Torch();
        this.container.addChild(this.torch.getContainer());
    }

    private createArenaBackground(): void {
        this.arenaBackground = new Sprite();
        this.arenaBackground = new Sprite(Texture.from('assets/art/Background.png'))
        this.arenaBackground.anchor.set(0.5);
        this.container.addChild(this.arenaBackground);
    }

    private createArenaCircle(): void {
        this.arenaCircle = new Sprite();
        this.arenaCircle = new Sprite(Texture.from('assets/art/Sand_Area.png'))
        this.arenaCircle.anchor.set(0.5);
        this.container.addChild(this.arenaCircle);
    }

    private createWallColumnsTop(): void {
        this.arenaWallColumnsTop = new Sprite();
        this.arenaWallColumnsTop = new Sprite(Texture.from('assets/art/WallColumns.png'))
        //this.arenaWallColumns.scale.set(1.02)
        this.arenaWallColumnsTop.position.y -= 30;
        this.arenaWallColumnsTop.anchor.set(0.5, 1);
        this.container.addChild(this.arenaWallColumnsTop);
    }

    private createWallColumnsBottom(): void {
        this.arenaWallColumnsBottom = new Sprite();
        this.arenaWallColumnsBottom = new Sprite(Texture.from('assets/art/WallColumns2.png'))
        this.arenaWallColumnsBottom.position.y -= 30;
        this.arenaWallColumnsBottom.anchor.set(0.5, 0);
        this.container.addChild(this.arenaWallColumnsBottom);
    }

    private createArenaStands(): void {
        this.arenaStands = new Sprite();
        this.arenaStands = new Sprite(Texture.from('assets/art/Stands.png'))
        this.arenaStands.position.y -= 90;
        this.arenaStands.anchor.set(0.5);
        this.container.addChild(this.arenaStands);
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

    private updatePlayer(delta: number): void {
        if (this.player) {
            this.player.update(delta);
        }
    }

    private updateEnemy(delta: number): void {
        if (this.enemy) {
            this.enemy.update(delta);
        }
    }

    private updateBellhead(delta: number): void {
        if (this.bellhead) {
            this.bellhead.update(delta);
        }
    }

    /**
     * Runs from the Main Game Loop
     * @param delta delta time
     */
    public update(delta: number): void {
        // TODO - add update logic
        this.updateGodrays(delta);
        this.updatePlayer(delta);
        this.updateBellhead(delta);
    }
}

interface ArenaInterface {
    radius: number,
    difficulty: number
}