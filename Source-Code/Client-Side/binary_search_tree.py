import face_recognition
class Node:
    def __init__(self, face_encoding, face_name):
        self.face_encoding = face_encoding
        self.face_name = face_name
        self.left = None
        self.right = None

class BinarySearchTree:
    def __init__(self):
        self.root = None

    def insert(self, face_encoding, face_name):
        if self.root is None:
            self.root = Node(face_encoding, face_name)
        else:
            self._insert_recursively(self.root, face_encoding, face_name)

    def _insert_recursively(self, current_node, face_encoding, face_name):
        distance_to_current = face_recognition.face_distance([current_node.face_encoding], face_encoding)[0]

        if distance_to_current <= 0.5:  # Adjust the threshold as needed
            if current_node.left is None:
                current_node.left = Node(face_encoding, face_name)
            else:
                self._insert_recursively(current_node.left, face_encoding, face_name)
        else:
            if current_node.right is None:
                current_node.right = Node(face_encoding, face_name)
            else:
                self._insert_recursively(current_node.right, face_encoding, face_name)

    def inorder_traversal(self):
        sorted_encodings_and_names = []
        self._inorder_traversal_recursively(self.root, sorted_encodings_and_names)
        return sorted_encodings_and_names

    def _inorder_traversal_recursively(self, current_node, sorted_encodings_and_names):
        if current_node is not None:
            self._inorder_traversal_recursively(current_node.left, sorted_encodings_and_names)
            sorted_encodings_and_names.append((current_node.face_encoding, current_node.face_name))
            self._inorder_traversal_recursively(current_node.right, sorted_encodings_and_names)