var MySampleApp = {
	init: function (window, document, $, Handlebars) {
		var phoneContactsData = [],
				phoneContactTemplate = Handlebars.compile($("#phone-contacts-partial").html())

		var getPhoneContacts = function() {
			var options = new ContactFindOptions();
			options.filter = "";
			options.multiple = true;
			//options.hasPhoneNumber = true;
			var filter = ["displayName", "phoneNumbers", "emails"];
			navigator.contacts.find(filter, onContactsFetchSuccess, onContactsFetchError, options);
		};

		// get contact information for all contacts
		var onContactsFetchSuccess = function(contacts) {
			for (var i = 0; i < contacts.length; i++) {
				if(contacts[i].displayName !== null){
					if(contacts[i].phoneNumbers !== null){
						for(var j=0; j<contacts[i].phoneNumbers.length;j++){
							//select number only if it's mobile number
							if(contacts[i].phoneNumbers[j].type === 'mobile'){
								if(contacts[i].emails !== null){
									for(var k=0; k < contacts[i].emails.length; k++){
										phoneContactsData.push({'name' : contacts[i].displayName, 'number': contacts[i].phoneNumbers[j].value, 'email':contacts[i].emails[k].value});
										break;
									}
								} else {
									phoneContactsData.push({'name' : contacts[i].displayName, 'number': contacts[i].phoneNumbers[j].value});
								}
								break;
							}
						}
					}else{
						if(contacts[i].emails !== null){
							for(var k=0; k < contacts[i].emails.length; k++){
								phoneContactsData.push({'name' : contacts[i].displayName, 'number': '', 'email':contacts[i].emails[k].value});
								break;
							}
						}
					}
				}
			}
			window.console.log(contacts.length + " <- total Found === good number -> "+ phoneContactsData.length);
			showContactsInfo();
		 };

		var onContactsFetchError  = function(contactError) {
			$('#contacts-msg').text(contactError);
		};

		var showContactsInfo = function(){
			window.console.log('show contacts page')
			$('#phonecontactslist').empty();
			var html;
			var contactsObj = {};

			$('#phoneContactFilter').show();
			contactsObj = {contacts:phoneContactsData};
			html = phoneContactTemplate(contactsObj);
			$('#phonecontactslist').append(html);
			$('#phonecontactslist').trigger("create");
			$.mobile.changePage("#phone-contacts-view", {transition : "left"}, false);
		};

		var addEventsListeners = function() {
			//clearEventsAfterSignIn();
			$('body')
				.off('tap', '#get-phone-contacts').on('tap', '#get-phone-contacts', getPhoneContacts)
				$('#phoneContactFilter').on('keyup', function() {
					var query = (this.value).toLowerCase();
					$(':checkbox').each(function(i, elem) {
						if (elem.value.indexOf(query) != -1) {
							$(this).closest('div').show();
						}else{
							$(this).closest('div').hide();
						}
					});
				});
		};

		Handlebars.registerHelper('toLowerCase', function(str) {
			if(str === null){ window.console.log(str); return}
		  else{
		  	return str.toLowerCase();
		  }
		});

		addEventsListeners();
	}
};