import 'dart:html' as dom;
import 'dart:convert' as convert;
import 'package:angular2/angular2.dart';
import 'package:angular_dart_todomvc/models/item.dart';

@Injectable()
class StorageService {
  final dom.Storage _storage = dom.window.localStorage;
  static const String STORAGE_KEY = 'todos-angulardart';

  List<Item> loadItems() {
    final String data = _storage[STORAGE_KEY];

    if (data == null) {
      return [];
    }

    final List<Map> rawItems = convert.JSON.decode(data);
    return rawItems.map((item) => new Item.fromJson(item)).toList();
  }

  void saveItems(List<Item> items) {
    _storage[STORAGE_KEY] = convert.JSON.encode(items);
  }
}
