
var userId = "leah";
var SearchInput = React.createClass({
	getInitialState: function(){
		return {};

	}, 
	render: function(){

	return (<div>
		<form> 
		<input type ="text"  onChange={this.props.onChange} value={this.props.filter_text}> </input>
		</form>
		</div>);
	}
});


var SearchComponent = React.createClass({
	getInitialState: function(){
		return {searchString: "",
			searchBooks: []
			}

	},
	// handleSearchChange: function(e){
	// 	var searchString = e.target.value;
	// 	this.setState({searchString: searchString});
	// 	var rComp = this;
	// 	if (searchString.length < 1){
	// 		return;
	// 	}
	// 	$.ajax({
	// 				type: "GET",
	// 				data: {searchString: searchString},
	// 				url: '/search',
	// 				dataType: 'json'
	// 			}).done(function(data) {
	// 				var searchBooksList = [];
	// 				for(var i = 0; i < data.length; i++){
	// 					var bookId = data[i].ASIN[0];
	// 					var maybeBook = _.select(rComp.props.possBooks, function(book){ return book.attributes.bookId === bookId;})[0];
	// 					if (maybeBook){
	// 						searchBooksList.push(maybeBook)
	// 					} else {
	// 						var book = createNewBook("funClub",
	// 												data[i].ItemAttributes[0].Title[0],
	// 												data[i].ItemAttributes[0].Author[0],
	// 												data[i].ASIN[0],
	// 												data[i].SmallImage[0].URL[0],
	// 												data[i].SmallImage[0].Height[0]["_"],
	// 												data[i].SmallImage[0].Width[0]["_"],
	// 												[]);
	// 						searchBooksList.push(book);
	// 					}
	// 				}
	// 				rComp.setState({searchBooks: searchBooksList})

	// 			});

	// },
	render: function(){
		var that = this;
		var booksFound = this.state.searchBooks.map(function(book){
			return (<div><BasicBookComp bookInfo={book} onVote={that.props.onVote} bookVotes={that.props.bookVotes}/></div>);

		});
		return (<div><SearchInput  onChange={this.handleSearchChange}/>{booksFound}</div>)
	}
});

var VoteButton = React.createClass({
	render: function(){
		var heartPic = "../public/blackheart.png";
		//var numberVotes = this.props.votes === undefined ? 0 : this.props.votes.length;
		var cleanVotes = this.props.votes === undefined ? [] : this.props.votes;
	if(cleanVotes.indexOf(userId) != -1){
		heartPic = "../public/redheart.png";
	} 
		return (<span onClick={this.props.onVote}>
			<img style={heartStyle} src={heartPic}></img> <span>{cleanVotes.length}</span>
			</span>);

	}
})


var BasicBookComp = React.createClass({
	render: function(){
		var bookId = this.props.bookInfo.attributes.bookId;
		var votesList = this.props.bookVotes[bookId];
		return (<div style={basicBookBoxStyle}> 
			<img src={this.props.bookInfo.attributes.picUrl}> </img>
			<span style={bookTitleStyle}>{this.props.bookInfo.attributes.title}</span>
			<div style={bookAuthorStyle}>{this.props.bookInfo.attributes.author}
			<VoteButton votes={votesList} onVote={this.props.onVote.bind(this, bookId, this.props.bookInfo)}/></div>
			</div>);
	}
});


// var booksFound = this.state.searchBooks.map(function(book){
// 			return (<div><BasicBookComp bookInfo={book} onVote={that.props.onVote} bookVotes={that.props.bookVotes}/></div>);

// 		});
// 		return (<div><SearchInput  onChange={this.handleSearchChange}/>{booksFound}</div>)

var PotentialBooksList = React.createClass({
	render: function(){
		var booksList = this.props.possBooks.map(function(book){
			return (<div> <BasicBookComp> bookInfo={book} </div>);
		});
		
	}
});


var BooksMenu = React.createClass({
	getInitialState: function(){
		return {
			clubName: "funClub",
			club: undefined,
			possBooks: [],
			bookVotes: {}
			
		}

	},
	render: function(){
		return (<div> <SearchComponent clubName={this.state.clubName} possBooks={this.state.possBooks} onVote={this.onVote} bookVotes={this.state.bookVotes}/> 
				<PotentialBooksList possBooks={this.state.possBooks} />
			</div>);
	},
	componentDidMount: function(){
		var rComponent = this;
		var query = new Parse.Query(Club);
		query.equalTo("clubName", "funClub");
		query.find({
			success: function(results){
				rComponent.setState({club: results[0]});
			}
		})

		var bookQuery = new Parse.Query(Book);
		bookQuery.equalTo("clubName", "funClub");
		bookQuery.find({
			success: function(bresults){
				// var possArray = [];
				// for (var i =0; i< bresults.length; i++){
				// 	if (bresults[i].attributes.votes && bresults[i].attributes.votes.length > 0){
				// 		possArray.push(bresults[i]);
				// 	}
				// }
				rComponent.setState({possBooks: bresults});
				var votes = {};
				for(var i=0; i< bresults.length; i++){
					var bookInfo = bresults[i].attributes;
					if (bookInfo.votes != undefined && bookInfo.votes.length){
						votes[bookInfo.bookId] = bookInfo.votes;
					}
				}
				rComponent.setState({bookVotes: votes});

			},
			error: function(error){
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	},
	onVote: function(bookId, bookInfo){
		var oldVotes = this.state.bookVotes[bookId] === undefined ? [] : this.state.bookVotes[bookId];
		var newVotes = []
		if (_.indexOf(oldVotes, userId) >=0){
			newVotes = _.without(oldVotes, userId);
		} else {
			newVotes.push(userId);
		}
		var addOn = {}
		addOn[bookId] = newVotes;
		var newBookVotes = _.extend(this.state.bookVotes, addOn);
		this.setState(newBookVotes);
		bookInfo.set("votes", newVotes);
		bookInfo.save();
		 if (newVotes.length === 0){
		 	this.setState({possBooks: _.without(this.state.possBooks, _.findWhere(this.state.possBooks, {bookId: bookId}))});
			bookInfo.destroy();
			console.log("destroying");
		} 
		else if (newVotes.length === 1){
		}
		else {

		}
		// 	console.log("saving");
		// 	bookAtt = bookInfo.attributes;
		// 	// var newBookInfo = createNewBook(this.state.clubName, bookAtt.title, bookAtt.author, bookAtt.bookId, bookAtt.picUrl, bookAtt.height, bookAtt.width, newVotes);
		// 	// bookInfo.save({success: function(){

		// 	// },
		// 	// error: function(er){
		// 	// 	var newBookInfo = createNewBook(this.state.clubName, bookAtt.title, bookAtt.author, bookAtt.bookId, bookAtt.picUrl, bookAtt.height, bookAtt.width, newVotes);
		// 	// 	newBookInfo.save();
		// 	// }});
		// }
	}
});




React.render(
	<div>
	<BooksMenu/>
        </div>,
        document.getElementById("anchor")
      );