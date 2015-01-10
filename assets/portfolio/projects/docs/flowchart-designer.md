## Flowchart Designer

As its name suggests it is a fully JavaScript based flowchart designer which allows to design your desired flowchart in a browser.

__Flowchart Designer__ was actually the key part of a bigger product, A BPMN . The company I was working with at the time, was kind of the only provider in the BPMN market at the time and we had decided to implement a web based BPMN Modeler for modeling enterprise BPMN processes.

The idea was kind of new and challenging in the local market in my home country but in europe couple of companies had been working on that for a while. One of them was [Signavio](http://www.signavio.com) which was focused around the same idea but with a difference: the front-end stack was centered around SVG, but ours was more of a JavaScript based solution with a bit use of HTML5 canvas element.

To get started with more detail about this project, I should mention that we didn't actually start off from scratch. Back then, there used to be a company or just a website named: ajax.org, which had a JavaScript library named: `APF` that I think stands for `Ajax.org Platform`. __APF__ already had a bunch of useful features for us to achieve what we wanted faster, so that I, as the fron-end team lead, decided to go with `APF` and start building something on top of that.

In terms of BPMN related stuff all I could say is, the whole product was kind of responsible for generating couple of xml files, one of which stored the whole needed informtion for the shapes and their position, but the most important file to generate was a BPEL(Business Process Execution Language) document, which as its name suggests makes the whole BPMN diagram executable, that's why it was considered a BPMN2BPEL modeler.

So lets go through the way it worked, actually it still is in production but only in the enterprise level, so I'd say: lets go through the way it works.

## Diagram Models and templates
Each diagram has its model, which has the underlying shape configration. For instance for a simple flowchart shapes the model could be:

```xml
<template>
  <element type="eStart" picture="scripts/eappflow/shapes/start-trans.gif" dwidth="35" dheight="36">
    <input x="17" y="33" position="bottom" name="1"></input>
  </element>
  <element type="eEnd" picture="scripts/eappflow/shapes/end-trans.gif" dwidth="35" dheight="35">
    <input x="17" y="0" position="top" name="1"></input>
  </element>
  <element type="eActivity" picture="scripts/eappflow/shapes/task-transparent.png" dwidth="93" dheight="63" >
    <input x="46" y="0" position="top" name="1"></input>
    <input x="46" y="63" position="bottom" name="4"></input>
  </element>
  <element type="eDecisionActivity" picture="scripts/eappflow/shapes/decisiontask-trans-ver.gif" dwidth="93" dheight="105">
    <input x="46" y="0" position="top" name="1"></input>
    <input x="68" y="83" position="bottom" name="2"></input>
    <input x="24" y="83" position="bottom" name="3"></input>
    <input x="46" y="105" position="bottom" name="4"></input>
  </element>
  <element type="eDecision" picture="scripts/eappflow/shapes/decision-trans.gif" dwidth="43" dheight="43">
    <input x="21" y="-1" position="top" name="1"></input>
    <input x="21" y="44" position="bottom" name="2"></input>
    <input x="-1" y="22" position="left" name="3"></input>
    <input x="44" y="22" position="right" name="4"></input>
  </element>
</template>
```

The modeling engine is responsible to read this template and provide all the requirements for modeling the actual flowchart. A simple flowchart model could be like:

```xml
<flowchart>
  <block id="b2" left="200" top="50" width="35" height="36" type="eStart" caption="Start" lock="false" zindex="1001" cap-pos="topside">
    <bpel/>
    <connection ref="b10" output="1" input="1" type="none-arrow">
      <bpel/>
    </connection>
  </block>
  <block id="b10" left="171" top="150" width="93" height="63" type="eActivity" caption="Activity" lock="false" zindex="1001" cap-pos="inside">
    <bpel/>
    <connection ref="b6" output="2" input="1" type="none-arrow">
      <bpel/>
    </connection>
  </block>
  <block id="b6" left="200" top="288" width="35" height="36" type="eEnd" caption="Terminate" lock="false" zindex="1001" cap-pos="outside">
    <bpel/>
  </block>
</flowchart>
```
The final piece, which was the **APF** way of binding objects, shapes and xml attributes, is `bindings` xml document. Something like:
```xml
<a:bindings>
    <a:move select="self::node()[not(@move='false') and not(@lock='true')]">
    </a:move>
    <a:resize select="self::node()[@resize='true' and not(@lock='true')]">
    </a:resize>
    <a:css select="self::node()[@lock='true']" default="locked">
    </a:css>
    <a:left select="@left">
    </a:left>
    <a:top select="@top">
    </a:top>
    <a:id select="@id">
    </a:id>
    <a:width select="@width">
    </a:width>
    <a:height select="@height">
    </a:height>
    <a:flipv select="@flipv">
    </a:flipv>
    <a:fliph select="@fliph">
    </a:fliph>
    <a:rotation select="@rotation">
    </a:rotation>
    <a:lock select="@lock">
    </a:lock>
    <a:type select="@type">
    </a:type>
    <a:caption select="@caption">
    </a:caption>
    <a:caption value="Untitled block">
    </a:caption>
    <a:cap-pos select="@cap-pos">
    </a:cap-pos>
    <a:zindex select="@zindex">
    </a:zindex>
    <a:image select="@src">
    </a:image>
    <a:traverse select="block">
    </a:traverse>
    <!-- Connection Binding Rules -->
    <a:connection select="connection">
    </a:connection>
    <a:ref select="@ref">
    </a:ref>
    <a:input select="@input">
    </a:input>
    <a:output select="@output">
    </a:output>
    <a:label select="@label">
    </a:label>
</a:bindings>
```

These three pieces together with the flowchart engine renders a simple flowchart like:

![flow-chart1](https://cloud.githubusercontent.com/assets/6114456/5691006/cf9f3502-98c6-11e4-8d87-fe06b0448f88.png)

As you see there is no sign of any `SVG` nodes in the actual DOM, but we did use `canvas` elements for our main shapes. To be honest I still am not sure if it was the best way to do that. Actually not using `SVG` back then was for sure a really important trade off.

## Undo/Redo

It is just ready to call right out of the box. You could do the regular `ctrl+z` and `ctrl+y` in the uploaded example.

## JavaScript API

The flowchart engine provides a really nice and easy to work with API. A realitime JavaScript object with the responsibility of taking care of all the arduous tasks based on a simple interface for developers. For instance to add a new shape to an existing flowchart all we need is first having access to the mentioned JavaScript object, and then you could easily do what you want. For instance in the online example I have uploaded in this repo:

- **Add a new shape**:
Just call the `addBlock(...)` function and pass it the desired block type, x/y position and a caption. The valid types are provided based on the template file we discussed above:

```javascript
wfExample.addBlock('eActivity', 0, 0, 'My favorite activity!');
```

- **Get the new model**:
Once you make the first change in the flowchart, the bound model gets automatically updated and you can have access to the new xml document like:

```javascript
wfExample.getModel().getXml();//=> <flowchart>...</flowchart>
```

## Explore the example

The way you could check out the example is as simple as downloading [the zip file](https://github.com/fixjs/fixjs.github.io/raw/master/assets/portfolio/projects/flowchart-designer.zip), extracting it and exposing the root folder in any desired http server. I usually go with:

```python
python -m SimpleHTTPServer 9000
```
Then this is what you will see when you open up the [localhost:9000](http://localhost:9000):

![flowchart-screenshot2](https://cloud.githubusercontent.com/assets/6114456/5692339/ed91215c-9906-11e4-83c1-1cd3b45c12ef.png)
