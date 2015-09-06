var username = "";
var password = "";
var conversationList;
var conversationCount = 0;
var currentConvoCount = 0;
var currentConvo = "";
var convoLoop;
var convoConnect;
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
	$('<div>').attr('class', 'col s12 fullscreen').attr('id', 'pane'));
	$(".fullscreen").height(window.innerHeight);
	$("body").append('' +
		'<div class="fixed-action-btn" style="bottom: 45px; right: 24px;">' +
		'<a class="btn-floating btn-large red"><i class="large material-icons">chat</i></a>' +
		'<ul id="chat_area">' +
		'</ul>' +
		'</div>');
	if (data.conversations !== undefined) {
		for (var i = 0; i < data.conversations.length; i++) {
			$("#chat_area").append('<li id="' + data.conversations[i].conversation + '" class="convo-button"><a class="btn-floating blue">' + data.conversations[i].person.substring(0, 2).toUpperCase() + '</a></li>');
		}
	}

	if (data.conversations === undefined) {
		currentConvoCount = 0;
	} else {
		currentConvoCount = data.conversations.length;
	}

	$("#chat_area").append('<li><a id="chat-button" class="btn-floating blue">+</a></li>');

	$("#chat-button").click(function() {
		showNewConvo();
	});

	$('.convo-button').click(function() {
		currentConvo = this.id;
		clearPane();
		$("#pane").append(
		$('<div>')
			.attr('id', 'messageArea')
			.height(window.innerHeight * 0.9)
			.css('overflow', 'scroll'));
		$("#pane").append(
		$('<div>')
			.attr('id', 'textArea')
			.height(window.innerHeight * 0.1));
		$("#textArea").append('' +
			' <div class="row"> ' +
			'   <div class="input-field col s6"> ' +
			'     <input id="message_body" type="text" class="validate"> ' +
			'     <label class="active" for="message_body">First Name</label> ' +
			'   </div> ' +
			' </div> ');

		$("#message_body").keydown(function(e) {
			if (e.keyCode == 13) {
				$.ajax({
					url: "/send",
					type: "POST",
					data: {
						"message": $("#message_body").val(),
						"sender": username,
						"convoid": currentConvo
					}
				});
				$("#message_body").val('');
			}
		});
		convoLoop = setInterval(function() {
			$.ajax({
				url: "/thread",
				type: "POST",
				data: {
					"convoid": currentConvo
				},
				success: function(data) {
					if (conversationCount < data.length) {
						update(data);
					}
				},
				dataType: "json"
			});
		}, 500);
	});


}

function showNewConvo() {
	clearPane();
	$("#pane").append('' +
		'<div class="row">' +
		'<form class="col s12">' +
		'<div class="row">' +
		'<div class="input-field col s12">' +
		'<textarea id="interests" class="materialize-textarea"></textarea>' +
		'<label for="interests">I want to talk to someone about...</label>' +
		'</div>' +
		'</div>' +
		'</form>' +
		'</div>' +
		'<a id="lets_talk" class="waves-effect waves-light btn">Let\'s Talk!</a>');
	$("#lets_talk").click(function() {
		console.log('clicked');
		var strings = $("#interests").val()
		$.ajax({
			url: "/create",
			type: "POST",
			data: {
				"user": username,
				"interests": strings
			}
		})
		clearPane();

		convoConnect = setInterval(function() {
			console.log('loop');
			$.ajax({
				url: "/conversation",
				type: "POST",
				data: {
					'user': username,
					'pass': password
				},
				success: function(data) {
					if (data.length > currentConvoCount) {
						clearInterval(convoConnect);
						showChat(data);
					}
				}
			});
		}, 5000);
	});
}

function update(data) {
	for (var i = 0; i < data.length - conversationCount; i++) {
		addMessage(data[i + conversationCount]);
	}
	conversationCount = data.length;
}

function addMessage(data) {
	if (data.sender === username) {
		addMessageFromSelf(data.message);
	} else {
		addMessageFromOthers(data.message);
	}
	$("#messageArea").scrollTop($("#messageArea")[0].scrollHeight);
}

var _id = 0;

function addMessageFromOthers(message) {
	$("#messageArea").append('' +
		'<div class="row hidden" id="' + _id + '">' +
		'	<div class="col s7">' +
		'	  <div class="card-panel deep-orange darken-4">' +
		'	    <span class="white-text">' + message +
		'	    </span>' +
		'	  </div>' +
		'	</div>' +
		'</div> ');

	$("#" + _id).fadeIn(800);
	_id += 1;
}

function addMessageFromSelf(message) {
	$("#messageArea").append('' +
		'<div class="row hidden" id="' + _id + '">' +
		'	<div class="col s7 right-align offset-s4">' +
		'	  <div class="card-panel teal">' +
		'	    <span class="white-text">' + message +
		'	    </span>' +
		'	  </div>' +
		'	</div>' +
		'</div> ');
	$("#" + _id).fadeIn(800);
	_id += 1;
}

function clearPane() {
	$("#pane").empty();
	clearInterval(convoLoop);
}
