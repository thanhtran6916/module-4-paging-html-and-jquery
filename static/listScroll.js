let urlCustomer = "http://localhost:8080/customers/";

let user = JSON.parse(localStorage.getItem("user"));

let totalPage = 0;

let pageNumber = 0;

function showCustomer(customer) {
    return `<div><img src="../../static/image/${customer.image}" alt=""><br><br></div>`
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
        success: function (data) {
            let content = "";
            for (let i = 0; i < data.content.length; i++) {
                content += showCustomer(data.content[i]);
            }
            $("#showList").append(content);
            totalPage = data.totalPages;
            pageNumber = data.number;

        }
    })
}

showListCustomer();

$(document).ready(function(){
    $(window).scroll(function(){
        if($(window).scrollTop() > $(document).height()-$(window).height()){
            $.ajax({
                url: `${urlCustomer}?page=${pageNumber += 1}`,
                headers: {
                    'Accept':'application/json',
                    'Content-Type':'application/json',
                    'Authorization':'Bearer ' + user.token
                },
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    let content = "";
                    for (let i = 0; i < data.content.length; i++) {
                        content += showCustomer(data.content[i]);
                    }
                    $("#showList").append(content);
                }
            })
        }
    });
});


