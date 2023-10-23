#Soothing Systems

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

class SoundManager{
    +Number bpm
    +Sound sparkleSound
    +Sound waveSound
}

class Sound{
    +isLooping
    +gameSession
    setup()*
    trigger()*
    startLoop()
    stopLoop()
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

## State Diagram

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

- the manager base class supplies the singleton objects P5 and Session. Rather than getting these through the class hierarchy, we could just import them as needed in concrete implementations. Disregard this if managers will supply additional abstract behavior.

- testing game objects currently requires spinning up the whole environment; we might benefit from a lighter testing harness for some components; for example testing a single game object.

- instead of passing gameSession by inheritance hierarchy, just include a singleton constructor? Lots of member chains...

- collision BB is assumed at root game object

- rotation and scale assumed at base game object; consider particles which have none...