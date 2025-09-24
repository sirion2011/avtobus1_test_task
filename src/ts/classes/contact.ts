import { IContact } from '../types/index.js';

export class Contact implements IContact {
    public id: string;
    
    constructor(
        public name: string,
        public phone: string, 
        public group: string
    ) {
        this.id = this.generateId();
    }

    private generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    get fullName(): string {
        return this.name; 
    }

    static createWithFullName(firstName: string, lastName: string, middleName: string, phone: string, group: string): Contact {
        const fullName = `${lastName} ${firstName} ${middleName}`.trim();
        return new Contact(fullName, phone, group);
    }
}