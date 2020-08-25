/**
 * @global
 * @typedef DeferredAppsStatus
 * @property {number} [applicationId]
 * @property {boolean} isActual
 * @property {boolean} canBeSign
 */

/**
 *
 * @return {Promise<DeferredAppsStatus>}
 */
export function apiCheckDeferredApps() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                applicationId: null,
                isActual: false,
                canBeSign: false,
            });
        }, 300);
    });
}

export class SellAppsApiService {
    async getActiveAppPepVerifications() {
        try {
            const resultResponse = await axios.get(`/sellapps/getActiveAppPepVerifications`);

            if (!resultResponse.data || typeof resultResponse.data !== 'object') {
                throw new Error('Ошибка при проверке статуса отложенных заявок');
            }

            return resultResponse.data;
        } catch (e) {
            console.error(e.message);
        }
    }

    async getApplicationById(id) {
        const response = await axios.get(`/SellApps/${id}`);

        if (!response.data || typeof response.data !== 'object') {
            throw new Error(`Запрос GET /SellApps/${id} завершился с ошибкой`);
        }

        return response.data;
    }

    async getConsultation() {
        await axios.get(`/SellApps/getConsultation`);
    }

    async cancelAppPepVerification(applicationId) {
        await axios.put(`/sellapps/cancelAppPepVerification/${applicationId}`);
    }

    async requestSmsCode(appIds) {
        try {
            const requestSmsResponse = await axios.post('/sellapps/otp', {
                appIds,
            });

            if (!requestSmsResponse.data || typeof requestSmsResponse.data !== 'object') {
                throw new Error(`Запрос POST /sellapps/otp с параметрами ${JSON.stringify(appIds)} завершился с ошибкой [пустой ответ]`);
            }

            return requestSmsResponse.data;
        } catch (e) {
            console.error(e.message);
        }
    }
}
