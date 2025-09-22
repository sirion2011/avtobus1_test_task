import { Contact } from './contact.js';
import { IContact } from '../types/index.js';

export class ContactManager {
    private contacts: Contact[] = [];
    private groups: string[] = ['Друзья', 'Коллеги', 'Семья'];

    constructor() {
        this.loadFromStorage();
    }

    public addContact(name: string, phone: string, group: string): void {
        const normalizedPhone = this.normalizePhone(phone);
        
        if (this.isPhoneExists(normalizedPhone)) {
            throw new Error('Контакт с таким номером телефона уже существует');
        }

        const contact = new Contact(name, normalizedPhone, group);
        this.contacts.push(contact);
        this.saveToStorage();
    }

    private isPhoneExists(phone: string): boolean {
        const normalizedSearch = this.normalizePhone(phone);
        return this.contacts.some(contact => 
            this.normalizePhone(contact.phone) === normalizedSearch
        );
    }

    private normalizePhone(phone: string): string {
        return phone.replace(/\D/g, '');
    }

    private loadFromStorage(): void {
        const stored = localStorage.getItem('contacts');
        if (stored) {
            const contactsData: IContact[] = JSON.parse(stored);
            this.contacts = contactsData.map(contact => 
                new Contact(contact.name, contact.phone, contact.group)
            );
        }
    }

    private saveToStorage(): void {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    public getContacts(): Contact[] {
        return this.contacts;
    }

    public getGroups(): string[] {
        return this.groups;
    }
}