import { Contact } from '../classes/contact.js';
import { ContactManager } from '../classes/contactManager.js';

export class ContactList {
    private container: HTMLElement;
    private contactManager: ContactManager;

    constructor(containerId: string, contactManager: ContactManager) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with id '${containerId}' not found`);
        }
        
        this.container = container;
        this.contactManager = contactManager;
        console.log('ContactList initialized with contacts:', this.contactManager.getContacts());
        this.render();
    }

    public render(): void {
        const contacts = this.contactManager.getContacts();
        console.log('Rendering contacts:', contacts);
        
        if (contacts.length === 0) {
            this.container.innerHTML = this.getEmptyState();
            return;
        }

        this.container.innerHTML = this.getContactsHTML(contacts);
    }

    public update(): void {
      console.log('ContactList update called');
        this.render();
    }

    private getEmptyState(): string {
        return `
            <div class="empty-state">
                <h2>📭 Список контактов пуст</h2>
                <p>Добавьте первый контакт чтобы начать</p>
            </div>
        `;
    }

    private getContactsHTML(contacts: Contact[]): string {
        return `
            <div class="contacts-list">
                <h2>📋 Контакты (${contacts.length})</h2>
                <div class="contacts-grid">
                    ${contacts.map(contact => this.getContactHTML(contact)).join('')}
                </div>
            </div>
        `;
    }

    private getContactHTML(contact: Contact): string {
        return `
            <div class="contact-card">
                <div class="contact-info">
                    <h3 class="contact-name">${contact.name}</h3>
                    <p class="contact-phone">${contact.phone}</p>
                    <span class="contact-group">${contact.group}</span>
                </div>
            </div>
        `;
    }
}