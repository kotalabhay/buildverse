function pagination(response) {
    if (response.page_data != null) {
        page_number = parseInt(response.page_data.number);
        if (response.page_data.num_pages != null && response.page_data.num_pages != response.page_data.number) {
            total_page_number = response.page_data.num_pages;
        }
        else {
            total_page_number = response.page_data.number;
        }
        let previous_total = 1;
        if (total_page_number > 7) {
            previous_total = total_page_number - 6;
        }
        else {
            previous_total = total_page_number;
        }
        let next_start = 1;
        if (total_page_number < 7) {
            next_start = total_page_number;
        }
        else {
            next_start = 7;
        }
        let previous_current_page_number = page_number - 2;
        let next_current_page_number = page_number + 2;

        let footer_html = '';
        footer_html = footer_html +
            '<li class="pager" onclick="previous_paginate()"><a href="#" data-page="1">‹</a></li>'

        if (page_number <= next_start) {
            for (let i = 1; i <= next_start; i++) {
                if (i === page_number) {
                    footer_html = footer_html +
                        '<li class="active" onclick="paginate(' + i + ')"><a href="#" data-page="' + i + '">' + i + '</a></li>'
                }
                else {
                    footer_html = footer_html +
                        '<li onclick="paginate(' + i + ')"><a href="#" data-page="' + i + '">' + i + '</a></li>'
                }
            }
            if (total_page_number > 7) {
                footer_html = footer_html +
                    '<li class="ellipsis"><a href="#">…</a></li><li onclick="paginate(' + total_page_number + ')"><a href="#" data-page="' + total_page_number + '">' + total_page_number + '</a></li>'
            }
        }
        else if (page_number > next_start && page_number < previous_total) {
            footer_html = footer_html +
                '<li onclick="paginate(1)"><a href="#" data-page="1">1</a></li><li class="ellipsis"><a href="#">…</a></li>'
            for (let i = previous_current_page_number; i <= next_current_page_number; i++) {
                if (i === page_number) {
                    footer_html = footer_html +
                        '<li class="active" onclick="paginate(' + i + ')"><a href="#" data-page="' + i + '">' + i + '</a></li>'
                }
                else {
                    footer_html = footer_html +
                        '<li onclick="paginate(' + i + ')"><a href="#" data-page="' + i + '">' + i + '</a></li>'
                }
            }
            footer_html = footer_html +
                '<li class="ellipsis"><a href="#">…</a></li><li onclick="paginate(' + total_page_number + ')"><a href="#" data-page="' + total_page_number + '">' + total_page_number + '</a></li>'
        }
        else if (page_number >= previous_total) {
            footer_html = footer_html +
                '<li onclick="paginate(1)"><a href="#" data-page="1">1</a></li><li class="ellipsis"><a href="#">…</a></li>'
            for (let i = previous_total; i <= total_page_number; i++) {
                if (i === page_number) {
                    footer_html = footer_html +
                        '<li class="active" onclick="paginate(' + i + ')"><a href="#" data-page="' + i + '">' + i + '</a></li>'
                }
                else {
                    footer_html = footer_html +
                        '<li onclick="paginate(' + i + ')"><a href="#" data-page="' + i + '">' + i + '</a></li>'
                }
            }
        }
        else {
            return false;
        }

        footer_html = footer_html +
            '<li class="pager" onclick="next_paginate()"><a href="#" data-page="2">›</a></li>'
        document.getElementById("table-footer").innerHTML = footer_html;
    }
    document.getElementById("table-info").innerHTML = '<div>Showing ' + page_number + ' of ' + total_page_number + ' entries</div>'
}

function psuedoClick(parentElem) {
    let beforeClicked,
        afterClicked;

    let parentLeft = parseInt(parentElem.getBoundingClientRect().left, 10),
        parentTop = parseInt(parentElem.getBoundingClientRect().top, 10);

    let parentWidth = parseInt(window.getComputedStyle(parentElem).width, 10),
        parentHeight = parseInt(window.getComputedStyle(parentElem).height, 10);

    let before = window.getComputedStyle(parentElem, ':before');

    let beforeStart = parentLeft + (parseInt(before.getPropertyValue("left"), 10)),
        beforeEnd = beforeStart + parseInt(before.width, 10);

    let beforeYStart = parentTop + (parseInt(before.getPropertyValue("top"), 10)),
        beforeYEnd = beforeYStart + parseInt(before.height, 10);

    let after = window.getComputedStyle(parentElem, ':after');

    let afterStart = parentLeft + (parseInt(after.getPropertyValue("left"), 10)),
        afterEnd = afterStart + parseInt(after.width, 10);

    let afterYStart = parentTop + (parseInt(after.getPropertyValue("top"), 10)),
        afterYEnd = afterYStart + parseInt(after.height, 10);

    let mouseX = event.clientX,
        mouseY = event.clientY;

    beforeClicked = (mouseX >= beforeStart && mouseX <= beforeEnd && mouseY >= beforeYStart && mouseY <= beforeYEnd ? true : false);

    afterClicked = (mouseX >= afterStart && mouseX <= afterEnd && mouseY >= afterYStart && mouseY <= afterYEnd ? true : false);

    return {
        "before": beforeClicked,
        "after": afterClicked

    };
}

function paginate(no) {
    page_number = no;
    load(search, page_number, length, position, position_column_name);
}

function previous_paginate() {
    let previous_no = page_number - 1;
    if (previous_no < 1) {
        return false;
    }
    else {
        page_number = previous_no;
        load(search, page_number, length, position, position_column_name);
    }
}

function next_paginate() {
    let next_no = page_number + 1;
    if (next_no > total_page_number) {
        return false;
    }
    else {
        page_number = next_no;
        load(search, page_number, length, position, position_column_name);
    }
}

$('#table-search').on('keyup', function () {
    search = $(this).val();
    load(search, 1, length, position, position_column_name);
});

$('#table-dropdown').on('change', function () {
    length = $(this).val();
    load(search, page_number, length, position, position_column_name);
});

$('.table-sort').before().click(function () {
    position_column_name = $(this).data("value");
    if (psuedoClick(this).before === true) {
        position = 'desc';
        load(search, page_number, length, position, position_column_name);
    }
    else {
        position = 'asc';
        load(search, page_number, length, position, position_column_name);
    }
});