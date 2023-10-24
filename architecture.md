# Soothing Systems Architecture

Here's a first pass on some architecture diagrams. Feel free to contribute!

I intend to add more subsystems and break it into different levels of detail as I work my way through the codebase. Ultimately it is meant to give a 'lay of the land' to contributors at a glance.

These diagrams are made using [Mermaid.js](http://mermaid.js.org/), which automatically generates various diagrams from grammar rules and ascii art! An emergent benefit of this approach is it works pretty well with version control and incremental changes. 

 - <small>[PlantUML](https://plantuml.com/)! is another good diagramming tool.</small>

Mermaid is supported by a lot of flavors of [Markdown](https://www.markdownguide.org/), most importantly [GitHub](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams) and [GitLab](https://docs.gitlab.com/ee/user/markdown.html#mermaid).
So any mermaid code you upload is automatically converted to diagrams when viewed in repo.

A Mermaid previewer is really handy while working on diagrams in VsCode. Here is the extension id of the best one I have used so far;

> **bierner.markdown-mermaid**

You normally don't have to go crazy with diagrams- the full UML recommendations are really heavyweight! However, I often find Class, sequence, and flowchart diagrams invaluable. This is the easiest way I have found to make them so far!

## Class Diagrams

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

**TODO**

```mermaid
sequenceDiagram

```

## Menu State Diagram

**TODO**

```mermaid
stateDiagram-v2
    [*] --> Main
    Main --> About
    About --> Main
    Main --> Load
    Load --> Game
    Game --> Load
```
