export class Sidebar {
    private sidebarElement: HTMLElement;
    private toggleButton: HTMLElement;
    private closeButton: HTMLElement;
    private overlay: HTMLElement;
    private groupsList: HTMLElement;
    private mainContent: HTMLElement;
    private isOpen: boolean = false;

    private groupsBtn: HTMLElement;
    private addContactBtn: HTMLElement;
    
    private groupsGrid: HTMLElement;
    private emptyState: HTMLElement;
    private contactsContainer: HTMLElement;
    private contactsList: HTMLElement;
    private contactsTitle: HTMLElement;
    private backToGroupsBtn: HTMLElement;

    private addGroupBtn: HTMLElement;
    private addGroupForm: HTMLElement;
    private groupNameInput: HTMLInputElement;
    private confirmAddBtn: HTMLElement;
    private cancelAddBtn: HTMLElement;

    private addContactModal: HTMLElement;
    private closeContactModalBtn: HTMLElement;
    private cancelContactBtn: HTMLElement;
    private contactForm: HTMLFormElement;
    private contactGroupSelect: HTMLSelectElement;
    
    private contactLastNameInput: HTMLInputElement;
    private contactFirstNameInput: HTMLInputElement;
    private contactMiddleNameInput: HTMLInputElement;
    private contactPhoneInput: HTMLInputElement;
    
    private lastNameError: HTMLElement;
    private firstNameError: HTMLElement;
    private middleNameError: HTMLElement;
    private phoneError: HTMLElement;
    private groupError: HTMLElement;

    private currentEditingContact: any = null;
    private currentGroupName: string = '';

    constructor() {
        this.sidebarElement = document.getElementById('sidebar')!;
        this.toggleButton = document.getElementById('sidebar-toggle')!;
        this.closeButton = document.getElementById('sidebar-close')!;
        this.overlay = document.getElementById('sidebar-overlay')!;
        this.groupsList = document.getElementById('groups-list')!;
        this.mainContent = document.getElementById('main-content')!;
        
        this.groupsBtn = document.getElementById('groups-btn')!;
        this.addContactBtn = document.getElementById('add-contact-btn')!;
        
        this.groupsGrid = document.getElementById('groups-grid')!;
        this.emptyState = document.getElementById('empty-state')!;
        this.contactsContainer = document.getElementById('contacts-container')!;
        this.contactsList = document.getElementById('contacts-list')!;
        this.contactsTitle = document.getElementById('contacts-title')!;
        this.backToGroupsBtn = document.getElementById('back-to-groups-btn')!;
        
        this.addGroupBtn = document.getElementById('add-group-btn')!;
        this.addGroupForm = document.getElementById('add-group-form')!;
        this.groupNameInput = document.getElementById('group-name-input') as HTMLInputElement;
        this.confirmAddBtn = document.getElementById('confirm-add-group')!;
        this.cancelAddBtn = document.getElementById('cancel-add-group')!;

        this.addContactModal = document.getElementById('add-contact-modal')!;
        this.closeContactModalBtn = document.getElementById('close-contact-modal')!;
        this.cancelContactBtn = document.getElementById('cancel-contact')!;
        this.contactForm = document.getElementById('contact-form') as HTMLFormElement;
        this.contactGroupSelect = document.getElementById('contact-group') as HTMLSelectElement;
        
        this.contactLastNameInput = document.getElementById('contact-lastname') as HTMLInputElement;
        this.contactFirstNameInput = document.getElementById('contact-firstname') as HTMLInputElement;
        this.contactMiddleNameInput = document.getElementById('contact-middlename') as HTMLInputElement;
        this.contactPhoneInput = document.getElementById('contact-phone') as HTMLInputElement;
        
        this.lastNameError = document.getElementById('lastname-error')!;
        this.firstNameError = document.getElementById('firstname-error')!;
        this.middleNameError = document.getElementById('middlename-error')!;
        this.phoneError = document.getElementById('phone-error')!;
        this.groupError = document.getElementById('group-error')!;

        this.init();
    }

    private init(): void {
        this.setupSidebarHandlers();
        this.setupGroupHandlers();
        this.setupGroupManagementHandlers();
        this.setupHeaderButtons();
        this.setupContactsHandlers();
        this.setupContactModalHandlers();
        this.setupPhoneMask();
        this.updateGroupsGrid();
        this.loadGroupsFromStorage();
    }

    private setupSidebarHandlers(): void {
        this.toggleButton.addEventListener('click', () => this.open());
        this.closeButton.addEventListener('click', () => this.close());
        this.overlay.addEventListener('click', () => this.close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.addGroupForm.style.display !== 'none') {
                    this.cancelAddGroup();
                } else if (this.addContactModal.classList.contains('active')) {
                    this.closeContactModal();
                } else {
                    this.close();
                }
            }
        });
    }

    private setupHeaderButtons(): void {
        this.groupsBtn.addEventListener('click', () => this.open());
        this.addContactBtn.addEventListener('click', () => this.openContactModal());
    }

    private setupGroupHandlers(): void {
        this.groupsList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const groupItem = target.closest('.group-item');
            const deleteBtn = target.closest('.group-delete-btn');
            
            if (deleteBtn && groupItem) {
                e.stopPropagation();
                const groupName = groupItem.querySelector('.group-name')?.textContent || '';
                this.deleteGroup(groupItem as HTMLElement, groupName);
                return;
            }
            
            if (groupItem) {
                this.selectGroup(groupItem as HTMLElement);
            }
        });

        this.groupsGrid.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const groupCard = target.closest('.group-card');
            const arrowBtn = target.closest('.group-card__arrow');
            
            if (arrowBtn && groupCard) {
                e.stopPropagation();
                const groupName = groupCard.querySelector('.group-card__name')?.textContent || '';
                this.showGroupContacts(groupName);
                return;
            }
            
            if (groupCard) {
                const groupName = groupCard.querySelector('.group-card__name')?.textContent || '';
                this.selectGroupByName(groupName);
            }
        });
    }

    private setupGroupManagementHandlers(): void {
        this.addGroupBtn.addEventListener('click', () => this.showAddGroupForm());
        this.confirmAddBtn.addEventListener('click', () => this.confirmAddGroup());
        this.cancelAddBtn.addEventListener('click', () => this.cancelAddGroup());
        
        this.groupNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.confirmAddGroup();
        });
    }

    private setupContactsHandlers(): void {
        this.backToGroupsBtn.addEventListener('click', () => this.showGroupsGrid());
        
        this.contactsList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const contactItem = target.closest('.contact-item');
            
            if (!contactItem) return;
            
            const editBtn = target.closest('.contact-edit-btn');
            const deleteBtn = target.closest('.contact-delete-btn');
            
            if (editBtn) {
                e.stopPropagation();
                const contactId = contactItem.getAttribute('data-contact-id');
                this.editContact(contactId!);
                return;
            }
            
            if (deleteBtn) {
                e.stopPropagation();
                const contactId = contactItem.getAttribute('data-contact-id');
                this.deleteContact(contactId!);
                return;
            }
        });
    }

    private setupContactModalHandlers(): void {
        this.closeContactModalBtn.addEventListener('click', () => this.closeContactModal());
        this.cancelContactBtn.addEventListener('click', () => this.closeContactModal());

        this.addContactModal.addEventListener('click', (e) => {
            if (e.target === this.addContactModal) this.closeContactModal();
        });

        this.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleContactSubmit();
        });

        this.setupRealTimeValidation();
    }

    private setupRealTimeValidation(): void {
        this.contactLastNameInput.addEventListener('blur', () => this.validateLastName());
        this.contactFirstNameInput.addEventListener('blur', () => this.validateFirstName());
        this.contactMiddleNameInput.addEventListener('blur', () => this.validateMiddleName());
        this.contactPhoneInput.addEventListener('blur', () => this.validatePhone());
        this.contactGroupSelect.addEventListener('change', () => this.validateGroup());
    }

    private setupPhoneMask(): void {
        this.contactPhoneInput.addEventListener('input', (e) => {
            const input = e.target as HTMLInputElement;
            let value = input.value.replace(/\D/g, '');
            
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            
            if (value.length > 0) {
                let formattedValue = '+7 (';
                
                if (value.length > 0) formattedValue += value.substring(0, 3);
                if (value.length > 3) formattedValue += ') ' + value.substring(3, 6);
                if (value.length > 6) formattedValue += '-' + value.substring(6, 8);
                if (value.length > 8) formattedValue += '-' + value.substring(8, 10);
                
                input.value = formattedValue;
            }
        });
    }

    private showAddGroupForm(): void {
        this.addGroupForm.style.display = 'block';
        this.groupNameInput.value = '';
        this.groupNameInput.focus();
    }

    private hideAddGroupForm(): void {
        this.addGroupForm.style.display = 'none';
    }

    private confirmAddGroup(): void {
        const groupName = this.groupNameInput.value.trim();
        
        if (!groupName) {
            this.showError('Название группы не может быть пустым');
            return;
        }

        if (this.isGroupExists(groupName)) {
            this.showError('Группа с таким названием уже существует');
            return;
        }

        this.addGroupToList(groupName);
        this.saveGroupsToStorage();
        this.hideAddGroupForm();
        this.showTempMessage(`Группа "${groupName}" добавлена`);
    }

    private cancelAddGroup(): void {
        this.hideAddGroupForm();
    }

    private isGroupExists(groupName: string): boolean {
        const existingGroups = Array.from(this.groupsList.querySelectorAll('.group-name'));
        return existingGroups.some(element => 
            element.textContent?.toLowerCase() === groupName.toLowerCase()
        );
    }

    private addGroupToList(groupName: string): void {
        const groupItem = document.createElement('li');
        groupItem.className = 'group-item';
        
        if (this.groupsList.children.length === 0) {
            groupItem.classList.add('active');
        }
        
        groupItem.innerHTML = `
            <span class="group-name">${this.escapeHtml(groupName)}</span>
            <button class="group-delete-btn" title="Удалить группу">×</button>
        `;

        const deleteBtn = groupItem.querySelector('.group-delete-btn') as HTMLElement;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteGroup(groupItem, groupName);
        });

        this.groupsList.appendChild(groupItem);
        this.updateGroupsGrid();
    }

    private deleteGroup(groupItem: HTMLElement, groupName: string): void {
        if (confirm(`Вы уверены, что хотите удалить группу "${groupName}"? Это приведет к удалению всех контактов в этой группе.`)) {
            const wasActive = groupItem.classList.contains('active');
            groupItem.remove();
            this.saveGroupsToStorage();
            this.deleteContactsByGroup(groupName);
            
            this.showTempMessage(`Группа "${groupName}" и все контакты удалены`);
            this.updateGroupsGrid();
            
            if (wasActive && this.groupsList.children.length > 0) {
                const firstGroup = this.groupsList.querySelector('.group-item:first-child') as HTMLElement;
                if (firstGroup) this.selectGroup(firstGroup);
            }
            
            if (this.contactsContainer.style.display === 'block') {
                this.showGroupsGrid();
            }
        }
    }

    private openContactModal(contact: any = null): void {
        this.addContactModal.classList.add('active');
        this.populateGroupSelect();
        
        if (contact) {
            this.currentEditingContact = contact;
            this.fillContactForm(contact);
            this.updateModalTitle('Редактировать контакт');
        } else {
            this.currentEditingContact = null;
            this.clearForm();
            this.updateModalTitle('Добавить контакт');
        }
        
        this.contactFirstNameInput.focus();
    }

    private closeContactModal(): void {
        this.addContactModal.classList.remove('active');
        this.currentEditingContact = null;
        this.clearErrors();
    }

    private updateModalTitle(title: string): void {
        const modalTitle = this.addContactModal.querySelector('h3');
        if (modalTitle) {
            modalTitle.textContent = title;
        }
    }

    private fillContactForm(contact: any): void {
        const nameParts = contact.name.split(' ');
        this.contactLastNameInput.value = nameParts[0] || '';
        this.contactFirstNameInput.value = nameParts[1] || '';
        this.contactMiddleNameInput.value = nameParts.slice(2).join(' ') || '';
        this.contactPhoneInput.value = this.formatPhoneNumber(contact.phone);
        this.contactGroupSelect.value = contact.group;
    }

    private populateGroupSelect(): void {
        this.contactGroupSelect.innerHTML = '<option value="">Выберите группу</option>';
        
        const groups = Array.from(this.groupsList.querySelectorAll('.group-name'))
            .map(element => element.textContent)
            .filter(Boolean) as string[];
        
        groups.forEach(group => {
            const option = document.createElement('option');
            option.value = group!;
            option.textContent = group;
            this.contactGroupSelect.appendChild(option);
        });
    }

    private handleContactSubmit(): void {
        if (this.validateForm()) {
            if (this.currentEditingContact) {
                this.updateContact();
            } else {
                this.addNewContact();
            }
        }
    }

    private validateForm(): boolean {
        return this.validateLastName() && 
               this.validateFirstName() && 
               this.validatePhone() && 
               this.validateGroup();
    }

    private validateLastName(): boolean {
        const value = this.contactLastNameInput.value.trim();
        const error = this.validateName(value, 'Фамилия');
        this.lastNameError.textContent = error || '';
        this.contactLastNameInput.classList.toggle('error', !!error);
        return !error;
    }

    private validateFirstName(): boolean {
        const value = this.contactFirstNameInput.value.trim();
        const error = this.validateName(value, 'Имя');
        this.firstNameError.textContent = error || '';
        this.contactFirstNameInput.classList.toggle('error', !!error);
        return !error;
    }

    private validateMiddleName(): boolean {
        const value = this.contactMiddleNameInput.value.trim();
        if (value && !/^[а-яА-ЯёЁa-zA-Z\- ]+$/.test(value)) {
            this.middleNameError.textContent = 'Отчество может содержать только буквы';
            this.contactMiddleNameInput.classList.add('error');
            return false;
        }
        this.middleNameError.textContent = '';
        this.contactMiddleNameInput.classList.remove('error');
        return true;
    }

    private validatePhone(): boolean {
        const value = this.contactPhoneInput.value.trim();
        const cleaned = value.replace(/\D/g, '');
        
        let error = '';
        if (!value) error = 'Поле обязательно для заполнения';
        else if (cleaned.length !== 11) error = 'Номер должен содержать 11 цифр';
        else if (!cleaned.startsWith('7') && !cleaned.startsWith('8')) error = 'Номер должен начинаться с 7 или 8';
        
        this.phoneError.textContent = error;
        this.contactPhoneInput.classList.toggle('error', !!error);
        return !error;
    }

    private validateGroup(): boolean {
        const value = this.contactGroupSelect.value;
        const error = value ? '' : 'Выберите группу';
        this.groupError.textContent = error;
        this.contactGroupSelect.classList.toggle('error', !!error);
        return !error;
    }

    private validateName(value: string, fieldName: string): string {
        if (!value) return 'Поле обязательно для заполнения';
        if (value.length < 2) return `${fieldName} должно содержать минимум 2 символа`;
        if (!/^[а-яА-ЯёЁa-zA-Z\- ]+$/.test(value)) return `${fieldName} может содержать только буквы`;
        return '';
    }

    private addNewContact(): void {
        const lastName = this.contactLastNameInput.value.trim();
        const firstName = this.contactFirstNameInput.value.trim();
        const middleName = this.contactMiddleNameInput.value.trim();
        const phone = this.contactPhoneInput.value;
        const group = this.contactGroupSelect.value;

        const fullName = `${lastName} ${firstName} ${middleName}`.trim();
        const contacts = this.getContactsFromStorage();
        
        const phoneExists = contacts.some(contact => 
            contact.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
        );
        
        if (phoneExists) {
            this.showError('Контакт с таким номером телефона уже существует');
            return;
        }

        const newContact = {
            id: Date.now().toString(),
            name: fullName,
            phone: phone.replace(/\D/g, ''),
            group: group
        };

        contacts.push(newContact);
        localStorage.setItem('contacts', JSON.stringify(contacts));

        this.showTempMessage('Контакт успешно добавлен');
        this.closeContactModal();
        this.updateGroupsGrid();

        if (this.contactsContainer.style.display === 'block' && 
            this.contactsTitle.textContent?.includes(group)) {
            this.displayContacts(group);
        }
    }

    private updateContact(): void {
        const lastName = this.contactLastNameInput.value.trim();
        const firstName = this.contactFirstNameInput.value.trim();
        const middleName = this.contactMiddleNameInput.value.trim();
        const phone = this.contactPhoneInput.value;
        const group = this.contactGroupSelect.value;

        const fullName = `${lastName} ${firstName} ${middleName}`.trim();
        const contacts = this.getContactsFromStorage();
        
        const phoneExists = contacts.some(contact => 
            contact.id !== this.currentEditingContact.id &&
            contact.phone.replace(/\D/g, '') === phone.replace(/\D/g, '')
        );
        
        if (phoneExists) {
            this.showError('Контакт с таким номером телефона уже существует');
            return;
        }

        const contactIndex = contacts.findIndex(contact => contact.id === this.currentEditingContact.id);
        if (contactIndex !== -1) {
            contacts[contactIndex] = {
                ...contacts[contactIndex],
                name: fullName,
                phone: phone.replace(/\D/g, ''),
                group: group
            };

            localStorage.setItem('contacts', JSON.stringify(contacts));

            this.showTempMessage('Контакт успешно обновлен');
            this.closeContactModal();
            this.updateGroupsGrid();

            if (this.contactsContainer.style.display === 'block') {
                this.displayContacts(this.currentGroupName);
            }
        }
    }

    private editContact(contactId: string): void {
        const contacts = this.getContactsFromStorage();
        const contact = contacts.find(c => c.id === contactId);
        
        if (contact) {
            this.openContactModal(contact);
        }
    }

    private deleteContact(contactId: string): void {
        const contacts = this.getContactsFromStorage();
        const contact = contacts.find(c => c.id === contactId);
        
        if (!contact) return;

        if (confirm(`Вы уверены, что хотите удалить контакт "${contact.name}"?`)) {
            const updatedContacts = contacts.filter(c => c.id !== contactId);
            localStorage.setItem('contacts', JSON.stringify(updatedContacts));

            this.showTempMessage('Контакт успешно удален');
            this.updateGroupsGrid();

            if (this.contactsContainer.style.display === 'block') {
                this.displayContacts(this.currentGroupName);
            }
        }
    }

    private showGroupContacts(groupName: string): void {
        this.groupsGrid.style.display = 'none';
        this.contactsContainer.style.display = 'block';
        this.emptyState.classList.remove('show');
        this.contactsTitle.textContent = `Контакты группы "${groupName}"`;
        this.currentGroupName = groupName;
        this.displayContacts(groupName);
    }

    private showGroupsGrid(): void {
        this.contactsContainer.style.display = 'none';
        this.groupsGrid.style.display = 'flex';
        this.currentGroupName = '';
        if (this.groupsList.children.length === 0) {
            this.emptyState.classList.add('show');
        }
    }

    private displayContacts(groupName: string): void {
        const contacts = this.getContactsFromStorage().filter(contact => contact.group === groupName);
        this.contactsList.innerHTML = '';
        
        if (contacts.length === 0) {
            this.contactsList.innerHTML = '<div class="empty-contacts"><p>В этой группе пока нет контактов</p></div>';
            return;
        }
        
        contacts.forEach(contact => {
            const contactItem = document.createElement('div');
            contactItem.className = 'contact-item';
            contactItem.setAttribute('data-contact-id', contact.id);
            contactItem.innerHTML = `
                <div class="contact-info">
                    <div class="contact-name">${this.escapeHtml(contact.name)}</div>
                    <div class="contact-phone">${this.formatPhoneNumber(contact.phone)}</div>
                </div>
                <div class="contact-actions">
                    <button class="contact-edit-btn" title="Редактировать контакт">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                    </button>
                    <button class="contact-delete-btn" title="Удалить контакт">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                    </button>
                </div>
            `;
            this.contactsList.appendChild(contactItem);
        });
    }

    private selectGroupByName(groupName: string): void {
        const groupItems = this.groupsList.querySelectorAll('.group-item');
        const groupItem = Array.from(groupItems).find(item => 
            item.querySelector('.group-name')?.textContent === groupName
        ) as HTMLElement;
        
        if (groupItem) this.selectGroup(groupItem);
    }

    private selectGroup(groupItem: HTMLElement): void {
        document.querySelectorAll('.group-item').forEach(item => item.classList.remove('active'));
        document.querySelectorAll('.group-card').forEach(card => card.classList.remove('active'));
        
        groupItem.classList.add('active');
        const groupName = groupItem.querySelector('.group-name')?.textContent || '';
        this.activateGroupCard(groupName);
        
        if (window.innerWidth < 769) this.close();
    }

    private activateGroupCard(groupName: string): void {
        const groupCards = this.groupsGrid.querySelectorAll('.group-card');
        groupCards.forEach(card => {
            const cardName = card.querySelector('.group-card__name')?.textContent;
            card.classList.toggle('active', cardName === groupName);
        });
    }

    private updateGroupsGrid(): void {
        const groups = Array.from(this.groupsList.querySelectorAll('.group-name'))
            .map(element => element.textContent)
            .filter(Boolean) as string[];
        
        this.groupsGrid.innerHTML = '';
        
        if (groups.length === 0) {
            this.emptyState.classList.add('show');
            this.groupsGrid.style.display = 'none';
            this.contactsContainer.style.display = 'none';
        } else {
            this.emptyState.classList.remove('show');
            this.groupsGrid.style.display = 'flex';
            
            groups.forEach((groupName, index) => {
                const contactsCount = this.getContactsCountByGroup(groupName);
                const groupCard = document.createElement('div');
                groupCard.className = 'group-card';
                
                if (index === 0) groupCard.classList.add('active');
                
                groupCard.innerHTML = `
                    <div class="group-card__content">
                        <div class="group-card__left">
                            <span class="group-card__icon">👥</span>
                            <div class="group-card__info">
                                <div class="group-card__name">${this.escapeHtml(groupName)}</div>
                                <div class="group-card__count">${contactsCount} контактов</div>
                            </div>
                        </div>
                        <div class="group-card__right">
                            <button class="group-card__arrow" title="Просмотреть контакты группы">→</button>
                        </div>
                    </div>
                `;
                
                this.groupsGrid.appendChild(groupCard);
            });
        }
    }

    private loadGroupsFromStorage(): void {
        const groups = this.getGroupsFromStorage();
        groups.forEach(group => {
            if (!this.isGroupExists(group)) this.addGroupToList(group);
        });
    }

    private getGroupsFromStorage(): string[] {
        const stored = localStorage.getItem('groups');
        return stored ? JSON.parse(stored) : [];
    }

    private saveGroupsToStorage(): void {
        const groups = Array.from(this.groupsList.querySelectorAll('.group-name'))
            .map(element => element.textContent)
            .filter(Boolean) as string[];
        localStorage.setItem('groups', JSON.stringify(groups));
    }

    private getContactsFromStorage(): any[] {
        const stored = localStorage.getItem('contacts');
        return stored ? JSON.parse(stored) : [];
    }

    private getContactsCountByGroup(groupName: string): number {
        const contacts = this.getContactsFromStorage();
        return contacts.filter(contact => contact.group === groupName).length;
    }

    private deleteContactsByGroup(groupName: string): void {
        const contacts = this.getContactsFromStorage();
        const updatedContacts = contacts.filter(contact => contact.group !== groupName);
        localStorage.setItem('contacts', JSON.stringify(updatedContacts));
    }

    private formatPhoneNumber(phone: string): string {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return `+7 (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 9)}-${cleaned.substring(9)}`;
        }
        return phone;
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private clearForm(): void {
        this.contactForm.reset();
        this.clearErrors();
    }

    private clearErrors(): void {
        [this.lastNameError, this.firstNameError, this.middleNameError, this.phoneError, this.groupError]
            .forEach(el => el.textContent = '');
        
        this.contactForm.querySelectorAll('input, select').forEach(input => {
            input.classList.remove('error');
        });
    }

    private showError(message: string): void {
        alert(message);
    }

    private showTempMessage(message: string): void {
        alert(message);
    }

    public open(): void {
        this.sidebarElement.classList.add('open');
        this.overlay.classList.add('active');
        this.mainContent.classList.add('sidebar-open');
        this.isOpen = true;
    }

    public close(): void {
        this.sidebarElement.classList.remove('open');
        this.overlay.classList.remove('active');
        this.mainContent.classList.remove('sidebar-open');
        this.isOpen = false;
    }

    public isSidebarOpen(): boolean {
        return this.isOpen;
    }

    public toggle(): void {
        this.isOpen ? this.close() : this.open();
    }
}