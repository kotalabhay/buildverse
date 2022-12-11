$(function () {
    setTimeout(function () {
        $('.preloader').fadeOut();
    }, 500);

    var win = navigator.platform.indexOf('Win') > -1;
    if (win && document.querySelector('#sidenav-scrollbar')) {
        var options = {
            damping: '0.5'
        }
        Scrollbar.init(document.querySelector('#sidenav-scrollbar'), options);
    }

    $('body').tooltip({ selector: '[data-toggle="tooltip"]', placement: 'left' });

    $('a[data-bs-toggle="tab"]').on('shown.bs.tab', function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
        $('.main-content').animate({ scrollTop: 0 }, 500);
    });

    let toggle = document.getElementById('navbarToggle');
    toggle.click();

    $('.sidenav').on('mouseenter mouseleave', debounce(function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    }, 500));

    $('#navbarToggle').on('click', debounce(function () {
        $.fn.dataTable.tables({ visible: true, api: true }).columns.adjust();
    }, 500));

    backgroundImages();
});

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');

function changeBackground(id) {
    if (parseInt(localStorage.getItem("background-image")) != id) {
        localStorage.setItem("background-image", id);
    }
    else {
        localStorage.setItem("background-image", 0);
    }
    backgroundImages();
}

function backgroundImages() {
    $('body').removeClass('main-body secondary-body');
    if (parseInt(localStorage.getItem("background-image")) === 1) {
        $('body').addClass('main-body');
    }
    else if (parseInt(localStorage.getItem("background-image")) === 2) {
        $('body').addClass('secondary-body');
    }
    else {
        return true;
    }
}