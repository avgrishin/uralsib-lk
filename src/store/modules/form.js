export default {
    namespaced: true,
    state: {
        completed: {
            personalData: {
                lastName: [false, 'имя'],
                firstName: [false, 'фамилия'],
                phone: [false, 'телефон'],
                email: [false, 'email'],
                birthPlace: [false, 'место рождения'],
                birthDate: [false, 'дата рождения'],
                gender: [false, 'пол'],
                snils: [false, 'СНИЛС'],
                inn: [false, 'ИНН'],
            },
            passport: {
                series: [false, 'серия'],
                number: [false, 'номер'],
                issued: [false, 'дата выдачи'],
                issuer: [false, 'место выдачи'],
                issuerCode: [false, 'код подразделения'],
                scanPage1Id: [false, 'скан первой страницы паспорта'],
                scanPage2Id: [false, 'скан страницы с регистрацией'],
                registrarValidationState: [null, 'статус регистрации'],
            },
            addresses: {
                zipCode: [false, 'индекс'],
                state: [false, 'область'],
                street: [false, 'улица'],
                city: [false, 'город'],
                area: [false, 'населенный пункт'],
                building:[false,'дом,Корп./Стр,Кв'],
            },
            bankingDetail: {
                bic: [false, 'БИК'],
                bankName: [false, 'наименование банка'],
                accCorr: [false, 'корреспондентский счёт'],
                accCheck: [false, 'расчётный счёт'],
            }
        }
    },
    mutations: {
        updateCompleted(state, fields) {
            state.completed = fields;
        },
        clearCompleted(state) {
            state.completed = {
                personalData: {
                    lastName: [false, 'имя'],
                    firstName: [false, 'фамилия'],
                    phone: [false, 'телефон'],
                    email: [false, 'email'],
                    birthPlace: [false, 'место рождения'],
                    birthDate: [false, 'дата рождения'],
                    gender: [false, 'пол'],
                 /*   snils: [false, 'СНИЛС'],
                    inn: [false, 'ИНН'],*/
                },
                passport: {
                    series: [false, 'серия'],
                    number: [false, 'номер'],
                    issued: [false, 'дата выдачи'],
                    issuer: [false, 'место выдачи'],
                    issuerCode: [false, 'код подразделения'],
                    scanPage1Id: [false, 'скан первой страницы паспорта'],
                    scanPage2Id: [false, 'скан страницы с регистрацией'],
                    registrarValidationState: [null, 'статус регистрации'],
                },
                addresses: {
                    zipCode: [false, 'индекс'],
                    state: [false, 'область'],
                    street: [false, 'улица'],
                    city: [false, 'город'],
                    area: [false, 'населенный пункт'],
                    building:[false,'дом,Корп./Стр,Кв'],
                },
                bankingDetail: {
                    bic: [false, 'БИК'],
                    bankName: [false, 'наименование банка'],
                    accCorr: [false, 'корреспондентский счёт'],
                    accCheck: [false, 'расчётный счёт'],
                }
            }
        }
    },
    actions: {
        checkCompletness({ commit, dispatch }) {
            // all required fields, keys are equal to ones from API
            let fields = {
                personalData: {
                    lastName: [false, 'имя'],
                    firstName: [false, 'фамилия'],
                    phone: [false, 'телефон'],
                    email: [false, 'email'],
                    birthPlace: [false, 'место рождения'],
                    birthDate: [false, 'дата рождения'],
                    gender: [false, 'пол'],
             /*       snils: [false, 'СНИЛС'],
                    inn: [false, 'ИНН'],*/
                },
                passport: {
                    series: [false, 'серия'],
                    number: [false, 'номер'],
                    issued: [false, 'дата выдачи'],
                    issuer: [false, 'место выдачи'],
                    issuerCode: [false, 'код подразделения'],
                    scanPage1Id: [false, 'скан первой страницы паспорта'],
                    scanPage2Id: [false, 'скан страницы с регистрацией'],
                    registrarValidationState: [null, 'статус регистрации'],
                },
                addresses: {
                    zipCode: [false, 'индекс'],
                    state: [false, 'область'],
                    street: [false, 'улица'],
                    city: [false, 'город'],
                    area: [false, 'населенный пункт'],
                    building:[false,'дом,Корп./Стр,Кв'],
                },
                bankingDetail: {
                    bic: [false, 'БИК'],
                    bankName: [false, 'наименование банка'],
                    accCorr: [false, 'корреспондентский счёт'],
                    accCheck: [false, 'расчётный счёт'],
                }
            };

            axios.get('/ClientProfile/draft').then(({ data }) => {
                // data.passport.registrarValidationState = 3;
                setTimeout(() => {
                    // Loop through all sections (Personal data, passport, etc.)
                    for (let section in fields) {
                        // Loop through fields in section
                        for (let input in fields[section]) {
                            // Check if section exists in API result


                            if (!data[section]) continue;
                            
                            if (section == 'addresses') {

                                if (data[section].registrationAddress[input]) {


                                    if (input=='state') { //Если пользователь хоть одно заполнил, считать за одно заполненное поле
                                        if(data[section].registrationAddress[input] == 'Москва г' ||
                                            data[section].registrationAddress[input] == 'Санкт-Петербург г' ||
                                            data[section].registrationAddress[input] == 'Севастополь г') {

                                            fields[section]['city'][0] = true;
                                            fields[section]['area'][0] = true;
                                        }

                                        fields[section][input][0] = true;
                                    }

                                    if (input=='city' || input=='area') { //Если пользователь хоть одно заполнил, считать за одно заполненное поле

                                        fields[section]['city'][0] = true;
                                        fields[section]['area'][0] = true;
                                    }
                                    if (input=='building' || input=='block' || input=='appartment') { //Если пользователь хоть одно заполнил, считать за одно заполненное поле
                                        fields[section]['building'][0] = true;
                                    }
                                    else fields[section][input][0] = true;

                                }
                            } else {
                                if (data[section] && data[section][input]) fields[section][input][0] = true;
                            }

                            if(input == 'registrarValidationState') {
                                fields[section][input][0] = data[section][input]
                            }

                        }
                    }
                commit('updateCompleted', fields);
                }, 100);
            }).catch((data) => commit('updateCompleted', fields));
        }
    },
    getters: {
        completedFiltered(state) {
            let completed = Object.assign([], state.completed);
            let hasNRK = state.completed.passport.registrarValidationState[0];
            completed.passport = _.pickBy(completed.passport, (value, key) => {
                return key.search(/registrarValidationState/g) == -1;
            });
            if (hasNRK == 3) {
                completed.passport = _.pickBy(completed.passport, (value, key) => {
                    return key.search(/scanPage1Id|scanPage2Id/g) == -1;
                });
            }
            return completed;
        },
        mainPercentage(state, getters) {
            let data = { percentage: 0, fields: [] };
            let completed = getters.completedFiltered;
            let values = Object.values(completed);
            if (!Object.keys(completed).length) return data;
            let fields = [].concat.apply([], values.map(item => Object.values(item)));

            if (!fields.filter(item => item[0]).length) return data;

            for (let i = 0; i < fields.length; i++) {
                if(fields[i][1] === 'статус регистрации') {
                    i = i
                    fields.splice(i, 1);
                }
            }
            let percentage = fields.filter(item => item[0]).length*100/fields.length;
            return {
                percentage: percentage,
                fields: fields.filter(item => !item[0])
            };
        },
        stepPercentage(state, getters) {
            let data = {
                personalData: 0,
                passport: 0,
                addresses: 0,
                bankingDetail: 0
            }
            let completed = getters.completedFiltered;
            if (!Object.values(completed).length) return data;

            for (let section in completed) {
                let values = Object.values(completed[section]);
                data[section] = ((values.filter((item) => {
                    return item[0]
                }).length) * 100 / (values.length));
            }
            return data;
        }
    }
}