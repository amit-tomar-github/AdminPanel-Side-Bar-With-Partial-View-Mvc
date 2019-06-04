
$(document).ready(function () {
    //Enable datatable on table
    var dataTableUser = $('#tblData').DataTable();

    $("#spanPageHeader").html("User Master");
    $("#divMsgClient").hide();
    $("#divMsgModal").hide();

    //this value will be send to controller for user operation
    var SelectedId;
    var SelectedRow;
    //************** Start Grid Delete Link to show delete confirmation popup*****************
    $('#tblData').on('click', '.linkDel', function (e) {
        // $(".linkDel").click(function (e) {
        $('#confirmModal').modal('show');
        SelectedId = $(this).data("del-id");
        SelectedRow = $(this).parents("tr:first");
    });
    //***********End************************
    //************************Start Delete Button From Delete Confirmation Modal*********************
    $("#btnDelete").click(function () {
        DeleteUser(SelectedId, SelectedRow, dataTableUser);
    });

    //************End**************************
    //*************Show Edit popup*************

    $('#tblData').on('click', '.linkEdit', function (e) {
        e.preventDefault();
        FnIsEdit(true);
        var editHref = $(this).attr("href");
        GetUserById(editHref);
    });

    //************Show New User Modal**************
    $("#btnAddNew").click(function () {
        FnIsEdit(false);
    });
    //************Click on save button on modal**************
    $("#btnSave").click(function () {
        if ($("#hidIsEdit").val() == "false") {
            AddNewUser();
        }
        else {
            EditUser();
        }
    });
        //***************End*******************
    //when close modal then reload window to refresh data
    $(".modal-close").click(function () {
        window.location.reload();
    });

    //When Click On CLose Button On Modal Popup message then not remove from dom just hide 
    $("#modalMsgBtnClose").click(function () {
        $("#spanMsgClientModal").text("");
        $("#divMsgModal").hide();
    });
});

//*************Add New User***********
function AddNewUser() {
    //Disable save button
    EnableSave(false);
    var $form = $('#myForm');
    //Validat form data
    $.validator.unobtrusive.parse($form);
    if ($form.valid()) {
        var obj =
            {
                "Id": $("#Id").val(),
                "Name": $("#Name").val()
            };
        var myJSON = JSON.stringify(obj);
        //debugger;
        $.ajax({
            type: "POST",
            url: "/UserMaster/AddNewUser",
            data: myJSON,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                // debugger;
                if (response.Response == "Y") {
                    $("#divMsgModal").addClass("alert-success");
                    $("#spanMsgClientModal").text("User added successfully");
                    $("#divMsgModal").show();

                    EnableSave(true);
                }
                else {
                    $("#divMsgModal").addClass("alert-warning");
                    $("#spanMsgClientModal").text(response.ErrorMessage);
                    $("#divMsgModal").show();

                    EnableSave(true);
                }
            },
            failure: function (response) {
                $("#divMsgModal").addClass("alert-warning");
                $("#spanMsgClientModal").text(response.responseText);
                $("#divMsgModal").show();

                EnableSave(true);
            },
            error: function (response) {
                $("#divMsgModal").addClass("alert-warning");
                $("#spanMsgClientModal").text(response.responseText);
                $("#divMsgModal").show();

                EnableSave(true);
            }

        });

    }
    else {
        EnableSave(true);
        return false;
    }
}

//*************Delete User***********
function DeleteUser(SelectedId, SelectedRow, dataTableUser) {
    $('#confirmModal').modal('hide');
    var obj = { "Id": SelectedId };
    var myJSON = JSON.stringify(obj);
    $.ajax({
        type: "POST",
        url: "/UserMaster/DeleteUser",
        data: myJSON,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Response == "Y") {
                SelectedRow.fadeOut('fast', function () {
                    dataTableUser.row(SelectedRow).remove().draw();
                });
                $("#divMsgClient").addClass("alert-success");
                $("#spanMsgClient").text("User deleted successfully");
                $("#divMsgClient").show();
                //Calculate total
                var lblCount = parseInt($("#lblCount").text());
                lblCount = lblCount - 1;
                $("#lblCount").text(lblCount);

            }
            else {
                $("#divMsgClient").addClass("alert-warning");
                $("#spanMsgClient").text(response.ErrorMessage);
                $("#divMsgClient").show();
            }
        },
        failure: function (response) {
            $("#divMsgClient").addClass("alert-warning");
            $("#spanMsgClient").text(response.responseText);
            $("#divMsgClient").show();
        },
        error: function (response) {
            $("#divMsgClient").addClass("alert-warning");
            $("#spanMsgClient").text(response.responseText);
            $("#divMsgClient").show();
        }
    });
}

//*************Edit User***********
function EditUser() {
    //Disable save button
    EnableSave(false);
    var $form = $('#myForm');
    //Validat form data
    $.validator.unobtrusive.parse($form);
    if ($form.valid()) {
        var obj =
            {
                "Id": $("#Id").val(),
                "Name": $("#Name").val()
            };
        var myJSON = JSON.stringify(obj);
        //debugger;
        $.ajax({
            type: "POST",
            url: "/UserMaster/EditUser",
            data: myJSON,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                // debugger;
                if (response.Response == "Y") {
                    $("#divMsgModal").addClass("alert-success");
                    $("#spanMsgClientModal").text("User updated successfully");
                    $("#divMsgModal").show();

                    EnableSave(true);
                }
                else {
                    $("#divMsgModal").addClass("alert-warning");
                    $("#spanMsgClientModal").text(response.ErrorMessage);
                    $("#divMsgModal").show();

                    EnableSave(true);
                }
            },
            failure: function (response) {
                $("#divMsgModal").addClass("alert-warning");
                $("#spanMsgClientModal").text(response.responseText);
                $("#divMsgModal").show();

                EnableSave(true);
            },
            error: function (response) {
                $("#divMsgModal").addClass("alert-warning");
                $("#spanMsgClientModal").text(response.responseText);
                $("#divMsgModal").show();

                EnableSave(true);
            }

        });

    }
    else {
        EnableSave(true);
        return false;
    }
}

//*************Get Selected User Data On Edit Modal***********
function GetUserById(editHref) {
    $.ajax({
        url: editHref,
        success: function (response) {
            if (response.Response == "Y") {
                $("#Id").val(response.Id);
                $("#Name").val(response.Name);
            }
            else {
                $("#divMsgModal").addClass("alert-warning");
                $("#spanMsgClientModal").text(response.ErrorMessage);
                $("#divMsgModal").show();
            }
        },
        failure: function (response) {
            $("#divMsgModal").addClass("alert-warning");
            $("#spanMsgClientModal").text(response.responseText);
            $("#divMsgModal").show();
        },
        error: function (response) {
            $("#divMsgModal").addClass("alert-warning");
            $("#spanMsgClientModal").text(response.responseText);
            $("#divMsgModal").show();
        }

    });
}

//***********Enable Save Button On Modal************
function EnableSave(param) {
    if (param == true) {
        $("#btnSave").html("Save");
        $("#btnSave").removeClass("disabled");
    }
    else {
        $("#btnSave").html("Saving...");
        $("#btnSave").addClass('disabled');
    }
}

//**Enable Disable Field For Edit Popup**********
function FnIsEdit(IsEdit) {
    $("#hidIsEdit").val(IsEdit);
    if (IsEdit == true) {
        $("#Id").attr('disabled', true);
        $("#userModalHeader").html("Edit User");
    }
    else {
        $("#Id").removeAttr('disabled');
        $("#userModalHeader").html("Add New User");
    }

    $('#userModal').modal('show');
}

