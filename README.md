# Control mutiple agv
Path finding, task scheduling for multiple AGV robot
## Requirements
- python v3

## Setup
```sh
poetry shell
poetry install
```
## Run
```sh
uvicorn main:app --reload
```

![Demo](./web/chrome-capture-2022-8-22.gif)

## References
* [Time enhanced A∗: Towards the development of a new approach for Multi-Robot Coordination](https://www.researchgate.net/publication/280527637_Time_enhanced_A_Towards_the_development_of_a_new_approach_for_Multi-Robot_Coordination)
* [A temporal optimization applied to time enhanced A*](https://sci-hub.se/10.1063/1.5114225)
* [Grids and Graphs](https://www.redblobgames.com/pathfinding/grids/graphs.html)
