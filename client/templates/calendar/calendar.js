Session.setDefault('editing_calevent', null);
Session.setDefault('showEditEvent', false);
Session.setDefault('lastMod', null);

Template.calendar.rendered = function () 
{
	$('#calendar').fullCalendar({
		dayClick: function(date, jsEvent, view) 
		{						
			CalEvents.insert({title:'New Event',start:date.format(),end:date.format()});
			Session.set('lastMod', new Date());        
		},
		eventClick: function(calEvent, jsEvent, view) 
		{
		},
		events: function(start, end, timezone, callback) 
		{			
			var events =[];
			calEvents =CalEvents.find();
			calEvents.forEach(function (evt) {
				events.push({
					id:evt._id,
					title:evt.title,
					start:evt.start,
					end:evt.end
				});
			});

			callback(events);    	
		}

	});
}

Template.calendar.helpers({
	lastMod: function () {
		console.log(Session.get('lastMod'));
		$('#calendar').fullCalendar( 'refetchEvents');
		return Session.get('lastMod');
	}
});

