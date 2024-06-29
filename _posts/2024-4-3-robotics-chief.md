---
title: 'Programming through the 2024 Robotics Season'
date: 2024-04-03
permalink: /posts/robotics-development/
tags:
  - programming
  - robotics
---

All of the programming related things we did in the 2024 robotics season, Crescendo.

All of this is taken from our Open Alliance page, which you can find [here](https://www.chiefdelphi.com/t/frc-1257-parallel-universe-2024-build-thread-open-alliance/447080). Throughout the season, I contributed heavily there.

# 1/28 Programming Update
After picking a robot design, our programming team started thinking about how we wanted to organize our robot. Including how to tackle our new challenge of SWERVE! We also have to plan out driver control methods, vision, autos, and the works. This post will highlight everything our programmers have done so far.

[GitHub Repository](https://github.com/FRC1257/2024-Robot/)

## Software Library Decisions

### Advantage Kit

Recently, we created our [2024 robot code project](https://github.com/FRC1257/2024-robot/tree/swerve)! We made the decision to use [Advantage Kit](https://github.com/Mechanical-Advantage/AdvantageKit/tree/main) to help log data on our robot and improve the real and simulated separation of our code. We hope that this will help us debug problems in our code before we test it on the robot and better understand how our robot works by analyzing log files in [Advantage Scope](https://github.com/Mechanical-Advantage/AdvantageScope). 

In addition, they also have some really good example projects, especially for [advanced swerve drive](https://github.com/Mechanical-Advantage/AdvantageKit/tree/main/example_projects/advanced_swerve_drive/src/main/java/frc/robot). So we decided to use their template code as the base of our project. 

### Photon Vision

Last season, our team used [Photon Vision](https://photonvision.org/) to detect April Tags. We had code to combine the pose estimates from one camera to update our odometry. However, we didn’t end up using it very much. 

This year we plan to use two coprocessors. One Raspberry Pi 4 from last year with one camera and a new Orange Pi 5 with two cameras. We will use two cameras for April Tag detection and one on the Orange Pi for [note detection](https://docs.photonvision.org/en/latest/docs/objectDetection/about-object-detection.html). Photon Vision makes it really easy to set up these vision measurements and use them in our code.

The first thing that I worked on was incorporating vision into our project base. I started by using Photon Vision examples to create [simulation](https://docs.photonvision.org/en/latest/docs/examples/simaimandrange.html) and [real](https://docs.photonvision.org/en/latest/docs/programming/photonlib/robot-pose-estimator.html) IO classes in our [vision subsystem](https://github.com/FRC1257/2024-Robot/tree/master/src/main/java/frc/robot/subsystems/vision). Then I worked to add dual camera support. We use these values in the pose estimator built in to our drive subsystem. Here is a screenshot of what the simulated camera looks like. Below is a video showcasing vision and pose estimation working in tandem.

![alt_text](/images/posts/frc24/black.png "image_tooltip")


<iframe src="https://www.youtube.com/embed/X5Xm3rrZEt4"></iframe>

### Path Planner

#autonomous #pathplanner

Last season, our team created a [customizable auto system](https://github.com/FRC1257/2023-Robot/blob/master/src/main/java/frc/robot/commands/GenerateTrajedies.java) using WPILib trajectories. This year, with swerve, we want to use a more powerful system to fully utilize the benefits of our new drivetrain. So we decided to use [Path Planner](https://pathplanner.dev/home.html), which was already integrated into our base project. 

Path Planner has a nice [web UI](https://github.com/mjansen4857/pathplanner) that we can use to create autos and run commands in between. It also has support for generating trajectories [on the fly](https://pathplanner.dev/pplib-create-a-path-on-the-fly.html) which we can use to create another customizable auto system for this year. We think this might be really useful in higher levels of play along with our manually created autos. Below is an example of an auto running on the simulated robot.

<iframe src="https://www.youtube.com/embed/KnJ286f669I"></iframe>

## Features 

### Advantage Scope

To test the physical movements of our robot in simulation, we wanted to [import our robot CAD](https://github.com/Mechanical-Advantage/AdvantageScope/blob/main/docs/CUSTOM-ASSETS.md) to [Advantage Scope](https://github.com/Mechanical-Advantage/AdvantageScope). I separated our robot CAD into drive base and pivot components to use in Advantage Scope. Here is the [folder](https://github.com/FRC1257/2024-Robot/tree/master/advantage_scope/Robot_AllenV1) that we created to store our configuration and object files. Below is a picture of the robot in simulation. (the arm isn’t in the correct position but we hope to fix that later)


![alt_text](/images/posts/frc24/sim.png "image_tooltip")


Another thing we created was a custom Advantage Scope layout for our code. We decided to store this in our [Advantage Scope folder](https://github.com/FRC1257/2024-Robot/tree/master/advantage_scope/) as well to allow for easy access for all our programmers.

### Auto Aim

We worked on some rudimentary [auto-aim code](https://github.com/FRC1257/2024-Robot/blob/master/src/main/java/frc/robot/commands/DriveCommands.java) for our drivetrain that controls the angle of our robot as we move around the field. It constantly tries to put the shooting end of our bot at the position of the speaker. It works with a PID controller connected to the robot’s angular speed. Here is a video of it in action.

<iframe src="https://www.youtube.com/embed/Y1pcj-bU0sI"></iframe>

### Path Finding

#pathing

Initially, we were having some trouble getting [path finding](https://pathplanner.dev/pplib-pathfinding.html) with Path Planner working. Path finding allows us to move to positions on the field while avoiding obstacles. This would be useful for moving to specific points of the field like the AMP, SOURCE, or SPEAKER. Instead, we began by [generating trajectories](https://pathplanner.dev/pplib-create-a-path-on-the-fly.html) to points. The problem with this is that it ignores obstacles on the field, so it can drive through walls and solid objects which is not something we wanted. These trajectories are more customizable than path finding, so we will definitely use them with manually created trajectories to create our customizable auto system.

However, we did end up getting path-finding working this week. The problem was that we were using an older version of the `LocalADStarAK.java` file. Once we updated [that file](https://gist.github.com/mjansen4857/a8024b55eb427184dbd10ae8923bd57d), we were all set. Below is a video of the robot path finding to the AMP and SOURCE.

<iframe src="https://www.youtube.com/embed/oZoH1J_pXK4"></iframe>

Here is a more complete video of our robot in simulation with all the things we can do.

<iframe src="https://www.youtube.com/embed/pkk5lIfQLZY"></iframe>

With this drive and vision code down, our team can build on top of this base to accomplish all of our goals.

## Testing Swerve

Once our drivetrain was built, we flashed all of our motor controllers and our roborio with the latest software. We also zeroed our absolute encoders for measuring the turn and ensured our motor controllers had the right IDs.

The first time we ran our code on the bot the turn motors were jittering and making all sorts of crunching noises. Clearly, something wasn’t working correctly. Thankfully we had a fallback option. We used the [REV MAXSwerve](https://github.com/REVrobotics/MAXSwerve-Java-Template) template to test our robot and it worked!

[Video of it in action!](https://drive.google.com/file/d/1INTUDGdMCMWSMVrwqUqiTQ8VGbZaGMfb/view?usp=sharing)

Thanks for making this edit Michael!

Later, we realized the Advantage Kit example code that we copied was meant for a different swerve module and the encoders the code was looking for were non-existent. So we brought the REV MAXSwerve code to our code and prepared to test it on the robot. We’ll test it next week to see if it works. It would really suck if it didn’t 😭.

## Programming Subsystems

We’ve split up our team to work on the Pivot, Intake/Shooter, Ground Intake, Climb, and Trap?!?! mechanisms. Each group has 3-4 programmers on it and they will all contribute to their own subsystem branches in the code. Once they are done, we will merge everything together for our final robot code!

Currently, once we get the basic layout for our subsystems down, we plan to build on top with more advanced and autonomous features in different branches. Hopefully, the code for the subsystems will be done within a week or so and after that we will reconvene to talk about what exactly we want to do for autos. That’s when we’ll create some of our hard-coded Path Planner autos and think about what sort of customizable autos to add in the future.

In addition, we’ll also work together to figure out how to shoot while moving. Right now, we’re going to take it one step at a time, starting with the bare minimum going up to a fancy autonomous system.	

## Things to do

This week our programming team wants to:

* Get our swerve bot working with our Advantage Kit code
* Set up Vision
    * Calibrate April Tag Detection
    * Note Detection
* Finish Subsystems
* Test Things we made in simulation
    * Auto-aim
    * Path Finding
    * Pose Estimation
* Create Advantage Scope Layouts

Bonus:

Here’s a video I made explaining swerve for our members

<iframe src="https://www.youtube.com/embed/gwmCFI6-dKg"></iframe>

# 2/13 Programming Update

[TL;DR generated by ChatGPT](https://chat.openai.com/share/656efc8e-6a4c-4f32-a55b-9cc657da75ad): We built subsystems like a pivot, intake, shooter, and LED control for our robot. Used PID loops, tested in simulation, and integrated controller commands. Created a GitHub repo for real logs. Developed a note-shooting visualizer and planned auto routes for our swerve drive. Future plans include finishing the robot, testing, vision tuning, and documentation. Check out our videos and code progress. Thanks for reading! 


## Making all our Subsystems

### Pivot

We created a [branch for our pivot subsystem](https://github.com/FRC1257/2024-Robot/tree/pivot/src/main/java/frc/robot) which uses 4 NEOs following each other to move the entire mechanism. We added PID position and voltage control modes to this system. We also added some code to make the PID values [Tunable Numbers](https://github.com/FRC1257/2024-Robot/blob/pivot/src/main/java/frc/robot/util/LoggedTunableNumber.java) which helps while testing. We also added some basic commands and bound them to controller inputs. In our code, we ran our robot in simulation to catch some of the bugs it had before. Below is a video of the robot running in simulation and showing our CAD move in Advantage Scope. It took a while for us to tune our robot [configuration](https://github.com/FRC1257/2024-Robot/blob/pivot/advantage_scope/Robot_AllenV1/config.json) in Advantage Scope to look correct. 

<iframe src="https://www.youtube.com/embed/W6bo5JZr7Ow"></iframe>

### Intake / Ground Intake

Programmatically, both of these subsystems are nearly identical. The only difference is that the [intake system](https://github.com/FRC1257/2024-Robot/tree/intake/src/main/java/frc/robot) has a break beam sensor while the [ground intake](https://github.com/FRC1257/2024-Robot/tree/ground-intake/src/main/java/frc/robot) does not. So, we decided to finish the intake first, then copy-paste the code and remove the break beam for our ground intake code. This allows the ground intake to work in tandem with the intake as commands are executed.

Some notable features are [PID loop for velocity](https://github.com/FRC1257/2024-Robot/blob/46f2baabf80722809a44ff3192bf4bf2669849e7/src/main/java/frc/robot/subsystems/Intake/IntakeIOSparkMax.java#L73) and [commands with the break beam](https://github.com/FRC1257/2024-Robot/blob/46f2baabf80722809a44ff3192bf4bf2669849e7/src/main/java/frc/robot/subsystems/Intake/Intake.java#L64) like intaking till it detects a note.

We tested these in sim, but didn’t record any videos of it. The only visual way of seeing if it was working was to use Advantage Scope to graph out the intake speed and setpoint.

Much of the code’s structure is based on our [virtual 2023 robot](https://github.com/FRC1257/Virtual-Robot/).

### Shooter

Since we have a very similar shooter design to 6328, we are taking some inspiration from [their shooter code](https://github.com/Mechanical-Advantage/RobotCode2024/tree/main/src/main/java/org/littletonrobotics/frc2024/subsystems/superstructure/flywheels). We made sure to include velocity PID loops for both sides and create the relevant commands using it. Currently, we are working on some math to control the speed that our shooter needs to go and the angle of the arm to score shots in the speaker.


![alt_text](/images/posts/frc24/shooter.png "image_tooltip")


### LED

We’re also going to have LEDs on our robot controlled by the [REV Blinkin](https://www.revrobotics.com/rev-11-1105/). We’ve never used these before, so we were super grateful to find this code with exactly what we were looking for:

[REV Example Code](https://www.chiefdelphi.com/t/rev-blinkin-example-code/452871/4?u=akeboss)

We haven’t made any commands or anything yet to control our LEDs, but will do so in the future.

## Putting it all together

We put all of our subsystems together in the [super structure branch](https://github.com/FRC1257/2024-Robot/network) to later combine with our swerve branch and bring in to master. Masterfully written post coming to explain our issues with swerve and how we fixed them.

Here’s a visual of our network graph so you can see the code being merged into the Super Structure branch (blue) and later master (white).


![alt_text](/images/posts/frc24/gittt.png "image_tooltip")



![alt_text](/images/posts/frc24/gittmerged.png "image_tooltip")


## Other Extra Features

### Note Shooting Visualizer

Recently, Advantage Scope added support for [3D Trajectories](https://www.chiefdelphi.com/t/advantagescope-2024-log-analysis-robot-telemetry-continued/442658/48?u=akeboss), so we thought it would be cool to make a little note-shooting simulator for our robot. Currently, the speeds are hard-coded to move at a set speed when set to launch, so later we will incorporate it with our shooter mechanism to take the velocities from there to show. We added a small [util section](https://github.com/FRC1257/2024-Robot/tree/master/src/main/java/frc/robot/util/note) to our code to store all this note visualization stuff. Another feature we need to add is to incorporate the robot’s speed into account for the note simulation. 

Later on, unrelated to simulating shots, we also want to write some more code to simulate notes on the ground for our intake to pick up in simulation. 

Here’s a video of it in action:
<iframe src="https://www.youtube.com/embed/4srhygaGKlE"></iframe>

Bonus: 

Here’s a video of the trig being messed up in our simulation class. 
<iframe src="https://www.youtube.com/embed/UTBXmu_R084"></iframe>

It was missing code to multiply the horizontal speed by the cosine of the pivot angle.

Here’s a video of it not working when we move the robot around. Also, the code to show the pivot component was also messed up.

<iframe src="https://www.youtube.com/embed/1p_AlynLhpo"></iframe>

The y value needed to be negated. For the arm component, the Pose3d needed to be at the origin of the field not at the position of the robot. 

### Controller Commands

We also added a new [Drive Controls util class](https://github.com/FRC1257/2024-Robot/blob/master/src/main/java/frc/robot/util/DriveControls.java) to our code which will allow us to have different controller modes depending on the driver or operator of the robot. It works by storing our controller and the different inputs we might want from the controller as static variables that are accessed elsewhere. 


![alt_text](/images/posts/frc24/controller_commands.png "image_tooltip")


Then we instantiate these controls depending on the driver or operator. 


![alt_text](/images/posts/frc24/configure.png "image_tooltip")


We added this mainly because we might want to have different controller layouts when we are testing the robot or to customize the controls to what other drivers might want it to be set to.

Then we configure all our commands as normal.


![alt_text](/images/posts/frc24/speaker_aim.png "image_tooltip")


### Storing Real Logs

Another addition we made was to create a GitHub repository to upload the real robot logs we get to keep them all in one place. Here it is

[2024 Logs](https://github.com/FRC1257/2024-Logs) 

## Autos

With all our subsystems done, we’ve started planning out auto routes. Since it’s our first year with swerve, we spent a while playing around with [Path Planner ](https://pathplanner.dev/pathplanner-gui.html)just to see what we could do with it. We knew that we wanted to have as many autos as possible, so for now we split up our group to try to make as many autos during our last meeting as we could. Here’s one example, the rest of our autos are in our robot code repo.

<iframe src="https://www.youtube.com/embed/Ex8V-GmCdbE"></iframe>

We made sure to use [linked waypoints](https://pathplanner.dev/gui-project-browser.html#manage-named-commands-and-linked-waypoints) to make sure our paths remained the same everywhere if we changed one point. In addition, we also added some named commands to [event markers](https://pathplanner.dev/gui-editing-paths-and-autos.html#event-markers) to run during these paths. These are all the commands we anticipate using for now. 


![alt_text](/images/posts/frc24/comms.png "image_tooltip")


## Road Ahead

### Our plan

* Finish the Robot
    1. Test Motors/Encoders/Sensors
    2. PID Constants and SysId
    3. Vision Tuning
    4. Run our Autos
* Shooting
    
    5. Shooting from anywhere on the field
    6. Shooting while moving
* Autos
    
    7. Work on a bunch of autos in Path Planner
    8. Work on customizable ones
    9. Note following command using vision
* Documentation
    
    10. Make some nice visuals with all our commands and autos
    11. Create and stick to a naming convention for our autos

Onward to the next week of build season! Here’s a little picture of what our robot looks like right now. Thanks for the picture Kevin!


![alt_text](/images/posts/frc24/bot_prog.png "image_tooltip")


Thanks for reading! Have a wonderful day!

# 2/28 Programming Update
Hello!

Instead of me (Akash) writing the programming post for this week. I thought I would hand it off to our programming team to talk about instead! Hope you enjoy!

[TL;DR generated by ChatGPT](https://chat.openai.com/share/1301dc22-eb39-4d8a-a530-22aef1e23fea):
Hey folks!

Our programming team has achieved significant milestones in robot development. They tackled shooter and pivot complexities, opting for a versatile lookup table approach. LED functionalities were implemented based on dynamic robot states, and a Note Shooting Visualizer class was crafted for simulation and tuning. Compound commands like autoScore and shootSpeaker were explained, showcasing efficient robotic actions. Vision code was enhanced to consider Pose estimates’ averages for improved accuracy. The team also designed multiple autonomous routines, including customizable ones through the Elastic dashboard. NoteChooser facilitates autonomous routine selection, while preparations for testing, PID tuning, vision optimization, and code cleanup are underway.

Cheers,
1257 Programming Subteam

## Things we worked on
### Shooter and Pivot
Darrien, Tyler, and Sam

Shooter code, shoot anywhere, and shoot while moving

#### Shooting While Moving
Recently, we’ve been trying to play around with all the above kinds of shooting commands and created one that can hopefully shoot from any position while stationary and moving. The command waits for the robot to turn towards the speaker, then uses the lookup table to determine the appropriate shooter speed and pivot arm angle to score.

Here’s [our code](https://github.com/FRC1257/2024-Robot/blob/ea8b40ac194a77f1de93b913e1a60e9ff37cc475/src/main/java/frc/robot/RobotContainer.java#L401). It doesn’t exactly work yet as we’ve seen in simulation, however, we’re going to fix up the problems to get it working soon.

<iframe src="https://www.youtube.com/embed/pCzEHhQW0rU"></iframe>

#### Lookup Table Rationale:
Instead of using [a mathematical equation](https://www.desmos.com/calculator/sbktfvbnbm) to calculate angle and RPM, we decided to use a lookup table. Because real life physics are nonlinear and dynamic, we will inevitably need to adjust values to compensate. Compared to a single math equation, the lookup table allows us to adjust values very easily.

We were mainly inspired by [this post by Team Rembrandts](https://www.chiefdelphi.com/t/frc-4481-team-rembrandts-2024-build-thread-open-alliance/441907/296).

We also wrote a class to tune [our table](https://github.com/FRC1257/2024-Robot/blob/dev/src/main/java/frc/robot/util/misc/Lookup.java) with [Logged Dashboard Numbers](https://github.com/FRC1257/2024-Robot/blob/dev/src/main/java/frc/robot/util/misc/LookupTuner.java) to make testing easier.

We know that WPILib has its own built in [InterpolatingDoubleTreeMap](https://github.wpilib.org/allwpilib/docs/release/java/edu/wpi/first/math/interpolation/InterpolatingDoubleTreeMap.html) and we plan to use it in the future.

#### TurnSpeakerAngle Command
The command defines the speaker’s location and creates a vector between it and the robot’s current location. A `Rotation2d` method is then used to determine how far the robot must rotate to be ready to score into the speaker. Here is the code for it.

#### ShootWhileMoving Command
The command runs the TurnSpeakerAngle command in parallel; This is necessary for the robot to shoot accurately and is a more efficient implementation as opposed to copying the previous command.

Every tick, the robot gets the ideal angle, sets the pivot arm PID accordingly, and runs the PID. The PID gets closer and closer to its setpoint, and when it is at the setpoint, the shooter runs at the ideal RPM. The ideal angle and RPM are derived from the getRPM and getAngle functions from before.

If interrupted, the command stops the pivot and shooter. The end condition for the command is for the pivot and shooter to reach their setpoint. An andThen is used to make sure the intake is available before the command is over.

#### ShootAnywhere Prerequisite Functions:
See [here](https://github.com/FRC1257/2024-Robot/blob/ea8b40ac194a77f1de93b913e1a60e9ff37cc475/src/main/java/frc/robot/RobotContainer.java#L473) for these methods.

`getEstimatedTransform`
- Using the current velocity, it predicts how far the robot will move over 20ms (one tick)

`getEstimatedPosition`
- Returns the estimated position in the next tick. It adds the estimated transform to the robot’s current position.

`getEstimatedDistance`
- Returns the distance between the speaker position and the estimated position.

`getAngle / getRPM`
- Uses the distance from getEstimatedDistance, inputs it into the lookup table, and returns the ideal Angle or RPM.


### LED
This [system](https://github.com/FRC1257/2024-Robot/blob/led-commands/src/main/java/frc/robot/subsystems/LED/BlinkinLEDController.java) flashes LED different colors based on the state of the robot. The BlinkinLEDController has a bunch of static variables that describe the state of the robot

- isEnabled: true if robot is enabled, false otherwise
- isEndgame: true if match time < 30 seconds, false otherwise
- noteInIntake: true if there is a note in the intake, false otherwise
- shooting: true if the robot is currently shooting a note, false otherwise
- pivotArmDown: true if the pivot arm is down, false otherwise

Unlike a subsystem, variables are updated in LEDPeriodic method in [RobotContainer.java](https://github.com/FRC1257/2024-Robot/blob/f366f90203d0c1f1e3e24279811e7ed15867f076/src/main/java/frc/robot/RobotContainer.java#L350), which runs periodically, and LEDs are updated in periodic method in BlinkinLEDController.java based on these variables

Here’s a picture of us setting up the Blinkin controller and configuring colors.

![alt_text](/images/posts/frc24/images/image3.jpg "image_tooltip")

### Note Shooting Visualizer
The Note Visualizer class is designed to facilitate the analysis of, and subsequent manipulation of code used in shooting from various positions, and tuning of the aforementioned lookup table. It’s important to note that the Note Visualizer class is strictly for simulation purposes, and does not have any effect on the robots shooting during a match.

`setRobotPoseSupplier`
- Sets the supplier values for robotPoseSupplier, leftSpeed, rightSpeed, and pivotAngle

`shoot`
- Simulates the action of shooting a note using a variety of closely associated classes and methods.

### Note Following
We also wrote some code to follow notes, however, we haven’t been able to test it on our robot yet. We have two different approaches: one that estimates the Pose2d of the note and [creates a trajectory towards it](https://github.com/FRC1257/2024-Robot/blob/39971a8f0a0333bb338dbd5637599f68cddeeedf/src/main/java/frc/robot/subsystems/drive/Drive.java#L418) 1and another that just takes [the angle to the note](https://github.com/FRC1257/2024-Robot/blob/39971a8f0a0333bb338dbd5637599f68cddeeedf/src/main/java/frc/robot/commands/DriveCommands.java#L237).

### Compound Commands
Carlos and Raghav

Here’s an explanation of some of our compound commands and a nice diagram.

`autoScore`
- Create a setpoint using PID for intake to go to
- Have the robot move to amp and intake go to setpoint at the same time
- Once the robot is ready, handoff happens and the note is released

`shootSpeaker`
- Arm moves to the position necessary to shoot note
- Set speeds for the shooter motors to shoot the note and then releases the note

`Handoff`
- For releasing note
- Set the speed of shooter motors and shoot out a note

`aimShooter`
- Uses PhotonVision and sets the position and angle needed to shoot note into speaker from anywhere on the field

![alt_text](/images/posts/frc24/images/image2.png "image_tooltip")

### Vision
We also redid our vision code to take the [average of our Pose estimates](https://github.com/FRC1257/2024-Robot/blob/ea8b40ac194a77f1de93b913e1a60e9ff37cc475/src/main/java/frc/robot/subsystems/vision/VisionIO.java#L53) and not just the “best” one. In simulation, the output looks slightly better however we won’t know till we test it.

### Autos
Bowen, Claire, Jase, Kavi, and Mai

So many autos! Here’s some information about our autos!

![alt_text](/images/posts/frc24/images/image4.png "image_tooltip")

- Naming convention:
    1. s(1-3): signifies the starting position (top mid or bottom)
    2. n(1-8): signifies the location of each note
    3. sc(1-8): signifies the shooting location correlating with each note position

- Types of autos
    1. There are no 1 note autos as that is fairly simple
    2. 2 Note, 3 Note, 4 Note, 5 Note, and 6 Note autos pick up that many notes and shoot in one autonomous round

- How we made the autos (in steps)
    1. Set 1 starting location of 3 possible (top middle or bottom)
    2. Call upon preset paths (paths typically go to a note location and then shoot)
    3. Make sure that the paths are smooth by copying the x and y coordinates of the ending positions to starting positions (could just guess and check)
- Example: (4 Note Auto Top)
    - [4 Note Auto Top.mp4 - Google Drive 1](https://drive.google.com/file/d/1X_mIqVcJiLMeSILMcZEiNqnDgYFSWrZd/view?usp=sharing)
    - This auto picks up a total of 4 notes and starts at the first starting position (the top)

### Customizable Autos
This year we wanted to be able to perform any auto action on the field. Our customizable autos are facilitated by the drive team who select the note positions for our robot to pick up at and then where they should be scored. The [MakeAutos.java file](https://github.com/FRC1257/2024-Robot/blob/dev/src/main/java/frc/robot/util/autonomous/MakeAutos.java) tells the robot to go to the note specified through our [Elastic](https://github.com/Gold872/elastic-dashboard) dashboard (basically a nicer version of ShuffleBoard), then directs the robot to the specified shooting position and shoots the note. The code has the capability to run this action four times for up to five note custom autos. These are the methods used:

goToPose: uses path finding to go to a location (specified by Elastic)

getSelected: a method used to retrieve the location from the Network Table (basically what’s in the Elastic dashboard)

deadlineWith: makes the robot operate an action simultaneously with another
- In this case it is to initiate the intake while the robot goes to the specified note

![alt_text](/images/posts/frc24/images/image6.png "image_tooltip")

### NoteChooser/AutoChooser
NoteChooser uses the SendableChooser class to present a selection of options to our dashboard. For example, we may want to select between different autonomous routines. By putting every possible Command into a SendableChooser, we will have a list of different options on the programming laptop. We have different options for starting positions, set score positions, and set note positions. By doing this, we can make the autos more efficient and optimize the process for autonomous.

![alt_text](/images/posts/frc24/images/image5.png "image_tooltip")

This screenshot of a sim shows the different dropdowns that the NoteChooser created. In this example, the robot first intakes Note 1, then shoots it at the top. Next, it chooses Note 2, and shoots it at the top again, and so on so forth.

![alt_text](/images/posts/frc24/images/image1.gif "image_tooltip")

This same process is displayed in this GIF, with different notes chosen.

(Note 8, Bottom; Note 7, Really Bottom; Note 3, Center; Note 1, Center) (4 Note Auto)

<iframe src="https://www.youtube.com/embed/EwmC1FrXmVE"></iframe>

We also added some code to [flip our poses in Field Constants](https://github.com/FRC1257/2024-Robot/blob/dev/src/main/java/frc/robot/FieldConstants.java ) to ensure that our code works on both sides of the field.

<iframe src="https://www.youtube.com/embed/8-o_SCfyLoQ"></iframe>


## Road Ahead
### Our plan
- Finish the Robot
    1. Test Motors/Encoders/Sensors
    2. PID Constants and SysId
    3. Vision Tuning
    4. Run our Autos
- Clean up our code
    1. Remove Unused Imports
    2. Reformat Code
    3. Add Comments
- Advanced Features
    1. Custom Web Dashboard maybe
    2. Autonomous Teleop Cycling
    3. Improving our simulation code to include notes for vision and intaking

# 4/1 Season Update
Take a look at our new website!!! 

[https://frc1257.org/](https://frc1257.org/) 

[TLDR Generated by ChatGPT](https://chat.openai.com/share/23c30543-a8ae-4a4d-817d-0e2c997b3e22): It's been quite a journey lately, with two competitions back-to-back and a myriad of challenges to navigate. At Seneca, despite our best efforts, we encountered issues with our swerve modules that hindered our performance. However, after reverting to the REV Max Swerve template, we saw significant improvements, marking a turning point in our competition experience. Moving on to Montgomery, we faced further hurdles with our vision system, intake aligners, and swerve driving, but with the help of fellow teams and CSAs, we tackled each obstacle head-on. Despite setbacks like periodic disconnections and mechanical failures, we persisted and made crucial repairs and improvements throughout the event. Looking ahead, we're grateful for the support of our sponsors and teammates as we continue to refine our robot for future competitions, with DCMP on the horizon. Thanks for following along, and stay tuned for more updates!

## [Seneca](https://www.thebluealliance.com/event/2024njtab)

Talk about driving around a bit before comp and some practice. Not too much though. No vision and no autos we want to test at comp

Before our first competition at Seneca, we only tested the basic subsystem movements on our robot. We tried driving around, running amp and speaker cycles, and intaking notes off the ground. We didn’t have any cameras on our bot so we couldn’t use the fancy auto-aim and auto code that we had planned. At Seneca, we hoped to progressively test new features and improve our robot. (in hindsight, this probably wasn’t a good idea)

### Saturday

We ended up missing our first practice match since we needed to prepare our robot to pass inspection. Our reversible bumpers were fairly close to the limit when we were on the red alliance. After that, we were ready to run. 

Our [first match](https://www.thebluealliance.com/match/2024njtab_qm4) was really bad. We didn't move initially and it set the tone for the rest of the competition. Because something about our swerve modules was broken, our drivers literally couldn’t control the robot.


![alt_text](/images/posts/frc24/comp/image1.gif "image_tooltip")


The robot is dead on the field for the first part of the match then it comes to life but moves uncontrollably as we try to align with the amp.

Right after our first match, we went through our logs to figure out what was going wrong. We didn’t have enough time to fully analyze it but we attempted changing the code to fix it (in hindsight again this was a poor decision since our code had worked before and it introduced new untested changes to the robot). Since our swerve wasn’t working, we decided not to run our Path Planner trajectories at all and instead run our robot forward for 2 seconds using field relative drive. However, sometimes it went backward so we kept negating it in an attempt to make it go forward (this issue is eventually fixed but it was at Montgomery).

However, even as we try to run this auto swerve still bugs out. [https://www.thebluealliance.com/match/2024njtab_qm20](https://www.thebluealliance.com/match/2024njtab_qm20) 

<iframe src="https://www.youtube.com/embed/iKECzELTLfs"></iframe>

Fast forward a few matches and we’re still struggling with this swerve issue. All our other subsystems are working fine.

As we frantically tried to fix the problem, we asked for help from all different sorts of teams. We also reserved a lot practice field time to test our robot, trying to pinpoint the exact cause of the issue. At the practice field, we realized that our gyro was repeatedly disconnecting over the course of the match. Seeing our logs, some of our team members joked that the gyro looked like a riemann sum 💀. Our command swerve states were waving around like they were the inflatable things at car dealerships and our robot could not match their oscillations, causing the robot to brown out over the course of the match. Clearly, something was wrong.


![alt_text](/images/posts/frc24/comp/image2.gif "image_tooltip")


Notice in this log that the joystick moves pretty smoothly but results in a lot of fast changes in the swerve modules.


![alt_text](/images/posts/frc24/comp/image3.png "image_tooltip")


This match’s log didn’t have the reinmann sum graph but still shows that the gyro wasn’t working. Our robot was moving around and spinning in the match, however, in the log, the gyro doesn’t go above 0.2 radians.

We tried a bunch of things like getting just robot relative drive working. But for some reason it wouldn’t work (in hindsight it should have worked since it doesnt need the angle so we thought it couldn’t be the gyro) We also tried a bunch of other suggestions like tuning our swerve PID and removing our Orange Pi, but these weren’t the source of our issue.

Thank you to all the teams at Seneca trying to help us out we really appreciate it!

#### Quals 33 the turning point

By now we thought it was all over for us, we couldn’t find what was going wrong, so we decided to revert to the REV Max Swerve template that we started with at the beginning of the season. After plugging in our swerve constants, we head out to the practice field and it worked!!! We were chilling!! The only issue was that it didn’t have any code to move our subsystems, but at least we could drive around robot relative. At the start of qualification 33, we didn’t expect anything to happen during auto but were delighted to see the WPILib example trajectory run beautifully on our robot! It really lifted our spirits and although we were a defense bot during the match we were on the up.


![alt_text](/images/posts/frc24/comp/image4.gif "image_tooltip")


In the minutes right after the match, we worked tirelessly to add our subsystems to this new version of the code, subsystem by subsystem. Honestly, it was some of the most stressful programming I’ve ever done. That night our entire programming team worked through the night and on the bus ride to add all of the PID controls and basic autos to our new version of the robot code.

Stories will be told about our courage and resistance while rewriting our entire codebase in a day. This is the branch that we created based on REV swerve with all our subsystems. It’s basically our same code base without Advantage Kit.

 [https://github.com/FRC1257/2024-Robot/commits/CodeModifiedWithRev/](https://github.com/FRC1257/2024-Robot/commits/CodeModifiedWithRev/) 

In addition to this code, we also created another version of our code where we took our current Advantage Kit code and swapped out all the swerve code with what was in the REV Swerve template. We wanted to have this as an option so we could see our logs after every match. Our logs really helped us debug the issues we were having and we are thankful for Advantage Kit!

[https://github.com/FRC1257/2024-Robot/tree/SwerveNoAdvantage](https://github.com/FRC1257/2024-Robot/tree/SwerveNoAdvantage)

### Sunday

After rewriting our code, we went into the day unsure of what would happen when we went to test it. We went to the practice field to test our changes (which also added Path Planner and our subsystems), however, they didn't work. We realized that the only other thing we changed was replacing the code for our gyro (since we weren’t using the one in the [REV Swerve template](https://github.com/REVrobotics/MAXSwerve-Java-Template/)) to use our NavX. Now we knew for sure that our NavX was messed up. On a whim, we tried our original code, but we used a gyro angle of zero instead of the (inaccurate) data being outputted by our NavX and it worked! We didn’t have field-relative swerve but at least it was robot-relative and we could move around with our original code!

It turned out that the code was not the issue, so the programming team was a little sad to not use the code we worked so hard on in the night. But we were happy that we could run the version we developing and testing over the course fo the season.

We began asking around if any teams had any spare NavXs. In the process of doing so, we realized that the gyro we were running was over 12 years old 💀. There were no teams at Seneca with a spare NavX 1.0, however, thankfully a miracle happened and 365 the Miracle Workerz lent us their NavX 2.0. We put it on our robot and went on the practice field once more, and now we had field-oriented swerve! Our swerve issues were finally fixed!! Unfortunately, though it was a little too late, qualification matches were already over and our position was very low down since our robot wasn’t operable for most of the competition. Although we were fixed by the end, it was a dismal performance by our team.

During alliance selection, we ended up getting picked by Alliance 1 composed of 365 (the Miracle Workerz) and 316 (LUNATECS)!!! Our team was very excited to have gotten picked and was determined to start our comeback arc. 

We were selected as a defense bot and we began working on a cheese-cake net (what we like to call the snail sail) to further block notes shot from other robots. Our drivers did a really nice job playing subwoofer defense and blocking robots from lining up and shooting. Although we had one slight hiccup that led us to the lower bracket, our robot was cruising through playoffs with no mechanical issues.


![alt_text](/images/posts/frc24/comp/image5.gif "image_tooltip")


Example of some subwoofer defense

Before our finals match, we saw that our robot had lost a lot of its pushing power. We flipped over our robot and saw that our wheel tread was basically gone. So before the match, we quickly replaced our wheels. Here’s a picture of what they looked like. 


![alt_text](/images/posts/frc24/comp/image6.jpg "image_tooltip")


Old wheel vs new wheel comparison

We ended up winning and got our first blue banner in eight years!!! Thank you again to our alliance the Miracle Workerz and the Lunatecs we are so happy that we could do this with you!


![alt_text](/images/posts/frc24/comp/image7.jpg "image_tooltip")


We also got the Engineering Inspiration award!!! First time in 15 years! Huge congratulations to our documentation team for this big achievement! They’ve been putting in the work to rebuild us from the ground up this year!


![alt_text](/images/posts/frc24/comp/image8.jpg "image_tooltip")


## Preparing for Montgomery

Even though we were on the winning alliance, we didn’t do very well. Here are the things we were working on. 



* Beautify the wiring
* Move RoboRio location
* Add camera mounts
* Wire photoelectric sensor
* Wire Orange Pi again with buck converter
* Intake aligners
* Creating autos that our robot can do without shooting anywhere

We mainly used this week to test the mechanical changes we made to the robot and focused on driver practice. We tested some basic autos but didn’t have time to get the vision and pose estimation things we needed on the robot.

## Montgomery

### Saturday 

When we arrived at Montgomery, we started with initially tuning vision. In our pit, we attempted to use the built-in calibrater in Photon Vision, but for some reason, it wasn’t working very well to detect tags. Also, it wasn’t properly updating our pose estimator with the vision estimates. We decided to use [https://calibdb.net/](https://calibdb.net/) for all future calibrations which is recommended. We also decided not to use vision at this competition since it would take a while to tune and we were running into some mechanical problems that were slowing us down.

One of the new things we were trying for this competition was a set of note aligners for our intake. When we put it on for a match though, they ended up twisting and breaking, so we had to take them off the robot. 

Another issue we had was swerve driving very slowly sometimes. We were thinking that this was an electrical issue, so we called over Kevin the CSA and he helped look through the rest of our logs to see what was wrong. In the end, it turned out to be an issue with our battery (if i remember correctly). We’re really thankful for Kevin helping us out through the rest fo the competition!


![alt_text](/images/posts/frc24/comp/image9.gif "image_tooltip")


In this swerve view, the blue arrow is where it should be pointing and red is where it is. You can see that the red is slow to catch up to the blue arrows. Also, the back left wheel is a little slower than the rest.

Another issue we faced was periodic disconnections in some of our matches. After troubleshooting we realized it was because our driver station laptop didn’t have much charge and Advantage Scope was also left running on it. The laptop was pulling 100% CPU so it physically couldn’t keep up with the robot. After we gave it some charge and closed out Advantage Scope and a bunch of other programs, the problem was fixed.

Later on, bearings started popping out of the shooter so our pit crew tried their best to make temporary repairs to it. We decided that this issue was happening because our shooter plates where made out of polycarb and not metal, so we decided to cut out new shooter plates out of metal to make sure that it didn’t happen again.

Another thing we noticed was that our bumper fabric was stuck in our wheels. This explains why the back left wheel was slower in some of our matches.

Then in one of our matches; our robot turned into a sledgehammer.


![alt_text](/images/posts/frc24/comp/image10.gif "image_tooltip")


The arm mashed against the subwoofer in the auto and was unusable for the rest of the match. 

After looking at the logs we realized our encoder wasn't getting inputs. Later we also saw our photoelectric sensor wasn’t working. We tried changing our encoder to a different port and using a different encoder but it was still broken. By then it was the end of the day and we thought the best way to prepare for the next day would be to have a replacement ready. We took one of our old RoboRio 1s and took it home to test the DIO ports. 

<iframe src="https://www.youtube.com/embed/ZfNz0uv_pkM"></iframe>

We got a spare RoboRio from 7587 and it worked! We tried testing the old RoboRio 2 with the same code that we ran on the replacement RoboRio 1 but it didn’t work. This means that there was a physical issue with our RoboRio 2. Apparently, this is a known issue with the RoboRio 2s

I don’t think this is the correct link (I’ll update it later), but it seems close to the issue in the post we were looking at

[Chief Delphi Link](https://www.chiefdelphi.com/t/roborio-2-pwm-has-no-power/459455) 

By the end, our robot was working pretty well and we were cycling amp fairly quickly. We ended up 19th. However, we didn’t get picked on an alliance, unfortunately. This individual performance was way better than our performance at Seneca and we were ready to continue refining our robot.

## What’s next

We want to thank all of our sponsors for being with us as we work really hard to improve our robot for our future competitions. Even though it’s been rough so far we’ve definitely learned a lot from our mistakes and gained valuable experience troubleshooting.

We plan on creating more technical videos and documentation to help other teams and our own future members once the season is over.

But our season is not over yet!!! We qualified to DCMP by the skin of our teeth!!! We’ve been working feverishly to 10x our robot’s performance in this time. Look out for another post with all the things we’ve been up to! We’ve been cooking 👀

Thanks for reading this huge post and have a nice day!

# 4/3 DCMP Prep

We’ve mainly been focusing on how best to improve our robot before we leave it for spring break. Our biggest focuses were:

- Everything Functioning Mechanically
- Vision
- Aligners
- Autos

It was crunch time for us, and being the team with the lowest EPA going into DCMP, it was cook or be cooked for us. Just in case, we’ve also been developing the Snail Sail which is basically a blocker that goes on the intake side of our robot.

## Driver Practice

We ran full practice matches using the practice mode section of the driver station to emulate the strain the robot would go through on the field. We used one of our school’s computer labs to set up a practice area. Our drivers got a lot of practice cycling and we further refined our controls. We had some battery browning out issues since we were running old batteries, so we ordered new ones and we are good to go!


![alt_text](/images/posts/frc24/dcmp/image1.gif "image_tooltip")


(This footage is at 1.4x speed to make it short enough for a GIF)

## Vision

After making sure that everything was mechanically sound on our robot, we mounted our three camera mounts and calibrated our cameras for Photon Vision! We knew vision would be very important if we wanted to shoot quicker, avoid defense, and use our advanced autonomous features. Honestly, our process of setting everything up was a little rushed but we ended up getting everything on the robot and tested.

[Short](https://youtube.com/shorts/QtH8BUOnWjo?feature=share) 

First, we made sure our cameras could detect april tags.

Then, we checked to see that these estimates were being added to our pose estimator. This took a while to debug since our original code for multi-cam photon vision took the average of all the estimates to make one combined vision estimate. The better way to do this is to loop through all the estimates and add everything to the pose estimator. That’s how we got this beautiful video.

[Another Short](https://youtube.com/shorts/VtI-r6Wq43k?feature=share)

Then we tried auto aim and it worked beautifully (when it saw a tag, easy fix I think)!!! It was also running our shoot anywhere code (that was the angle I was talking about tuning)

<iframe src="https://www.youtube.com/embed/9NluVRwwG6Q"></iframe>

Speaking of tuning, we were able to tune our lookup table for shots 3-5 m away from the speaker, but we didn’t have time to do the ones close up. For now, our drivers will use the setpoints for close (that we know work), and we’ll tune it at DCMP. 

## Cooking

Inspired by another Open Alliance team, we decided to add Goblin Mode, or in our case, Turbo Mode to supercharge our defense. At the very least, with the snail sail on, we can be a solid defense bot.

[https://www.chiefdelphi.com/t/frc-1155-the-sciborgs-2024-build-thread-open-alliance/441531/51](https://www.chiefdelphi.com/t/frc-1155-the-sciborgs-2024-build-thread-open-alliance/441531/51)

### Custom Autos

Another thing we we’re working on was our custom auto system that [we developed earlier in the season](https://www.chiefdelphi.com/t/frc-1257-parallel-universe-2024-build-thread-open-alliance/447080/18?u=akeboss). With working vision and pose estimation, our robot will know where it is and be able to create its own paths.

The first addition we added was [some code](https://github.com/FRC1257/2024-Robot/blob/e82ce3560adabeb341b7a0cb99118f4b12cc8d4f/src/main/java/frc/robot/util/autonomous/MakeAutos.java#L38) to check if there was a note in the robot before driving to the shooting position. Since we don’t have a camera for note detection yet, this should allow us to save time if the robot doesn’t have a note to score and move on to the next one.

It scores only if has note.


![alt_text](/images/posts/frc24/dcmp/image2.png "image_tooltip")


Here’s a video of it in action

<iframe src="https://www.youtube.com/embed/gplZdlSoHBk"></iframe>

The next addition was to [add dynamic obstacles](https://github.com/FRC1257/2024-Robot/commit/e82ce3560adabeb341b7a0cb99118f4b12cc8d4f) on the field for our robot to avoid in auto. We wanted this so we could tell our pathfinder to avoid certain sections of the field entirely where other robots may be running our autos. This is a fairly new feature in Path Planner, but we tested it in simulation and theoretically, it will work fine.

[https://www.chiefdelphi.com/t/pathplanner-2024-beta/442364/359?u=akeboss](https://www.chiefdelphi.com/t/pathplanner-2024-beta/442364/359?u=akeboss)

Here’s a video demonstration of this.

<iframe src="https://www.youtube.com/embed/tlve1WyNt1w"></iframe>

# Technical Documentation

We’ve also been working on creating a video series about programming for our future members and the community! It’s still a work in progress but will be updated regularly.

[Playlist](https://www.youtube.com/watch?v=_05BV_G8byY&list=PLUniOkSvUS6qEUThVFekGeq427MZpcC5I)


## Videos I Made
<iframe src="https://www.youtube.com/embed/nBBPKs8JCAI"></iframe>
<iframe src="https://www.youtube.com/embed/VMRwvzphNx4"></iframe>
<iframe src="https://www.youtube.com/embed/gwmCFI6-dKg?si=YhrIWDYBbVUnsje4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Robotics has been so fun this year! It's been my pleasure to work with such a wonderful team for four years!