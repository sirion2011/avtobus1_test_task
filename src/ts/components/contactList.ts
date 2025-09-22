import { Contact } from '../classes/contact.js';
import { ContactManager } from '../classes/contactManager.js';

export class ContactList {
  private container: HTMLElement;
  private contactManager: ContactManager;

  constructor(containerId: string) {
    this.container = document.getElementById(containerId)!;
    this.contactManager = new ContactManager();
    this.render();
  }

  private render(): void {
    const contacts = this.contactManager.getContacts();
    
    if (contacts.length === 0) {
      this.container.innerHTML = this.getEmptyState();
      return;
    }

    this.container.innerHTML = this.getContactsHTML(contacts);
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

  // Метод для обновления списка
  public update(): void {
    this.render();
  }
}