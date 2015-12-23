///// The TodoItem model //////////////////////////////////

using StringTools;

// Using the DataClass library: 
// https://github.com/ciscoheat/dataclass

// Model
class TodoItem implements dataclass.DataClass {
	@validate(_.length > 0)
	public var id : String;
	
	@validate(_.trim().length > 0) 
	public var title : String;
	
	public var completed : Bool = false;
}
