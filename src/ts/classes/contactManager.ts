import { Contact } from './contact.js';
import { IContact } from '../types/index.js';

export class ContactManager {
  private contacts: Contact[] = [];
  private groups: string[] = ['Друзья', 'Коллеги', 'Семья'];

  constructor() {
    this.loadFromStorage(); // ← ЭТОТ МЕТОД НУЖНО СОЗДАТЬ
  }

  // ДОБАВЛЯЕМ МЕТОД loadFromStorage
  private loadFromStorage(): void {
    const stored = localStorage.getItem('contacts');
    if (stored) {
      const contactsData: IContact[] = JSON.parse(stored);
      this.contacts = contactsData.map(contact => 
        new Contact(contact.name, contact.phone, contact.group)
      );
    }
  }

  // ДОБАВЛЯЕМ МЕТОД saveToStorage
  private saveToStorage(): void {
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
  }

  // ДОБАВЛЯЕМ БАЗОВЫЕ МЕТОДЫ ДЛЯ ТЕСТА
  public addContact(name: string, phone: string, group: string): void {
    const contact = new Contact(name, phone, group);
    this.contacts.push(contact);
    this.saveToStorage();
  }

  public getContacts(): Contact[] {
    return this.contacts;
  }

  public getGroups(): string[] {
    return this.groups;
  }
}