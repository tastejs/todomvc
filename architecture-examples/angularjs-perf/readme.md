# AngularJS (performance optimized) TodoMVC app

The normal AngularJS TodoMVC implemetation performs deep watching of the todos array object. This means that it keeps an in-memory copy of the complete array that is used for dirty checking in order to detect model mutations. For smaller applications such as TodoMVC, this is completely fine as one trades off a little memory and performance for the sake of simplicity.

In larger more complex applications however, where one might be working with 100s or 1000s of large objects one definitely should avoid using this approach. This implementation of the AngularJS app demonstrates the correct way to approach this problem when working in larger apps.
