---
title: 'Programming through the 2024 Robotics Season'
date: 2024-04-03
permalink: /posts/robotics-development/
tags:
  - programming
  - robotics
---

All of the programming related things we did in the 2024 robotics season, Crescendo.

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
getAngle / getRPM:

Uses the distance from getEstimatedDistance, inputs it into the lookup table, and returns the ideal Angle or RPM.
LED
This system flashes LED different colors based on the state of the robot. The BlinkinLEDController has a bunch of static variables that describe the state of the robot

isEnabled: true if robot is enabled, false otherwise

isEndgame: true if match time < 30 seconds, false otherwise

noteInIntake: true if there is a note in the intake, false otherwise

shooting: true if the robot is currently shooting a note, false otherwise

pivotArmDown: true if the pivot arm is down, false otherwise

Unlike a subsystem, variables are updated in LEDPeriodic method in RobotContainer.java, which runs periodically, and LEDs are updated in periodic method in BlinkinLEDController.java based on these variables

Here’s a picture of us setting up the Blinkin controller and configuring colors.



Note Shooting Visualizer
The Note Visualizer class is designed to facilitate the analysis of, and subsequent manipulation of code used in shooting from various positions, and tuning of the aforementioned lookup table. It’s important to note that the Note Visualizer class is strictly for simulation purposes, and does not have any effect on the robots shooting during a match.

setRobotPoseSupplier:

Sets the supplier values for robotPoseSupplier, leftSpeed, rightSpeed, and pivotAngle
shoot:

Simulates the action of shooting a note using a variety of closely associated classes and methods.
Note Following
We also wrote some code to follow notes, however, we haven’t been able to test it on our robot yet. We have two different approaches: one that estimates the Pose2d of the note and creates a trajectory towards it 1and another that just takes the angle to the note.

Compound Commands
Carlos and Raghav

Here’s an explanation of some of our compound commands and a nice diagram.

autoScore

Create a setpoint using PID for intake to go to
Have the robot move to amp and intake go to setpoint at the same time
Once the robot is ready, handoff happens and the note is released
shootSpeaker

Arm moves to the position necessary to shoot note
Set speeds for the shooter motors to shoot the note and then releases the note
Handoff

For releasing note
Set the speed of shooter motors and shoot out a note
aimShooter

Uses PhotonVision and sets the position and angle needed to shoot note into speaker from anywhere on the field


Vision
We also redid our vision code to take the average of our Pose estimates 1 and not just the “best” one. In simulation, the output looks slightly better however we won’t know till we test it.

Autos
Bowen, Claire, Jase, Kavi, and Mai

So many autos! Here’s some information about our autos!



Naming convention:
s(1-3): signifies the starting position (top mid or bottom)
n(1-8): signifies the location of each note
sc(1-8): signifies the shooting location correlating with each note position
Types of autos
There are no 1 note autos as that is fairly simple
2 Note, 3 Note, 4 Note, 5 Note, and 6 Note autos pick up that many notes and shoot in one autonomous round
How we made the autos (in steps)
Set 1 starting location of 3 possible (top middle or bottom)
Call upon preset paths (paths typically go to a note location and then shoot)
Make sure that the paths are smooth by copying the x and y coordinates of the ending positions to starting positions (could just guess and check)
Example: (4 Note Auto Top)
4 Note Auto Top.mp4 - Google Drive 1
This auto picks up a total of 4 notes and starts at the first starting position (the top)
Customizable Autos
This year we wanted to be able to perform any auto action on the field. Our customizable autos are facilitated by the drive team who select the note positions for our robot to pick up at and then where they should be scored. The MakeAutos.java file 1 tells the robot to go to the note specified through our Elastic dashboard (basically a nicer version of ShuffleBoard), then directs the robot to the specified shooting position and shoots the note. The code has the capability to run this action four times for up to five note custom autos. These are the methods used:

goToPose: uses path finding to go to a location (specified by Elastic)

getSelected: a method used to retrieve the location from the Network Table (basically what’s in the Elastic dashboard)

deadlineWith: makes the robot operate an action simultaneously with another

In this case it is to initiate the intake while the robot goes to the specified note


NoteChooser/AutoChooser
NoteChooser uses the SendableChooser class to present a selection of options to our dashboard. For example, we may want to select between different autonomous routines. By putting every possible Command into a SendableChooser, we will have a list of different options on the programming laptop. We have different options for starting positions, set score positions, and set note positions. By doing this, we can make the autos more efficient and optimize the process for autonomous.



This screenshot of a sim shows the different dropdowns that the NoteChooser created. In this example, the robot first intakes Note 1, then shoots it at the top. Next, it chooses Note 2, and shoots it at the top again, and so on so forth.



This same process is displayed in this GIF, with different notes chosen.

(Note 8, Bottom; Note 7, Really Bottom; Note 3, Center; Note 1, Center) (4 Note Auto)

custom autos with path planner path finding
custom autos with path planner path finding
We also added some code to flip our poses in Field Constants 1 to ensure that our code works on both sides of the field.

what the flip auto
what the flip auto
Road Ahead
Our plan
Finish the Robot
Test Motors/Encoders/Sensors
PID Constants and SysId
Vision Tuning
Run our Autos
Clean up our code
Remove Unused Imports
Reformat Code
Add Comments
Advanced Features
Custom Web Dashboard maybe
Autonomous Teleop Cycling
Improving our simulation code to include notes for vision and intaking
Thanks for reading! Have a wonderful day!

Authors
1257 Programming Subteam