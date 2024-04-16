# Multiple-Face-Recognition

# Table Of Contents
1. **[Face Detection](#1-face-detection)**
2. **[Face Recognition](#2-face-recognition)**
3. **[Multiple Face Recognition Using Multiple Cameras](#3-multiple-face-recognition-using-multiple-cameras)**
<!--- 4. Batch Face Recognition Using Single Camera --->

# Introduction

# 1. Face Detection
Various libraries were employed for face detection, including **OpenCV** and **Dlib**. However, **YOLOv8 exhibited superior performance** compared to its counterparts. The results are delineated below.
## Results
<table>
    <td>
      <figure>
        <img src="Readme_Images/Face Detection/Confusion_Matrix.png">
        <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Guide For Confusion Matrix</figcaption>
      </figure>
    </td>
    <td>
      <figure>
       <img src="Readme_Images/Face Detection/Results_Confusion_Matrix.png">
        <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Confusion Matrix</figcaption>
      </figure>
    </td>
  </tr>
</table>

<table>
    <td>
      <figure>
        <img src="Readme_Images/Face Detection/F1_Score.png">
        <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Evaluation Metrics</figcaption>
      </figure>
    </td>
    <td>
      <figure>
       <img src="Readme_Images/Face Detection/Yolov8.png">
        <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Real-Time Detection</figcaption>
      </figure>
    </td>
  </tr>
</table>


# 2. Face Recognition
There are three main components to this project.
- **Server Side:** Website for adding registered students/employees to the database
- **Client side:** TestBed (Hardware) for visual feedback of the attendance
- **Client side:** Face Recognition


## Simplified Methodology
<img src="Readme_Images/Face Recognition/Methodology.png">

## Server Side: Website
The website is made using MERN stack (Mongodb, Express, React and NodeJs). The key functionalities of the website are
1. Admin Authentication
2. Dashboard UI to show all the registered Students
3. Supports Registering, Modification and Deletion of Students in the Database

<table>
    <td>
      <figure>
        <img src="Readme_Images/Frontend, Backend, Hardware/Frontend.png">
        <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Guide For Website</figcaption>
      </figure>
    </td>
    <td>
      <figure>
       <img src="Readme_Images/Frontend, Backend, Hardware/Frontend_Database.png">
        <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Frontend and Database</figcaption>
      </figure>
    </td>
  </tr>
</table>

## Client Side: Hardware Implemnetation
Three designated lanes will be provided for users to mark their attendance via camera recognition. Each gate will be equipped with a camera positioned overhead, which will facilitate the attendance marking process for a single student at a time. The camera will capture an image/frame of the user, initiate face detection algorithm, Create facial encodings using face recognition, cross-reference these against registered encodings stored in the database, and subsequently retrieve the pertinent information. Upon successful identification, the LED indicator will illuminate green.

The implementation utilizes the `pyfirmata` library to interface with the LED indicator on the Arduino board.
<img src="Readme_Images/Frontend, Backend, Hardware/TestBed.png">

## Client Side: Face Recognition
The face recognition functionality underwent rigorous testing utilizing two prominent libraries: **DeepFace** and **FaceRecognition**. Following thorough evaluation, **FaceRecognition emerged as the superior performer**, showcasing optimal performance compared to DeepFace.

<img src="Readme_Images/Face Recognition/FaceRecognition.gif"/>

## Results
<table>
    <td>
      <figure>
        <img src="Readme_Images/Face Recognition/Confusion Matrix.png">
         <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Confusion Matrix</figcaption>
      </figure>
    </td>
    <td>
      <figure>
       <img src="Readme_Images/Face Recognition/Inference_Time.png">
        <figcaption>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Inference Time(seconds)</figcaption>
      </figure>
    </td>
  </tr>
</table>

## User Interface
<img src="Readme_Images/Face Recognition/UI.gif" />

# 3. Multiple Face Recognition Using Multiple Cameras
Face recognition will be conducted using multiple cameras, with each camera focusing on a single student or employee within its field of view. This system employs multiprocessing, ensuring that each camera instance operates independently of others. Each instance is executed as a separate process, initiated by running the file multiple times in different terminals, specified by 

`python main.py (name of Camera Instance)`. 

This approach enhances efficiency and scalability by enabling concurrent processing of multiple camera feeds without interference between instances.

<img src="Readme_Images/Face Recognition/Multiple Camera Inference.gif" width=684px height=384px/>

## Results
The inference time for each of the camera along with the retrieval time of the infromation from the database.

<img src="Readme_Images/Face Recognition/Multiple Camera Inference Table.png"/>

# Tech Stack
<li>Python</li>
<li>OpenCv</li>
<li>Pytorch</li>
<li>Yolov8</li>
<li>React</li>
<li>MongoDB</li>


### Contributors

**© Developed Under the Supervision of** 
- **[Dr Muhammad Rafi](https://khi.nu.edu.pk/personnel/dr-muhammad-rafi-phd/)(Associate Professor –Head of Department of AI & DS)**
- **[Dr Muhammad Waqas](https://khi.nu.edu.pk/personnel/dr-muhammad-waqas-phd/)(Assistant Professor)**

