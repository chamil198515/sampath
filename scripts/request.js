var workNotes = [];
$(document).on("click", "[id ^='btn_add_worknotes_']", function() {
    var element_id = $(this).attr('id');
    var request_id = element_id.split('_').pop();
    workNotes = [];
    var elementsArray = [];
    elementsArray = $("[id^='txt_worknotes_']")
    for (var i = 0; i < elementsArray.length; i++) {
        var element_id = $(elementsArray[i]).attr('id');
        var id_elements = element_id.split("_");
        workNotes.push({
            "id": 0,
            "createdDate": getCurrentDate(),
            "modifieddDate": getCurrentDate(),
            "submitter": "Madhawa Chaminda",
            "comment": $(elementsArray[i]).val()
        });
    }

    workNotes.push({
        "id": 0,
        "createdDate": "",
        "modifieddDate": "",
        "submitter": "",
        "comment": ""
    })
    renderWorkNotes(request_id, workNotes);
    return false;
});

$(document).on("click", "[id ^='btn_save_']", function() {
    var element_id = $(this).attr('id');
    var request_id = element_id.split('_').pop();
    var employee_id = $('#txt_employee_id_' + request_id).val();
    var requested_date = $('#txt_date_requested_' + request_id).val();
    var previous_request = $('#drop_previous_requests_' + request_id).dropdown('get value');
    var name = $('#txt_name_' + request_id).val();
    var designation = $('#drop_designation_' + request_id).dropdown('get value');
    var contact_details = $('#txt_contact_' + request_id).val();
    var branch_code = $('#drop_branches_' + request_id).dropdown('get value');
    var branch_name = $('#drop_branches_' + request_id).dropdown('get text');
    var request_type = $('#drop_types_' + request_id).dropdown('get value');
    var delivery_format = $('#drop_delivery_format_' + request_id).dropdown('get value');
    var frequency = $('#drop_frequency_' + request_id).dropdown('get value');
    var delivery_mode = $('#drop_delivery_format_' + request_id).dropdown('get value');
    var required_columns = $('#ta_require_columns_' + request_id).val();
    var filtering_criteria = $('#txt_fc_' + request_id).val();
    var report_title = $('#txt_rt_' + request_id).val();
    var due_Date = $('#txt_duedate_' + request_id).val();
    var priority = $('#drop_priority_' + request_id).dropdown('get value');
    var business_purpose = $('#ta_bp_' + request_id).val();
    var assignee_department = "";
    if ($('#drop_assigned_dpt_' + request_id).dropdown('get value') != "") {
        assignee_department = $('#drop_assigned_dpt_' + request_id).dropdown('get value');
    }
    var assignee = "";
    if ($('#drop_assigned_user_' + request_id).dropdown('get value') != "") {
        assignee = $('#drop_assigned_user_' + request_id).dropdown('get value');
    }

    var status = $('#drop_status_' + request_id).dropdown('get value');

    var comments = [];
    var elementsArray = [];
    elementsArray = $("[id^='txt_worknotes_']")
    for (var i = 0; i < elementsArray.length; i++) {
        var element_id = $(elementsArray[i]).attr('id');
        var id_elements = element_id.split("_");
        comments.push({
            "id": id_elements[3],
            "createdDate": getCurrentDate(),
            "modifieddDate": getCurrentDate(),
            "submitter": "Madhawa Chaminda",
            "comment": $(elementsArray[i]).val()
        });
    }

    var newRequest = {
        "request_id": request_id,
        "employee_id": employee_id,
        "requested_date": requested_date,
        "previous_request": previous_request,
        "name": name,
        "designation": designation,
        "contact_details": [{
            "contact": contact_details,
            "contactType": "mobile"
        }],
        "branch": {
            "branch_code": branch_code,
            "branch_name": branch_name,
            "branch_location": ""
        },
        "request_type": request_type,
        "delivery_format": delivery_format,
        "frequency": frequency,
        "delivery_mode": delivery_mode,
        "required_columns": required_columns,
        "filtering_criteria": filtering_criteria,
        "report_title": report_title,
        "due_Date": due_Date,
        "priority": priority,
        "business_purpose": business_purpose,
        "assignee_department": assignee_department,
        "assignee": assignee,
        "status": status,
        "comments": comments
    }

    $.ajax({
        url: url, //Add your URL
        type: "POST",
        data: JSON.stringify(newRequest),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() {
            alert('success');
        },
        fail: function() {
            alert('fail');
        }
    });


    return false;
});



function renderRequest(request_id, isNewRequest, isPreviousRequest) {
    $('#requestContainer').empty();
    var request = {};
    $.get("html/request.html", function(data) {
        var requestTemplate = data;
        $('#requestContainer').append(data);
        var elementsArray = [];
        elementsArray = $('#requestContainer').find("[id$='_rq']");
        for (var j = 0; j < elementsArray.length; j++) {
            var element_id = $(elementsArray[j]).attr("id");
            if(isPreviousRequest){
              element_id = element_id.replace("_rq", "_" + 0);
            }
            else{
              element_id = element_id.replace("_rq", "_" + request_id);
            }
            $(elementsArray[j]).attr("id", element_id);
        }
        if (!isNewRequest || isPreviousRequest) {
            $.get('request.json', function(data) {
                request = $.parseJSON(data);

                if(isPreviousRequest){
                  request_id = 0;
                  request.request_id = 0;
                  request.comments = [];
                  request.status = 'CREATED';
                }

                if (['CREATED', 'PA', 'REJECTED'].indexOf(request.status) > -1) {
                    $('#div_assign_details_container_' + request_id).addClass('hide');
                }
                if (['CREATED', 'REJECTED'].indexOf(request.status) > -1) {
                    $('#btn_submit_for_approval').removeClass('hide');
                }

                setValues(request, request_id);
                if(!isPreviousRequest){disableInputFeilds(request_id);}

            });
        } else {
            $('#div_assign_details_container_' + request_id).addClass('hide');
            $('#btn_submit_for_approval_' + request_id).removeClass('hide');
            setValues('', request_id);
        }

        //enableDatePicker();
        //enableDropdown();
    });
}


function renderWorkNotes(request_id, worknotesList) {
    $('#div_worknotes_container').empty();
    $.get("html/worknote.html", function(data) {
        var worknoteTemplate = data;
        for (var i = 0; i < worknotesList.length; i++) {
            $('#div_worknotes_container').append(worknoteTemplate);
            var element_id = $('#worknote').attr('id');
            element_id = 'worknote_' + request_id + '_' + worknotesList[i].id;
            $('#worknote').attr('id', element_id);

            element_id = $('#div_worknotes_added_date').attr('id');
            element_id = 'div_worknotes_added_date_' + request_id + '_' + worknotesList[i].id;
            $($('#div_worknotes_added_date').attr('id', element_id)).html(worknotesList[i].createdDate);

            element_id = $('#div_worknotes_owner').attr('id');
            element_id = 'div_worknotes_owner_' + request_id + '_' + worknotesList[i].id;
            if (worknotesList[i].submitter != "") {
                $($('#div_worknotes_owner').attr('id', element_id)).html('<h5>Added By  ' + worknotesList[i].submitter + '</h5>');
            } else {
                $($('#div_worknotes_owner').attr('id', element_id)).html('');
            }
            element_id = $('#txt_worknotes').attr('id');
            element_id = 'txt_worknotes_' + request_id + '_' + worknotesList[i].id;
            $($('#txt_worknotes').attr('id', element_id)).val(worknotesList[i].comment);

            if (request_id != 0 && worknotesList[i].id != 0) {
                $('#' + element_id).prop('disabled', true);
            }
        }
    });
}

//This will activate date picker
function enableDatePicker(id, value) {
    $(id).val(value);
    $(id).daterangepicker({
        singleDatePicker: true
    }, function(start, end, label) {
        console.log(start.toISOString(), end.toISOString(), label);
    });
}

function enableDropdown(id, url, selected_item) {
    $.ajax({
        url: url,
        type: 'GET',
        success: function(data) {
            var tempMenuItems = '';
            for (var i = 0; i < data.length; i++) {
                tempMenuItems = tempMenuItems + '<div class="item" data-value="' + data[i].value +
                    '" data-text="' + data[i].text +
                    '">' + data[i].name + '</div>';
            }
            $(id).find('.menu').html(tempMenuItems);
            $(id).dropdown("refresh");
            if (selected_item != "") {

                $(id).dropdown('set selected', selected_item);
            }

            if(id.indexOf("drop_previous_requests_") >= 0){
              $(id).dropdown({
                  onChange: function(val) {
                      renderRequest(val,true,true);
                  }
              });
            }
        }
    });
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    var today = mm + '/' + dd + '/' + yyyy;
    return today;
}

function setValues(request, request_id) {
    var date_requested = getCurrentDate();
    var previous_request = '';
    var designation = '';
    var branch_code = '';
    var priority = '';
    var duedate = getCurrentDate();
    var request_type = '';
    var delivery_format = '';
    var frequency = '';
    var assignee_department = '';
    var assignee = '';
    var status = 'CREATED';
    workNotes = []
    if (request.length != 0) {
        if(request_id == 0){
          $('#h1_Request_id_' + request_id).text('New Request');
        }
        else{
          $('#h1_Request_id_' + request_id).text(request_id);
        }

        $('#txt_employee_id_' + request_id).val(request.employee_id);
        $('#txt_name_' + request_id).val(request.name);
        var contact_details = '';
        for (var i = 0; i < request.contact_details.length; i++) {
            contact_details = contact_details + request.contact_details[i].contactType +
                " : " + request.contact_details[i].contact + " ";
        }
        $('#txt_contact_' + request_id).val(contact_details);
        $('#txt_rt_' + request_id).val(request.report_title);
        $('#ta_bp_' + request_id).val(request.business_purpose);
        $('#ta_require_columns_' + request_id).val(request.required_columns);
        $('#txt_fc_' + request_id).val(request.filtering_criteria);

        date_requested = request.requested_date;
        previous_request = request.previous_request;
        designation = request.designation;
        branch_code = request.branch.branch_code;
        priority = request.priority
        duedate = request.due_Date;
        request_type = request.request_type;
        delivery_format = request.delivery_format;
        frequency = request.frequency;
        assignee_department = request.assignee_department;
        assignee = request.assignee;
        status = request.status;
        workNotes = request.comments;

    } else {
        $('#h1_Request_id_' + request_id).text('New Request');
    }


    var temp_id = '#txt_date_requested_' + request_id;
    enableDatePicker(temp_id, date_requested);

    temp_id = '#drop_previous_requests_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/12ix61', previous_request);

    temp_id = '#drop_designation_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/qp6pj', designation);

    temp_id = '#drop_branches_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/151srt', branch_code);

    temp_id = '#drop_priority_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/124piv', priority);

    var temp_id = '#txt_duedate_' + request_id;
    enableDatePicker(temp_id, duedate);

    temp_id = '#drop_types_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/a36xj', request_type);

    temp_id = '#drop_delivery_format_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/16we2v', delivery_format);

    temp_id = '#drop_frequency_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/l8q8x', frequency);

    temp_id = '#drop_assigned_dpt_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/c9r0d', assignee_department);

    temp_id = '#drop_assigned_user_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/jegit', assignee);

    temp_id = '#drop_status_' + request_id;
    enableDropdown(temp_id, 'https://api.myjson.com/bins/sfhg5', status);

    renderWorkNotes(request_id, workNotes);
}

function disableInputFeilds(request_id) {
    $('#txt_employee_id_' + request_id).prop('disabled', true);
    $('#txt_name_' + request_id).prop('disabled', true);
    $('#txt_contact_' + request_id).prop('disabled', true);
    $('#txt_rt_' + request_id).prop('disabled', true);
    $('#ta_bp_' + request_id).prop('disabled', true);
    $('#txt_fc_' + request_id).prop('disabled', true);
    $('#txt_date_requested_' + request_id).prop('disabled', true);
    $('#drop_previous_requests_' + request_id).addClass('disabled')
    $('#drop_designation_' + request_id).addClass('disabled');
    $('#drop_branches_' + request_id).addClass('disabled');
    $('#drop_priority_' + request_id).addClass('disabled');
    $('#txt_duedate_' + request_id).prop('disabled', true);
    $('#drop_types_' + request_id).addClass('disabled');
    $('#drop_delivery_format_' + request_id).addClass('disabled');
    $('#drop_frequency_' + request_id).addClass('disabled');
    $('#ta_require_columns_' + request_id).prop('disabled', true);
    $('#drop_assigned_dpt_' + request_id).addClass('disabled');
    $('#drop_assigned_user_' + request_id).addClass('disabled');
    $('#drop_status_' + request_id).addClass('disabled');
    //$("[id^='txt_worknotes_']").prop('disabled', true);
}
