# OverReact Transformer

[](#__START_EMBEDDED_README__)

OverReact components are declared using a set of [annotations] which are 
picked up by the `over_react` Pub transformer.

This transformer generates code, wiring up the different pieces of component 
declarations and creating typed getters/setters for props and state.

This allows boilerplate to be significantly reduced, making the code you write 
much cleaner and more _grokkable_.

> Check out some [component demos] to see the transformer in action.

&nbsp;
&nbsp;



## Wiring it all up

__Be sure to familiarize yourself with the [OverReact library] first.__

The transformer wires up your factory, props class, and component class so that you don't have to!


### The transformation process

> All of this transformation happens "under the hood", but you can see it in action for your 
own components using the [transformer diff view](#debugging-with-the-diff-view).

1. A component is declared.

    ```dart
    @Factory()
    UiFactory<FooProps> Foo;
    
    @Props()
    class FooProps extends UiProps { 
      // ...
    }
    
    @Component()
    class FooComponent extends UiComponent<FooProps> {
      @override
      render() { 
        // ...
      }
    }
    ```

    Note that we've annotated our component pieces with `@Factory()`, `@Props()`, and `@Component()`. 
    These are what the transformer uses as "hooks" to find your component.

    Okay, so we've defined our component. Let's look at what the transformer does.
    
2. The transformer creates an implementation of the props class.

    ```dart
    // Concrete props implementation.
    //
    // Implements constructor and backing map, and links up to generated component factory.
    class _$FooPropsImpl extends FooProps {
      /// The backing props map proxied by this class.
      @override
      final Map props;
    
      _$FooPropsImpl(Map backingMap) : this.props = backingMap ?? ({});
    
      /// Let [UiProps] internals know that this class has been generated.
      @override
      bool get $isClassGenerated => true;
    
      /// The [ReactComponentFactory] associated with the component built by this class.
      @override
      Function get componentFactory => _$FooComponentFactory;
    
      /// The default namespace for the prop getters/setters generated for this class.
      @override
      String get propKeyNamespace => 'FooProps.';
    }
    ```
    
    It does this since the class we defined in our code inherits pseudo-abstract stubbed 
    members and doesn't have the constructor we need.

3. A mixin that implements the pseudo-abstract stubbed members of our component class is 
generated and mixed in to our existing component class.

    ```dart
    // Concrete component implementation mixin.
    //
    // Implements typed props/state factories, defaults `consumedPropKeys` to the keys
    // generated for the associated props class.
    class _$FooComponentImplMixin {
      /// Let [UiComponent] internals know that this class has been generated.
      @override
      bool get $isClassGenerated => true;
    
      /// The default consumed prop keys, taken from FooProps.
      /// Used in [UiProps.consumedPropKeys] if [consumedPropKeys] is not overridden.
      @override
      final List<List<String>> $defaultConsumedPropKeys = const [FooProps.$propKeys];
    
      @override
      FooProps typedPropsFactory(Map backingMap) => new _$FooPropsImpl(backingMap);
    }
    ```

    The underlying transformation:
    
    ```diff
    @Component()
    -class FooComponent extends UiStatefulComponent<FooProps, FooState> {
    +class FooComponent extends UiStatefulComponent<FooProps, FooState> with _$FooComponentImplMixin {
    ```

    Note that the `typedPropsFactory` variable is wired up to use the props implementation 
    class's constructor. This lets us get an instance of that class when we use the `props` 
    getter and the `newProps()` method, and is necessary since the code we wrote 
    doesn't have a proper constructor.

4. Our fully implemented component class is registered with the [react-dart] wrapper.

    ```dart
    // React component factory implementation.
    //
    // Registers component implementation and links type meta to builder factory.
    final _$FooComponentFactory = registerComponent(() => new FooComponent(),
        builderFactory: Foo,
        componentClass: FooComponent,
        isWrapper: false,
        displayName: 'Foo'
    );
    ```

5. Finally, it initializes the factory variable with a function that returns a new instance of our 
private props implementation. This factory is __the entry-point__ to externally consuming our 
component and props class.

    ```diff
    @Factory()
    -UiFactory<FooProps> Foo;
    +UiFactory<FooProps> Foo = ([Map backingProps]) => new _$FooPropsImpl(backingProps);
    ```

&nbsp;
&nbsp;



## Props / State Getters and Setters

Writing a statically-typed prop / state API for React components in Dart proved to be a huge pain when we 
attempted to do it from scratch.

We found that the most straightforward way to adhere to React patterns was to use `Map`s for `props` and `state`. 

So we went about defining typed getters and setters on `MapView`-like classes which proxy Map key-value pairs. 
However, typing these getters and setters quickly became tedious 
_(especially if you need namespaced keys for platform scalability)_:

```dart
class FooProps extends UiProps {
  String get title               => props['FooProps.title'];
  set title(String value)        => props['FooProps.title'] = value;

  bool get isEnabled             => props['FooProps.isEnabled'];
  set isEnabled(bool value)      => props['FooProps.isEnabled'] = value;

  MouseEventCallback get onClick => props['FooProps.onClick'];
  set onClick(Callback value)    => props['FooProps.onClick'] = value;

  // Imagine a component with 20 of these... yuck.
}
```

With the transformer, we cut down on repetition while preserving statically-typed getter and setters. 

Props and state are declared using _fields_, making the actual code you write much simpler - 
and much more like the React JS library intended:

```dart
@Props()
class FooProps extends UiProps {
  String title;

  bool isEnabled;

  MouseEventCallback onClick;

  // ...
}

@State()
class FooState extends UiState {
  bool isShown;

  String currentText;

  // ...
}
```

> Check out some [component demos] for more info about using fields to define props and state values in the real world.

&nbsp;
&nbsp;



## Debugging with the diff view

The `over_react` transformer provides a diff view for each transformed file, 
which you can use to see how exactly your source files are modified.

When in debug mode (`pub serve`, not `pub build`), this diff is accessible by 
appending `.diff.html` to the URL of your Dart file.

__The easiest way to view it:__

1. Open the Dartium developer tools.
2. In the "Sources" tab, open the desired file <em>(you can use <kbd>⌘P</kbd> to search)</em>.
3. Right-click within the file contents and select "Open Link in New Tab".
4. Append `.diff.html` to the url in the newly opened tab.



[OverReact library]: https://github.com/Workiva/over_react/blob/master/README.md
[annotations]: https://github.com/Workiva/over_react/blob/master/lib/src/component_declaration/annotations.dart
[component demos]: https://workiva.github.io/over_react/demos/
[react-dart]: https://github.com/cleandart/react-dart
