<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        label {
            display: block;
        }
        form div {
            margin-bottom: 10px;
        }
    </style>
</head>
<body>

<form action="send.php" method="post" id="index-send-esia">
    <div>
        <label for="">Passport series</label>
        <input type="text" name="passportSeries" placeholder="pass series" />
    </div>
    <div>
        <label for="">Passport number</label>
        <input type="text" name="passportNumber" placeholder="pass number" />
    </div>
    <div>
        <label for="">Last name</label>
        <input type="text" name="lastName" placeholder="last name" />
    </div>
    <div>
        <label for="">First name</label>
        <input type="text" name="firstName" placeholder="first name" />
    </div>
    <div>
        <label for="">Middle name</label>
        <input type="text" name="middleName" placeholder="middle name" />
    </div>
    <div>
        <label for="">INN</label>
        <input type="text" name="inn" placeholder="inn" />
    </div>
    <div>
        <label for="">SNILS</label>
        <input type="text" name="snils" placeholder="snils" />
    </div>
    <div>
        <input type="submit" name="submit" value="send">
    </div>
</form>
<input type="submit" name="submit_get" value="get">
<script src="//ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
<script>
    $(function() {
        $(document).on('click', '[name="submit_get"]', function(ev) {
            var data = {request_message_id: '546dc770-e1b8-11e8-91b3-353936343533'};
            $.post('get.php', JSON.stringify(data), function(response) {

            });
        });
        $(document).on('submit', '#index-send-esia', function(ev) {
            ev.preventDefault();

            var
                $form = $(this),
                $btn = $form.find('[type="submit"]');

            if ($btn.attr('disabled')) {
                return;
            }

            $btn.attr('disabled', 'disabled');
            $.post($form.attr('action'), $form.serialize(), function(response) {
                if (1 === response.state) {
                    var msg = 'Success.';
                    if (response.hasOwnProperty('request_message_id')) {
                        msg += "\nMessage Id: "+response.request_message_id;
                    }
                    alert(msg);
                }
                else if (response.hasOwnProperty('message')) {
                    alert("Fail\n"+response.message);
                }
            }, 'json').always(function() {
                $btn.removeAttr('disabled');
            });
        });
    });
</script>

</body>
</html>