# Soothing Systems

## Class Diagrams

Taking notes on system architecture, will eventually break diagram into subsections at the right level of detail...

``` mermaid
---
title: Soothing Systems
---

classDiagram

GameSession "1" o--o "n" State
GameSession "1" o-- "n" Pose
GameSession "1" o-- "1" SoundManager
GameSession o-- Manager
State <|-- GameState
State <|-- AboutState
State <|-- MenuState
State <|-- LoadingState
Manager <|-- SoundManager
SoundManager o-- SparkleSound
Sound <|-- SparkleSound


class GameSession{
    note "Singleton"
    +State[] states
    +State currentState
    +Skeleton skeleton
    +Boolean skeletonLoaded
    +Pose[] poseLandmarks
    +GameSession instance
    +P5 p5
    +Canvas canvas
    +Color backgroundColor
    +Color flashColor
    +SoundManager soundManager
    +ParticleManager particleManager
    +BreathingManager breathingManager
    +Number canvasHeight
    +Number canvasWidth
    +spriteManager
    +mediaPipe

    +addStateToGame(State state)
    +setCurrentState(State state)
    +setCurrentStateByName(String stateName)
}

class State{
    <<Abstract>>
    +String name
    +GameSession gameSession
    +P5 p5
    +State prevState
    setup()*
    update()*
    render()*
    resize()*
    cleanup()*
    keyPressed()*
    keyReleased()*
    keyTyped()*
    keyIsDown()*
    mousePressed()*
    mouseReleased()*
    mouseMoved()*
    mouseDragged()*
    mouseClicked()*
    doubleClicked()*
    mouseWheel()*
    requestPointerLock()*
    exitPointerLock()*

}

class GameState{
    -backButton
    -menuButton
    -testTarget
    -testTarget1
    -narrator
}

class AboutState{
    -backButton
    -tsyButton
    -yogaButton
    -howGameButton
    -creditsButton
}

class MenuState{
    -backButton
    setup()
    render()
    update()
    mousePressed()
    mouseReleased()
    cleanup()
}

class LoadingState{
    +Boolean cameraLoaded
    +Boolean loading
    Boolean loadingBackgroundImg
    setup()
    update()
    render()
    resize()
    cleanup()
    mousePressed()
    mouseReleased()

}

class Pose{
    +Number x
    +Number y
    +Number z
    +Number score
    +Number name
}

class Manager{
    -GameSession
    -P5
}

class Sound{
    +isLooping
    +gameSession
    setup()*
    trigger()*
    startLoop()
    stopLoop()
}

class SoundManager{
    +Number bpm
    +Sound sparkleSound
    +Sound waveSound
}

class SparkleSound {
    -Number delay
    -Number baseVol
    -String[] notes
    trigger()
    startLoop()
    stopLoop()
}


```

## initialization sequence

```mermaid
sequenceDiagram


```

## Menu State Diagram

```mermaid
stateDiagram-v2
    [*] --> Main
    Main --> About
    About --> Main
    Main --> Load
    Load --> Game
    Game --> Load
```

## Notes;

- the manager base class supplies the singleton objects P5 and Session. Rather than getting these through the class hierarchy, we could just import them as needed in concrete implementations. Could reduce code complexity and make testing easier. Disregard this if managers will supply additional abstract behavior.

- testing game objects currently requires spinning up the whole environment; we might benefit from a lighter testing harness for some components; for example testing a single game object.

- instead of passing gameSession by inheritance hierarchy, just include a singleton constructor? Lots of member chains...

- Collision BB is assumed at root game object. Rotation and scale assumed at base game object; However exceptions exist. consider particles which have no dimensions. Should we add more game objects to avoid 

- Usually root classes are implemented so individual systems(physics, particles, etc) can treat a collection of game objects uniformly. However the current game loop explicitly invokes these methods. Meaning we have an interface but nothing is treated generically. is it just for conceptual purposes?

- UI is homebrew; Is there a reason we are rending UI in the game canvas? is this a conscious effort to get people familiar with UI from scratch or be a solely P5 project? If there isn't an explicit goal we might consider just moving it all to normal HTML5 elements and have the game loop respond to plain old DOM events. easier to style and maintain. can even use your favorite css framework. The experience will probably be more transferrable for students interested in web design too.
  - I can see this needing SPA-like functionality for the UI overlays which would then need to be synced with the game state which is presumably what we were trying to avoid!
  - HTML5 Canvas actually allows you to add DOM elements 'inside' the canvas, and P5 does expose this functionality. So we may be able to still use HTML components directly in the context of your game states.
  - I need to think about this more...

- setup and cleanup calls 