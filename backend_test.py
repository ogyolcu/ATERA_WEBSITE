import requests
import sys
from datetime import datetime
import json

class AteraAPITester:
    def __init__(self, base_url="https://laptop-shop-nz.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_token = None

    def run_test(self, name, method, endpoint, expected_status, data=None, auth_required=False):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, list):
                        print(f"   Response: List with {len(response_data)} items")
                    elif isinstance(response_data, dict):
                        print(f"   Response keys: {list(response_data.keys())}")
                except:
                    print(f"   Response: {response.text[:100]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.status_code < 500 else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_admin_login(self):
        """Test admin login and store session"""
        success, response = self.run_test(
            "Admin Login",
            "POST",
            "auth/login",
            200,
            data={"email": "admin@atera.com.tr", "password": "admin123"}
        )
        if success and 'id' in response:
            print(f"   Logged in as: {response.get('email')} (Role: {response.get('role')})")
            return True
        return False

    def test_auth_me(self):
        """Test getting current user info"""
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        return success

    def test_public_banners(self):
        """Test getting public banners"""
        success, response = self.run_test(
            "Get Public Banners",
            "GET",
            "public/banners",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} banners")
            for banner in response[:2]:  # Show first 2
                print(f"   - {banner.get('title_en', 'No title')} (Order: {banner.get('order', 0)})")
        return success

    def test_public_brands(self):
        """Test getting public brands"""
        success, response = self.run_test(
            "Get Public Brands",
            "GET",
            "public/brands",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} brands")
            for brand in response:
                print(f"   - {brand.get('name', 'No name')} (Order: {brand.get('order', 0)})")
        return success

    def test_contact_form(self):
        """Test contact form submission"""
        test_contact = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "message": "This is a test message from automated testing."
        }
        
        success, response = self.run_test(
            "Submit Contact Form",
            "POST",
            "contact",
            200,
            data=test_contact
        )
        
        if success and 'id' in response:
            print(f"   Contact message created with ID: {response.get('id')}")
            return response.get('id')
        return None

    def test_admin_banners(self):
        """Test admin banner management"""
        success, response = self.run_test(
            "Get Admin Banners",
            "GET",
            "admin/banners",
            200
        )
        return success

    def test_admin_brands(self):
        """Test admin brand management"""
        success, response = self.run_test(
            "Get Admin Brands",
            "GET",
            "admin/brands",
            200
        )
        return success

    def test_admin_messages(self):
        """Test admin messages"""
        success, response = self.run_test(
            "Get Admin Messages",
            "GET",
            "admin/messages",
            200
        )
        if success and isinstance(response, list):
            print(f"   Found {len(response)} messages")
        return success

    def test_logout(self):
        """Test logout"""
        success, response = self.run_test(
            "Admin Logout",
            "POST",
            "auth/logout",
            200
        )
        return success

def main():
    print("🚀 Starting Atera API Testing...")
    print("=" * 50)
    
    tester = AteraAPITester()
    
    # Test public endpoints first (no auth required)
    print("\n📋 Testing Public Endpoints...")
    public_tests = [
        tester.test_public_banners(),
        tester.test_public_brands(),
        tester.test_contact_form() is not None,
    ]
    
    # Test authentication
    print("\n🔐 Testing Authentication...")
    auth_success = tester.test_admin_login()
    
    if auth_success:
        auth_tests = [
            tester.test_auth_me(),
        ]
        
        # Test admin endpoints
        print("\n👨‍💼 Testing Admin Endpoints...")
        admin_tests = [
            tester.test_admin_banners(),
            tester.test_admin_brands(),
            tester.test_admin_messages(),
        ]
        
        # Test logout
        print("\n🚪 Testing Logout...")
        logout_tests = [
            tester.test_logout(),
        ]
        
        all_tests = public_tests + auth_tests + admin_tests + logout_tests
    else:
        print("❌ Admin login failed, skipping authenticated tests")
        all_tests = public_tests
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        failed = tester.tests_run - tester.tests_passed
        print(f"⚠️  {failed} test(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())