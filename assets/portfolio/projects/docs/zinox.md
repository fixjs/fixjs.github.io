# ZinoX

The original name was `Zino` and along with all the extension packages and components it was called `ZinoX`. It **`was`** called `Zino` because after I finished working on the project the company changed its name but they didn't touch the code base.

## What is it

A JavaScript client framework aiming to set up an end to end solution for `**S**ingle **P**age **A**pplication`s(SPAs) and enterprise `web` applications. It is worth noting that what we call `SPA` these days didn't used to be called this way. The older trendy alternative phrase was **R**ich **I**nternet **A**pplications or RIAs. The wikipedia's definition starts like this:
> A rich Internet application (RIA) is a Web application that has many of the characteristics of desktop application software,

Offering an end to end solution needed us to cover a whole bunch of different types of features and components but the most important part was to set up the best front end design pattern, similar to what we know these days as MVC solutions.

With a quick look at files and dates we could see that this project dates back to around **seven** years ago, and that's why its features or functionalities might seem crazy sometimes, but back then it was really promising.

To deign a Zino application we had come up with a auto scaffolding solution, something like what rails offers these days but much simpler. You run the command and it will ask you the name and the version and then a new folder gets generated with all the needed files.

## Underlying ideas
Using **XML**, **XSL** and **XML Schemas(.xsd files)** for data modeling, **WSDL** files for web services and also **SOAP(1.1-1.2)** files as the **Data eXchange Format**, all together were sort of the main underlying ideas in `Zino` as a client framework.

To make it terse let's describe the usuall steps when coding on Zino.

## How to implement a Component

The code block below shows us the way devs could implement a new Zino module or component:
```javascript
/*!
  import zinox.util.Action;
  import zinox.ui.Icon;
  import zinox.ui.controls.MyOtherComponent;
*/
function MyComponent(defaultText){
  arguments.callee.superClass.call(this, ce("div"));

  /*<init class="zinox.ui.controls.MyComponent" 
      tag="my-component"
      version="0.1.1a"
      author="Mehran Hatami" 
      createdate="2008/2/18" />*/
      
  var $t =this;

  //...

  var text = "";
  $t.text = new zino.lang.Property(String,
    function text$$getter(){
      return text;
    },
    function text$$setter(value){
      if(value!=text){
        text=value;
        //do your magic
      }
    }
  );

  //...
}

MyComponent.prototype.initX = function(node){
  var $t = this;
  //call the parent initX function
  zinox.ui.Control.prototype.initX.apply(this, arguments);

  //this is how a xml node gets mapped to a JavaScript object
  if( node.getAttribute("text") )       this.text.set( eval( ea(node.getAttribute("text")) ) );
};

zinox.ui.controls.MyComponent = MyComponent;
```

This was what we had come up with to make things easier for developers.
- **Dependency management**: The first part is the comment box on top of the file like:

```javascript
/*!
  import zinox.util.Action;
  import zinox.ui.Icon;
  import zinox.ui.controls.MyOtherComponent;
*/
```

This way devs ask the dependency management system to provide them with what they need as dependencies to implement the new component.

- **Super**: The first line of the code in the main constructor function is the equivalent for `super` statement in coffescript, which calls the super class constructor function.

- **Meta data**: the other comment box to specify the meta data of the component.
```javascript
/*<init class="zinox.ui.controls.MyComponent" 
      tag="my-component"
      version="0.1.1a"
      author="Mehran Hatami" 
      createdate="2008/2/18" />*/
```
The most important part of this information is `tag`, which specifies the actual `tagName` when using this component in a `Zino` application.

- **Properties with setter and getter**: To define a property `Zino` offers a module named: `zino.lang.Property` which has bunch of events like when we need to observe `change` event.
```javascript
var text = "";
$t.text = new zino.lang.Property(String,
  function text$$getter(){
    return text;
  },
  function text$$setter(value){
    if(value!=text){
      text=value;
      //do your magic like updating the other variables if needed
      //BUT no need to update the DOM because `Zino` also offers a data binding solution
    }
  }
);
```
- **initX**: This function was a `Zino` specific convention for defining a component that could be used in a `Zino` application. By having a quick look something bad will probably catch your eyes in this line of the code:
```javascript
if( node.getAttribute("text") )       this.text.set( eval( ea(node.getAttribute("text")) ) );
```
We used **eval** to map text properties to object values!!!! *I know, I know, I know,* and I can't even say anything to advocate its being part of what I have been working on some day, although `Zino` has its own way of detecting **XSS attacks** or other dangrous wholes when using **eval**.

# Zino application .zino/.xml files

To develop a `Zino` application instead of `HTML` files, developer should create a `Zino` xml file like this:
```xml
<?xml version="1.0" ?>
<?xml-stylesheet href="/dre/client/_transformer.xsl" type="text/xsl" ?>
<zino>
  <config id="defaultTheme" value="dario" />
  <config id="defaultCulture" value="en-US" />
  <import ns="zinox.ui.controls.Form" />
  <import ns="zinox.ui.controls.MyComponent" />
  <form object="baseForm">
    <my-component id="myTestComponent" text="Just a simple Zino component"></my-component>
  </form>
</zino>
```

Check out the way `my-component` is being used in the from element. And as you might have guessed `Zino` creates a JavaScript object which is an instance of `zinox.ui.controls.MyOtherComponent`.

## Run the working example

To check out a working example, extract the `zinox.zip` file and run the `serve.sh` file in the terminal, which will start a lightweight python http server on `3000`. Now in order to see how `Zino` actually works check this link out: [A working Zino/ZinoX example](http://localhost:3000/dre/client/index.xml).
Or simply copy this `http://localhost:3000/dre/client/index.xml` to your address bar.

When the page gets loaded you could do `View page source` and make sure if the loaded page is really  a `XML` file. Regarding the context of the page, it is worth noting that, this example is actually a working example of `zinox.ui.controls.ColorBoxModal` which as its name suggests is a Color Selector type thing implemented in `Zino`. You could choose your desired color and push the `Ok` button, which will change the background color of the page to the selected color.