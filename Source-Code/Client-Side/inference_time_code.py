import pandas as pd
from pymongo import MongoClient
import requests
import re
import threading
from datetime import datetime
import cv2
import ultralytics
import numpy as np
import pickle
from binary_search_tree import BinarySearchTree
import time
import os
from datetime import datetime
import face_recognition
import sys

def get_direct_link(google_drive_link):
    # Extract file ID from the Google Drive link
    file_id_match = re.search(r'[-\w]{25,}', google_drive_link)
    
    if file_id_match:
        file_id = file_id_match.group(0)
        # Construct the direct download link
        direct_link = f"https://drive.google.com/uc?export=view&id={file_id}"
        return direct_link
    else:
        return "Invalid Google Drive link."

def downloadProfilePicture(studentInfo):
    #Caching might come here
    usuableLink = get_direct_link(str(studentInfo["Link"].iloc[0]))
    # print("Usuable Link:" + usuableLink)
    destination_path = str(studentInfo['ID'].iloc[0])+".jpg"

    response = requests.get(usuableLink)
    with open(destination_path, 'wb') as file:
        file.write(response.content)
        
    imgStudent = cv2.imread(destination_path)
    return imgStudent    

def displayUi(studentInfo, imgStudent):

#For Textual Data
    cv2.putText(imgBackground, str(studentInfo['Total_Attendance'].iloc[0]), (878, 127),
                                cv2.FONT_HERSHEY_COMPLEX, 1, (255, 255, 255), 1)
    
    cv2.putText(imgBackground, str(studentInfo['ID'].iloc[0]), (958, 471),
                cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255), 1)
    
    cv2.putText(imgBackground, str(studentInfo['Name'].iloc[0]), (980, 541),
                cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255), 1)

    cv2.putText(imgBackground, str(studentInfo['Field'].iloc[0]), (975, 613),
                cv2.FONT_HERSHEY_COMPLEX, 0.5, (255, 255, 255), 1)
    
    
    #For the Student Image
    resized_imgStudent = cv2.resize(imgStudent, (216, 216))
    imgBackground[177: 177 + 216, 931:931 + 216] = resized_imgStudent

def get_student_from_Database(student_id):
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017')
    
    # Specify the database and collection
    db = client['officialDB']
    collection = db['officialDB']
    
    # Retrieve student information using find_one
    student_dataBase = collection.find_one({"ID": student_id})

    
    # Close the MongoDB connection
    client.close()
    
    return student_dataBase

def getStudentInfo(student_id, student_dataBase):
    if student_dataBase:
        # Convert the retrieved data to a DataFrame
        studentInfo = pd.DataFrame({
            "Total_Attendance": [student_dataBase["attendance"]],
            "ID": [student_dataBase["ID"]],
            "Name": [student_dataBase["Name"]],
            "Field": [student_dataBase["Dept"]],
            "Link": [student_dataBase["URL"]],
            "Last_Attendance": [student_dataBase["last_attendance"]],
        })
        
    else:
        print(f"Student with ID {student_id} not found.")
        studentInfo = pd.DataFrame({})
    return studentInfo

# with update_lock:

def update_database(student_id,instance_name):
# Connect to MongoDB
    try:
        client = MongoClient('mongodb://localhost:27017')

        # Specify the database and collection
        db = client['officialDB']
        collection = db['officialDB']

        student_to_be_updated = collection.find_one({"ID": student_id})
        if student_to_be_updated:

            # with update_lock:
            new_attendance_count = student_to_be_updated['attendance']+1
            new_last_attendance = datetime.now().strftime("%Y-%m-%d %H:%M:%S.%f")

            collection.update_one(
                {"_id": student_to_be_updated["_id"]},
                  {
                      "$set": {
                          "Camera_Instance": instance_name,
                          "attendance": new_attendance_count,
                          "last_attendance" : new_last_attendance
                        }
                    }
            )
            updated_document = collection.find_one({"_id": student_to_be_updated["_id"]})
            print(updated_document)
        else:
            print(f"No student found with ID: {student_id}")

    except Exception as e:
        print(f"Error updating database: {e}")

    finally:
        # Ensure that the MongoDB client is properly closed
        client.close()



# Load modified face tree structure and face names from binary file
class Node:
    def __init__(self, face_encoding, face_name):
        self.face_encoding = face_encoding
        self.face_name = face_name
        self.left = None
        self.right = None


known_faces_tree = []
with open('./face_recognition_known_faces.pickle_tree.pickle', 'rb') as f:
    known_faces_tree = pickle.load(f)


padding = 60
# Load the YOLO model
model = ultralytics.YOLO("yolov8n-face.pt")

def convert_to_int(value):
    try:
        return int(value)
    except ValueError:
        return value
    
instance = convert_to_int(sys.argv[1])
print(instance)

instanceName = "Instance 3"
if instance == 0:
    instanceName = "Instance 1"
elif instance == 1:
    instanceName = "Instance 2"
else:
    instanceName = "Not Defined"


cap = cv2.VideoCapture(instance)


imgBackground = cv2.imread('Frontend/background2.png')

folderModePath = "Frontend/Modes/"
modePathList = os.listdir(folderModePath)
imgModeList = []

for path in modePathList:
    imgModeList.append(cv2.imread(os.path.join(folderModePath,path)))

modeType = 0
frameCounter = 0
pauseFrames = 10
pauseForAlreadyMarked = 30

def calculateTime(start_time):
    elapsed_time = time.time() - start_time
    seconds = int(elapsed_time)
    milliseconds = int((elapsed_time - seconds) * 1000)
            
    formatted_time = f"{seconds:02d}.{milliseconds:03d}"
    return formatted_time

while True:
    _, img = cap.read()

    imgBackground[118:118+480,80:80+640] = img
    imgBackground[42:42+633, 826:826+414]= imgModeList[modeType]
    
    startTime = time.time()
    results = model(img,verbose=False)
    result = results[0]
    
    if result:

        # Insert Face Recognition here
        for box in result.boxes:
            x1 = round(box.xyxy[0].tolist()[0])
            y1 = round(box.xyxy[0].tolist()[1])
            x2 = round(box.xyxy[0].tolist()[2])
            y2 = round(box.xyxy[0].tolist()[3])
            x1 -= padding
            y1 -= padding
            x2 += padding
            y2 += padding

            # Ensure the coordinates are within the image boundaries
            x1 = max(x1, 0)
            y1 = max(y1, 0)
            x2 = min(x2, img.shape[1])
            y2 = min(y2, img.shape[0])

            h = y2 - y1
            w = x2 - x1

            face_region = img[y1:y2, x1:x2]

            # Recognize the face using face_recognition library
            face_encoding = face_recognition.face_encodings(np.array(face_region))
            name_of_person = "Unknown Face"
            if len(face_encoding) > 0:
                face_encoding = face_encoding[0]
                # Search for the closest match in the BST
                current_node = known_faces_tree.root
                closest_match = None
                closest_match_name = None
                min_distance = float('inf')
                min_threshold = 0.6
                while current_node is not None:
                    distance = face_recognition.face_distance([current_node.face_encoding], face_encoding)[0]
                    if distance < min_distance:
                        min_distance = distance
                        closest_match = current_node.face_encoding
                        closest_match_name = current_node.face_name

                    if distance == 0:
                        break
                    elif distance < 0:
                        current_node = current_node.left
                    else:
                        current_node = current_node.right

                if closest_match is not None and min_distance < min_threshold:
                    name_of_person = closest_match_name
                    # print(min_distance)
                else:
                    name_of_person = 'Unknown Face'

            cv2.rectangle(img, (x1, y1), (x1 + w, y1 + h), (0, 255, 0), 2)

            #Inside whenFound student[ID]
            if name_of_person != "Unknown Face":
                student_id = name_of_person
                time_for_faceRecog = calculateTime(startTime)
                print("Face Recognition Time:",time_for_faceRecog)
                
                if frameCounter == 0:
                    #Make it first Frame
                    frameCounter = 1

                    #Show Active State
                    modeType = 1


            if frameCounter!=0:

                #If this is first frame download the data
                if frameCounter == 1:
                    student_dataBase = get_student_from_Database(student_id)

                    studentInfo = getStudentInfo(student_id, student_dataBase)

                    if modeType!=3:
                        imgStudent = downloadProfilePicture(studentInfo)
                    print("Data Downloaded")

                    
                    
                    
                    #Check lastAttendance
                    dateTimeObject = datetime.strptime(str(studentInfo["Last_Attendance"].iloc[0]), "%Y-%m-%d %H:%M:%S.%f")
                    secondsElapsed = (datetime.now()-dateTimeObject).total_seconds()

                    if secondsElapsed > pauseForAlreadyMarked:
                        update_database(student_id,instanceName)
                        time_for_Database = calculateTime(startTime)
                        print("Database Time:",time_for_Database)
                    else:
                        modeType = 3
                        frameCounter = 0
                        imgBackground[42:42+633, 826:826+414]= imgModeList[modeType]
                
                if modeType!= 3:

                    #Pause and show the Details
                    if pauseFrames<frameCounter<pauseFrames+10:
                        time_for_Marked = calculateTime(startTime)
                        print("Marked Time:",time_for_Marked)
                        modeType = 2
                        

                    imgBackground[42:42+633, 826:826+414]= imgModeList[modeType]

                    #Count 10 Frames
                    if frameCounter <=pauseFrames:
                        displayUi(studentInfo,imgStudent)

                    frameCounter+=1


                    #Reset everything
                    if frameCounter>=pauseFrames+10:
                        frameCounter = 0
                        modeType = 0
                        imgBackground[42:42+633, 826:826+414]= imgModeList[modeType]
    
    else:
        modeType = 0
        frameCounter = 0

    # # Display the frame with the bounding boxes
    cv2.imshow(f'Face Attendance {instanceName} ',imgBackground)
    key = cv2.waitKey(1) & 0xFF

    if key == ord('q'):
        break


cap.release()

# Close all windows
cv2.destroyAllWindows()