import { Container, Sprite } from "pixi.js";
import { Entity } from "./base-entity";
import { Bellhead } from "./Bellhead";
import { Enemy } from "./enemy";
import { Player } from "./player";
import { interval } from 'rxjs';

/**
 * Manager for entities
 */
export class EntityManager {

    private spawnBellheadTimer = interval(20000);

    // Private list of Entities.
    private entityList: Entity[] = [];

    private x = 0;

    private container: Container = null;

    constructor() {
        this.spawnBellheadTimer.subscribe(x => {
            this.spawnEntity(0);
        }
        );
    }

    public setContainer(container: Container): void {
        this.container = container;
        this.spawnEntity(0);
        this.spawnEntity(1);
    }

    /**
     * Entity manager logic to run each frame.
     * @param delta 
     */
    public update(delta: number) {
        this.x += 1 * delta;

        if (Math.floor(this.x % 100) === 0) {
            this.spawnEntity(1);
        }

        // For each entity, we need to either: update it, nullify it, or remove it.
        for (let i = this.entityList.length; i >= 0; i--) {
            const entity = this.entityList[i];
            if (entity) {
                // If entity is not destroyed, then we update it.
                if (!entity.isDestroyed) {
                    entity.update(delta);
                    this.checkCollisionWithSword(entity);
                    if (entity.type === 'enemy' && entity.isAlive) {
                        this.checkCollisionWithPlayer(entity);
                    }
                }
                // If entity is destroyed, then we set it to null so it will be removed next frame.
                else {
                    this.entityList[i] = null;
                    continue;
                }
            }
            // If entity is null, then we can remove it from the entityList
            else {
                this.entityList.splice(i);
            }
        }
    }


    private isCollidingWithSword(entity: Entity): boolean {
        const ab = Player.SwordBounds;
        const bb = entity.sprite.getBounds();
        if(entity.type === 'bellhead') {
            const hitboxReduction = 40;
            return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width-hitboxReduction && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height-hitboxReduction;
        }
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    private isCollidingWithPlayer(entity: Entity): boolean {
        const ab = Player.playerSprite.getBounds();
        const bb = entity.sprite.getBounds();
        return ab.x + ab.width > bb.x && ab.x < bb.x + bb.width && ab.y + ab.height > bb.y && ab.y < bb.y + bb.height;
    }

    private checkCollisionWithSword(entity: Entity): void {
        if (this.isCollidingWithSword(entity)) {
            if (Player.playerIsAlive) {
                entity.takeDamage();
            }
        }
    }

    private checkCollisionWithPlayer(entity: Entity): void {
        if (this.isCollidingWithPlayer(entity)) {
            if (Player.playerIsAlive) {
                Player.playerEntity.takeDamage(10);
            }
        }
    }

    spawnEntity(type: number): Entity {
        if (!Player.playerIsAlive) {
            return;
        }

        let entity: Entity = null;
        switch (type) {
            case 1:
                entity = new Enemy();
                entity.type = 'enemy';
                break;
            case 2:
                break;
            default: // Bellhead
                entity = new Bellhead();
                entity.type = 'bellhead';
                break;

        }

        if (entity) {
            this.entityList.push(entity);
        }
        this.container.addChild(entity.getContainer());
        return entity;
    }

    /**
     * Removes all entities from memory, and cleans up memory.
     */
    public reset(): void {
        for (let i = this.entityList.length - 1; i >= 0; i--) {
            this.entityList[i].destroy();
            this.entityList.pop();
        }
    }
}