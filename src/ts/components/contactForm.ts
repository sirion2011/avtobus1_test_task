import { ContactManager } from '../classes/contactManager.js';

export class ContactForm {
    private formElement: HTMLFormElement;
    private contactManager: ContactManager;
    private onSubmitCallback: (() => void) | null = null;

    constructor(formId: string) {
        const form = document.getElementById(formId);
        if (!form) {
            throw new Error(`Form with id '${formId}' not found`);
        }
        
        this.formElement = form as HTMLFormElement;
        this.contactManager = new ContactManager();
        this.init();
    }

    private init(): void {
        this.formElement.addEventListener('submit', this.handleSubmit.bind(this));
        this.renderGroupOptions();
    }

    private renderGroupOptions(): void {
        const groupSelect = this.formElement.querySelector('#contact-group') as HTMLSelectElement;
        if (!groupSelect) return;

        const groups = this.contactManager.getGroups();
        groupSelect.innerHTML = groups.map(group => 
            `<option value="${group}">${group}</option>`
        ).join('');
    }

    private handleSubmit(event: Event): void {
        event.preventDefault();
        
        const formData = new FormData(this.formElement);
        const name = formData.get('name') as string;
        const phone = formData.get('phone') as string;
        const group = formData.get('group') as string;

        // Базовая валидация
        if (!name?.trim() || !phone?.trim()) {
            alert('Заполните все обязательные поля');
            return;
        }

        try {
            this.contactManager.addContact(name.trim(), phone.trim(), group);
            this.formElement.reset();
            
            // Вызываем колбэк для обновления списка
            if (this.onSubmitCallback) {
                this.onSubmitCallback();
            }

            console.log('Контакт добавлен:', { name, phone, group });
        } catch (error) {
            alert(error instanceof Error ? error.message : 'Ошибка при добавлении контакта');
        }
    }

    public setOnSubmit(callback: () => void): void {
        this.onSubmitCallback = callback;
    }
}