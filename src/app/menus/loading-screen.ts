import { Container, Loader, Text } from "pixi.js";
import { GraphicsManagerService } from "../../services/graphics-manager/graphics-manager.service";

export class LoadingScreen {

    // Graphics
    private container: Container = null;
    private progressText: Text = null;

    constructor() {
        this.init();
    }

    /**
     * Runs all initialization code.
     */
    public init(): void {
        this.container = new Container();
        this.progressText = new Text(`Loading.\n${0}%`, { fontSize: 32, fill: 0xffffff, align: 'center', strokeThickness: 2 });
        this.progressText.resolution = 2; // Crisp text.
        this.progressText.anchor.set(0.5);
        this.progressText.position.set(GraphicsManagerService.INITIAL_WIDTH / 2, GraphicsManagerService.INITIAL_HEIGHT / 2);
        this.container.addChild(this.progressText);
    }

    public loadAssets(): Promise<any> {
        return new Promise((resolve) => {

            const assetsToLoad: string[] = [
                'assets/art/arm.png',
                'assets/art/Background.png',
                'assets/art/Bellhead_Attack.png',
                'assets/art/Bellhead_Walk.png',
                'assets/art/blood.png',
                'assets/art/blood2.png',
                'assets/art/blood3.png',
                'assets/art/blood4.png',
                'assets/art/blood5.png',
                'assets/art/end.png',
                'assets/art/Glad_Walk.png',
                'assets/art/gladiator-idle.png',
                'assets/art/Health_full.png',
                'assets/art/Health_Left.png',
                'assets/art/Health_Right.png',
                'assets/art/intro.png',
                'assets/art/Pedestrian.png',
                'assets/art/Sand_Area.png',
                'assets/art/Shockwave.png',
                'assets/art/SpearMan_Walk.png',
                'assets/art/Stands.png',
                'assets/art/Sword.png',
                'assets/art/Torch.png',
                'assets/art/WallColumns.png',
                'assets/art/WallColumns2.png',
            ];

            const loader = Loader.shared;
            loader.add(assetsToLoad).onComplete.add(() => {
                setTimeout(() => {
                    resolve(true);
                }, 1000);
            });

            loader.onProgress.add(() => {
                this.progressText.text = `Loading.\n${Math.round(loader.progress)}%`
            });

            loader.load();
        })
    }

    /**
     * Destroys the graphics. Must have called init() first.
     */
    public destroy(): void {
        this.progressText.destroy(true);
        this.container.destroy(true);
    }

    /**
     * 
     * @returns The container the ErrorScreen is inside.
     */
    getContainer() { return this.container; }
}
