
var SearchInput = React.createClass({
	getInitialState: function(){
		return {};

	}, 
	render: function(){

	return (<div style={searchBarStyle}>
		<form> 
		<input  type ="text"  onChange={this.props.onChange} value={this.props.filter_text}> </input>
		</form>
		</div>);
	}
});


var SearchComponent = React.createClass({
	render: function(){
		var that = this;
		var booksFound = this.props.searchBooks.map(function(book){
			return (<div><BasicBookComp bookInfo={book} onVote={that.props.onVote} /></div>);

		});
		return (<div><SearchInput  onChange={this.props.handleSearchChange}/>{booksFound}</div>)
	}
});

var VoteButton = React.createClass({
	render: function(){
		var heartPic = "../public/blackheart.png";
		var cleanVotes = this.props.votes === undefined ? [] : this.props.votes;
	if(cleanVotes.indexOf(this.props.username) != -1){
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
		var votesList = this.props.bookInfo.attributes.votes;// from search its bookVotes, but from potential its votes
		return (<div style={basicBookBoxStyle}> 
			<span><img src={this.props.bookInfo.attributes.picUrl}> </img></span>
			<span style={bookTitleStyle}> {this.props.bookInfo.attributes.title}
			<div style={bookAuthorStyle}> {this.props.bookInfo.attributes.author}
			<VoteButton votes={votesList} onVote={this.props.onVote.bind(this, bookId, this.props.bookInfo)} username={this.props.username}/></div></span>
			</div>);
	}
});

var PossibleBookComp = React.createClass({
	render: function(){
		return (<div><BasicBookComp bookInfo={this.props.bookInfo} onVote={this.props.onVote}
			 username={this.props.username} style={this.props.style} /></div>);
	}
})

var PotentialBooksList = React.createClass({
	render: function(){

		var that = this;
		var booksList = this.props.possBooks.map(function(book){
				if (that.props.searchAndPoss[book.attributes.bookId]){
			return (<div  style={possBooksSearchStyle}> <PossibleBookComp bookInfo={book} onVote={that.props.onVote} username={that.props.username}/> </div>);
				} else {
			return (<div  style={possBooksStyle}> <PossibleBookComp bookInfo={book} onVote={that.props.onVote} username={that.props.username}/> </div>);
		}
		});
		return (<div style={potentialBooksStyle} >{booksList}</div>)
		
	}
});


var BooksMenu = React.createClass({
	getInitialState: function(){
		return {
			clubName: "funClub",
			club: undefined,
			possBooks: [],
			searchBooks: [],
			searchAndPoss: {},
			username: ""
		}

	},
	render: function(){

		return (<div style={booksWrapperStyle}><SearchComponent style={searchCompStyle}clubName={this.state.clubName} possBooks={this.state.possBooks} onVote={this.onVote} 
			handleSearchChange={this.handleSearchChange} searchBooks={this.state.searchBooks}/> 
				<PotentialBooksList possBooks={this.state.possBooks} onVote={this.onVote} searchAndPoss={this.state.searchAndPoss} username={this.state.username}/>
			
			</div>);
	},
	componentWillMount:function(){
		var rComponent = this;
		var currentUser = Parse.User.current();
		if(currentUser){
			this.setState({currentUser: currentUser, username: currentUser.attributes.username});
		}
	},
	componentDidMount: function(){
		var rComponent = this;
		var query = new Parse.Query(Club);
		query.equalTo("clubName", currentUser.attributes.clubName);
		query.find({
			success: function(results){
				rComponent.setState({club: results[0]});
			}
		});
		var bookQuery = new Parse.Query(Book);
		bookQuery.equalTo("clubName", currentUser.attributes.clubName);
		bookQuery.find({
			success: function(bresults){
				console.log(bresults);
				rComponent.setState({possBooks: bresults});
			},
			error: function(error){
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	},
	handleSearchChange: function(e){
		var searchString = e.target.value;
		this.setState({searchString: searchString});
		var rComp = this;
		if (searchString.length < 1){
			rComp.setState({searchBooks: []});
			rComp.setState({searchAndPoss: {}});
			return;
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
					if (data[i].ItemAttributes != undefined && data[i].ItemAttributes.length && data[i].ItemAttributes[0].Author){
					var book = createNewBook(rComp.state.currentUser.attributes.clubName,
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
			}
			rComp.setState({searchBooks: searchBooksList, searchAndPoss: topPoss, possBooks: searchAtTopOfPossBooks(rComp.state.possBooks, topPoss)});
		});

	},
	onVote: function(bookId, bookInfo){
		var oldVotes = bookInfo.attributes.votes === undefined ? [] : bookInfo.attributes.votes;
		var newVotes = []
		if (_.indexOf(oldVotes, this.state.username) >=0){
			newVotes = _.without(oldVotes, this.state.username);
		} else {
			newVotes.push(this.state.username);
		}
		updateBookStoreAfterVote(this, newVotes, bookInfo);
	}
});

