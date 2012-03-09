$(document).ready(function() {
	var devapp = new App();
	var panel = $('<panel id="devpanel">');
	$('<button>Re-List All</button>').click(devapp.listAll).appendTo(panel);
	$('<button>Wipe Out</button>').click(function() {$('.plate').remove();}).appendTo(panel);
	$('<button>Toggle Join Form</button>').click(function() {
			$('#joinform').toggle();
		}).appendTo(panel);
	$('body').append(panel);
});
