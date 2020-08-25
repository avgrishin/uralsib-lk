import Inputmask from 'inputmask';

Inputmask.extendAliases({
    phoneru: {
        alias: "abstractphone",
        countrycode: "7",
        phoneCodes: [
            {
                mask: "+7 (###) ### ## ##",
                cc: "RU",
                cd: "Russia",
                type: "mobile"
            }
        ]
    }
});