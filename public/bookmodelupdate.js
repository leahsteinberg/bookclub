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


var updateBookStoreAfterVote = function(that, newVotes, bookInfo){
	// var addOn = {}
	var bookId = bookInfo.attributes.bookId;
	// addOn[bookId] = newVotes;
	// var newBookVotes = _.extend(that.state.bookVotes, addOn);
	// that.setState(newBookVotes);

	bookInfo.set("votes", newVotes);
	bookInfo.save();
	if (newVotes.length === 0){
			that.setState({possBooks: _.select(that.state.possBooks, function(book){ return book.attributes.bookId != bookId;}) })
			console.log("removing", bookInfo);
			bookInfo.destroy();
	}else if (newVotes.length === 1){
				// add to possBooks
			that.setState({possBooks: [bookInfo].concat(that.state.possBooks)});
				// remove from search Books
			that.setState({searchBooks: _.select(that.state.searchBooks, function(book){ return book.attributes.bookId != bookId;}) })
	}
}


var createNewBookFromInfo = function(bookInfo){
	var info = bookInfo.attributes;
	return createNewBook(info.title, info.author, info.bookId, info.picUrl, info.height, info.width, info.votes);

}


// var updateVotesOnParse = function(newVotes){ // deprecated I think
// 	return function(bookObj, bookInfo){
// 		if (bookObj === undefined){
// 			bookObj = bookInfo;

// 		} else {
// 			bookObj.set("votes", newVotes);
// 		}
// 		bookObj.save();
// 	}
// }


// var getBookFromParseAndUpdate = function(bookInfo, callback){
// 	var bookQuery = new Parse.Query(Book);
// 	bookQuery.equalTo("bookId", bookId);
// 	bookQuery.first({
// 		success: function(bresults){
// 			callback(bresults, bookInfo);
// 		},
// 		error: function(error){
// 		console.log("Error: " + error.code + " " + error.message);
// 		}
// 	});


// }