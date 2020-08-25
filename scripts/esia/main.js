var hash = window.location.hash.replace('#', '');
var url = window.location.origin;

if (hash.indexOf('signupRequestId') !== -1) {
    var query = hash.split('=');
	url += '/#/register/contact?regesia=1&form=' + query[1];
    window.location = url;
}

if (hash.indexOf('access_token') !== -1) {
    url += '/#/?' + hash;
    window.location = url;
}

if (hash.indexOf('error') !== -1) {
    url += '/#/?' + hash;
    window.location = url;
}
if (hash.indexOf('registrarValidation') !== -1) {
    url += '/#/?' + hash;
    window.location = url;
}

window.location = url;
