
let urlCustomer = "http://localhost:8080/customers/";

let user = JSON.parse(localStorage.getItem("user"));

let totalPage = 0;

let pageNumber = 0;

console.log(user.token);

showListCustomer();

function showCustomer(customer) {
    let content = `<tr><td>${customer.id}</td>
                    <td>${customer.name}</td>
                    <td>${customer.address}</td>
                    <td>${customer.image}</td>
                    <td><button class="btn btn-warning" onclick="showEdit(${customer.id})">Edit</button></td>
                    <td><button class="btn btn-primary" onclick="showInfo(${customer.id})">Info</button></td>
                    <td><button class="btn btn-danger" onclick="showDelete(${customer.id})">Delete</button></td></tr>`
    return content;
}

function showListCustomer(page) {
    $.ajax({
        url: `${urlCustomer}?page=${page}`,
        headers: {
            'Accept':'application/json',
            'Content-Type':'application/json',
            'Authorization':'Bearer ' + user.token
        },
        method: 'GET',
        dataType: 'json',
        success: function(data){
            let content = ""
            for (let i = 0; i < data.content.length; i++) {
                content += showCustomer(data.content[i])
            }
            totalPage = data.totalPages;
            page = data.number;
            $("#showListTable").html(content);
            pageNumber = page;
            showPaging();
            console.log(page);
        }
    });
}

function previous() {
    pageNumber -= 1;
    showListCustomer(pageNumber);
}

function next() {
    pageNumber += 1;
    showListCustomer(pageNumber);
}

function showPaging() {
    if (pageNumber <= 0) {
        $("#previous").addClass("disabled");
        $("#previous").html(`<span class='page-link'>Previous</span>`);
    } else {
        $("#previous").removeClass("disabled");
        $("#previous").html(`<button class="page-link" onclick="previous()">Previous</button>`);
    }
    if (pageNumber >= totalPage - 1) {
        $("#next").addClass("disabled");
        $("#next").html(`<span class='page-link'>Next</span>`);
    } else {
        $("#next").removeClass("disabled");
        $("#next").html(`<button class="page-link" onclick="next()">Next</button>`);
    }
    if (totalPage <= 5) {
        showPositionPage(totalPage);
    }
    if (totalPage > 5) {
        if (pageNumber == 0 || pageNumber == 1 || pageNumber == 2) {
            showPositionPage(5);
        } else if (pageNumber < totalPage - 2){
            $("#pagePosition").html(`
                        <li id="one" class="page-item"></li>
                        <li id="two" class="page-item"></li>
                        <li id="three" class="page-item active" aria-current="page"></li>
                        <li id="four" class="page-item"></li>
                        <li id="five" class="page-item"></li>`);
            $("#one").html(`<button class="page-link" onclick="showListCustomer(${pageNumber - 2})">${pageNumber - 1}</button>`);
            $("#two").html(`<button class="page-link" onclick="showListCustomer(${pageNumber - 1})">${pageNumber}</button>`);
            $("#three").html(`<span class="page-link">${pageNumber + 1}</span>`);
            $("#four").html(`<button class="page-link" onclick="showListCustomer(${pageNumber + 1})">${pageNumber + 2}</button>`);
            $("#five").html(`<button class="page-link" onclick="showListCustomer(${pageNumber + 2})">${pageNumber + 3}</button>`);
        } else {
            let content = "";
            for (let i = totalPage - 5; i < totalPage; i++) {
                if (i == pageNumber) {
                    content += `<li class="page-item active"><span class="page-link">${i + 1}</span></li>`
                } else {
                    content += `<li class="page-item"><button class="page-link" onclick="showListCustomer(${i})">${i + 1}</button></li>`
                }
            }
            $("#pagePosition").html(content);
        }
    }

}

function showPositionPage(size) {
    let content = "";
    for (let i = 0; i < size; i++) {
        if (i == pageNumber) {
            content += `<li class="page-item active"><span class="page-link">${i + 1}</span></li>`
        } else {
            content += `<li class="page-item"><button class="page-link" onclick="showListCustomer(${i})">${i + 1}</button></li>`
        }
    }
    $("#pagePosition").html(content);
}

function showCreate() {
    var myModal = new bootstrap.Modal(document.getElementById('myModal'));
    $("#id").val("");
    $("#name").val("");
    $("#address").val("");
    $("#image").hide();
    $("#delete").hide();
    $("#edit").hide();
    $("#save").show();
    myModal.show();
}

function saveAndEditCustomer() {
    let id = $("#id").val();
    if (id == null || id < 1) {
        let form = $("#formCustomer")[0];
        let formData = new FormData(form);
        $.ajax({
            url: urlCustomer,
            method: 'post',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            enctype: 'multipart/form-data',
            headers: {
                'Authorization':'Bearer ' + user.token
            },
            success: function (data) {
                showListCustomer();
            }
        })
    } else {
        let form = $("#formCustomer")[0];
        let formData = new FormData(form);
        $.ajax({
            url: urlCustomer,
            method: 'post',
            processData: false,
            contentType: false,
            cache: false,
            data: formData,
            enctype: 'multipart/form-data',
            headers: {
                'Authorization':'Bearer ' + user.token
            },
            success: function (data) {
                showListCustomer();
                $("#id").val(0)
            }
        })
    }
}

function showInfo(id) {
    $.ajax({
        url: urlCustomer + id,
        method: 'get',
        headers: {
            'Authorization':'Bearer ' + user.token
        },
        success: function (data) {
            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            $("#id").val(data.id);
            $("#name").val(data.name);
            $("#address").val(data.address);
            $("#image").show();
            $("#image").attr("src",`../../static/image/${data.image}`);
            $("#delete").hide();
            $("#edit").hide();
            $("#save").hide();
            myModal.show();
        }
    })
}

function showDelete(id) {
    $.ajax({
        url: urlCustomer + id,
        method: 'get',
        headers: {
            'Authorization':'Bearer ' + user.token
        },
        success: function (data) {
            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            $("#id").val(data.id);
            $("#name").val(data.name);
            $("#address").val(data.address);
            $("#image").show();
            $("#image").attr("src",`../../static/image/${data.image}`);
            $("#delete").show();
            $("#edit").hide();
            $("#save").hide();
            myModal.show();
        }
    })
}

function deleteCustomer() {
    let id = $("#id").val();
    $.ajax({
        url: urlCustomer + id,
        method: 'delete',
        headers: {
            'Authorization':'Bearer ' + user.token
        },
        success: function () {
            showListCustomer();
        }
    })
}

function showEdit(id) {
    $.ajax({
        url: urlCustomer + id,
        method: 'get',
        headers: {
            'Authorization':'Bearer ' + user.token
        },
        success: function (data) {
            var myModal = new bootstrap.Modal(document.getElementById('myModal'));
            $("#id").val(data.id);
            $("#name").val(data.name);
            $("#address").val(data.address);
            $("#image").show();
            $("#image").attr("src",`../../static/image/${data.image}`);
            $("#delete").hide();
            $("#edit").show();
            $("#save").hide();
            myModal.show();
        }
    })
}