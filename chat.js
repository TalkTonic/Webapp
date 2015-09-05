var username = "";
var password = "";
var conversationList;

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
	console.log(data.conversations.length);
	$('body').empty();
	$('body').append(
		$('<div>').attr('class', 'row').append(
			$('<div>').attr('class', 'col s12 fullscreen').attr('id', 'pane')
		)
	);
	$(".fullscreen").height(window.innerHeight);
	$("body").append('' +
		'<div class="fixed-action-btn" style="bottom: 45px; right: 24px;">' +
			'<a class="btn-floating btn-large red"><i class="large material-icons">chat</i></a>' +
			'<ul id="chat_area">'+
			'</ul>' +
		'</div>');

	for(var i = 0; i < data.conversations.length; i++) {
		$("#chat_area").append('<li><a id="chat-button" class="btn-floating blue">'+data.conversations[i].person.substring(0, 2).toUpperCase()+'</a></li>');
	}
	
		$("#chat_area").append('<li><a id="chat-button" class="btn-floating blue">+</a></li>');


	$("#chat-button").click(function() { 
		showNewConvo();
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

function clearPane() {
	$("#pane").empty();
}
