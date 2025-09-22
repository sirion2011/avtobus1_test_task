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
}