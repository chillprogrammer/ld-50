import { Entity } from "./base-entity";

/**
 * Manager for entities
 */
export class EntityManager {

    // Private list of Entities.
    private entityList: Entity[] = [];

    /**
     * Entity manager logic to run each frame.
     * @param delta 
     */
    public update(delta: number) {

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

    /**
     * Removes all entities from memory, and cleans up memory.
     */
    public reset(): void {
        for (let entity of this.entityList) {
            entity.destroy();
        }
    }
}