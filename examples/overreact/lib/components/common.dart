typedef dynamic IndexCallback(int index);
typedef dynamic FilterCallback(Filter filter);

class TodoValue {
  String displayValue;
  bool isCompleted;
  int _uniqueId;

  TodoValue(this.displayValue, this.isCompleted) : this._uniqueId = _generateUniqueId();

  @override
  String toString() => '$displayValue, $isCompleted, $_uniqueId';
}

int _todoCount = 0;
int _generateUniqueId() => _todoCount++;

enum Filter {
  all,
  active,
  completed
}
