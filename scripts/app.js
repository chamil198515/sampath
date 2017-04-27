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
                var user_Obj = { "name":"John", "employee_id":employeeObj.user_id, "branch":"1000",
                "designation":6,"phone_no":"0772926206","email":"chamil2gmail.com",
                "authToken":"61411a5d-1d5e-4473-8967-a77755dea7af","immediate_manager_id":"E002" };

                setCookie("user_Obj",JSON.stringify(user_Obj),1)

            } else {
                $('msg-loginFailure').removeClass('hide');
            }
        });
    });
});


function setCookie(cname, cvalue,exdays) {
    var user = getCookie(cname);
    if (user == "") {
      var d = new Date();
      d.setTime(d.getTime() + (exdays*24*60*60*1000));
      var exdays = "expires="+ d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + exdays + ";path=/";
    }
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


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
                    renderRequest(0, true, false);
                    break;
                default:
                    renderLogin();
            }
        });
    });
}
