export default {
    namespaced: true,
    state: {
        step_1: null,
        step_2: null,
        regesia:false,
        form_id: false
    },
    mutations: {
        save(state, payload) {
            if (payload.step == 1) {
                let data = payload.data;
                data.phone = data.phone.replace(/\D/g, '');
                data.phone.length == 10 ? '7' + data.phone : data.phone;

                state.step_1 = data;
            } else if (payload.step == 2) state.step_2 = payload.data;
        },
        setRegEsia(state,regesia) {
          state.regesia = regesia
        },
        setFormId(state, form_id) {
            if (form_id.indexOf('?utm_source') !== -1) {
                form_id= form_id.substr(0, form_id.indexOf('?utm_source')); 
            }
            state.form_id = form_id;
        },
        clear(state) {
            state.step_1 = null;
            state.step_2 = null;
            state.form_id = null;
            
            localStorage.removeItem('form_id');
            localStorage.removeItem('phone');
        }
    }
}