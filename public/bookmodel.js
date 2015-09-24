
var Book = Parse.Object.extend("Book");

var BookList = Parse.Collection.extend({
		model: Book,
});

var Club = Parse.Object.extend("Club");
var Comment = Parse.Object.extend("Comment");


// var bookQuery = new Parse.Query(Book);
// 		bookQuery.equalTo("clubName", "funtown");
// 		bookQuery.first({
// 			success: function(book){
// 				console.log(book);
// 				var comment = new Comment();
// 				comment.set("by", "lrs2");
// 				comment.set("text", "hey hey im a comment lol");
// 				book.set("comments", [comment]);
// 				book.save();
// 				//rComponent.setState({possBooks: bresults});
// 			},
// 			error: function(error){
// 				console.log("Error: " + error.code + " " + error.message);
// 			}
// 		});


