# GA WDI Project 1 - Shapes

<img src="" alt="shapes game">

## Premise
Shapes is a 'hole-in-the-wall' style game.  The aim is to fit your shape inside the hole when time the time runs out.

## Brief
To build a browser-based game using HTML, CSS and JavaScript.

## Technologies used
* HTML5
* CSS, **SCSS**, **Gulp**
* JavaScript, **JQuery**

## Features
Shapes features a timer, x/y position mapping and manipulation and element rotation (controlled and automatic) in its game logic.  Other features include start and end game menus, a non-persistent high score record, animated gif instructions and background and triggered audio.

## Challenges
The primary challenge with Shapes was programming the win condition.  Adding rotation to the target hole made an otherwise simple task highly complex.  The reason for this was the way the win condition was measured, comparing the x/y position of the hole (specifically its top left corner) with the x/y position of the shape (also its top left corner).  The problem this presented was twofold, first the 'win window' (x/y position of the hole with an additional margin on both axes) did not rotate with the hole resulting in it quickly losing alignment with the hole (illustrated below) and triggering wins incorrectly.

The solution to this was to add an extra element to the win condition, measuring the rotation of the hole and shape ...

## Successes


## Improvements

### Technical Changes

### Non-technical Changes


## Link ##
[Visit Shapes on Heroku](https://shapes-app.herokuapp.com/ "Shapes")
