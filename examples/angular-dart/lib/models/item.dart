class Item {
  String title;
  bool completed;

  Item([this.title = '', this.completed = false]);

  Item.fromJson(Map obj) {
    this.title = obj['title'];
    this.completed = obj['completed'];
  }

  bool get isEmpty => title.trim().isEmpty;

  Item clone() => new Item(this.title, this.completed);

  String toString() => toJson().toString();

  void normalize() {
    title = title.trim();
  }

  // This is method is called when from JSON.encode.
  Map toJson() => {'title': title, 'completed': completed};
}
