$(document).ready(function () {
    $('#switchlines').change(function () {
        var opacity = 1;
        var state = $($('.axis line')[0]).attr('class');
        /*if (state !== 'down') {
            state = 'down';
            opacity = 'display: none;';
        } else {
            state = '';
            opacity = '';
        }*/
        console.log(this, $(this), this.checked, $(this).checked);
        if (!this.checked) {
            state = 'down';
            opacity = 'display: none;';
        } else {
            state = '';
            opacity = '';
        }
        $('.axis line').attr("class", state);
        $('g.tick').attr("style", opacity);
        console.log("Switch toggled");
    });
    $('#switchhighlight').click(function () {
        $('.plots > .posts, .comment').each(function (i) {
            var state = $(this).attr('class').split(' ');
            var prevC = $(this).attr('class');
            //console.log(state);
            var i = [$.inArray('nohighlight', state), $.inArray('highlight', state)]
            if (i[0] >= 0) {
                state.splice(i[0], 1);
                state.push('highlight');
                state = state.join(' ');
                $(this).attr("class", state);
            } else if (i[1] >= 0) {
                state.splice(i[1], 1);
                state.push('nohighlight');
                state = state.join(' ');
                $(this).attr("class", state);
            }

            console.log(prevC, "==>", $(this).attr('class'));
        });

        /*fObj.clearHighlight();*/

        console.log("Switch toggled");
    });
});

$(function () {
    $('#users').change(function (e) {
        var uid = $(e.target).val();
        console.log(uid);
        fObj.repaintNodes(uid);
        console.dir(uid);
    });
    $('#reset-brush').click(function (e) {
        // body...
        d3.selectAll(".brush").call(fObj.brush.clear());
        fObj.brush.on('brush')();
        console.log(fObj.brush.empty());
        console.log(fObj.brush.extent());
    });
});

function changeUser(uid) {
    // body...

    console.log(uid);
    fObj.repaintNodes(uid);

}