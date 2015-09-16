
var EmailLogin = React.createClass({

	render: function(){
		var emailColor = this.props.validEmail ? "green" : "red";
		return (<div>
			<form> 
		<div><input type ="text" style={{color: emailColor}} onChange={this.props.onEmailChange} value={this.props.email} placeholder={"email"}> </input> </div>
		<div><input type= "password" onChange={this.props.onPasswordChange} value={this.props.password} placeholder={"password"}></input></div>
		</form>
			</div>)

	},
	
	onSignUp: function(e){
		e.preventDefault();
		console.log("submitted!");
		var user = new Parse.User();
		user.set("password", this.state.password);
		user.set("email", this.state.email);
		user.signUp(null, {
 		success: function(user) {
  			console.log("we have signed up", user);

  		},
  		error: function(user, error) {
    		// Show the error message somewhere and let the user try again.
    	alert("Error: " + error.code + " " + error.message);
  		}
		});

	},
	onLogin: function(e){
		e.preventDefault();
		console.log("log in!!!");
	}
});

//usernameLogin
// emailLogin
// clubName
//
var LogInType = React.createClass({
	render: function(){
		var logInStyle = newClubStyle = joinClubStyle = {};
		if (this.props.logInType === "logIn"){
			logInStyle = {color: "red"};
		} else if (this.props.logInType === "newClub"){
			newClubStyle = {color: "red"};
		} else {
			joinClubStyle = {color: "red"};
		}
		return (<div>
			<span style={logInStyle} onClick={this.props.changeLogInType.bind(this, "logIn")}> LogIn </span> 
			<span style={newClubStyle} onClick={this.props.changeLogInType.bind(this, "newClub")}> Make A New Club </span>
			<span style={joinClubStyle} onClick={this.props.changeLogInType.bind(this, "joinClub")}> Join A Club </span>
			</div>)
	}

});

// var NewClub = React.createClass({
// 	render: function() {

// 	}
// });


var EntryMenu = React.createClass({
	getInitialState: function(){
		return {email: "", password: "", 
				username: "", clubName: "",
				logInType: "logIn", 
				validEmail: false, validPassword: false, validUsername: false, validClubName: false};
	},
	render: function(){
			var email = (<EmailLogin  
							validEmail={this.state.validEmail} email={this.state.email} password={this.state.password} 
						onEmailChange={this.onEmailChange} onPasswordChange={this.onPasswordChange}/>);

			var userName = (<div><input type="text" onChange={this.onUsernameChange} value={this.state.username} placeholder={"username"}></input></div>);
			var inputsAndButtons = (<div></div>);
			if (this.state.logInType === "logIn"){
			inputsAndButtons = (<div>
				{email}
				<button onClick={this.onLogIn}>Log In </button>
				</div>);
			}	
			else if (this.state.logInType === "newClub"){
				inputsAndButtons = (
					<div>
					{email}
					{userName}
					<div><input type="text" onChange={this.onClubNameChange} value={this.state.clubName} placeholder={"club name"}></input></div>
					<button onClick={this.onNewClubSubmit}>Sign Up and Make a Club!</button>
					</div>);
			} else {
				inputsAndButtons = (
					<div> 
					{email}
					{userName}
					<button onClick={this.onJoinClubSubmit}>Check For Club Invitations </button>
					</div>
					);
			}
			return (<div>
				<LogInType logInType={this.state.logInType} changeLogInType={this.changeLogInType}/>
				{inputsAndButtons}
				</div>);
		
	},
	changeLogInType: function(type){
		this.setState({logInType: type});
		if (type != "newClub"){
			this.setState({clubName: ""});
		}
	},
	onEmailChange: function(e){
		var emailString = e.target.value;
		this.setState({validEmail: (emailString.indexOf('@') != -1)})
		this.setState({email: emailString});
	},
	onPasswordChange: function(e){
		var passwordString = e.target.value;
		this.setState({password: passwordString});
	},
	onClubNameChange: function(e){

	},
	onNewClubSubmit: function(e){

	},
	onJoinClubSubmit: function(e){

	},
	onLogInSubmit: function(e){

	}
});



