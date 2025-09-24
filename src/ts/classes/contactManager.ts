import { Contact } from './contact.js';
import { IContact } from '../types/index.js';

export class ContactManager {
    private contacts: Contact[] = [];

    constructor() {
        this.loadFromStorage();
    }

    public addContact(name: string, phone: string, group: string): boolean {
        const normalizedPhone = this.normalizePhone(phone);
        
        if (this.isPhoneExists(normalizedPhone)) {
            return false;
        }

        const contact = new Contact(name, normalizedPhone, group);
        this.contacts.push(contact);
        this.saveToStorage();
        return true;
    }

    public addContactWithFullName(firstName: string, lastName: string, middleName: string, phone: string, group: string): boolean {
        const fullName = `${lastName} ${firstName} ${middleName}`.trim();
        return this.addContact(fullName, phone, group);
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
            try {
                const contactsData: IContact[] = JSON.parse(stored);
                this.contacts = contactsData.map(contact => 
                    new Contact(contact.name, contact.phone, contact.group)
                );
            } catch (error) {
                console.error('Error loading contacts:', error);
                this.contacts = [];
            }
        }
    }

    private saveToStorage(): void {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    public getContacts(): Contact[] {
        return this.contacts;
    }

    public getContactsByGroup(groupName: string): Contact[] {
        return this.contacts.filter(contact => contact.group === groupName);
    }

    public getContactsCountByGroup(groupName: string): number {
        return this.getContactsByGroup(groupName).length;
    }

    public deleteContact(contactId: string): void {
        this.contacts = this.contacts.filter(contact => contact.id !== contactId);
        this.saveToStorage();
    }

    public deleteContactsByGroup(groupName: string): void {
        this.contacts = this.contacts.filter(contact => contact.group !== groupName);
        this.saveToStorage();
    }

    public getGroupsFromContacts(): string[] {
        const groups = new Set(this.contacts.map(contact => contact.group));
        return Array.from(groups);
    }

    public formatPhoneForDisplay(phone: string): string {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9)}`;
        }
        return phone;
    }
}