let isPrivate = false;

export function initDataLayerHelpers() {
    const urlParams = new URLSearchParams(window.location.search.replace('/#/', '/'));
    const category = localStorage.getItem('category') || 'LK';

    var interactPushed = false;
    var validatedFields = [];

    /**
     * Отправляет событие в dataLayer
     * @param params
     */
    function fireEvent(params) {
        const pathname = '/' + window.location.hash.split('?')[0];

        var event = {
            'event': 'autoEvent',
            'eventCategory': category,
            'eventAction': params.action,
            'eventLabel': params.label,
            'page': pathname
        };

        if (isPrivate) {
            return;
        }


        if (window.location.host.indexOf('am-uralsib.ru') === -1) {
            return;
        }

        dataLayer.push(event);
    }

    /**
     *
     * @param event
     */
    function mainEventHandler(event) {
        var action = $(this).data('action');
        var label = $(this).data('label');

        var eventData = {
            category: category,
            action: action,
            label: label,
        };

        // Событие interact отправляем 1 раз за время жизни страницы
        if (action === 'interact' && interactPushed) {
            return;
        }

        if (action === 'interact') {
            interactPushed = true;
        }

        // Событие успешной валидации отправляем 1 раз для поля
        if (action === 'validateField' && validatedFields.some(function (fieldName){
            return fieldName === label;
        })) {
            return;
        }

        if (action === 'validateField') {
            validatedFields.push(label);
        }

        fireEvent(eventData);
    }

    /**
     *
     * @param event
     */
    function validateChangeHandler(event) {
        var inputIsValid = !$(this).hasClass('invalid');

        if (!$(this).val().length) {
            return;
        }

        if (inputIsValid) {
            mainEventHandler.apply(this, event);
        }
    }

    function clickHandler(event) {
        var link = $(this).attr('href');
        var target = $(this).attr('target');

        if ($(this).hasClass('btn-disabled')) {
            return;
        }

        mainEventHandler.apply(this, event);

        if (link && link[0] !== '#' && target !== '_blank') {
            event.preventDefault();

            $(this).css({ opacity: 0.75 });

            setTimeout(function() {
                window.location = link;
            }, 500);
        }
    }

    function initHandlers() {
        $(document).on('click', '.js-click-datalayer', clickHandler);
        $(document).on('change', '.js-change-datalayer', mainEventHandler);
        $(document).on('input', '.js-input-datalayer', mainEventHandler);
        $(document).on('mouseenter', '.js-mouseenter-datalayer', mainEventHandler);
        $(document).on('change', '.js-validate-datalayer', validateChangeHandler);
    }

    initHandlers();

    window.dataLayerHelper = {
        fireEvent: fireEvent
    };
}

/**
 * Маленькая обертка
 * чтобы не плодить проверки
 * @param data
 */
export function checkAndFireEvent(data) {
	if (window.dataLayerHelper && data) {
		window.dataLayerHelper.fireEvent(data);
	}
}

export function togglePrivateGTMMode(flag = true) {
    isPrivate = flag;

    if (window.location.host.indexOf('am-uralsib.ru') === -1) {
        return;
    }

    dataLayer.push({
        isPrivate: flag ? 'YES' : 'NO',
    });
}

export function buildAppsDictionary(applications) {
    const result = {};

    if (!applications) {
        return result;
    }

    applications.forEach((item) => {
        result[item.app_id] = item.app_number;
    });

    return result;
}
