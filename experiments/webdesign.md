# Getting started

To start working with CSS we need Version control, an editor and a browser. I'm not sure what you have right now so I'll just go over it all here.

## Version Control: 

Version control is for tracking your changes and coordinating them with others.

> I recommend following the 'Contribution Guidelines' and making your first pull request!
>  - GitHub Desktop: https://desktop.github.com/
>  - Short explanation; https://www.youtube.com/watch?v=2ReR1YJrNOM
>  - Long explanation; https://www.youtube.com/watch?v=8JJ101D3knE
>  - Pull Request https://www.youtube.com/watch?v=8lGpZkjnkt4

A good exercise will be to clone this project to your machine using GitHub Desktop.
Eventually you might want to make your own personal scratch-space project where you can try out ideas in isolation.

<!-- I should talk to Sam about adding an experiments folder to Soothing Systems so everything stays in one place... -->

## Text Editor
Visual Studio code is a great place to start.
 - https://code.visualstudio.com/

It has a variety of community developed extensions that can help your work flow. To get started, click the blocks icon on the left menubar, then find and install these extensions;
  - **Live Preview**, Microsoft
    - makes it trivial to host static web pages for testing
  - **Markdown Preview Mermaid Support**, Matt Bierner
    - Mermaid allows you to generate SVG diagrams from simple grammars. Very useful for documentation, and also Github Markdown supports it.
    - Here's the [github markup documentation](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams)
  - **GitLens**, GitKracken
    - embeds git info in your editor
  - **Figma for VS Code**, Figma
    - I'm not sure how to use this yet but might help when incorporating the Figma concepts you're making!
  - **Code Spell Checker**, Side Street Software

Once you have done that, open the clone of this project with VsCode. 
Make sure you have added the 'Live Preview' Plugin. 

Open the file browser on the left bar (the icon the looks like two pages), then navigate to <code>'breathe/credits/index.html'</code> and open it. 

In the top menubar of the editor on the right side, there is a preview icon that looks like a magnifying glass above a book. Press that to host that web page locally and open an embedded Edge browser!

>Note the address in the URL; it points to the home address (<code>http://127.0.0.1</code>) on port <code>3000</code>. The Live Preview plugin is hosting this for us, but in the Soothing Systems project it will be hosted by nodemon which you have to run from the console.

## Browser Development Tools

Any modern browser will do; Chromium, Edge, Firefox, Safari. What we need to look at though, is the browser's developer tools. 

In the top right corner of the preview window in <code>VsCode</code> press the hamburger icon then click the 'Open in Browser'. Then just press <code>F12</code>.

This is the developer tool pane, and they can show you a wealth of details; Document structure, network monitor, rendering performance, memory profilers, and so on. Really powerful stuff.

It's really handy when you're developing your CSS and need to see what rules are being applied where.

Let's do a quick example by overlaying a diagram of our Grid layout;

In the Dev Tools Pane click the <code>'Elements'</code> tab to show the <code>Document Object Model</code>'s tree of elements.

Click on the <code>body/main/section</code> tag.

The display below will update to reflect the styles applied to this section tag.
In that display click the <code>'Layout'</code> tab.

Click the check box in <code>Grid -> Grid Overlays -> section.credits</code>.
This visually shows us how the grid in <code>section.css</code> divides the screen.

We'll talk more about how you can use these tools but in the meantime here's a video that seems like a good intro to all the basic stuff you can do;
 - https://www.youtube.com/watch?v=Uuaue9odUEo



# Key CSS Concepts

Here are some links which cover the CSS concepts used to make the Soothing Systems UI demo. There's a lot here so you might just start with the overviews, and dig deeper as you have questions about how various aspects of the demo work. 

These CSS links might be less directly relevant if you end up primarily working in higher-level frameworks. However those frameworks will often be built atop these fundamental standards.

Being aware of them will give you better intuitions on what's possible, and how to communicate with people working in different levels of the stack.

## Mozilla Developer Network

Mozilla's documentation is both well organized for beginners and comprehensive for experts. They are pretty much my go-to resources.
 - https://developer.mozilla.org/en-US/

They also have good guides. The HTML and CSS sections are a good place to start for designers;
 - https://developer.mozilla.org/en-US/docs/Learn

Here is a primer on reactive design which should help for the variety of devices we want to target;
 - https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design

Also it's important to have a grasp of CSS units, especially the relative ones; 
 - https://developer.mozilla.org/en-US/docs/Learn/CSS/Building_blocks/Values_and_units

## Grid and FlexBox

Once you get familiar with grid and flex you can accomplish most any layout you can dream up.

For a more exercise-oriented introduction, here is Rachel Andrews' tutorials; 
 - https://gridbyexample.com/

When working with grid, this cheat-sheet is your friend;
 - https://css-tricks.com/snippets/css/complete-guide-grid/

Flexbox has a different purpose and is used in different situations;
 - https://css-tricks.com/snippets/css/a-guide-to-flexbox/

These specifications are huge and devilish in the details, but if you can become conversant in grid and flex you're halfway there.

Problems arise as applications become more complex, and you need frameworks or complex naming to get out of them. However I'm betting we can keep things pretty straight-forward for this project.

## CSS Variables and Calcs

CSS now supports variables and arbitrary calculations. This really comes in handy for making dynamic layouts that can still be configured in one place. Here are some more MDN articles;

 - https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties

 - https://developer.mozilla.org/en-US/docs/Web/CSS/calc


# Bookmark dump

I compiled a list of CSS/Web Design bookmarks that I found helpful or inspiring back over the years. I Hope you find them useful too!

## CSS Magazines

Here are some good magazines that help keep you up to date. I used to make a point of checking out some every day at work to stay abreast of the trends and tech. They often feature guest writers from all over the industry so be wary of the rabbit holes you can get lost in!

 - https://css-tricks.com/
 - https://www.smashingmagazine.com/
 - https://codepen.io/spark

I still reference css-tricks' guides almost every project. 
 - https://css-tricks.com/guides/

## Inspiration

Here are some gems that I think capture some of the magic of the Web. A lot of these people I found via CSS-Tricks;

I love Jen Simmon's work. The header of her Layout Lab is inspired by 1930's avant garde printing press graphic design. Try resizing it and look at how reactive it is;
 - https://labs.jensimmons.com/index.html

Here's an explainer of how she made it;
 - https://www.youtube.com/watch?v=OxrsO4aIjyc

Here's another one of hers, a cool way to automate Mondrian paintings in CSS;
 - https://labs.jensimmons.com/2017/01-011.html
 - https://www.youtube.com/watch?v=qNtJ5p3h2A4

An oldie but goldie. Shows how CSS can be totally separate from content.While not as popular a philosophy nowadays because of how modern component frameworks are scoped, I really like the (possibly utopian) idea of Markup being purely semantic and designers still being able to do absolutely anything with it; 
 - https://www.csszengarden.com/

Code pen is a neat place to try out css. Here is a typography designer with amazing demos;
 - https://codepen.io/mandymichael/pens/popular

A Pinterest-like site for designers; I mainly liked how they implemented search-by-color!
 - https://www.designspiration.com/

Lynn Fischer makes really neat reactive homepages, here's her archive to try resizing;
 - https://lynnandtonic.com/archive/

An educational science blog that has amazing examples of what's possible with interactive web. This one is about watches, but be sure to check out his archives;
 - https://ciechanow.ski/mechanical-watch/

 An excellent infographic designer with neat concepts;
 - http://krisztinaszucs.com/

If you want to get into infographics, you can't beat D3- though you are definitely getting more into the developer side of things;
 - https://d3js.org/

 