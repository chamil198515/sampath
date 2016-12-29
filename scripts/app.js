$(document).ready(function() {
    var content = [{
            title: 'request1'
        }, {
            title: 'request2'
        }
        // etc
    ];

    renderLogin();

    $(document).on("click", '#btn-login', function() {
        $('#mainContainer').empty();
        $.get('employee.json', function(data) {
            var employeeObj = $.parseJSON(data);
            var isAuthenticated = true;
            if (isAuthenticated) {
                renderMainContainer(employeeObj.user_id);
            } else {
                $('msg-loginFailure').removeClass('hide');
            }
        });
    });
});


function enableSearch() {
    $('.ui.search')
        .search({
            source: content
        });
}

function renderLogin() {
    $('#mainContainer').empty();
    $('#mainContainer').load("/html/login.html");
}


function renderSearch() {
    $('#requestContainer').empty();
    $('#requestContainer').load("/html/search.html", function() {
        enableSearch();
    });
}

function renderMainContainer(user_id) {
    $('#mainContainer').load("/html/main.html", function() {

        renderSearch();
        renderRequestsSummary(user_id);

        $('.ui .item').on('click', function() {
            $('.ui .item').removeClass('active');
            $(this).addClass('active');
            var elimentId = $(this).attr("id");
            switch (elimentId) {
                case "lnk-myRequests":
                    renderSearch();
                    renderRequestsSummary(user_id);
                    break;
                case "lnk-createRequest":
                    renderRequest(0, true);
                    break;
                default:
                    alert("default");
            }
        });
    });
}
