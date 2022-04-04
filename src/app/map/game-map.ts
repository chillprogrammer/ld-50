import { GodrayFilter } from "@pixi/filter-godray";
import { Container, Sprite, Texture } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";
import { ServiceInjector } from "../../services/service-injector.module";
import { Entity } from "../entities/base-entity";
import { EntityManager } from "../entities/entity-manager";
import { Pedestrian } from "../entities/pedestrian";
import { Player } from "../entities/player";
import { Torch } from "../entities/Torch";
import { GameOverScreen } from "../menus/game-over-screen";


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
    private entityManager: EntityManager = null;
    private player: Player = null;
    private torch: Torch = null;

    private godrayFilter: GodrayFilter = null;

    private audienceList: Entity[] = [];

    private endscreen: GameOverScreen = null;


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
        this.container.sortableChildren = true;
        this.container.position.x = GraphicsManagerService.INITIAL_WIDTH / 2;
        this.container.position.y = GraphicsManagerService.INITIAL_HEIGHT / 2;
        this.container.scale.set(0.88);
        this.container.position.y += 35
        this.godrayFilter = new GodrayFilter();
        this.godrayFilter.time = 14;
        this.godrayFilter.lacunarity = 2.2
        this.godrayFilter.gain = 0.55;
        this.container.filters = [this.godrayFilter];
        this.createArenaBackground();
        this.createArenaCircle();
        this.createWallColumnsTop();
        this.createPlayer();
        this.createWallColumnsBottom();
        this.createArenaStands();
        this.createTorch();
        this.createEndScreen();
        //this.createAudience();
        this.entityManager = new EntityManager();
        this.entityManager.setContainer(this.container)
    }

    private createEndScreen() {
        this.endscreen = new GameOverScreen();
        this.container.addChild(this.endscreen.getContainer());
        this.endscreen.retrySubject.subscribe(() => {
            this.showEndScreen(false);
        })
    }

    private showEndScreen(val: boolean) {
        if (val) {
            this.container.filters = [];
            this.endscreen.getContainer().visible = true;
        } else {
            this.container.filters = [this.godrayFilter];
            this.entityManager.reset();
            this.player.reset();
            this.endscreen.getContainer().visible = false;
        }
    }

    private getRandomNumberBetween(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    private createAudience(): void {

        for (let i = 0; i < 100; i++) {
            let p = new Pedestrian();
            this.container.addChild(p.getContainer());
            this.audienceList.push(p);

            const randomX = this.getRandomNumberBetween(Entity.maxRadius + 25, GraphicsManagerService.INITIAL_WIDTH / 2);
            const randomY = this.getRandomNumberBetween(-GraphicsManagerService.INITIAL_HEIGHT / 2, GraphicsManagerService.INITIAL_HEIGHT / 2);
            p.sprite.position.set(randomX, randomY);
        }

        for (let i = 0; i < 100; i++) {
            let p = new Pedestrian();
            this.container.addChild(p.getContainer());
            this.audienceList.push(p);

            const randomX = this.getRandomNumberBetween(-GraphicsManagerService.INITIAL_WIDTH / 2, -Entity.maxRadius - 25);
            const randomY = this.getRandomNumberBetween(-GraphicsManagerService.INITIAL_HEIGHT / 2, GraphicsManagerService.INITIAL_HEIGHT / 2);
            p.sprite.position.set(randomX, randomY);
        }

    }

    private createPlayer(): void {
        this.player = new Player();
        Player.playerEntity = this.player;
        Entity.setMaxWalkingRadius(this.arenaObject.radius);
        this.container.addChild(this.player.getContainer());
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
        this.arenaWallColumnsTop.position.y -= 30;
        this.arenaWallColumnsTop.anchor.set(0.5, 1);
        this.container.addChild(this.arenaWallColumnsTop);
    }

    private createWallColumnsBottom(): void {
        this.arenaWallColumnsBottom = new Sprite();
        this.arenaWallColumnsBottom = new Sprite(Texture.from('assets/art/WallColumns2.png'))
        this.arenaWallColumnsBottom.position.y -= 30;
        this.arenaWallColumnsBottom.anchor.set(0.5, 0);
        this.arenaWallColumnsBottom.zIndex = 1000;
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

    private updateAudience(delta: number) {
        for (let pedestrian of this.audienceList) {
            if (pedestrian) {
                pedestrian.update(delta);
            }
        }
    }

    private updatePlayer(delta: number): void {
        if (this.player && this.player.isAlive) {
            this.player.update(delta);
        }
    }

    private updateEntityManager(delta: number): void {
        if (this.entityManager) {
            this.entityManager.update(delta);
        }
    }

    /**
     * Runs from the Main Game Loop
     * @param delta delta time
     */
    public update(delta: number): void {
        // TODO - add update logic
        this.updateGodrays(delta);
        if (!this.endscreen.getContainer().visible) {
            this.updatePlayer(delta);
            this.updateEntityManager(delta);
            this.updateAudience(delta);
        }

        if (this.player.getHealth() <= 0 && !this.endscreen.getContainer().visible) {
            this.showEndScreen(true);
        }
    }
}

interface ArenaInterface {
    radius: number,
    difficulty: number
}