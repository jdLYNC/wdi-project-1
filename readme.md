# GA WDI Project 1 - Shapes
[Improvements](#improvements "improvements")

<img src="https://i.imgur.com/dqFmB9N.png" alt="shapes game start menu">

## Premise
Shapes is a 'hole-in-the-wall' style game.  The aim is to fit your shape inside the hole when time the time runs out.

## Brief
To build a browser-based game using HTML, CSS and JavaScript.

## Approach
After being presented with the project brief I considered several ideas for appropriate products, my selection criterea were based on finding an idea that would push the limits of the skills I had learnt so far, while also being simple enough for me to deliver a polished and professional product within the deadline.

Once I had settled on the idea of Shapes my goal was to reach an MVP as early as possible.  I created the basic styling early on to gain a better feeling for the final product throughout the development process and then worked quickly towards the basic controls and the win/lose conditions.  Once these the were completed the second half of the project week was devoted to gaining user feedback, finetuning the win/lose conditions and adding additional styling and ancilliary functionality.

## Technologies used
* HTML5
* CSS, **SCSS**, **Gulp**
* JavaScript, **jQuery**

## Features
Shapes features a timer, offset position mapping and manipulation and element rotation (controlled and automatic) in its game logic.  Other features include start and end game menus, a non-persistent high score record, animated gif instructions, background and triggered audio and animation.

## Challenges
The primary challenge with Shapes was programming the win condition.  Adding continuous rotation to the target hole made an otherwise simple task highly complex.  The reason for this being the way the win condition was measured, comparing the offset of the hole `<div>` with the offset of the shape `<div>`.  The problem this presented was twofold, first the 'win window' (the offset of the hole with an added margin on both axes) did not rotate with the hole resulting in it quickly losing alignment with the hole (illustrated below) and triggering wins and losses incorrectly.

<img src="https://i.imgur.com/Z9vAzS8.jpg" alt="shapes game start menu">

The solution to this was to add an extra element to the win condition, measuring and comparing the rotation of the hole and shape as well as their offset.  However, this solution presented an additional problem in that the rotation data returned by jQuery `.css(transform)` was in the form of a 6 digit matrix in a string.  To use this data a new function was required to convert this data into a useable number of degrees.

## Successes
Throughout the project I sought user testing from my peers and implemented clear instructions and improved audio-visual queues to user during play as a result of their feedback.

In technical terms my greatest success was the solution I implemented to the win condition problem outlined above.

Overall I was very pleased with the final product I delivered for this project, in particular the design, aesthetic and UX.

## Improvements
Having completed the project there are a number of small improvements I would like to make to the game as well as one possible significant change.
### Minor Changes
* Audio muting options.
* Transitioning background colours for added variety.
* Fine tuning of the current win-condition margin.
### Major Changes
* An alternative solution to the win condition problem.  Instead of measuring offset checking for the user mouse hovering over a transparent `div` with a raised `z-index` located in the centre of the hole.
* Possible addition of a click event to immediately 'drop' the shape through the hole and end the timer.

## Link ##
[Visit Shapes on Heroku](https://shapes-app.herokuapp.com/ "Shapes")
