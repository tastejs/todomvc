import 'package:di/di.dart';
import 'package:angular/angular.dart';

import 'todo.dart';
import 'directives.dart';

main() {
	var module = new Module()
		..type(StorageService)
		..type(TodoController)
		..type(TodoDOMEventDirective);
	ngBootstrap(module: module);
}
