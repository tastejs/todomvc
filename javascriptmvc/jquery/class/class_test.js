steal
 .plugins("jquery/class")  //load your app
 .plugins('funcunit/qunit').then(function(){

module("jquery/class");

test("Creating", function(){
        
    jQuery.Class.extend("Animal",
    {
        count: 0,
        test: function() {
            return this.match ? true : false
        }
    },
    {
        init: function() {
            this.Class.count++;
            this.eyes = false;
        }
    }
    );
    Animal.extend("Dog",
    {
        match : /abc/
    },
    {
        init: function() {
            this._super();
        },
		talk: function() {
			return "Woof";
		}
    });
    Dog.extend("Ajax",
    {
        count : 0
    },
    {
        init: function( hairs ) {
            this._super();
            this.hairs = hairs;
            this.setEyes();
            
        },
        setEyes: function() {
            this.eyes = true;
        }
    });
    new Dog();
    new Animal();
    new Animal();
    var ajax = new Ajax(1000);
        
    equals(2, Animal.count, "right number of animals");
    equals(1, Dog.count, "right number of animals")
    ok(Dog.match, "right number of animals")
    ok(!Animal.match, "right number of animals")
    ok(Dog.test(), "right number of animals")
    ok(!Animal.test(), "right number of animals")
    equals(1, Ajax.count, "right number of animals")
    equals(2, Animal.count, "right number of animals");
    equals(true, ajax.eyes, "right number of animals");
    equals(1000, ajax.hairs, "right number of animals");
})


test("new instance",function(){
    var d = Ajax.newInstance(6);
    equals(6, d.hairs);
})


test("namespaces",function(){
	var fb = $.Class.extend("Foo.Bar")
	ok(Foo.Bar === fb, "returns class")
	equals(fb.shortName, "Bar", "short name is right");
	equals(fb.fullName, "Foo.Bar","fullName is right")
	
})

test("setups", function(){
	var order = 0,
		staticSetup,
		staticSetupArgs,
		staticInit,
		staticInitArgs,
		protoSetup,
		protoInitArgs,
		protoInit,
		staticProps = {
			setup: function() {
				staticSetup = ++order;
				staticSetupArgs = arguments;
				return ["something"]
			},
			init: function() {
				staticInit = ++order;
				staticInitArgs = arguments;
			}
		},
		protoProps = {
			setup: function( name ) {
				protoSetup = ++order;
				return ["Ford: "+name];
			},
			init: function() {
				protoInit = ++order;
				protoInitArgs = arguments;
			}
		}
	$.Class.extend("Car",staticProps,protoProps);
	
	var geo = new Car("geo");
	equals(staticSetup, 1);
	equals(staticInit, 2);
	equals(protoSetup, 3);
	equals(protoInit, 4);
	
	same($.makeArray(staticInitArgs), ["something"] )
	same($.makeArray(protoInitArgs),["Ford: geo"] )
	
	same($.makeArray(staticSetupArgs),[$.Class, "Car",staticProps, protoProps] ,"static construct");
	
	
	//now see if staticSetup gets called again ...
	Car.extend("Truck");
	equals(staticSetup, 5, "Static setup is called if overwriting");
	
});

test("callback", function(){
	var curVal = 0;
	$.Class.extend("Car",{
		show: function( value ) {
			equals(curVal, value)
		}
	},{
		show: function( value ) {
			
		}
	})
	var cb = Car.callback('show');
	curVal = 1;
	cb(1)
	
	curVal = 2;
	var cb2 = Car.callback('show',2)
	cb2();
});

test("callback error", 1,function(){
	$.Class.extend("Car",{
		show: function( value ) {
			equals(curVal, value)
		}
	},{
		show: function( value ) {
			
		}
	})
	try{
		Car.callback('huh');
		ok(false, "I should have errored")
	}catch(e){
		ok(true, "Error was thrown")
	}
})

test("Creating without extend", function(){
	$.Class("Bar",{
		ok : function(){
			ok(true, "ok called")
		}
	});
	new Bar().ok();
	
	Bar("Foo",{
		dude : function(){
			ok(true, "dude called")
		}
	});
	new Foo().dude(true);
})


/* Not sure I want to fix this yet.
test("Super in derived when parent doesn't have init", function(){
	$.Class("Parent",{
	});
	
	Parent("Derived",{
		init : function(){
			this._super();
		}
	});

	try {
		new Derived();
		ok(true, "Can call super in init safely")
	} catch (e) {
		ok(false, "Failed to call super in init with error: " + e)
	}
})*/

});