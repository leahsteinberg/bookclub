// var updateVotesOnParse = function(bookId, newVotes){
// 	console.log("new func", bookId, newVotes);
// 	var bookQuery = new Parse.Query(Book);
// 	bookQuery.equalTo("bookId", bookId);
// 	bookQuery.first({
// 		success: function(bresults){
// 			console.log("IN NEW FUNCT", bresults);
// 			if (bresults === undefined){
				

// 			} else {
				

// 			}

// 		},
// 		error: function(error){
// 		console.log("Error: " + error.code + " " + error.message);
// 		}
// 	});

// }

var searchAtTopOfPossBooks = function(poss, search){
	var inSearch = function(book){
		return search[book.attributes.bookId];
	}
	var twoArrays = _.partition(poss, inSearch);
	return twoArrays[0].concat(twoArrays[1]);
}

var createNewBook = function(clubName, title, author, bookId, picUrl, height, width, votes){
	var book = new Book();
	book.set("clubName", clubName);
	book.set("title", title);
	book.set("author", author);
	book.set("bookId", bookId);
	book.set("picUrl", picUrl);
	book.set("height", height);
	book.set("width", width);
	book.set("votes", votes);
	return book;

}



var createNewBookFromInfo = function(bookInfo){
	var info = bookInfo.attributes;
	return createNewBook(info.title, info.author, info.bookId, info.picUrl, info.height, info.width, info.votes);

}


var updateVotesOnParse = function(newVotes){
	return function(bookObj, bookInfo){
		if (bookObj === undefined){
			bookObj = bookInfo;

		} else {
			bookObj.set("votes", newVotes);
		}
		bookObj.save();
	}
}


var getBookFromParseAndUpdate = function(bookInfo, callback){
	var bookQuery = new Parse.Query(Book);
	bookQuery.equalTo("bookId", bookId);
	bookQuery.first({
		success: function(bresults){
			callback(bresults, bookInfo);
		},
		error: function(error){
		console.log("Error: " + error.code + " " + error.message);
		}
	});


}