///// A collection of TodoItem ////////////////////////////

using StringTools;

// Model
class TodoItems implements haxedci.Context
{
	static var STORAGE_KEY = "todos-haxe-mithril";

	// This is where the TodoItem are persisted.
	// Using the Haxe serializer for handling of any type.
	// normal JSON serialization should work too in this simple case.
	@role var storage : {
		function getItem(key : String) : String;
		function setItem(key : String, value : String) : Void;
	} = {
		function save() {
			self.setItem(STORAGE_KEY, haxe.Serializer.run(items));
		}
		function load() : Array<TodoItem> {
			try {
				var data = cast storage.getItem(STORAGE_KEY);
				return cast haxe.Unserializer.run(data);
			} catch(e : Dynamic) {
				return [];
			}
		}
	}

	@role var items : Array<TodoItem>;

	// For testing purposes, passing a storage object to the 
	// constructor could be allowed.
	public function new() {
		this.storage = js.Browser.getLocalStorage();
		this.items = storage.load();
	}

	public function add(title : String) : Void {
		items.push(new TodoItem({
			// Create a random id in this example
			id: Std.string(Math.random()),
			title: title
		}));
	}

	public function remove(item : TodoItem) : Bool
		return items.remove(item);

	// The save method is explicit, to avoid surprising
	// side-effects.
	public function save()
		storage.save();

	// Here's how to iterate the collection.
	public function iterator()
		return items.iterator();
}