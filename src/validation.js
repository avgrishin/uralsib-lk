import moment from 'moment';

const first_uppercase_letters_spaces_dashes_RU = {
    getMessage() {
        return 'Поле может содержать русские буквы, пробелы и тире.';
    },
    validate(value) {
        const regex = /^([А-ЯЁ][а-яё -]*)+$/;
        return regex.test(value);
    }
};

const one_space_between_words = {
    getMessage() {
        return 'Поле может содержать один пробел между слов.';
    },
    validate(value) {
        const regex = /^\S+(\s\S+)*$/;
        return regex.test(value);
    }
};

const letters_spaces_numbers_dashes_dots_RU = {
    getMessage() {
        return 'Поле может содержать русские буквы, пробелы, цифры, точки и тире.';
    },
    validate(value) {
        const regex = /^[а-яё0-9 -\.\№]+$/i;
        return regex.test(value);
    }
};

const date_format = {
    getMessage() {
        return 'Формат даты не соответсвует ДД.ММ.ГГГГ';
    },
    validate(value) {
        const regex = /^([0-9]{2}\.){2}[0-9]{4}$/;
        const test = regex.test(value);

        if (!test) return false;

        let date = moment(value, 'DD.MM.YYYY');
        return date.get('year') > 1901;
    }
};

const place_of_issue = {
    getMessage() {
        return 'Поле имеет недопустимые символы.';
    },
    validate(value) {
        const regex = /^[0-9а-яё "'\(\)\.№-]+$/i;
        return regex.test(value);
    }
};

const passport_format = {
    getMessage() {
        return 'Поле должно соответсововать формату XXXX XXXXXX';
    },
    validate(value) {
        const regex = /^[0-9]{4}\s[0-9]{6}$/;
        return regex.test(value);
    }
};

const passport_issuer = {
    getMessage() {
        return 'Поле должно соответсововать формату XXX-XXX';
    },
    validate(value) {
        value = value.replace(/-|\s/g, '');

        return /[0-9]{6}/.test(value);
    }
};

const latin_cyrilic_numbers_dashes_spaces = {
    getMessage(field) {
        return `${field}.`;
    },
    validate(value) {
        const regex = /^[0-9a-zа-яё -]+$/i;
        return regex.test(value);
    }
};

const international_passport_format = {
    getMessage(field) {
        return `${field}`;
    },
    validate(value) {
        const regex = /^[0-9]{2} [0-9]{7}$/;
        return regex.test(value);
    }
};

const military_id = {
    getMessage(field) {
        return `${field}`;
    },
    validate(value) {
        const regex = /^[А-ЯЁа-яё]{2} [0-9]{7}$/;
        return regex.test(value);
    }
}

const snils = {
    getMessage() {
        return 'Неверный номер СНИЛС.';
    },
    validate(value) {
        value = value.replace(/-|\s/g, '');
        const regex = /^[0-9]{11}$/;
        const test = regex.test(value);

        if (!test) return false;

        let control = value.match(/[0-9]{2}$/)[0];
        let sum = value.match(/^[0-9]{9}/)[0]
            .split('')
            .reverse()
            .map((value, index) => value * (index + 1))
            .reduce((a, b) => a + b, 0);

        if (sum < 100) return sum == control;
        else if (sum == 100 || sum == 101) return control == '00';

        let remainder = sum % 101;

        if (remainder < 100) return remainder == control;
        else if (remainder == 100 || remainder == 101) return control == '00';
    }
}

const mobile_phone = {
    getMessage() {
        return 'Неверный формат номера телефона';
    },
    validate(value) {
        let phone = value.replace(/ |\(|\)|\+/g, '');
        const regex = /9[0-9]{9}$/;
        return regex.test(phone);
    }
};

const home_phone = {
    getMessage(field) {
        return `${field}`;
    },
    validate(value) {
        const regex = /^[0-9]{3} [0-9]{7}$/;
        return regex.test(value);
    }
};

const valid_date = {
    getMessage(field) {
        return `${field}`;
    },
    validate(value, args = []) {
        const regex = /^([0-9]{2}\.){2}[0-9]{4}$/;
        const test = regex.test(value);

        if(!test) return false;

        let date = moment(value, 'DD.MM.YYYY');

        if (args[0] == undefined) return date.isBefore(moment());

        return date.isSameOrBefore(moment());
    }
};

const passport_date_valid = {
    getMessage(field) {
        return `${field}`;
    },
    validate(value, args) {
        const regex = /^([0-9]{2}\.){2}[0-9]{4}$/;
        const test = regex.test(value);

        if (!test) return false;

        let date = moment(value, 'DD.MM.YYYY');
        let dob = moment(args[0], 'DD.MM.YYYY');

        let age = moment().diff(dob, 'years');

        if (age >= 14 && age <= 20) {
            let expiry = date.add(6, 'years');
            return moment().isSameOrBefore(expiry);
        } else if (age > 20 && age <= 45) {
            let expiry = date.add(25, 'years');
            return moment().isSameOrBefore(expiry);
        } else return true;
    }
};

const all_same_characters = {
    getMessage(field) {
        return 'Поле не может иметь все одинаковые значения.';
    },
    validate(value, args = []) {
        let chars;
        let str = value.replace(/ |-|_|\+/g, '');

        if (args[1] != undefined) str = str.substr(parseInt(args[1]));

        if (args.length == 0 || args[0] == 0) chars = str.length;
        else chars = parseInt(args[0]);

        const regex = new RegExp(`^(.)\\1{${chars - 1}}`);
        return !regex.test(str);
    }
};

const age = {
    getMessage(field) {
        return 'Минимум 18 лет';
    },
    validate(value) {
        let date = moment(value, 'DD.MM.YYYY');

        if (!date.isValid()) return;

        return (moment().diff(date, 'years') >= 18);
    }
}

const rs = {
    getMessage(field, args) {
        let regex = /^[0-9]{9}$/;

        if (!args.length) return 'Не введен БИК';
        if (args[0].length != 9 || !regex.test(args[0])) return 'Неверный БИК';

        return 'Контрольное число не верное';
    },
    validate(value, args) {
        value = value.replace(/\D/g, '');

        let regex = /^[0-9]{9}$/;
        if (!args.length || args[0].length != 9 || !regex.test(args[0])) return false;

        let sum = 0;
        let bik = args[0];

        let coefficients = [7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1];
        let bik_rs = bik.slice(-3) + value;

        coefficients.forEach((item, index) => sum += item * (bik_rs[index] % 10));

        if (sum % 10 == 0) return true;

        return false;
    }
};

const address_index = {
    getMessage(field) {
        return 'Индекс должен состоять из 6 цифр';
    },
    validate(value) {
        value = value.replace(/\D/g, '');

        return /^[0-9]{6}$/.test(value);
    }
}

const account_number = {
    getMessage(field) {
        return 'Счет должен состоять из 20 цифр';
    },
    validate(value) {
        value = value.replace(/\D/g, '');

        return /^[0-9]{20}$/.test(value);
    }
}

const pif_amount = {
    getMessage(field, params, data) {
        return data || 'Ошибка';
    },
    validate(value, args) {
        let error = true;
        let message = '';

        const amount = args[0];
        const fraction = (amount % 1).toFixed(6);
        const integer = Math.floor(amount);

        const input = parseFloat(value);
        const input_fraction = (input % 1).toFixed(6);
        const input_integer = Math.floor(input);

        /*if ((integer === input_integer) && (fraction !== input_fraction)) {
            error = false;
            message = 'Дробная часть остатка должна быть указана';
        } else*/ if ((input_fraction != 0) && (fraction !== input_fraction)) {
            error = false;
            message = 'Дробная часть остатка не равна введенной';
        } else if (integer != 0 && input_integer == 0) {
            error = false;
            message = 'Целая часть остатка должна быть указана';
        } else if (integer < input_integer) {
            error = false;
            message = 'Указанная сумма больше остатка';
        }

        return {
            valid: error,
            data: message
        };
    }
};

const min_thousand = {
    getMessage() {
        return 'Ошибка';
    },
    validate(value, args) {
        let min = 1000;
        if (args.length) min = args[0];

        if (typeof min == 'string') min = min.toNumber();
        if (typeof value == 'string') value = value.toNumber();
        return value >= min;
    }
};

const max_thousand = {
    getMessage() {
        return 'Ошибка';
    },
    validate(value, args) {
        let max = 10000;
        if (args.length) max = args[0];

        if (typeof max == 'string') max = max.toNumber();
        if (typeof value == 'string') value = value.toNumber();
        return value <= max;
    }
};

const strong_password = {
    getMessage(field, params, data) {
        return data || 'Пароль не достаточно сильный';
    },
    validate(value) {
        const letters_regex = /(?=.*[a-zа-я])/i;
        const numbers_regex = /(?=.*[0-9])/;
        const special_regex = /(?=.*[!@#\$%\^&\*_\(\)\-\=\+\\\|\[\]"';:/\?{}\.,`~№])/;
        const carets_regex = /(?=.*[<>])/;
        const length = 8;

        let message = '';
        let valid = true;

        if (!letters_regex.test(value)) {
            message = 'Пароль должен содержать буквы';
            valid = false;
        } else if (!numbers_regex.test(value)) {
            message = 'Пароль должен содержать цифры';
            valid = false;
        } else if (carets_regex.test(value)) {
            message = 'Пароль не должен содержать < или >';
            valid = false;
        } else if (!special_regex.test(value)) {
            message = 'Пароль должен содержать как минимум один специальный символ';
            valid = false;
        } else if (value.length < length) {
            message = 'Пароль должен быть минимум 8 символов';
            valid = false;
        }

        return {
            valid: valid,
            data: message
        };
    }
};
const inn = {
    getMessage() {
        return 'Укажите правильный ИНН';
    },
    validate(inputNumber) {
        inputNumber = inputNumber.replace(/\D/g, '');
        //преобразуем в строку
        inputNumber = "" + inputNumber;
        //преобразуем в массив
        inputNumber = inputNumber.split('');
        //для ИНН в 10 знаков
        if ((inputNumber.length == 10) && (inputNumber[9] == ((2 * inputNumber[0] + 4 * inputNumber[1] + 10 * inputNumber[2] + 3 * inputNumber[3] + 5 * inputNumber[4] + 9 * inputNumber[5] + 4 * inputNumber[6] + 6 * inputNumber[7] + 8 * inputNumber[8]) % 11) % 10)) {
            return true;
            //для ИНН в 12 знаков
        } else if ((inputNumber.length == 12) && ((inputNumber[10] == ((7 * inputNumber[0] + 2 * inputNumber[1] + 4 * inputNumber[2] + 10 * inputNumber[3] + 3 * inputNumber[4] + 5 * inputNumber[5] + 9 * inputNumber[6] + 4 * inputNumber[7] + 6 * inputNumber[8] + 8 * inputNumber[9]) % 11) % 10) && (inputNumber[11] == ((3 * inputNumber[0] + 7 * inputNumber[1] + 2 * inputNumber[2] + 4 * inputNumber[3] + 10 * inputNumber[4] + 3 * inputNumber[5] + 5 * inputNumber[6] + 9 * inputNumber[7] + 4 * inputNumber[8] + 6 * inputNumber[9] + 8 * inputNumber[10]) % 11) % 10))) {
            return true;
        } else {
            return false;
        }
    }
}
const card_number = {
    getMessage() {
        return 'Номер карты должен состоять из 12 чисел';
    },
    validate(value) {
        value = value.replace(/\D/g, '');

        return /[0-9]{12}/.test(value);
    }
};

const sms = {
    getMessage() {
        return 'Неверный код из смс';
    },
    validate(value) {
        const regex = /[0-9]{5}/;

        return regex.test(value);
    }
};

const amountMinMax = {
    getMessage() {
        return 'Неверный код из смс';
    },
    validate(value, args) {
        value = value.replace(/\D/g, '');
        args = [...args].map(Number);
        return value >= args[0] && value <= args[1];
    }
};


export default {
    address_index,
    first_uppercase_letters_spaces_dashes_RU,
    one_space_between_words,
    letters_spaces_numbers_dashes_dots_RU,
    date_format,
    passport_format,
    latin_cyrilic_numbers_dashes_spaces,
    international_passport_format,
    military_id,
    snils,
    mobile_phone,
    home_phone,
    valid_date,
    passport_date_valid,
    all_same_characters,
    age,
    place_of_issue,
    rs,
    account_number,
    pif_amount,
    passport_issuer,
    min_thousand,
    max_thousand,
    strong_password,
    card_number,
    inn,
    sms,
    amountMinMax
};
