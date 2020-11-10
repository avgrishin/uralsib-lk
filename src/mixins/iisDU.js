import store from "../store";
import { DU_DISABLED_BUY, DU_CODE_DISABLED_BUY } from '../constatnts';

export default {
    watch: {
        '$route' (to) {
            this.rStrategyType = to.params.selectedStrategy;
            this.rsStrategyID = to.params.strategyPrefix
        },
    },

    data() {
        return {
            rStrategyType: this.$route.params.selectedStrategy,
            rsStrategyID: this.$route.params.strategyPrefix,
        }
    },
    computed: {
        buttonDisabledIIS() {
            let list = this.$store.state.iisDU.list;
            let selectedIISinCase;
            let iisInCase;
            if (list.length == 0 || typeof list != 'object') return false;
            list = list.filter(l => l.sType == this.rStrategyType.toUpperCase());
            iisInCase = list.find(l => l.contract.length > 0);
            if (!iisInCase) return {
                val: false,
                text: 'Купить'
            };

            selectedIISinCase = list.find(str => {
                const id = this.fund && this.fund.webSiteID || this.rsStrategyID;
                return id == str.webSiteID;
            });
            if (selectedIISinCase) {
                selectedIISinCase = selectedIISinCase.contract.length == 0
            }

            return {
                val: selectedIISinCase,
                text: selectedIISinCase ? 'Купить' : 'Пополнить'
            }
        },

        duDisabledBuy() {
            return this.fund && Boolean(DU_DISABLED_BUY.find(duId => duId === this.fund.id)) && (this.buttonDisabledIIS.val || this.rStrategyType.toUpperCase() !== 'IIS');
        },
    },

    methods: {
        checkContractSubmited(id) {
            let contracts = this.storeSrategyById(id).contract;
            if (!contracts && contracts.length == 0) return false;
            contracts = contracts.filter(contract => contract.canBuyFromLKK == 1);
            return contracts.length > 0;
        },

        showStrategyOldPopup() {
            window.events.$emit('show_popup', ['contact', {type: 'oldStrategy'}]);
        },

        /**
         * Открывает попап связи с менеджером для покупки "специальных" ДУ, на 28.12.19 это валютные рантье
         */
        showDuSpecialPopup(webSiteID) {
            window.events.$emit('show_popup', ['contact', {
                type: 'duSpecial',
                duName: this.fund.strategyName,
            }]);
        },

        storeSrategyById(id = this.rsStrategyID) {
            if (this.$store.state.iisDU.list.length != 0) {
                return [...this.$store.state.iisDU.list].find(item => {
                    return item ? item.webSiteID == id : ''
                });
            } else {
                return {};
            }
        },

        strategyOperation(id, contractPage) {
            if (this.$store.state.user.state.authState == 1) {
                window.events.$emit('show_popup', 'confirm-personal-data');
                return;
            }

            if (this.duDisabledBuy) {
                this.showDuSpecialPopup(id);
                return;
            }

            if (this.buttonDisabledIIS.val && this.rStrategyType == 'iis') {
                window.events.$emit('show_popup', ['message', {
                    msgSubject: 'У Вас уже приобретен ИИС!',
                    msgBtn: true
                }]);
                return;
            }
            axios.get(`/invest/getbyidparams?id=${id}`).then(({data}) => {
                if (!data) return;
                if (contractPage) {
                    data.firstContract = true;
                } else {
                    data.firstContract = false;
                }
                this.$store.commit('funds/updateOperation', {
                    path: 'fund.params',
                    data: data
                });

                //@ Если нет договоров по выбранной стратегии - переходим на страницу оформления договора
                if (!this.checkContractSubmited(id)) {
                    if (this.rStrategyType === 'iis' && this.storeSrategyById(id)) {

                        if (this.storeSrategyById(id).contract.find(contract => contract.canBuyFromLKK == 0)) {
                            this.showStrategyOldPopup();
                            return;
                        }
                    }
                    this.$router.push({name: 'iisDuStrategyСontract', params: { strategyPrefix: id }})
                } else {
                    this.$router.push({name: 'iisDuStrategyBuy', params: { strategyPrefix: id }})
                }
            });
        }
    }
}
