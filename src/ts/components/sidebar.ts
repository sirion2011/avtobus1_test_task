export class Sidebar {
    private sidebarElement: HTMLElement;
    private toggleButton: HTMLElement;
    private closeButton: HTMLElement;
    private groupsList: HTMLElement;
    private isOpen: boolean = false;

    // Элементы для управления группами
    private addGroupBtn: HTMLElement;
    private saveGroupBtn: HTMLElement;
    private addGroupForm: HTMLElement;
    private groupNameInput: HTMLInputElement;
    private confirmAddBtn: HTMLElement;
    private cancelAddBtn: HTMLElement;

    constructor() {
        this.sidebarElement = document.getElementById('sidebar')!;
        this.toggleButton = document.getElementById('sidebar-toggle')!;
        this.closeButton = document.getElementById('sidebar-close')!;
        this.groupsList = document.getElementById('groups-list')!;
        
        // Инициализация новых элементов
        this.addGroupBtn = document.getElementById('add-group-btn')!;
        this.saveGroupBtn = document.getElementById('save-group-btn')!;
        this.addGroupForm = document.getElementById('add-group-form')!;
        this.groupNameInput = document.getElementById('group-name-input') as HTMLInputElement;
        this.confirmAddBtn = document.getElementById('confirm-add-group')!;
        this.cancelAddBtn = document.getElementById('cancel-add-group')!;
        
        this.init();
    }

    private init(): void {
        this.setupSidebarHandlers();
        this.setupGroupHandlers();
        this.setupGroupManagementHandlers();
        this.checkViewport();
    }

    private setupSidebarHandlers(): void {
        // Открытие по кнопке в хедере
        this.toggleButton.addEventListener('click', () => {
            this.open();
        });

        // Закрытие по крестику в сайдбаре
        this.closeButton.addEventListener('click', () => {
            this.close();
        });

        // ESC только для отмены формы
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.addGroupForm.style.display !== 'none') {
                this.cancelAddGroup();
            }
        });

        // Адаптация к изменению размера окна
        window.addEventListener('resize', () => {
            this.checkViewport();
        });
    }

    private checkViewport(): void {
        if (window.innerWidth >= 769) {
            this.open(); // Всегда открыт на десктопе
            this.isOpen = true;
        } else {
            this.close(); // Закрыт на мобильных по умолчанию
            this.isOpen = false;
        }
    }

    private setupGroupHandlers(): void {
        this.groupsList.addEventListener('click', (e) => {
            const target = e.target as HTMLElement;
            const groupItem = target.closest('.group-item') as HTMLElement;
            const deleteBtn = target.closest('.group-delete-btn') as HTMLElement;
            
            if (deleteBtn) {
                e.stopPropagation();
                const groupItem = deleteBtn.closest('.group-item') as HTMLElement;
                const groupName = groupItem.querySelector('.group-name')?.textContent || '';
                this.deleteGroup(groupItem, groupName);
                return;
            }
            
            if (groupItem) {
                this.selectGroup(groupItem);
                
                // На мобильных закрываем сайдбар после выбора группы
                if (window.innerWidth < 769) {
                    this.close();
                }
            }
        });
    }

    private selectGroup(groupItem: HTMLElement): void {
        // Убираем активный класс у всех групп
        document.querySelectorAll('.group-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Добавляем активный класс выбранной группе
        groupItem.classList.add('active');
        
        const groupName = groupItem.querySelector('.group-name')?.textContent;
        console.log('Selected group:', groupName);
        
        this.onGroupSelect(groupName || '');
    }

    private setupGroupManagementHandlers(): void {
        // Кнопка "Добавить" - показываем поле ввода
        this.addGroupBtn.addEventListener('click', () => {
            this.showAddGroupForm();
        });

        // Подтверждение добавления группы
        this.confirmAddBtn.addEventListener('click', () => {
            this.confirmAddGroup();
        });

        // Отмена добавления группы
        this.cancelAddBtn.addEventListener('click', () => {
            this.cancelAddGroup();
        });

        // Enter в поле ввода
        this.groupNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.confirmAddGroup();
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
        
        // Первая группа становится активной
        if (this.groupsList.children.length === 0) {
            groupItem.classList.add('active');
        }
        
        groupItem.innerHTML = `
            <span class="group-name">${this.escapeHtml(groupName)}</span>
            <button class="group-delete-btn" title="Удалить группу">×</button>
        `;

        // Добавляем обработчик удаления
        const deleteBtn = groupItem.querySelector('.group-delete-btn') as HTMLElement;
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteGroup(groupItem, groupName);
        });

        this.groupsList.appendChild(groupItem);
    }

    private deleteGroup(groupItem: HTMLElement, groupName: string): void {
        if (confirm(`Вы уверены, что хотите удалить группу "${groupName}"? Это приведет к удалению всех контактов в этой группе.`)) {
            const wasActive = groupItem.classList.contains('active');
            groupItem.remove();
            this.showTempMessage(`Группа "${groupName}" удалена`);
            
            // Если удалили активную группу и есть другие группы, выбираем первую
            if (wasActive && this.groupsList.children.length > 0) {
                const firstGroup = this.groupsList.querySelector('.group-item:first-child') as HTMLElement;
                if (firstGroup) {
                    this.selectGroup(firstGroup);
                }
            }
        }
    }

    private escapeHtml(text: string): string {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    private onGroupSelect(groupName: string): void {
        console.log('Loading contacts for group:', groupName);
        // Здесь будет логика загрузки контактов
    }

    private showError(message: string): void {
        alert(message);
    }

    private showTempMessage(message: string): void {
        console.log(message);
        // Временно - позже заменим на toaster
    }

    public open(): void {
        this.sidebarElement.classList.add('open');
        this.isOpen = true;
    }

    public close(): void {
        this.sidebarElement.classList.remove('open');
        this.isOpen = false;
    }

    public isSidebarOpen(): boolean {
        return this.isOpen;
    }

    public toggle(): void {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }
}