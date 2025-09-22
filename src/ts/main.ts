import { ContactList } from './components/contactList.js';
import { ContactForm } from './components/contactForm.js';
import { ContactManager } from './classes/contactManager.js';


class App {
    private contactList: ContactList;
    private contactForm: ContactForm;

    constructor() {
        // Инициализируем компоненты
        this.contactList = new ContactList('contacts-container');
        this.contactForm = new ContactForm('contact-form');
        
        // Связываем форму и список
        this.contactForm.setOnSubmit(() => {
            this.contactList.update();
        });
        
        // Добавляем тестовые данные
        this.addSampleData();
    }

    private addSampleData(): void {
        // Простая проверка чтобы не дублировать данные
        const tempManager = new ContactManager();
        if (tempManager.getContacts().length === 0) {
            tempManager.addContact('Иван Иванов', '+7 900 123-45-67', 'Друзья');
            tempManager.addContact('Мария Петрова', '+7 900 987-65-43', 'Коллеги');
            tempManager.addContact('Алексей Сидоров', '+7 900 555-35-35', 'Семья');
            this.contactList.update();
        }
    }
}

// Запускаем приложение когда страница загрузится
document.addEventListener('DOMContentLoaded', () => {
    new App();
});