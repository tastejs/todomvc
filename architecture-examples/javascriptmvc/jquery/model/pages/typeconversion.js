/**
@page jquery.model.typeconversion Type Conversion
@parent jQuery.Model

# Type Conversion

You often want to convert from what the model sends you to
a form more useful to JavaScript.  For example, 
contacts might be returned from the server with dates that look like:
"1982-10-20".  We can model to convert it to something closer 
to <code>new Date(1982,10,20)</code>. We can do this in two ways: 

## Way 1: Setters

The [jQuery.Model.prototype.attrs attrs]
and [jQuery.Model.prototype.attr attr] function look for
a <code>set<b>ATTRNAME</b></code> function to handle setting the
date property.  

By providing a function that takes the raw data and returns
a form useful for JavaScript, we can make our models (which
use attrs and attr) automatically convert server data.

The following demo shows converting a contact's birthday into
a string.

@demo jquery/model/demo-setter.html


## Way 2: Convert

If you have a lot of dates, Setters won't scale well. 
Instead, you can set the type of 
an attribute and provide a function to convert that type.

The following sets the birthday attribute to "date" and provides a date conversion function:

@codestart
$.Model.extend("Contact",
{
  attributes : { 
    birthday : 'date'
  },
  convert : {
    date : function(raw){
      if(typeof raw == 'string'){
        var matches = raw.match(/(\d+)-(\d+)-(\d+)/)
        return new Date( matches[1], 
                        (+matches[2])-1, 
                         matches[3] )
      }else if(raw instanceof Date){
        return raw;
      }
    }
  },
  findAll : function( ... ){ ... }
},
{
  // No prototype properties necessary
})
@codeend

@demo jquery/model/demo-convert.html
 */