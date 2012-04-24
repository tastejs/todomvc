steal('test.js?dojo-widget').then(function() {
	
	var selectDay = function(diff) {
		var today = new Date(),
			daysInMonth = new Date(2012, today.getMonth()+1, 0).getDate(),
			monthChange = 0

		if(today.getDate() + diff > daysInMonth) {
			S('#calendar [data-dojo-attach-point="incrementMonth"]').click();
			monthChange = 1;
		} else if(today.getDate() + diff < 1) {
			S('#calendar [data-dojo-attach-point="decrementMonth"]').click();
			monthChange = -1;
		}
		today.setTime(today.getTime() + (diff*24*60*60*1000))

		S('#calendar .dijitCalendarBodyContainer td.dijitCalendarEnabledDate.dijitCalendarCurrentMonth span').then(function(el) {
			for (var i = 0; i < el.length; i++) {
				if (el[i].innerHTML == today.getDate()) {
					S(el[i]).click();
					break;
				}
			}
		});
		//Reset any changes we made to the month selection
		if(monthChange) {
			monthChange === -1 ? S('#calendar [data-dojo-attach-point="incrementMonth"]').click() : S('#calendar [data-dojo-attach-point="decrementMonth"]').click();
		}
		//Return the date we modified so the test can use it
		return today;
	};
	
	test('Manage due date', function() {
		var today;

		// Set due date to today
		helpers.add(1, 'today todo');
		S('#todo-list .todo:nth-child(1) .due-date').click();
		S('#calendar').visible('calendar is shown');
		selectDay(0);
		S('#todo-list .todo:nth-child(1) .date').text('Today', 'due date is today');
		helpers.remove(1);

		// Set due date to yesterday
		helpers.add(1, 'yesterday todo');
		S('#todo-list .todo:nth-child(1) .due-date').click();
		selectDay(-1);
		S('#todo-list .todo:nth-child(1) .date').text('Yesterday', 'due date is yesterday');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', true, 'due date is late');
		helpers.remove(1);
		
		// Set due date to tomorrow
		helpers.add(1, 'tomorrow todo');
		S('#todo-list .todo:nth-child(1) .due-date').click();
		selectDay(1);
		S('#todo-list .todo:nth-child(1) .date').text('Tomorrow', 'due date is tomorrow');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', false, 'due date is on time');
		helpers.remove(1);
		
		// Set due date to the future
		helpers.add(1, 'future todo');
		S('#todo-list .todo:nth-child(1) .due-date').click();
		today = selectDay(2);
		S('#todo-list .todo:nth-child(1) .date').text((today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear(), 'due date is in the future');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', false, 'future due date is on time');
		helpers.remove(1);
		
		// Set due date to the past
		helpers.add(1, 'past todo');
		S('#todo-list .todo:nth-child(1) .due-date').click();
		today = selectDay(-2);
		S('#todo-list .todo:nth-child(1) .date').text((today.getMonth()+1)+'/'+today.getDate()+'/'+today.getFullYear(), 'due date is in the past');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', true, 'past due date is late');
		
		// Clear due date
		S('#todo-list .todo:nth-child(1) .clear-date').click();
		S('#todo-list .todo:nth-child(1) .date').text('', 'due date is cleared');
	});
	
});