library uuid;

import 'dart:math';

Random _random = new Random();

String uuid() {
  return "${_S4()}${_S4()}-${_S4()}-${_S4()}-${_S4()}-${_S4()}${_S4()}${_S4()}";
}

String _S4() {
  return _random.nextInt(65536).toRadixString(16);
}
