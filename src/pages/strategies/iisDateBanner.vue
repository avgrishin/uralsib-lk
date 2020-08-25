<template>
	<section class="iis-date-banner">
        <h3>Уважаемые клиенты,</h3>
        <p>обращаем внимание, что в последние дни декабря при оплате <strong>картой стороннего банка</strong> существует риск поступления денежных средств на Ваш индивидуальный инвестиционный счет с задержкой от 1-го до 3-х рабочих дней.</p>
        <p>Во избежание проблемы с зачислением активов и получением налогового вычета на взнос в следующем году просим Вас <strong>осуществить перевод денежных средств до 30 декабря 2019г включительно и не использовать при оплате карты сторонних банков</strong></p>
    </section>
</template>

<script>
import moment from 'moment';

export default {
	name: 'IisDateBanner',

    computed: {
	    showBanner() {
	        return moment().month() === 11 && moment().date() >= 25;
        },
    }
};
</script>

<style lang="scss">
    .iis-date-banner h3 {
        margin-bottom: 14px;
    }
</style>
