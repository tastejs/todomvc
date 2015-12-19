## Style Guide

I might have broken some of the rules below, if you find such cases then let me know.


### Spacing

I completely understand when people get upset about inconsistent spacing in their code.

But I am very against postprocessing code to check for style, a single space off shouldn't need to slap the developer with an error. The developer no matter where must be focused on producing good code and not good looking code.

That being said, there is only one requirement I would put forward when it comes to spacing, and that can be summarized as "the more the merrier"

for example:

  function foo(){
    for(var i=0;i<10;i++){
      console.log("number is: " + i);
    }
  }

would be lesser preferable to:

  function foo() {
    for ( var i=0; i < 10; i++ ) {
      console.log( "number is: " + i );
    }
  }



### Variable Names:

camelCase


**Boolean**

is<name>

  var isNumber = typeof x === 'number';


**Arrays**

< variable name of array component >S

  var oddIntegerS = [ 1, 3, 5, 7 ];
  var randomFunctionS = [ morePizza, moreCoke, morePepperoni ];

The 'S' stacks up on multiple nesting of arrays:

  var randomFunctionSS = [ [ morePizza, moreCoke, morePepperoni ], [ moreCooking, moreMoney, morePets ] ];


In case the number items of array is predetermined and small,
then the variable name can be listed referring to all the components of the array separated by '00', in this case:

  var movie00year = [ 'Her', 2014 ];

If this array were to be nested along with other movies, then the 'S' would stack as usual:

  var movie00yearS = [ [ 'The Shawshank Redemption', 1994 ], [ 'Toy Story 3', 2010 ], [ 'Her', 2014 ] ];


**Objects**

- as Hashmaps:

< name of key >2< name of value >

  var country2continent = { 'USA': 'North America', 'Germany': 'Europe', 'Chile': 'South America' };

- as class instances (or class-like hashmaps)

camelCase

  var newCar = new Car();

(class-like hashmaps refer to intricate objects with multiple properties of different types,
  example: the lson object)

**Functions**

camelCase  

Try your best to keep the first word in the function name to be a verb.
If the first word cannot be a verb, then prefix with 'fn'.

*Ambiguity Arising from Variable Names*

Using the above variable naming conventions looks well on the surface, albiet when used to be complex data structures can begin to break down.

For example:

province2majorCityS

could mean a data structure such as:

{
   california: ["LA", "San Fran"]
}

OR

[ { california: "LA" }, { illinois: "Chicago" } ]


If the first data structure is the one we desire then there are 2 ways to resolve the ambiguity:

(1) Create a class or multiple classes:

province2majorCitiesList

(2) Using "_" to demarcate variables of the data structure, such as:

province2_majorCityS_


**(User-)Hidden Methods/Functions/Variables**

LAY.Level, LAY (global), LAY.Color, LAY.Take are examples of objects available to the user during runtime. For these objects there exists 2 types of methods, ones which is accessable to the user (such as LAY.Level.attr() ), and the remaining which are to accessed internally by the the engine (such as LAY.Level.$getAttrVal). To distinguish between these two, the "$" prefix is used.

To exaggerate the simplisitc design the user is disallowed to access any variables of instantiable objects (such as LAY.Level.parentLevel), an is provided equivalent methods for access (such as LAY.Level.parent() to access LAY.Level.parentLevel). For this reason none of the object variables require a prefix. However this rule does not fully apply to non-instantiable objects, the only one being LAY, which in this case would have both its functions and variables (which are non-user accessable) to be prefixed with a "$". 

**Unsure variables**

If the data structure type of a variable is not sure, use "3" as conjunction:
eg: element3elementS (either an element or array of elements)


**User API**

For the LAY API including its methods and direct variable access, the above rules mentioned do not apply. For instance the lson key "$gpu" requires a boolean, in abiding with the aforementioned code style instructions the name would be prefixed with an "is" and camelcased "$isGpu", however this is not the case.
