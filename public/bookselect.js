

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
	handleSearchChange: function(e){
		var searchString = e.target.value;
		this.setState({searchString: searchString});
		var rComp = this;
		if (searchString.length < 1){
			return;
		}
		$.ajax({
					type: "GET",
					data: {searchString: searchString},
					url: '/search',
					dataType: 'json'
				}).done(function(data) {
					console.log(data);
					var searchBooksList = [];
					for(var i = 0; i < data.length; i++){
						var bookId = data[i].ASIN[0];
						var maybeBook = _.select(rComp.props.possBooks, function(book){ return book.attributes.bookId === bookId;})[0];
						if (maybeBook){
							searchBooksList.push(maybeBook)
						} else {
							var book = new Book();
							book.set("title", data[i].ItemAttributes[0].Title[0]);
							book.set("author", data[i].ItemAttributes[0].Author[0]);
							book.set("bookId", data[i].ASIN[0]);
							book.set("picUrl", data[i].SmallImage[0].URL[0]);
							book.set("height", data[i].SmallImage[0].Height[0]["_"]);
							book.set("width", data[i].SmallImage[0].Width[0]["_"]);
							searchBooksList.push(book);
						}
					}
					rComp.setState({searchBooks: searchBooksList})

				});

	},
	render: function(){
		var booksFound = this.state.searchBooks.map(function(book){
			return (<div><BasicBookComp bookInfo={book}/></div>);

		});
		return (<div><SearchInput  onChange={this.handleSearchChange}/>{booksFound}</div>)
	}
});


var BasicBookComp = React.createClass({
	render: function(){
		return (<div> 
			<div>{this.props.bookInfo.attributes.title}</div>
			<div>{this.props.bookInfo.attributes.author}</div>


			</div>);
	}
});

var BooksMenu = React.createClass({
	getInitialState: function(){
		return {
			clubName: "funClub",
			
		}

	},
	render: function(){
		return (<div> <SearchComponent clubName={this.state.clubName} possBooks={this.state.possBooks}/> </div>);
	},
	componentDidMount: function(){
		var rComponent = this;
		var query = new Parse.Query(Club);
		query.equalTo("clubName", this.state.clubName);
		query.first({
			success: function(results){
				console.log("retrieved:", results);
		 		rComponent.setState({club: results});
			},
		 	error: function(error){
		 		console.log("Error: " + error.code + " " + error.message);
		 	}
		});

		var bookQuery = new Parse.Query(Book);
		query.equalTo("clubName", this.state.clubName);
		query.find({
			success: function(results){
				rComponent.setState({possBooks: results})

			},
			error: function(error){
				console.log("Error: " + error.code + " " + error.message);
			}
		});

		var query = new Parse.Query(Book);
		query.equalTo("clubId", this.state.clubId);
		query.find({
			success:function(results){
				rComponent.setState({possBooks: results});
			},
			error: function(error){
				console.log("Error: " + error.code + " " + error.message);
			}
		});
	}
});




React.render(
	<div>
	<BooksMenu/>
        </div>,
        document.getElementById("anchor")
      );