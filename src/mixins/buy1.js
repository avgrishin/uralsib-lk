export default {
    pdfActions(action) {
        if (this.$store.state.funds.operations.fund.application) {
            if (this.$store.state.funds.operations.fund.application.canPrint) this.getApplicationID(action);
            else this.getInvoice(action);
        } else {
            this.getInvoice(action);
        }
    },
    getInvoice(action) {
        if (action == 'send') {
            axios.get('/buyapps/mailaddrequest', {
                params: {
                    appNumber: this.$store.state.funds.operations.fund.number
                }
            }).then(() => flash(['Квитанция отправлена на почту']));

            return;
        }

        axios.get('/buyapps/addrequest', {
            params: {
                appNumber: this.$store.state.funds.operations.fund.number,
            },
            responseType: 'arraybuffer'
        }).then(({ data, headers }) => {
            const file = this.arrayBufferToBlob(data, headers);

            if (action == 'download' || (action == 'print' && this.isMobile)) {
                if (file) FileSaver.saveAs(file, 'invoice.pdf');
                else flash(['Бразуер не поддерживает blob'], 'error');
                window.log(action)
                return;
            }

            const url = URL.createObjectURL(file);

            if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
                window.open(url);
                return;
            }

            const iframe = document.createElement('iframe');

            iframe.id = 'invoice';
            iframe.name = 'invoice';
            iframe.style.display = 'none';
            iframe.style.width = '100%';
            iframe.style.height = '100%';

            iframe.onload = function () {
                this.contentWindow.focus();
                this.contentWindow.print();
            }

            iframe.src = url;

            document.body.appendChild(iframe);
        });
    },
    getApplicationID(action) {
        axios.get('/apps/allapps').then(({data}) => {
            let order = this.$store.state.funds.operations.fund.application;
            let application = data.find(item => order.orderNum == item.number);

            return new Promise((resolve, reject) => {
                if (application) return resolve(application);
                else reject();
            });
        }).then((data) => {
            this.$store.commit('funds/updateOperation', {
                path: 'fund.applicationID',
                data: data.applicationId
            });
            this.$store.commit('funds/updateOperation', {
                path: 'fund.number',
                data: data.number
            });
            this.getInvoice(action);
        });
    }
}