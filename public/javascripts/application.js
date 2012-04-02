var ccd = {
	// Create this closure to contain the cached modules
	module: function() {
		// Internal module cache.
		var modules = {};

		// Create a new module reference scaffold or load an
		// existing module.
		return function(name) {
			// If this module has already been created, return it.
			if (modules[name]) {
				return modules[name];
			}

			// Create a module and save it under this name
			return modules[name] = { /*Views: {}*/ };
		};
	}(),
	templates: {
		you: '<div class="plate <%= colorClass %>" date-phase="<%= data.phase %>" id="<%= data._id %>" style="background: <%= data.phase %>;">\
				<div class="name"><%= data.login %></div>\
				<div class="day"><%= data.day %></div>\
				<button data-role="increase-day">+</button>\
			</div>'
		}
};
