var username = "";
var password = "";
var conversationList;
var conversationCount = 0;
var currentConvo = "";

var bodyHeight = window.innerHeight;
$('#parent').height(bodyHeight - ($('#parent').position().top));

$('#register').click(function() {
	username = $('#register_username').val();
	password = $('#register_password').val();
	$.ajax({
		type: "POST", 
		url: "/register", 
		data: {
				'user': username,
				'pass': password
		},
		statusCode: {
			202: function(data) {
				showChat(data);
			}, 
			400: function() {
				alert("No");
			}
		}
	});

});

$('#submit').click(function() {
	username = $('#login_username').val();
	password = $('#login_password').val();
	$.ajax({
		type: "POST", 
		url: "/conversation", 
		data: {
				'user': username,
				'pass': password
		},
		statusCode: {
			202: function(data) {
				showChat(data);
			}, 
			403: function() {
				alert("No");
			}
		}
	});
});

function showChat(data) {
	$('body').empty();
	$('body').append(
		$('<div>').attr('class', 'col s12 fullscreen').attr('id', 'pane')
	);
	$(".fullscreen").height(window.innerHeight);
	$("body").append('' +
		'<div class="fixed-action-btn" style="bottom: 45px; right: 24px;">' +
			'<a class="btn-floating btn-large red"><i class="large material-icons">chat</i></a>' +
			'<ul id="chat_area">'+
			'</ul>' +
		'</div>');

	for(var i = 0; i < data.conversations.length; i++) {
		$("#chat_area").append('<li id="'+data.conversations[i].conversation+'" class="convo-button"><a class="btn-floating blue">'+data.conversations[i].person.substring(0, 2).toUpperCase()+'</a></li>');
	}
	
	$("#chat_area").append('<li><a id="chat-button" class="btn-floating blue">+</a></li>');

	$("#chat-button").click(function() { 
		showNewConvo();
	});

	$('.convo-button').click(function() {
		 currentConvo = this.id;
		 console.log(currentConvo);
		 clearPane();
		 $("#pane").append(
				$('<div>')
					.attr('id', 'messageArea')
					.height(window.innerHeight*0.9)
					.css('overflow', 'scroll')
		);
		$("#pane").append(
				$('<div>')
					.attr('id', 'textArea')
					.height(window.innerHeight*0.1)
		);
		$("#textArea").append(''+
'  <div class="row"> ' +
'    <form class="col s12"> ' +
'      <div class="row"> ' +
'        <div class="input-field col s12"> ' +
'          <textarea id="textarea1" class="materialize-textarea"></textarea> ' +
'          <label for="textarea1">Press Enter to send</label> ' +
'        </div> ' +
'      </div> ' +
'    </form> ' +
'  </div> '
		);
	setInterval(function(){
		$.ajax({
			url: "/thread",
			type: "POST", 
			data: {
				"convoid": currentConvo
			},
			success: function(data){
				if (conversationCount < data.length) {
					update(data);
				}
			},
			dataType: "json"});
	}, 500);
	});


}

function showNewConvo() {
	clearPane();
	$("#pane").append('' +
		  '<div class="row">'+
			'<form class="col s12">'+
			  '<div class="row">' +
				'<div class="input-field col s12">' +
				  '<textarea id="textarea1" class="materialize-textarea"></textarea>' +
				  '<label for="textarea1">I want to talk to someone about...</label>' +
				'</div>' +
			  '</div>' +
			'</form>' +
		  '</div>' + 
		  '<a class="waves-effect waves-light btn">Let\'s Talk!</a>'
	);
}

function update(data) {
	console.log('update');
	console.log(conversationCount);
	for (var i = 0; i < data.length; i++) {
		addMessage(data[i+conversationCount]);
	}
	conversationCount = data.length;
}

function addMessage(data) {
	console.log('addMessage');
	console.log(username);
	if (data.sender === username) {
		addMessageFromSelf(data.message);
	} else {
		addMessageFromOthers(data.message);
	}
}

function addMessageFromOthers(message) {
	$("#messageArea").append('' +
	    '<div class="row">' +
		'	<div class="col s7">' +
		'	  <div class="card-panel deep-orange darken-4">' +
		'	    <span class="white-text">' +
					message +
		'	    </span>' +
		'	  </div>' +
		'	</div>' +
		'</div> '
	);
}

function addMessageFromSelf(message) {
	$("#messageArea").append('' +
	    '<div class="row">' +
		'	<div class="col s7 right-align offset-s4">' +
		'	  <div class="card-panel teal">' +
		'	    <span class="white-text">' +
		message +
		'	    </span>' +
		'	  </div>' +
		'	</div>' +
		'</div> '
	);
}

function clearPane() {
	$("#pane").empty();
}
