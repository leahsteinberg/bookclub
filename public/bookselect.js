
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

	
	render: function(){
		var that = this;
		var booksFound = this.props.searchBooks.map(function(book){
			return (<div><BasicBookComp bookInfo={book} onVote={that.props.onVote} bookVotes={that.props.bookVotes}/></div>);

		});
		return (<div><SearchInput  onChange={this.props.handleSearchChange}/>{booksFound}</div>)
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
			<span><img src={this.props.bookInfo.attributes.picUrl}> </img></span>
			<span style={bookTitleStyle}> {this.props.bookInfo.attributes.title}
			<div style={bookAuthorStyle}> {this.props.bookInfo.attributes.author}
			<VoteButton votes={votesList} onVote={this.props.onVote.bind(this, bookId, this.props.bookInfo)}/></div></span>
			</div>);
	}
});



var PotentialBooksList = React.createClass({
	render: function(){

		var that = this;
		var booksList = this.props.possBooks.map(function(book){
				if (that.props.searchAndPoss[book.attributes.bookId]){
			return (<div  style={possBooksSearchStyle}> <BasicBookComp bookInfo={book} onVote={that.props.onVote} bookVotes={that.props.bookVotes}/> </div>);

				} else {

			return (<div  style={possBooksStyle}> <BasicBookComp bookInfo={book} onVote={that.props.onVote} bookVotes={that.props.bookVotes}/> </div>);
		}
		});
		return (<div>{booksList}</div>)
		
	}
});


var BooksMenu = React.createClass({
	getInitialState: function(){
		return {
			clubName: "funClub",
			club: undefined,
			possBooks: [],
			searchBooks: [],
			bookVotes: {},
			searchAndPoss: {}
		}

	},
	render: function(){
		return (<div> <SearchComponent clubName={this.state.clubName} possBooks={this.state.possBooks} onVote={this.onVote} bookVotes={this.state.bookVotes} handleSearchChange={this.handleSearchChange} searchBooks={this.state.searchBooks}/> 
				<PotentialBooksList possBooks={this.state.possBooks} onVote={this.onVote} bookVotes={this.state.bookVotes} searchAndPoss={this.state.searchAndPoss}/>
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
				console.log(bresults);
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

	handleSearchChange: function(e){
		var searchString = e.target.value;
		console.log("handle search", searchString);
		this.setState({searchString: searchString});
		var rComp = this;
		if (searchString.length < 1){
			rComp.setState({searchBooks: []});
			rComp.setState({searchAndPoss: {}});
		}
		$.ajax({
			type: "GET",
			data: {searchString: searchString},
			url: '/search',
			dataType: 'json'
		}).done(function(data) {
			var searchBooksList = [];
			var topPoss = {};
			for(var i = 0; i < data.length; i++){
				var bookId = data[i].ASIN[0];
				var maybeBook = _.select(rComp.state.possBooks, function(book){ return book.attributes.bookId === bookId;})[0];
				if (maybeBook){ // we already have the book.
					topPoss[maybeBook.attributes.bookId]= true;
				} else {
					var book = createNewBook("funClub",
								data[i].ItemAttributes[0].Title[0],
								data[i].ItemAttributes[0].Author[0],
								data[i].ASIN[0],
								data[i].SmallImage[0].URL[0],
								data[i].SmallImage[0].Height[0]["_"],
								data[i].SmallImage[0].Width[0]["_"],
								[]);
					searchBooksList.push(book);
				}
			}
			rComp.setState({searchBooks: searchBooksList});
			rComp.setState({searchAndPoss: topPoss});

			//if (topPossList){
				var newi = searchAtTopOfPossBooks(rComp.state.possBooks, topPoss);
				rComp.setState({possBooks: newi});
			//}

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
		updateBookStoreAfterVote(this, newVotes, bookInfo);
	}
});




React.render(
	<div>
	<BooksMenu/>
        </div>,
        document.getElementById("anchor")
      );