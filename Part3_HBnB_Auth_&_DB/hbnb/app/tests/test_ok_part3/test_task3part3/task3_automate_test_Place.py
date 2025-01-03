import requests
import unittest
import csv
import logging
import io
import sys

BASE_URL = "http://127.0.0.1:5000/api/v1"
USER_CREDENTIALS = {
    "first_name": "Test",
    "last_name": "User",
    "email": "testuser@example.com",
    "password": "password123",
    "is_admin": True
}

class APITestCase(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        # Configure logging
        cls.log_stream = io.StringIO()
        logging.basicConfig(stream=cls.log_stream, level=logging.INFO)

        logging.info("Creating User...")
        cls.user_id = cls.create_user()
        logging.info(f"Create User: {cls.user_response.status_code} {cls.user_response.json()}")

        logging.info("Authenticating User...")
        cls.token = cls.authenticate_user()
        logging.info(f"Authenticate User: {cls.auth_response.status_code} {cls.auth_response.json()}")

        logging.info("Creating Amenity WiFi...")
        cls.amenity_id_1 = cls.create_amenity("WiFi")
        logging.info(f"Create Amenity (WiFi): {cls.amenity_response.status_code} {cls.amenity_response.json()}")

        logging.info("Creating Amenity Pool...")
        cls.amenity_id_2 = cls.create_amenity("Pool")
        logging.info(f"Create Amenity (Pool): {cls.amenity_response.status_code} {cls.amenity_response.json()}")

        logging.info("Creating Place...")
        cls.place_id = cls.create_place()
        logging.info(f"Create Place: {cls.place_response.status_code} {cls.place_response.json()}")

    @classmethod
    def tearDownClass(cls):
        # Save log to CSV
        log_contents = cls.log_stream.getvalue()
        with open('test_log_place.csv', 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['Log'])
            writer.writerow([log_contents])
        print("Test log successfully written to test_log_place.csv")

    @staticmethod
    def create_user():
        url = f"{BASE_URL}/users/"
        response = requests.post(url, json=USER_CREDENTIALS)
        APITestCase.user_response = response
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        return response.json().get('id')

    @staticmethod
    def authenticate_user():
        url = f"{BASE_URL}/auth/login"
        data = {
            "email": USER_CREDENTIALS['email'],
            "password": USER_CREDENTIALS['password']
        }
        response = requests.post(url, json=data)
        APITestCase.auth_response = response
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        return response.json().get('access_token')

    @classmethod
    def create_amenity(cls, name):
        url = f"{BASE_URL}/amenities/"
        headers = {"Authorization": f"Bearer {cls.token}"}
        data = {"name": name}
        response = requests.post(url, json=data, headers=headers)
        cls.amenity_response = response
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        return response.json().get('id')

    @classmethod
    def create_place(cls):
        url = f"{BASE_URL}/places/"
        headers = {"Authorization": f"Bearer {cls.token}"}
        data = {
            "title": "New Place",
            "description": "A nice place",
            "price": 100.0,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "owner_id": cls.user_id,
            "amenities": [cls.amenity_id_1, cls.amenity_id_2]
        }
        response = requests.post(url, json=data, headers=headers)
        cls.place_response = response
        assert response.status_code == 201, f"Expected 201, got {response.status_code}"
        return response.json().get('id')

    def test_place_creation(self):
        url = f"{BASE_URL}/places/"
        headers = {"Authorization": f"Bearer {self.token}"}
        data = {
            "title": "New Place",
            "description": "A nice place",
            "price": 100.0,
            "latitude": 37.7749,
            "longitude": -122.4194,
            "owner_id": self.user_id,
            "amenities": [self.amenity_id_1, self.amenity_id_2]
        }
        response = requests.post(url, json=data, headers=headers)
        logging.info(f"Test Place Creation: {response.status_code}")
        logging.info(response.json())
        self.assertEqual(response.status_code, 201)

    def test_get_all_places(self):
        url = f"{BASE_URL}/places/"
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(url, headers=headers)
        logging.info(f"Test Get All Places: {response.status_code}")
        logging.info(response.json())
        self.assertEqual(response.status_code, 200)

    def test_get_place_by_id(self):
        url = f"{BASE_URL}/places/{self.place_id}"
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(url, headers=headers)
        logging.info(f"Test Get Place by ID: {response.status_code}")
        logging.info(response.json())
        self.assertEqual(response.status_code, 200)

    # def test_update_place(self):
    #     url = f"{BASE_URL}/places/{self.place_id}"
    #     headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
    #     data = {
    #         "title": "Updated Place",
    #         "description": "An updated nice place",
    #         "price": 150.0
    #     }
    #     response = requests.put(url, json=data, headers=headers)
    #     logging.info(f"Test Update Place: {response.status_code}")
    #     if response.status_code == 200:
    #         logging.info(response.json())
    #     self.assertEqual(response.status_code, 200)

    def test_update_place(self):
        url = f"{BASE_URL}/places/{self.place_id}"
        headers = {"Authorization": f"Bearer {self.token}", "Content-Type": "application/json"}
        data = {
            "title": "Updated Place",
            "description": "An updated nice place",
            "price": 150.0,
            "latitude": 37.7749,
            "longitude": -122.4194
        }
        response = requests.put(url, json=data, headers=headers)
        logging.info(f"Test Update Place: {response.status_code}")
        if response.status_code == 200:
            logging.info(response.json())
        self.assertEqual(response.status_code, 200)

    # def test_delete_place(self):
    #     url = f"{BASE_URL}/places/{self.place_id}"
    #     headers = {"Authorization": f"Bearer {self.token}"}
    #     response = requests.delete(url, headers=headers)
    #     logging.info(f"Test Delete Place: {response.status_code}")
    #     self.assertEqual(response.status_code, 204)

print(""" TEST PLACE PART3
██╗  ██╗██████╗ ███╗   ██╗██████╗
██║  ██║██╔══██╗████╗  ██║██╔══██╗
███████║███████║██╔██╗ ██║███████║
██╔══██║██║  ██║██║╚██╗██║██║  ██║
██║  ██║██████╔╝██║ ╚████║██████╔╝
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═══╝╚═════╝
 | HBnB part3 Logo  # C24
""")


if __name__ == "__main__":
    unittest.main()

print("""
██╗  ██╗██████╗ ███╗   ██╗██████╗
██║  ██║██╔══██╗████╗  ██║██╔══██╗
███████║███████║██╔██╗ ██║███████║
██╔══██║██║  ██║██║╚██╗██║██║  ██║
██║  ██║██████╔╝██║ ╚████║██████╔╝
╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═══╝╚═════╝
 | HBnB part3 Logo  # C24
""")
