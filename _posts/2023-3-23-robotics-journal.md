---
title: 'Robotics Journal'
date: 2023-03-21
permalink: /posts/robotics-journal/
tags:
  - journal
  - robotics
---

3/21/23 - Build Season
======
Initial Design for the robot
<img src='/images/posts/robotics/image13.png'>

Build Season
-------
We began designing the robot as soon as the [game for this year](https://www.youtube.com/watch?v=0zpflsYc4PA) was released in January. Eventually, we came up with the design pictured above which features an elevator that extends outward to the side and is connected to a pivot arm that rotates allowing the claw to eject a piece to score. We also designed an intake at the front which would pick up cones and cubes from off the ground to feed into the claw. Designing the robot in CAD took a few weeks and eventually, the build subteam began building the robot. Our initial hard deadline for the robot build was March 1st, but eventually, it became clear that we wouldn’t be able to finish it in time. The team began spending a lot more time on the robot with a couple of Saturday sessions and more extended meetings late at night. Despite this additional time, we still weren’t able to finish building the robot the week before the competition (the week before was 3/13). Faced with delays, the build subteam decided to drop the intake for this competition and focus on making the elevator, pivot arm, and pivot wrist. 

Still, the robot was only mechanically completed the day before the competition, Thursday 3/16. On that same day, the electronics subteam began its first work on the robot and finished wiring it. This wiring process was done in haste and there was not enough time to test all the code features that we wanted to add to the robot, so the team decided that moving each component manually with the controller would be good enough. When the robot was first turned on, it didn’t move; here’s a really [awkward video](https://drive.google.com/file/d/10MjgqrIf4_iwp8_K9jkk-W64uzm9BV-n/view?usp=share_link) of that happening.  Eventually, we got the [drivetrain working](https://drive.google.com/file/d/1ZF-Gdotd2PZkRgkY6OZpi7yf4FR1tIcU/view?usp=sharing) and the elevator moved. But there was some sort of issue that was preventing the rest of the robot from moving. We had an emergency meeting on Friday to attempt to solve this issue, but we couldn’t. The next day, we had our first competition at Robbinsville.

Programming’s Build Season
------
I am the co-vice captain of the programming subteam, so I am responsible for all of the robot’s code. I knew from the very beginning (October 24th) that managing the people on my subteam would be the hardest part of the job. Honestly, robotics programming is pretty easy, but teaching other people so it becomes easy for them is hard. I started by creating a huge document with all the resources that would ever be needed for programming the robot [Programming Resources](https://docs.google.com/document/d/1KaAQCZHfttFZk9dY0amIj057UGiLFXdztHYZKqD3VwI/edit#heading=h.8op83lvrsd9). Our team already has a website with [documentation](https://frc1257.github.io/robotics-training/#/), but I just needed a place to gather information together. (Side note During the offseason I plan to update the website with everything we learned. It’s important to keep info in the same place) 

<img src='/images/posts/robotics/image11.png'>

As soon as the build subteam created the design for the robot, I began planning out what we would need to do for this season. Here’s a doc I made to plan out the basic subsystems we wanted to program [Subsystem Guide](https://docs.google.com/document/d/1bjx53oYOKt6_3epfSJThbfDca2tzqah9jR-95VM3sKE/edit?usp=sharing) also perhaps the most useful thing has been the TODO list I made to guide us through our objectives for each meeting [Programming TODO List](https://docs.google.com/document/d/1TSDPyOiz-I9v3jUPU4W0HA2auuR9z_ARn48d7Ad-H44/edit?usp=sharing). We got all the programming done fairly quickly. Above is a graph of the changes we made 

We basically finished everything by the end of February, but we had to wait for build to finish the robot. But coding the basic subsystems wasn’t all that we were doing, those are pretty easy. Here’s an example of what the meat of the claw subsystem looks like.

<img src='/images/posts/robotics/image6.png'>

We also worked on creating advanced autonomous routines for our robot to follow during the start of a match. We wanted to make a fully customizable program to allow us to choose anything we wanted to do. Here is an example of what we made. As you can see, there are many buttons you can press to change the trajectory of the robot. There are also a bunch of dropdown menus to select starting positions. 

<img src='/images/posts/robotics/image1.png'>

In addition to this, we also worked on using a Raspberry Pi and two cameras to get our robot’s position on the field. Knowing the robot’s position on the field is useful because it helps it follow the trajectories we tell it to. Also, we can use the position for driver convenience features like commands to align to a scoring location or pick-up place. This is a picture of what the robot sees. 

<img src='/images/posts/robotics/image8.png'>
<img src='/images/posts/robotics/image12.png'>

Also, this was kinda on the side, but I also helped make this [website](https://akeboss-tech.github.io/BootstrapStrategyApp/) for our strategy subteam and this [script](https://replit.com/@AkashDubey/StratScanner) to read the QR Codes the site generated.

3/24/23 - Reality Check
=======
Robbinsville
-------

When we got to Robbinsville, we did not have a working robot. We tried everything to get our robot working in the two hours we had before our first real match. We also had some practice matches scheduled before our first match. When we first examined the robot, we noticed that there were a lot of electronics problems. In our code, we could see that there were CAN errors which meant that the motors weren’t connected properly. As soon as we got to the competition, we asked the CSAs (idk what it stands for but they are adults who help teams) to help us out.

<img src='/images/posts/robotics/image9.png'>

When it came time for our first practice matches, we still weren’t ready to compete, so we decided to skip them. It was at this point that I realized that our robotics team had messed up pretty badly and we would only be able to scavenge for a chance of attending our Mid-Atlantic District level competition. After skipping our practice matches, we were finally able to get our robot “working.” It wasn’t really working because our drivers didn’t have the limits in the software that they needed. The problem wasn’t that we didn’t have the code (we did plus a lot more that we didn’t get to run), but that we didn’t have enough time to test to see what the encoder limits would be at the max. Because of this, we couldn’t get the elevator moving because the drivers didn’t want to break it again (which is valid). Above is a clip from our first match. We are the bot in blue and, as you can see, our robot can move and our pivot arm is moving properly, but our pivot wrist is flopping around too much.

*[encoder]: Encoders are by far the most common method for measuring rotational motion in FRC®, and for good reason - they are cheap, easy-to-use, and reliable.

<img src='/images/posts/robotics/image5.gif'>

Then again, there is not much we could have done with a working elevator, pivot arm, and pivot wrist anyway. Our claw physically couldn’t pick up any cubes or cones. This was clearly a problem and we kinda experienced more general misfortune throughout the event which relegated us to last place on the first day.

Here’s a video of our robot flipping over and then righting itself. 

<img src='/images/posts/robotics/image4.gif'>

We were having balance problems so we decided to add a simple counterweight to the robot to fix this issue. Initially, the build team put a bag of Allen keys on the bot as a counterweight, but in one of our later matches, the bag opened and released the keys onto the field. This is not allowed and our robot was disabled for the remainder of the match. There was this one CSA that thought our robot failing like that was the funniest thing in the world so he “shit posted” us on Reddit. Eventually, he deleted the post and his account. This was pretty funny though and this is why we decided to name our robot Allen. 

At the end of the day, we finished in last place and there was seemingly nothing we can do to fix it. But on Sunday, somehow we won 2 matches and gained 2 places. So we didn’t finish in last!! Also, we helped out another team at the event and we won the Gracious Professionalism award. 

*[Gracious Professionalism award]: Gracious professionals learn and compete like crazy, but treat one another with respect and kindness in the process. They avoid treating anyone like losers. No chest thumping tough talk, but no sticky-sweet platitudes either. Knowledge, competition, and empathy are comfortably blended.

3/25/23 - The Comeback (the aftermath of Robbinsville)
=======
The New Plan
-------
Since our robot flopped so badly, we realized that the team needed to make the robot simpler and more reliable. We decided to remove the Pivot Wrist subsystem and re-wire the entire robot. We also had the idea of adding an intake that can shoot cubes. This will allow us to score more points on the low and mid level. Here’s an image of what cube shooting looks like.

<img src='/images/posts/robotics/image3.png'>

As soon as we came back from our first competition, we got a deserved earful from our coach, Mrs. Cook, about the things that needed to change in order to get our robot working. The first thing was setting harder deadlines for the build subteam. We need a working robot by 3/25/2023 or we won’t be going to our next competition, which is 4/1/23. Our coach told us that the magnet principal had talked to her about our performance and gave our coach the ability to not attend the next competition if she wanted to. This is a hard deadline and it will definitely make the build team work faster so we get time to test. 
The thing is, we thought that we would be able to come to school on Saturday to work on the robot, but because Magnet will be cleaning up after the relay event they won’t allow us to work there. So we have lost a day on our schedule and the deadline has been updated to affect this. The build subteam gets another day but we lose another day of testing. The only subteam it really hurts is programming. And if we can’t get everything done in time, there will be a repeat of what happened last time.

What’s next for Programming
-------
I’m trying to do all I can in order to be prepared for when we get the robot. For one, we need to revise our autos to add cube shooting functionality and add the changes from our previous competition. Here’s an example of it speed up at 2x speed. We will eventually need to tune these so that they are going fast enough on the real bot. 

<img src='/images/posts/robotics/image10.gif'>

Honestly, we already had all the code that we needed done but we are just making slight adjustments to account for the changes being made to the robot. We can’t really test to see if everything works and moves autonomously until we get the robot to test with. We are going to need to tune PID values for our subsystems to do this. Other than that, we just need to make sure the drivers know how to use everything. 

<img src='/images/posts/robotics/image2.png'>

I could have written a lot more about this, but I think this journal is fine. I don’t need to make it too long. I kinda see that it might be hard to follow this because I forgot to define certain things, but I think it is a pretty good journal which has all the things I did for robotics.
