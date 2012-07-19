module("jquery/model/associations",{
	setup: function() {
		
		$.Model.extend("MyTest.Person");
		$.Model.extend("MyTest.Loan");
		$.Model.extend("MyTest.Issues");
		
		$.Model.extend("MyTest.Customer",
		{
			init: function() {
				this.belongsTo("MyTest.Person")
				this.hasMany("MyTest.Loan")
				this.hasMany("MyTest.Issues")
			}
		},
		{});
	}
})





test("associations work", function(){
	var c = new MyTest.Customer({
		id: 5,
		person : {
			id: 1,
			name: "Justin"
		},
		issues : [],
		loans : [
			{
				amount : 1000,
				id: 2
			},
			{
				amount : 19999,
				id: 3
			}
		]
	})
	equals(c.person.name, "Justin", "association present");
	equals(c.person.Class, MyTest.Person, "belongs to association typed");
	
	equals(c.issues.length, 0);
	
	equals(c.loans.length, 2);
	
	equals(c.loans[0].Class, MyTest.Loan);
})