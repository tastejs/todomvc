steal('test.js?jquery-widget').then(function() {
	
	var today = new Date(),
		todayMonth = new Date().getMonth(),
		months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		selectDay = function(diff) {
			// Reset the calendar to the current month
			S('#calendar .ui-datepicker-month').then(function(el) {
				if (el[0].innerHTML.indexOf(months[todayMonth]) == -1) {
					var prevMonth = (todayMonth - 1 >= 0) ? todayMonth - 1 : 11,
						nextMonth = (todayMonth + 1 <= 11) ? todayMonth + 1 : 0;
					if (el[0].innerHTML.indexOf(months[prevMonth]) > -1) {
						S('#calendar .ui-datepicker-next').click();	
					}
					else if (el[0].innerHTML.indexOf(months[nextMonth]) > -1) {
						S('#calendar .ui-datepicker-prev').click();	
					}
				}
			});
			
			// Switch the month if necessary
			var diffDate = new Date();
			diffDate.setDate(diffDate.getDate() + diff);
			if (diffDate.getMonth() != today.getMonth()) {
				if (diffDate.getMonth() < today.getMonth() || (today.getMonth() == 0 && diffDate.getMonth() == 11)) {
					S('#calendar .ui-datepicker-prev').click();	
				}
				else if (diffDate.getMonth() > today.getMonth() || (today.getMonth() == 11 && diffDate.getMonth() == 0)) {
					S('#calendar .ui-datepicker-next').click();	
				}
			}
			
			// Select the proper day
			S('#calendar .ui-datepicker-calendar tbody a').then(function(el) {
				for (var i = 0; i < el.length; i++) {
					if (el[i].innerHTML == diffDate.getDate()) {
						S(el[i]).click();
						break;
					}
				}
			});
	};
	
	test('Manage due date', function() {
		var today = new Date();
		helpers.add(1, 'new todo');
		
		// Set due date to today
		S('#todo-list .todo:nth-child(1) .due-date').click();
		S('#calendar').visible('calendar is shown');
		selectDay(0);
		S('#todo-list .todo:nth-child(1) .date').text('Today', 'due date is today');
		
		// Set due date to yesterday
		S('#todo-list .todo:nth-child(1) .due-date').click();
		selectDay(-1);
		S('#todo-list .todo:nth-child(1) .date').text('Yesterday', 'due date is yesterday');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', true, 'due date is late');
		
		// Set due date to tomorrow
		S('#todo-list .todo:nth-child(1) .due-date').click();
		selectDay(1);
		S('#todo-list .todo:nth-child(1) .date').text('Tomorrow', 'due date is tomorrow');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', false, 'due date is on time');
		
		// Set due date to the future
		S('#todo-list .todo:nth-child(1) .due-date').click();
		selectDay(2);
		var future = new Date();
		future.setDate(future.getDate()+2);
		S('#todo-list .todo:nth-child(1) .date').text((future.getMonth()+1)+'/'+future.getDate()+'/'+future.getFullYear(), 'due date is in the future');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', false, 'future due date is on time');
		
		// Set due date to the past
		S('#todo-list .todo:nth-child(1) .due-date').click();
		selectDay(-2);
		var past = new Date();
		past.setDate(past.getDate()-2);
		S('#todo-list .todo:nth-child(1) .date').text((past.getMonth()+1)+'/'+past.getDate()+'/'+past.getFullYear(), 'due date is in the past');
		S('#todo-list .todo:nth-child(1) .date').hasClass('late', true, 'past due date is late');
		
		// Clear due date
		S('#todo-list .todo:nth-child(1) .clear-date').click();
		S('#todo-list .todo:nth-child(1) .date').text('', 'due date is cleared');
	});
	
});