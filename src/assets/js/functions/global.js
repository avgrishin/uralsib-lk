import CONSTANTS from './constants';
const { QU_UTM_SOURCE, QU_REG_DATA_FROM_US, QU_TRANSACTION_ID } = CONSTANTS;

export const CONST_EXP = CONSTANTS;

export function b64DecodeUnicode(str) {
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

export function getAllParams(url = window.location.href) {
    url = url.replace(/^(?:\/\/|[^\/]+)*\//, "");
    if (!url.includes('?')) return;
    let data;
    let foo = url.split('#/');

    let part_1 =foo[0].split('?');
    let part_2 = foo[1].split('?');

    part_1 = part_1.length <= 1 ? [] : part_1;
    part_2 = part_2.length <= 1 ? [] : part_2;

    if (part_1.length >= 1) part_1 = part_1[1].split('&');
    if (part_2.length >= 1) part_2 = part_2[1].split('&');

    data = [...part_1, ...part_2];

    let dict = {};
    let elem = [];
    for (let i = data.length - 1; i >= 0; i--) {
        elem = data[i].split('=');
        if (elem.length > 1) {
            dict[elem[0]] = elem[1];
        }
    };
    return dict;
};

export function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function setUtmSource() {
    if (!getAllParams()) return;
    let utmString = '';
    Object.keys(getAllParams()).forEach((key, index) => {
        utmString = `${index == 0 ? '?' : ''}${utmString}&${key}=${key = getAllParams()[key]}`;
        if (utmString.charAt(0) === '?' && utmString.charAt(1) === '&') {
            utmString = utmString.split('');
            utmString[1] = '';
            utmString = utmString.join('');
        } else if (utmString.charAt(0) === '&') {
            utmString = utmString.split('');
            utmString[0] = '?';
            utmString = utmString.join('');
        }
    });
    if(utmString.indexOf('regesia') === -1) {
        localStorage.setItem(QU_UTM_SOURCE, utmString);
    }
};

export function setRegDataFromUS() {
    let dataFromQuery = getParameterByName('data');
    if (!dataFromQuery) return;
    localStorage.setItem(QU_REG_DATA_FROM_US, dataFromQuery);
};


export function getRegDataUS() {
    const regDataFromUs = localStorage.getItem(QU_REG_DATA_FROM_US);
    if (!regDataFromUs) return;
    let data = b64DecodeUnicode(regDataFromUs);
    data = JSON.parse(data);
    return data;
}

export function removeFromStorage(name) {
    if (!name) return;
    localStorage.removeItem(name);
}

export function setTransactionId() {
    let urlTransaction = getParameterByName(QU_TRANSACTION_ID);
    if(!urlTransaction) return;

    localStorage.setItem(QU_TRANSACTION_ID, urlTransaction);
}


export function addPixelImg() {
  const getTransactionId = localStorage.getItem(QU_TRANSACTION_ID);
  if (!getTransactionId) return;

  let pixelImg = `<img style="position: absolute; opacity: 0;" src="http://tracking.banki.ru/SP155?adv_sub=${advSub}&transaction_id=${getTransactionId}" width="1"  height="1"/>`;
  let pixelImgWrapper = document.createElement("div");
  pixelImgWrapper.innerHTML = pixelImg;
  document.head.appendChild(pixelImgWrapper);

  localStorage.removeItem(QU_TRANSACTION_ID);
}
