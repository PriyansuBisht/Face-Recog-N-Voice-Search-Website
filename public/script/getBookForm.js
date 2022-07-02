function getBook( book ) {
    var getBookForm = document.createElement("form");
    getBookForm.action = "/getBook";
    getBookForm.method = "GET";
    getBookForm.style.display = "none";

    var bookInfo = document.createElement("input");
    bookInfo.type = "text";
    bookInfo.value = book;
    bookInfo.name = "book";
    
    getBookForm.appendChild(bookInfo);
    document.body.appendChild(getBookForm);
    getBookForm.submit();
}