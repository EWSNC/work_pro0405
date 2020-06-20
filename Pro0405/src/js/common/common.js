$(function () {
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        var selfid = e.target.id;
        var selectid = "#" + selfid.replace("-tab", "") + " > iframe";
        $(selectid)[0].contentWindow.location.reload(true);
    });
});