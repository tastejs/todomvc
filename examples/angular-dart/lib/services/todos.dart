import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/models/item.dart';
import 'package:angular_dart_todomvc/services/storage.dart';

@Injectable()
class TodosStore {
  final StorageService _storage;

  List<Item> _items;
  List<Item> get items => _items;

  TodosStore(this._storage) {
    _items = _storage.loadItems();
  }

  void persist() {
    _storage.saveItems(_items);
  }

  void addItem(Item item) {
    _items.add(item);
    persist();
  }

  void removeItem(Item item) {
    _items.remove(item);
    persist();
  }

  void clearCompleted() {
    _items.removeWhere((i) => i.completed);
    persist();
  }

  bool get allChecked => items.every((i) => i.completed);

  void set allChecked(value) {
    items.forEach((i) => i.completed = value);
    persist();
  }

  int get remaining => items.where((item) => !item.completed).length;

  int get completed => items.where((item) => item.completed).length;
}
