import 'package:angular2/angular2.dart';

@Component(
    selector: 'footer-info',
    template: '''
<footer class="info">
        <p>Double-click to edit a todo</p>
        <p>Written by <a>Hadrien Lejard</a> with Angular 2 For Dart</p>
        <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
 </footer>
    ''')
class FooterInfo {}
