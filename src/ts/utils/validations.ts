export class Validator {
    static validateName(name: string): string | null {
        if (!name.trim()) {
            return 'Поле обязательно для заполнения';
        }
        
        if (name.length < 2) {
            return 'Имя должно содержать минимум 2 символа';
        }
        
        if (!/^[а-яА-ЯёЁa-zA-Z\- ]+$/.test(name)) {
            return 'Имя может содержать только буквы, дефисы и пробелы';
        }
        
        return null;
    }

    static validatePhone(phone: string): string | null {
        if (!phone.trim()) {
            return 'Поле обязательно для заполнения';
        }
        
        const cleaned = phone.replace(/\D/g, '');
        
        if (cleaned.length !== 11) {
            return 'Номер телефона должен содержать 11 цифр';
        }
        
        if (!cleaned.startsWith('7') && !cleaned.startsWith('8')) {
            return 'Номер должен начинаться с 7 или 8';
        }
        
        return null;
    }

    static validateGroup(group: string): string | null {
        if (!group.trim()) {
            return 'Выберите группу';
        }
        
        return null;
    }
}