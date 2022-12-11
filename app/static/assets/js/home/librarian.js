

$(function () {
    load();
});


function load() {
    $('#librarian-list').DataTable({
        destroy: true,
        processing: true,
        ajax: {
            type: "GET",
            url: "/librarian_data",
            headers: { 'X-CSRFToken': csrftoken },
            mode: 'same-origin',
            dataSrc: 'data',

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
                data: "book_name",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.book_name != null) {
                            data = '<div class="text-bold text-capitalize">' + row.book_name + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "is_borrowed",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.is_borrowed != null) {
                            data = '<div class="text-bold text-capitalize">' + row.is_borrowed + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
            {
                data: "book_returned",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.book_returned != null) {
                            data = '<div class="text-bold text-capitalize">' + row.book_returned + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },
                        {
                data: "return_date",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.return_date != null) {
                            data = '<div class="text-bold text-capitalize">' + row.return_date + '</div>'
                        }
                        else {
                            data = '<div>-</div>'
                        }
                    }
                    return data;
                }
            },

            {
                data: "issue_date",
                render: function (data, type, row, meta) {
                    if (type === 'display') {
                        if (row.issue_date != null) {
                            data = '<div class="text-bold text-capitalize">' + row.issue_date + '</div>'
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


