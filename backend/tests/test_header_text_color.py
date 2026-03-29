"""
Test suite for header_text_color feature and core API endpoints
Tests: Auth, Settings (including header_text_color), Public endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials from test_credentials.md
ADMIN_EMAIL = "ozan.yolcu@atera.com.tr"
ADMIN_PASSWORD = "admin123"


class TestHealthAndPublicEndpoints:
    """Test public endpoints that don't require authentication"""
    
    def test_api_root(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        print(f"✓ API root: {data}")
    
    def test_uptime_ping(self):
        """Test uptime ping endpoint"""
        response = requests.get(f"{BASE_URL}/api/uptime/ping")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        print(f"✓ Uptime ping: {data}")
    
    def test_public_settings_returns_header_text_color(self):
        """Test GET /api/public/settings returns header_text_color field"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Verify header_text_color field exists
        assert "header_text_color" in data, "header_text_color field missing from settings"
        
        # Verify it's a valid color string (hex format)
        header_text_color = data["header_text_color"]
        assert isinstance(header_text_color, str), "header_text_color should be a string"
        assert header_text_color.startswith("#"), f"header_text_color should be hex format, got: {header_text_color}"
        
        print(f"✓ Public settings header_text_color: {header_text_color}")
        
        # Also verify other essential settings fields
        assert "background_color" in data
        assert "header_color" in data
        assert "text_color" in data
        print(f"✓ All essential color settings present")
    
    def test_public_banners(self):
        """Test GET /api/public/banners"""
        response = requests.get(f"{BASE_URL}/api/public/banners")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Public banners: {len(data)} banners found")
    
    def test_public_brands(self):
        """Test GET /api/public/brands"""
        response = requests.get(f"{BASE_URL}/api/public/brands")
        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        print(f"✓ Public brands: {len(data)} brands found")


class TestAuthentication:
    """Test authentication endpoints"""
    
    def test_login_success(self):
        """Test login with valid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        assert response.status_code == 200, f"Login failed: {response.text}"
        data = response.json()
        
        # Verify response structure
        assert "access_token" in data, "access_token missing from login response"
        assert "refresh_token" in data, "refresh_token missing from login response"
        assert "email" in data
        assert "role" in data
        assert data["email"] == ADMIN_EMAIL
        assert data["role"] == "admin"
        
        print(f"✓ Login successful for {ADMIN_EMAIL}")
        return data["access_token"]
    
    def test_login_invalid_credentials(self):
        """Test login with invalid credentials"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": "wrong@email.com", "password": "wrongpassword"}
        )
        assert response.status_code == 401
        print("✓ Invalid credentials correctly rejected")
    
    def test_auth_me_without_token(self):
        """Test /auth/me without token returns 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401
        print("✓ /auth/me correctly requires authentication")


class TestAdminSettings:
    """Test admin settings endpoints including header_text_color"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        response = requests.post(
            f"{BASE_URL}/api/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}
        )
        if response.status_code == 200:
            return response.json().get("access_token")
        pytest.skip("Authentication failed")
    
    def test_get_admin_settings(self, auth_token):
        """Test GET /api/admin/settings with auth"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/settings", headers=headers)
        assert response.status_code == 200
        data = response.json()
        
        # Verify header_text_color exists
        assert "header_text_color" in data
        print(f"✓ Admin settings retrieved, header_text_color: {data['header_text_color']}")
    
    def test_update_header_text_color(self, auth_token):
        """Test PUT /api/admin/settings to update header_text_color"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Get current settings
        get_response = requests.get(f"{BASE_URL}/api/admin/settings", headers=headers)
        assert get_response.status_code == 200
        original_color = get_response.json().get("header_text_color")
        print(f"  Original header_text_color: {original_color}")
        
        # Update to a new color
        test_color = "#FF5733"  # Orange-red test color
        update_response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            headers=headers,
            json={"header_text_color": test_color}
        )
        assert update_response.status_code == 200
        updated_data = update_response.json()
        assert updated_data["header_text_color"] == test_color
        print(f"  Updated header_text_color to: {test_color}")
        
        # Verify persistence via GET
        verify_response = requests.get(f"{BASE_URL}/api/admin/settings", headers=headers)
        assert verify_response.status_code == 200
        assert verify_response.json()["header_text_color"] == test_color
        print(f"✓ header_text_color update persisted correctly")
        
        # Verify public endpoint also reflects the change
        public_response = requests.get(f"{BASE_URL}/api/public/settings")
        assert public_response.status_code == 200
        assert public_response.json()["header_text_color"] == test_color
        print(f"✓ Public settings also reflects updated header_text_color")
        
        # Restore original color
        restore_response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            headers=headers,
            json={"header_text_color": original_color}
        )
        assert restore_response.status_code == 200
        print(f"  Restored header_text_color to: {original_color}")
    
    def test_admin_settings_without_auth(self):
        """Test admin settings endpoints require authentication"""
        # GET without auth
        get_response = requests.get(f"{BASE_URL}/api/admin/settings")
        assert get_response.status_code == 401
        
        # PUT without auth
        put_response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"header_text_color": "#FFFFFF"}
        )
        assert put_response.status_code == 401
        print("✓ Admin settings correctly require authentication")


class TestContactForm:
    """Test contact form submission"""
    
    def test_submit_contact_form(self):
        """Test POST /api/contact"""
        test_message = {
            "name": "TEST_User",
            "email": "test@example.com",
            "phone": "+90 555 123 4567",
            "message": "This is a test message from automated testing"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=test_message)
        assert response.status_code == 200
        data = response.json()
        
        assert data["name"] == test_message["name"]
        assert data["email"] == test_message["email"]
        assert "id" in data
        print(f"✓ Contact form submitted successfully, id: {data['id']}")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
