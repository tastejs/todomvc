import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/storage.dart';

@Injectable()
class TodosService {
  final StorageService _storage;

  List<Item> _items;

  TodosService(this._storage) {
    _items = _storage.loadItems();
  }

  List<Item> get items => _items;

  void addItem(Item item) {
    _items.add(item);
    persist();
  }

  void removeItem(Item item) {
    _items.remove(item);
    persist();
  }

  void persist() {
    _storage.saveItems(_items);
  }
}
