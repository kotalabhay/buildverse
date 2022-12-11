
$(function () {
    load();
});


function load() {
    $('#borrowed-list').DataTable({
        processing: true,
        destroy: true,
        ajax: {
            type: "POST",
            url: "/my_borrowed_books_data",
            headers: { 'X-CSRFToken': csrftoken },
            mode: 'same-origin',
            dataSrc: 'data'

        },
        lengthChange: true,
        pageLength: 5,
        lengthMenu: [
            [5, 10, 25, 50, 100],
            [5, 10, 25, 50, 100],
        ],
        searching: true,
        paging: true,
        info: true,
        language: {
            paginate: {
                previous: '<a href="#" class="pager">&#x25C2;</a>',
                next: '<a href="#" class="pager">&#x25B8;</a>'
            }
        },
        columns: [
            {
                data: "id",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.id != null) {
                            data = '<div class="text-bold text-capitalize">' + row.id + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "title",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.title != null) {
                            data = '<div class="text-bold text-capitalize">' + row.title + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "author",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.author != null) {
                            data = '<div class="text-bold text-capitalize">' + row.author + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "genre",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.genre != null) {
                            data = '';
                            for (let i = 0; i < row.genre.length; i++) {
                                if (i < 2) {
                                    data += '<div class="text-capitalize badge badge-secondary mb-1">' + row.genre[i].name + '</div><br />'
                                }
                                else {
                                    data += '<div class="text-capitalize badge badge-secondary">...</div>'
                                    break;
                                }
                            }
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "language",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.language != null) {
                            data = '';
                            for (let i = 0; i < row.language.length; i++) {

                                if (i < 2) {
                                    data += '<div class="text-capitalize badge badge-secondary mb-1">' + row.language[i].name + '</div><br />'
                                }
                                else {
                                    data += '<div class="text-capitalize badge badge-secondary">...</div>'
                                    break;
                                }
                            }
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "total_copies",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.total_copies != null) {
                            data = '<div class="text-bold text-capitalize">' + row.total_copies + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "available_copies",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.available_copies != null) {
                            data = '<div class="text-bold text-capitalize">' + row.available_copies + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "isbn",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.isbn != null) {
                            data = '<div class="text-bold text-capitalize">' + row.isbn + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },

        ],

        drawCallback: function () {
            $('.paginate_button', this.api().table().container()).on('click', function () {
                $('.main-content').animate({ scrollTop: 0 }, 500);
            });
        }
    });
}

