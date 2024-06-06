# Replace with your MongoDB connection details
import pymongo
import requests
from PIL import Image
import cv2
import numpy as np
import face_recognition
import os
import pickle
from deepface import DeepFace
from scipy.spatial.distance import cosine


class Node:
    def __init__(self, face_encoding, face_name):
        self.face_encoding = face_encoding
        self.face_name = face_name
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, face_encoding, face_name,model_type):
        if self.root is None:
            self.root = Node((face_encoding), face_name)
        else:
            self._insert_recursively(self.root, face_encoding, face_name,model_type)

    def _insert_recursively(self, current_node, face_encoding, face_name,model_type):
        distance_to_current = 0
        face_encoding=np.array(face_encoding)
        if model_type=='face_recognition':
            distance_to_current = face_recognition.face_distance([current_node.face_encoding], face_encoding)[0]
        elif model_type=='facenet':
            distance_to_current = cosine(face_encoding.flatten(), current_node.face_encoding.flatten())
        else:
            result=DeepFace.verify(face_encoding, current_node.face_encoding)    
            distance_to_current=result['distance']
            # o_current = np.linalg.norm(face_encoding - current_node.face_encoding)
            print
            # print(face_encoding)
            distance_to_current = (face_encoding - current_node.face_encoding)
        if distance_to_current <= 0.5:  # Adjust the threshold as needed
            if current_node.left is None:
                current_node.left = Node((face_encoding), face_name)
            else:
                self._insert_recursively(current_node.left, face_encoding, face_name,model_type)
        else:
            if current_node.right is None:
                current_node.right = Node(face_encoding, face_name)
            else:
                self._insert_recursively(current_node.right, face_encoding, face_name,model_type)

    def inorder_traversal(self):
        sorted_encodings_and_names = []
        self._inorder_traversal_recursively(self.root, sorted_encodings_and_names)
        return sorted_encodings_and_names

    def _inorder_traversal_recursively(self, current_node, sorted_encodings_and_names):
        if current_node is not None:
            self._inorder_traversal_recursively(current_node.left, sorted_encodings_and_names)
            sorted_encodings_and_names.append((current_node.face_encoding, current_node.face_name))
            self._inorder_traversal_recursively(current_node.right, sorted_encodings_and_names)


def get_tree_embedding(file,model_type):
    known_face_namess=[]
    known_face_encodingss=[]
    with open(file, 'rb') as f:
        known_face_encodings, known_face_names = pickle.load(f)
    known_faces_tree = BinarySearchTree()
    for face_encoding, face_name in zip(known_face_encodings, known_face_names):
        # print(type(face_encoding))    
        # print("----------------")
        known_faces_tree.insert(face_encoding, face_name,model_type)

    face_names=known_faces_tree.inorder_traversal()

# # Store face names and tree structure in binary format
    with open(f'{file}_tree.pickle', 'wb') as f:
        pickle.dump( known_faces_tree, f)

# model_type="facenet"
# get_tree_embedding('./facenet_known_faces.pickle',model_type)
model_type='face_recognition'
get_tree_embedding('./face_recognition_known_faces.pickle',model_type='face_recognition')
# get_tree_embedding('./deepface_known_faces.pickle',model_type='deepface')