---
title: "MSDS Final: Depth Estimation"
excerpt: "CTE Partnerships a website bringing information about local businesses together!"
image: "/images/portfolio/stereo/poster.png"
collection: portfolio
---

<h1 align="center"><a href="https://github.com/AkeBoss-tech/3d-stereo-camera/">Using Machine Learning and Stereo Vision to Predict the Position of an Object in an Image</a></h1>

<p align="center">By: Akash Dubey and Bryan Ly</p> 

![Depth Estimation](/images/portfolio/stereo/poster.png)


This was our submission for our Mathematical Statistics and Data Sciences final project during our senior year of high school. We learned a lot about computer vision, depth estimation, machine learning, cameras, and, surprisingly, ChatGPT through this project. The code is available on our [GitHub](https://github.com/AkeBoss-tech/3d-stereo-camera/).

<h2 align="center">Research Question</h2>
<p align='center'>Is there a significant difference between the distances predicted by a stereo vision model compared to other machine learning models and actual distances?</p>

<h2 align="center">Background</h2>

As artificial intelligence develops increasingly rapidly, there are an ever so increasing number of applications in more and more fields across multiple disciplines. One such subset of artificial intelligence focuses on the understanding and extraction of information from digital images. This subset is called computer vision. 

A type of computer vision called stereo vision utilizes input from 2 perspectives (from pairs of either camera inputs or photos) in order to estimate the depth of different points on an image. The output is a disparity map, which measures the disparity between 2 corresponding points on the 2 input visuals. This can either be a live or still disparity map, depending on whether it is reading live information from 2 cameras or calculating disparity based on 2 photos. A common method to match corresponding locations from 2 inputs is called Semi-Global Block Matching (SGBM), which breaks down images into blocks, then compares different blocks to find matching “locations” on the 2 images. Based on the difference in position relative to the entire image of each block, in combination with the camera calibration data, stereo vision algorithms calculate and output a disparity map containing the relative depth of different points on the image. More advanced algorithms translate the disparity map into a depth map, which calculates actual distances from the camera rather than relative position compared to other points in the image. 

<h2 align="center">Tools</h2>
- OpenCV: Python image processing library, also contains SGBM sorting algorithm
- GLPN NYU: a depth-estimation model we compared our stereo vision model with
- DPT Hybrid Midas: another depth-estimation model we compared our stereo vision model with
- Logitech C920 HD Pro Webcam: used to capture photos for stereo vision
- calibdb.net: aided in camera calibration
- ChatGPT: aided us with coding the stereo vision model

<h2 align="center">Visualizations</h2>

### Figure 1
![Figure 1](/images/portfolio/stereo/results.png)
Depth Estimation at Different Positions for Models

### Figure 2
![Figure 2](/images/portfolio/stereo/boxplot.png)

Residual Plots for Distance for each Model

### Figure 3
![Figure 3](/images/portfolio/stereo/right_image.jpg)

Right Input Image

### Figure 4
![Figure 4](/images/portfolio/stereo/stereo_disparity_map.png)

Stereo Depth Map

<h2 align="center">Methods</h2>

- Coded stereo vision model, used SGBM to match images, then took test photos
- Fine-tuned settings for more accurate photos
    - Eliminate noise
    - “Replicating” accurate scene in depth maps
- Imported 2 other depth estimation AI models (non stereo vision)
- Subtracted 3 models’ measurements from real distances
- Performed T-test

<h2 align="center">Result</h2>
No significant difference between the real distances and the models’ measurements

### P-values

| GLPN-NYU | Intel | Stereo Vision |
|----------|-------|---------------|
|  30.3% | 24.7% | 12.5% | 

<h2 align="center">Conclusion</h2>
Due to the fact that our study showed that there was no significant difference between the 3 comp. vis. models and the real distances, we can reasonably conclude that the real solution, which in our case is the accurate/real measurements of depth, are contained in the 3 models we tested. However, it is important to note that when simply looking at the outputted depth maps, the GLPN-NYU model had the smoothest graph, while our stereo vision model had the most noise. This is something that should be addressed later before being applied to real-world applications. 
