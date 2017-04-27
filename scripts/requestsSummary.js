    $(document).on("click", "[id ^='lnk_request_id_']", function() {
        var element_id = $(this).attr('id');
        var request_id = element_id.split('_').pop();
        renderRequest(request_id, false, false);
    });
    $(document).on("click", "[id ^='btn_viewDetails_']", function() {
        var element_id = $(this).attr('id');
        var request_id = element_id.split('_').pop();
        renderRequest(request_id, false, false);
    });

    $(document).on("click", "[id ^='btn_approve_']", function() {
        var element_id = $(this).attr('id');
        var request_id = element_id.split('_').pop();
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "http://localhost:8080/request/" + request_id,
            success: function(response) {
                var requestObj = response;
                var user_obj = JSON.parse(getCookie("user_Obj"));
                requestObj.status = 3;
                requestObj.assignee = "E003"; //chamil remove hardcoded value
                requestObj.currentuser_id = user_obj.employee_id;
                requestObj.currentuser_role = user_obj.designation;
                $.ajax({
                    type: "PUT",
                    contentType: "application/json",
                    url: "http://localhost:8080/request", //Add your URL
                    data: JSON.stringify(requestObj),
                    dataType: "json",
                    success: function(data) {
                        //$('#p_success_message').text('Request was successfully saved');
                        //$('#p_success_message').removeClass('hide');
                        //var employee_id = data.employee_id;
                        renderSearch();
                        renderRequestsSummary(data.employee_id);
                    },
                    failure: function() {
                        $('#p_error_message').text('An error occured while saving request');
                        $('#p_error_message').removeClass('hide');
                    }
                });
            },
            failure: function() {
                $("#p_error_message").text('An Error occured while loading request');
                $("#p_error_message").parent('.negative').removeClass('hide');
            }
        });
    });



    function renderRequestsSummary(user_id) {
            var assignedRequestSummary = [{}];
  	        var submittedRequestSummary = [{}];
            $('#assignedRequestsContainer').empty();
  	        $('#submittedRequestsContainer').empty();
            $.get("html/requestSummary.html", function(data) {
            var requestSummaryTemplate = data;
            $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url: "http://localhost:8080/users/" + user_id + "/requestSummary",
                        success: function(response) {
                                $('.ui.accordion').accordion('refresh');
                                assignedRequestSummary = response;
                                for (var i = 0; i < assignedRequestSummary.length; i++) {
                                    var status = assignedRequestSummary[i].status;
                                    if(status == "1"){
                                      continue;
                                    }
                                    var request_id = assignedRequestSummary[i].request_id;
                                    var tittle = assignedRequestSummary[i].title;
                                    var business_purpose = assignedRequestSummary[i].business_purpose;
                                    var created_by = 'Created  by ' + assignedRequestSummary[i].requested_by + ' at ' + assignedRequestSummary[i].requested_date;
                                    var due_date = '';
                                    var priority = assignedRequestSummary[i].priority;

                                    if (priority == 'Imediate') {
                                        due_date = 'This request need to be completed within 3 working days.'
                                    } else if (priority == 'Important') {
                                        due_date = 'This request need to be completed within 5 working days.'
                                    } else {

                                    }


                                    var elementsArray = [];
                                    elementsArray = $('#assignedRequestsContainer').append(requestSummaryTemplate).find("[id$='_rs']");
                                    for (var j = 0; j < elementsArray.length; j++) {
                                        var element_id = $(elementsArray[j]).attr("id");
                                        element_id = element_id.replace("_rs", "_assignedRequest_" + + request_id);
                                        $(elementsArray[j]).attr("id", element_id);
                                        if (status != "2") {
                                            $('#div_approve_btn_container_assignedRequest_' + request_id).addClass("hide");
                                        }
                                        $('#lnk_priority_assignedRequest_' + request_id).html('<h4>' + priority + '</h4>');
                                        $('#lnk_request_id_assignedRequest_' + request_id).text(request_id);
                                        $('#para_title_assignedRequest_' + request_id).text(tittle);
                                        $('#para_bp_assignedRequest_' + request_id).text(business_purpose);
                                        $('#para_created_by_assignedRequest_' + request_id).text(created_by);
                                        $('#para_dueDate_assignedRequest_' + request_id).text(due_date);
                              SetStatus(status, "assignedRequest_"+request_id);
                          }
                      }
                  },
                  failure: function() {
                      $("#p_error_message").text('An Error occured while loading assigned request summary');
                      $("#p_error_message").parent('.negative').removeClass('hide');
                  }
              });


              $.ajax({
                  type: "GET",
                  contentType: "application/json",
                  url: "http://localhost:8080/users/" + user_id + "/requestSummaryByInitiator",
                  success: function(response) {
                      //alert(response)
                      $('.ui.accordion').accordion('refresh');
                      submittedRequestSummary = response;
                      for (var i = 0; i < submittedRequestSummary.length; i++) {
                          var request_id = submittedRequestSummary[i].request_id;
                          var tittle = submittedRequestSummary[i].title;
                          var business_purpose = submittedRequestSummary[i].business_purpose;
                          var created_by = 'Created  by ' + submittedRequestSummary[i].requested_by + ' at ' + submittedRequestSummary[i].requested_date;
                          var due_date = '';
                          var priority = submittedRequestSummary[i].priority;

                          if(priority == 'Imediate'){
                            due_date = 'This request need to be completed within 3 working days.'
                          }
                          else if(priority == 'Important'){
                            due_date = 'This request need to be completed within 5 working days.'
                          }
                          else{

                          }
                          var status = submittedRequestSummary[i].status;

                          var elementsArray = [];
                          elementsArray = $('#submittedRequestsContainer').append(requestSummaryTemplate).find("[id$='_rs']");
                          for (var j = 0; j < elementsArray.length; j++) {
                              var element_id = $(elementsArray[j]).attr("id");
                              element_id = element_id.replace("_rs", "_submitRequest_" + request_id );
                              $(elementsArray[j]).attr("id", element_id);
                              //if (status != 2) {
                              $('#div_approve_btn_container_submitRequest_' + request_id).addClass("hide");
                              //}
                              $('#lnk_priority_submitRequest_' + request_id).html('<h4>' + priority + '</h4>');
                              $('#lnk_request_id_submitRequest_' + request_id).text(request_id);
                              $('#para_title_submitRequest_' + request_id).text(tittle);
                              $('#para_bp_submitRequest_' + request_id).text(business_purpose);
                              $('#para_created_by_submitRequest_' + request_id).text(created_by);
                              $('#para_dueDate_submitRequest_' + request_id).text(due_date);
                              SetStatus(status, "submitRequest_"+request_id);
                          }
                      }
                  },
                  failure: function() {
                      $("#p_error_message").text('An Error occured while loading request summary');
                      $("#p_error_message").parent('.negative').removeClass('hide');
                  }
              });
          });
      }





    function SetStatus(status, request_id) {
        switch (status) {
            case "2":
                $('#div_PA_' + request_id).removeClass('disabled');
                break;
            case "3":
                $('#div_APPROVED_' + request_id).removeClass('disabled');
                break;
            case "4":
                $('#div_REJECTED_' + request_id).removeClass('disabled');
                break;
            case "5":
                $('#div_ASSIGNED_' + request_id).removeClass('disabled');
                break;
            case "6":
                $('#div_WIP_' + request_id).removeClass('disabled');
                break;
            case "7":
                $('#div_PI_' + request_id).removeClass('disabled');
                break;
            case "8":
                $('#div_COMPLETED_' + request_id).removeClass('disabled');
                break;
            default:
                $('#div_CREATED_' + request_id).removeClass('disabled');
                break;
        }
    }
