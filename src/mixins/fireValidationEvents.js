
let oldErrors = [];

export default function createFireValidationMixin() {
    return {
        watch: {
            errorsItems(newErrors) {
                try {
                    if (oldErrors.length > newErrors.length) {
                        const validatedFields = _.difference(oldErrors, newErrors);

                        if (!validatedFields || !validatedFields.length) {
                            return;
                        }

                        oldErrors = [];
                        validatedFields.forEach(({ field, rule }) => {
                            // checkAndFireEvent({
                            //     action: 'validateField',
                            //     label: field || rule
                            // });
                        })
                    }

                    this.$nextTick(() => {
                        oldErrors = _.cloneDeep(newErrors);
                    })
                } catch (e) {
                    console.error(e.message);
                }
            }
        }
    };
}
