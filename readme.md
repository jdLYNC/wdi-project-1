# Shapes

*GA WDI Project-1

### Installation and set-up

### Premise
Shapes is a 'hole-in-the-wall' style game.  The aim is to position your shape inside the hole before the time runs out.  The shape's movement is tied to the mouse position and its rotation is controlled by scrolling.

### Approach

### Challenges
The primary challenge for coding Shapes was the win condition.  To win a level the user is required to position their shape clearly within the boards 'hole'.  In the code this translated to a condition which checked both the offset and rotation of the .shape <div> against the same properties of the .hole <div> and an additional margin.

This solution presented a key issue, the absence of rotation on the 'win window' created by the hole's offset and added margin (as well as the win windows untrackable movement to the current top-left-most corner during rotation).  To surpass the rotation issue I instead opted to

This solution presented two key issues, first how to deduce the <div>s' rotation, second the absence of rotation on the 'win window' created by the hole's offset and added margin.  Solving the first issue required the creation of a new function that converted the 6 digit matrix string returned by jQuery .css('transform') into a number of degrees.  This enabled the program to pull rotation data in a manner that was both easily intelligible and comparable.

The second issue
