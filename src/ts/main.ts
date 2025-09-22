import { ContactList } from './components/contactList.js';
import { ContactForm } from './components/contactForm.js';
import { ContactManager } from './classes/contactManager.js';

class App {
    private contactList: ContactList;
    private contactForm: ContactForm;
    private contactManager: ContactManager;

    constructor() {
        this.contactManager = new ContactManager();
        
        this.contactList = new ContactList('contacts-container', this.contactManager);
        this.contactForm = new ContactForm('contact-form', this.contactManager);
        
        this.contactForm.setOnSubmit(() => {
            console.log('Колбэк вызван, обновляем список...');
            this.contactList.update();
        });
        
        console.log('App initialized, contacts:', this.contactManager.getContacts());
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});