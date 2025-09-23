export class Sidebar {
    private sidebarElement: HTMLElement;
    private toggleButton: HTMLElement;
    private mainContent: HTMLElement;
    private overlay: HTMLElement;
    private isOpen: boolean = true;

    constructor() {
        this.sidebarElement = document.getElementById('sidebar')!;
        this.toggleButton = document.getElementById('sidebar-toggle')!;
        this.mainContent = document.getElementById('main-content')!;
        this.overlay = this.createOverlay();
        
        this.init();
    }

    private init(): void {
        this.toggleButton.addEventListener('click', () => {
            this.toggle();
        });

        this.overlay.addEventListener('click', () => {
            this.close();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.close();
            }
        });

        this.setupGroupHandlers();
    }

    private setupGroupHandlers(): void {
        const groupItems = this.sidebarElement.querySelectorAll('.group-item');
        groupItems.forEach(item => {
            item.addEventListener('click', () => {
                groupItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                console.log('Selected group:', item.querySelector('.group-name')?.textContent);
            });
        });
    }

    private createOverlay(): HTMLElement {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
        return overlay;
    }

    public toggle(): void {
        this.isOpen ? this.close() : this.open();
    }

    public open(): void {
        this.sidebarElement.classList.remove('collapsed');
        this.mainContent.classList.remove('sidebar-expanded');
        this.overlay.classList.remove('active');
        this.isOpen = true;
        
        const toggleText = this.toggleButton.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = 'Скрыть группы';
        }
    }

    public close(): void {
        this.sidebarElement.classList.add('collapsed');
        this.mainContent.classList.add('sidebar-expanded');
        this.overlay.classList.add('active');
        this.isOpen = false;
        
        const toggleText = this.toggleButton.querySelector('.toggle-text');
        if (toggleText) {
            toggleText.textContent = 'Показать группы';
        }
    }

    public updateGroups(groups: string[]): void {
        console.log('Update groups:', groups);
    }

    public isSidebarOpen(): boolean {
        return this.isOpen;
    }
}