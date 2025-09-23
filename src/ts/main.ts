import { ContactList } from './components/contactList.js';
import { ContactForm } from './components/contactForm.js';
import { ContactManager } from './classes/contactManager.js';
import { Sidebar } from './components/sidebar.js';

class App {
    private contactList: ContactList;
    private contactForm: ContactForm;
    private contactManager: ContactManager;
    private sidebar: Sidebar;

    constructor() {
        this.contactManager = new ContactManager();
        this.contactList = new ContactList('contacts-container', this.contactManager);
        this.contactForm = new ContactForm('contact-form', this.contactManager);
        this.sidebar = new Sidebar();
        
        this.contactForm.setOnSubmit(() => {
            this.contactList.update();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});