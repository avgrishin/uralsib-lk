export class AppsApiService {
    async allApps() {
        const { data: apps } = await axios.get('apps/allapps');

        if (!Array.isArray(apps)) {
            throw new TypeError('Apps is not array');
        }

        return apps;
    }

    async buyApps() {
        const { data: apps } = await axios.get('BuyApps');

        if (!Array.isArray(apps)) {
            throw new TypeError('Apps is not array');
        }

        return apps;
    }
}
