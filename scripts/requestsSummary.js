    $(document).on("click", "[id ^='lnk_request_id_']", function() {
        var element_id = $(this).attr('id');
        var request_id = element_id.split('_').pop();
        renderRequest(request_id, false,false);
    });
    $(document).on("click", "[id ^='btn_viewDetails_']", function() {
        var element_id = $(this).attr('id');
        var request_id = element_id.split('_').pop();
        renderRequest(request_id, false,false);
    });

    function renderRequestsSummary(user_id) {
        var requestSummary = [{}];
        $('#searchResultContainer').empty();
        $.get("html/requestSummary.html", function(data) {
            var requestSummaryTemplate = data;
            $.get('requestSummary.json', function(data) {
                requestSummary = $.parseJSON(data);
                for (var i = 0; i < requestSummary.length; i++) {
                    var request_id = requestSummary[i].request_id;
                    var tittle = requestSummary[i].tittle;
                    var business_purpose = requestSummary[i].business_purpose;
                    var created_by = 'Created ' + requestSummary[i].requested_date + ' by ' + requestSummary[i].requested_by;
                    var due_date = 'Delivery target is ' + requestSummary[i].due_date;
                    var priority = requestSummary[i].priority;
                    var status = requestSummary[i].status;

                    var elementsArray = [];
                    elementsArray = $('#searchResultContainer').append(requestSummaryTemplate).find("[id$='_rs']");
                    for (var j = 0; j < elementsArray.length; j++) {
                        var element_id = $(elementsArray[j]).attr("id");
                        element_id = element_id.replace("_rs", "_" + request_id);
                        $(elementsArray[j]).attr("id", element_id);
                        if (status != 'PA') {
                            $('#div_approve_btn_container_' + request_id).addClass("hide");
                        }
                        $('#lnk_priority_' + request_id).html('<h4>' + priority + '</h4>');
                        $('#lnk_request_id_' + request_id).text(request_id);
                        $('#para_title_' + request_id).text(tittle);
                        $('#para_bp_' + request_id).text(business_purpose);
                        $('#para_created_by_' + request_id).text(created_by);
                        $('#para_dueDate_' + request_id).text(due_date);
                        SetStatus(status, request_id);
                    }
                }
            });
        });
    }

    function SetStatus(status, request_id) {
        switch (status) {
            case 'PA':
                $('#div_PA_' + request_id).removeClass('disabled');
                break;
            case 'APPROVED':
                $('#div_APPROVED_' + request_id).removeClass('disabled');
                break;
            case 'REJECTED':
                $('#div_REJECTED_' + request_id).removeClass('disabled');
                break;
            case 'ASSIGNED':
                $('#div_ASSIGNED_' + request_id).removeClass('disabled');
                break;
            case 'WIP':
                $('#div_WIP_' + request_id).removeClass('disabled');
                break;
            case 'PI':
                $('#div_PI_' + request_id).removeClass('disabled');
                break;
            case 'COMPLETED':
                $('#div_COMPLETED_' + request_id).removeClass('disabled');
                break;
            default:
                $('#div_CREATED_' + request_id).removeClass('disabled');
                break;
        }
    }
