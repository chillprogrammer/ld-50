import { Container, Sprite } from "pixi.js";

/**
 * The base Entity class.
 */
export class Entity {

    public isDestroyed: boolean = false;

    // Variables
    protected health: number;
    protected maxHealth: number;
    protected shield: number;
    protected speed: number;

    // Pixi.js
    protected sprite: Sprite = null;
    protected container: Container = null;

    /**
     * Creates a default Entity object
     */
    constructor() {
        this.health = 100;
        this.maxHealth = 100;
        this.shield = 0;
        this.speed = 5;
    }

    /**
     * Destroys the entity, it's sprite, and all the rest of it.
     */
    public destroy(): void {
        this.isDestroyed = true;
    }

    /**
     * 
     * @returns Health
     */
    public getHealth(): number { return this.health; }

    /**
     * 
     * @returns Max Health
     */
    public getMaxHealth(): number { return this.maxHealth; }

    /**
     * 
     * @returns Shield
     */
    public getShield(): number { return this.shield; }

    /**
     * 
     * @returns Speed
     */
    public getSpeed(): number { return this.speed; }


    /**
     * Runs each tick.
     * @param delta delta time
     */
    public update(delta: number) {
        // TODO - enter update logic
    }

}