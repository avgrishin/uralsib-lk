export default {
    methods: {
        abbreviate(number, maxPlaces, forcePlaces, forceLetter) {
            number = Number(number);
            forceLetter = forceLetter || false;

            if (forceLetter !== false) {
                return this.annotate(number, maxPlaces, forcePlaces, forceLetter)
            }

            let abbr;
            if (number >= 1e12) abbr = 'трлн';
            else if (number >= 1e9) abbr = 'млрд';
            else if (number >= 1e6) abbr = 'млн';
            else if (number >= 1e3) abbr = 'тыс';
            else abbr = '';

            return this.annotate(number, maxPlaces, forcePlaces, abbr)
        },
        abbrNum(number, decPlaces) {
            decPlaces = Math.pow(10, decPlaces);

            var abbrev = [" тыс", " млн", " млрд", " трлн"];

            for (var i = abbrev.length - 1; i >= 0; i--) {

                var size = Math.pow(10, (i + 1) * 3);

                if (size <= number) {

                    number = Math.round(number * decPlaces / size) / decPlaces;

                    if ((number == 1000) && (i < abbrev.length - 1)) {
                        number = 1;
                        i++;
                    }

                    number += abbrev[i];

                    break;
                }
            }

            return number;
        },
        numberWithSpaces(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        },
        annotate(number, maxPlaces, forcePlaces, abbr) {
            let rounded = 0;

            switch (abbr) {
                case 'трлн':
                    rounded = number / 1e12
                    break
                case 'млрд':
                    rounded = number / 1e9
                    break
                case 'млн':
                    rounded = number / 1e6
                    break
                case 'тыс':
                    rounded = number / 1e3
                    break
                case '':
                    rounded = number
                    break
            }

            if (maxPlaces !== false) {
                let test = new RegExp('\\.\\d{' + (maxPlaces + 1) + ',}$');
                if (test.test(('' + rounded))) rounded = rounded.toFixed(maxPlaces);
            }

            if (forcePlaces !== false) {
                rounded = Number(rounded).toFixed(forcePlaces);
            }

            return rounded + ' ' + abbr;
        }
    }
};