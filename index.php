<?php
session_start();
$adv_sub = session_id();

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <meta name="SKYPE_TOOLBAR" content="SKYPE_TOOLBAR_PARSER_COMPATIBLE"/>
    <meta name="format-detection" content="telephone=no"/>
    <title>УС ЛК</title>
    <script
        src="https://code.jquery.com/jquery-3.4.1.slim.min.js"
        integrity="sha256-pasqAKBDmFT4eHoN2ndd6lN370kFiGUFyTiUHWhU7k8="
        crossorigin="anonymous"></script>
    <link href="https://fonts.googleapis.com/css?family=Fira+Sans:300,300i,400,400i,500,500i,600,600i,700,700i,800,800i,900,900i&amp;subset=cyrillic"
          rel="stylesheet">
    <meta name="viewport" content="width=device-width"/>

    <script>
        window.dataLayer = window.dataLayer || [];

        function saveCategoryToStorage() {
            try {
                var hash = window.location.hash;
                var searchString = hash.split('?')[1];

                if (!searchString) {
                    return;
                }

                var params = searchString.split('&').map(function(param) {
                    const splitParam = param.split('=');

                    return {
                        name: splitParam[0],
                        value: splitParam[1]
                    };
                });

                var categoryParamIndex = params.findIndex(function(item) {
                    return item.name === 'category'
                });

                if (categoryParamIndex === -1) {
                    return;
                }

                var category = params[categoryParamIndex].value;

                if (category) {
                    localStorage.setItem('category', category);
                }
            } catch (e) {
                console.log(e.message);
            }
        }

        saveCategoryToStorage();
    </script>

    <script>
    <?php if (isset($_SERVER['HTTP_X_REQUESTED_WITH'])) { ?>
    window.isAndroidWebview = true;
    <?php } else { ?>
    window.isAndroidWebview = false;
    <?php } ?>
    </script>

    <!-- Google Tag Manager -->
    <script>(function(w, d, s, l, i) {
        w[l] = w[l] || [];
        w[l].push({
            'gtm.start':
                new Date().getTime(), event: 'gtm.js'
        });
        var f = d.getElementsByTagName(s)[0],
            j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
        j.async = true;
        j.src =
            'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
        f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', 'GTM-M6MHC9Z');</script>
    <!-- End Google Tag Manager -->


    <script>
    var pixelImg = '<?php echo $postback_pixel; ?>';
    var advSub = '<?= $adv_sub?>';
    </script>
</head>

<body class="body">
<!-- Google Tag Manager (noscript) -->
<noscript>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M6MHC9Z" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T2PMQ88" height="0" width="0" style="display:none;visibility:hidden"></iframe>
    <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T7TTPQW" height="0" width="0" style="display:none;visibility:hidden"></iframe>
</noscript>
<!-- End Google Tag Manager (noscript) -->

<div id="app"></div>
<script>
(function(arr) {
    arr.forEach(function(item) {
        if (item.hasOwnProperty('prepend')) {
            return;
        }
        Object.defineProperty(item, 'prepend', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function prepend() {
                var argArr = Array.prototype.slice.call(arguments),
                    docFrag = document.createDocumentFragment();

                argArr.forEach(function(argItem) {
                    var isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.insertBefore(docFrag, this.firstChild);
            }
        });
    });
})([Element.prototype, Document.prototype, DocumentFragment.prototype]);
</script>
<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.336/build/pdf.min.js"></script>
<script type="text/javascript" src="https://www.google.com/jsapi?autoload={'modules':[{'name':'visualization','version':'1.1','packages':['corechart']}]}"></script>

<script>
try {
    google.load("visualization", "1.1", {packages: ["corechart"]});
} catch (e) {
    console.error(e.message);
}
</script>

<script src="/dist/build.js?version=<?= uniqid() ?>"></script>

<!-- Yandex.Metrika counter -->
<script type="text/javascript">
if (window.location.host.indexOf('am-uralsib.ru') !== -1) {
    (function(d, w, c) {
        (w[c] = w[c] || []).push(function() {
            try {
                w.yaCounter50062190 = new Ya.Metrika2({
                    id: 50062190,
                    clickmap: true,
                    trackLinks: true,
                    accurateTrackBounce: true,
                    webvisor: true
                });
            } catch (e) { }
        });

        var n = d.getElementsByTagName('script')[0],
            s = d.createElement('script'),
            f = function() { n.parentNode.insertBefore(s, n); };
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://mc.yandex.ru/metrika/tag.js';

        if (w.opera == '[object Opera]') {
            d.addEventListener('DOMContentLoaded', f, false);
        } else { f(); }
    })(document, window, 'yandex_metrika_callbacks2');
}
</script>
<noscript>
    <div><img src="https://mc.yandex.ru/watch/50062190" style="position:absolute; left:-9999px;" alt=""/></div>
</noscript>
<!-- /Yandex.Metrika counter -->
</body>
</html>
