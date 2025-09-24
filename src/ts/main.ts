import { Sidebar } from './components/sidebar.js';

class App {
    private sidebar: Sidebar;

    constructor() {
        this.sidebar = new Sidebar();
        console.log('App initialized');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});