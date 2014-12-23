Session.setDefault('editing_calevent', null);
Session.setDefault('showEditEvent', false);
Session.setDefault('lastMod', null);

Template.calendar.rendered = function () 
{
	$('#calendar').fullCalendar({
		dayClick: function(date, jsEvent, view){						
			CalEvents.insert({title:'New Event',start:date.format(),end:date.format()});
			Session.set('lastMod', new Date());        
		},
		eventClick: function(calEvent, jsEvent, view){
			Session.set('editing_calevent',calEvent.id);
			Session.set('showEditEvent',true);
		},
		eventDrop: function(calEvent){
			//console.log(calEvent.id,calEvent.start.format(),calEvent.end.format());
			CalEvents.update(calEvent.id,{$set: {start:calEvent.start.format(), end:calEvent.end.format()}})
		},
		events: function(start, end, timezone, callback){			
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
		},
		editable: true


	});
}

Template.calendar.helpers({
	lastMod: function () {		
		$('#calendar').fullCalendar( 'refetchEvents');
		return Session.get('lastMod');
	},
	showEditEvent: function(){			
		return Session.get('showEditEvent');
	}
});

Template.calendar.events({
	'click .fc-event-container': function () {
		$('#modal-id').modal('show');
	}
});

Template.editEvent.helpers({
	evt: function () {
		var calEvent =CalEvents.findOne({_id:Session.get('editing_calevent')});		
		return calEvent;
	}
});

Template.editEvent.events({
	'click #save': function (evt,tmpl) {
		updateCalEvent(Session.get('editing_calevent'),tmpl.find('#title').value);
		Session.set('editing_calevent',null);
			Session.set('showEditEvent',false);
		
		
	}
});

var updateCalEvent=function(id,title){
	CalEvents.update(id, {$set: {title:title}});
	return true;
}