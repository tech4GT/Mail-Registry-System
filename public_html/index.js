var urldata = $('#url');
var check = $('#emailCheck')
var submit = $('#submit')


submit.click(function () {
    console.log(check.is(':checked'));
    $.post('/add', {
        url: urldata.val(),
        emailCheck: check.is(':checked')
    }, function (data) {

    });
});
