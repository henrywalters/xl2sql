import EventListenerPool from 'hcore/dist/eventListenerPool';

export default class FileInput {
    private static instances: number = 0;
    private static prefix: string = 'file_input';
    private id: string;
    private el: HTMLInputElement;
    private file: File | null = null;
    private listeners: EventListenerPool<File>;


    constructor(id: string) {
        this.id = id;
        this.el = document.getElementById(this.id) as HTMLInputElement;
        this.listeners = new EventListenerPool();
        document.getElementById(this.id).addEventListener('change', (e: Event) => {
            // @ts-ignore
            this.file = e.target.files[0];

            this.listeners.emit(this.file);
        });
    }

    public static generate(container: HTMLElement = document.body): FileInput {
        const el = document.createElement('input');
        el.type = 'file';
        el.id = `${this.prefix}_${this.instances}`;
        this.instances += 1;
        container.appendChild(el);
        return new FileInput(el.id);
    }

    public onUpload(handler: (file: File) => void) {
        this.listeners.listen(handler);
    }
}