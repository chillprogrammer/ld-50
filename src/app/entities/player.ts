import { Entity } from "./base-entity";

export class Player extends Entity {

    constructor() {
        super();
        this.init();
    }

    /**
     * Initialize player class
     */
    private init(): void {
        this.health = 100;
        this.maxHealth = 100;
        this.shield = 50;
        this.speed = 5;
    }
}