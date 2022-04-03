import { Container } from "pixi.js";
import { Entity } from "./base-entity";
import { Bellhead } from "./Bellhead";
import { Enemy } from "./enemy";

/**
 * Manager for entities
 */
export class EntityManager {

    // Private list of Entities.
    private entityList: Entity[] = [];

    private x = 0;

    private container: Container = null;

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

        this.x++;

        // For each entity, we need to either: update it, nullify it, or remove it.
        for (let i = this.entityList.length; i >= 0; i--) {
            const entity = this.entityList[i];
            if (entity) {
                // If entity is not destroyed, then we update it.
                if (!entity.isDestroyed) {
                    entity.update(delta);
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

    spawnEntity(type: number): Entity {
        let entity: Entity = null;
        switch (type) {
            case 1:
                entity = new Enemy();
                break;
            case 2:
                break;
            default: // Bellhead
                entity = new Bellhead();
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
        for (let entity of this.entityList) {
            entity.destroy();
            this.entityList.pop();
        }
    }
}