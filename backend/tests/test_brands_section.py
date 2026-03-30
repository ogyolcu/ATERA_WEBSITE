"""
Test suite for Brands Section Title/Subtitle Styling Feature
Tests: brands_title_color, brands_title_size, brands_title_bold, brands_title_shadow_*,
       brands_subtitle_color, brands_subtitle_size, brands_subtitle_bold, brands_subtitle_shadow_*
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Test credentials
ADMIN_EMAIL = "ozan.yolcu@atera.com.tr"
ADMIN_PASSWORD = "admin123"


@pytest.fixture(scope="module")
def auth_token():
    """Get authentication token for admin user"""
    response = requests.post(f"{BASE_URL}/api/auth/login", json={
        "email": ADMIN_EMAIL,
        "password": ADMIN_PASSWORD
    })
    assert response.status_code == 200, f"Login failed: {response.text}"
    data = response.json()
    return data.get("access_token")


@pytest.fixture
def auth_headers(auth_token):
    """Return headers with auth token"""
    return {
        "Authorization": f"Bearer {auth_token}",
        "Content-Type": "application/json"
    }


class TestPublicSettingsEndpoint:
    """Test GET /api/public/settings returns all brands title/subtitle style fields"""
    
    def test_public_settings_returns_brands_title_color(self):
        """Verify brands_title_color field is returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_title_color" in data
        assert isinstance(data["brands_title_color"], str)
        
    def test_public_settings_returns_brands_title_size(self):
        """Verify brands_title_size field is returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_title_size" in data
        assert data["brands_title_size"] in ["small", "normal", "large", "xlarge"]
        
    def test_public_settings_returns_brands_title_bold(self):
        """Verify brands_title_bold field is returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_title_bold" in data
        assert isinstance(data["brands_title_bold"], bool)
        
    def test_public_settings_returns_brands_title_shadow_fields(self):
        """Verify all brands_title_shadow_* fields are returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Check shadow enabled
        assert "brands_title_shadow_enabled" in data
        assert isinstance(data["brands_title_shadow_enabled"], bool)
        
        # Check shadow color
        assert "brands_title_shadow_color" in data
        assert isinstance(data["brands_title_shadow_color"], str)
        
        # Check shadow blur
        assert "brands_title_shadow_blur" in data
        assert isinstance(data["brands_title_shadow_blur"], int)
        
        # Check shadow opacity
        assert "brands_title_shadow_opacity" in data
        assert isinstance(data["brands_title_shadow_opacity"], int)
        
    def test_public_settings_returns_brands_subtitle_color(self):
        """Verify brands_subtitle_color field is returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_subtitle_color" in data
        assert isinstance(data["brands_subtitle_color"], str)
        
    def test_public_settings_returns_brands_subtitle_size(self):
        """Verify brands_subtitle_size field is returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_subtitle_size" in data
        assert data["brands_subtitle_size"] in ["small", "normal", "large", "xlarge"]
        
    def test_public_settings_returns_brands_subtitle_bold(self):
        """Verify brands_subtitle_bold field is returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_subtitle_bold" in data
        assert isinstance(data["brands_subtitle_bold"], bool)
        
    def test_public_settings_returns_brands_subtitle_shadow_fields(self):
        """Verify all brands_subtitle_shadow_* fields are returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        
        # Check shadow enabled
        assert "brands_subtitle_shadow_enabled" in data
        assert isinstance(data["brands_subtitle_shadow_enabled"], bool)
        
        # Check shadow color
        assert "brands_subtitle_shadow_color" in data
        assert isinstance(data["brands_subtitle_shadow_color"], str)
        
        # Check shadow blur
        assert "brands_subtitle_shadow_blur" in data
        assert isinstance(data["brands_subtitle_shadow_blur"], int)
        
        # Check shadow opacity
        assert "brands_subtitle_shadow_opacity" in data
        assert isinstance(data["brands_subtitle_shadow_opacity"], int)


class TestAdminSettingsUpdate:
    """Test PUT /api/admin/settings accepts and persists all brands title/subtitle style fields"""
    
    def test_update_brands_title_color(self, auth_headers):
        """Test updating brands_title_color"""
        test_color = "#FF5733"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_color": test_color},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_title_color"] == test_color
        
        # Verify persistence via GET
        get_response = requests.get(f"{BASE_URL}/api/public/settings")
        assert get_response.status_code == 200
        assert get_response.json()["brands_title_color"] == test_color
        
    def test_update_brands_title_size(self, auth_headers):
        """Test updating brands_title_size"""
        test_size = "large"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_size": test_size},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_title_size"] == test_size
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/public/settings")
        assert get_response.json()["brands_title_size"] == test_size
        
    def test_update_brands_title_bold(self, auth_headers):
        """Test updating brands_title_bold"""
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_bold": True},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_title_bold"] == True
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/public/settings")
        assert get_response.json()["brands_title_bold"] == True
        
    def test_update_brands_title_shadow_enabled(self, auth_headers):
        """Test updating brands_title_shadow_enabled"""
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_shadow_enabled": True},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_title_shadow_enabled"] == True
        
    def test_update_brands_title_shadow_color(self, auth_headers):
        """Test updating brands_title_shadow_color"""
        test_color = "#00FF00"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_shadow_color": test_color},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_title_shadow_color"] == test_color
        
    def test_update_brands_title_shadow_blur(self, auth_headers):
        """Test updating brands_title_shadow_blur"""
        test_blur = 15
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_shadow_blur": test_blur},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_title_shadow_blur"] == test_blur
        
    def test_update_brands_title_shadow_opacity(self, auth_headers):
        """Test updating brands_title_shadow_opacity"""
        test_opacity = 75
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_shadow_opacity": test_opacity},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_title_shadow_opacity"] == test_opacity
        
    def test_update_brands_subtitle_color(self, auth_headers):
        """Test updating brands_subtitle_color"""
        test_color = "#AABBCC"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_color": test_color},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_subtitle_color"] == test_color
        
        # Verify persistence
        get_response = requests.get(f"{BASE_URL}/api/public/settings")
        assert get_response.json()["brands_subtitle_color"] == test_color
        
    def test_update_brands_subtitle_size(self, auth_headers):
        """Test updating brands_subtitle_size"""
        test_size = "xlarge"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_size": test_size},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_subtitle_size"] == test_size
        
    def test_update_brands_subtitle_bold(self, auth_headers):
        """Test updating brands_subtitle_bold"""
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_bold": True},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_subtitle_bold"] == True
        
    def test_update_brands_subtitle_shadow_enabled(self, auth_headers):
        """Test updating brands_subtitle_shadow_enabled"""
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_shadow_enabled": True},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_subtitle_shadow_enabled"] == True
        
    def test_update_brands_subtitle_shadow_color(self, auth_headers):
        """Test updating brands_subtitle_shadow_color"""
        test_color = "#112233"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_shadow_color": test_color},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_subtitle_shadow_color"] == test_color
        
    def test_update_brands_subtitle_shadow_blur(self, auth_headers):
        """Test updating brands_subtitle_shadow_blur"""
        test_blur = 10
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_shadow_blur": test_blur},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_subtitle_shadow_blur"] == test_blur
        
    def test_update_brands_subtitle_shadow_opacity(self, auth_headers):
        """Test updating brands_subtitle_shadow_opacity"""
        test_opacity = 60
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_shadow_opacity": test_opacity},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        assert data["brands_subtitle_shadow_opacity"] == test_opacity
        
    def test_update_all_brands_fields_at_once(self, auth_headers):
        """Test updating all brands title/subtitle fields in a single request"""
        update_data = {
            "brands_title_color": "#FFFFFF",
            "brands_title_size": "normal",
            "brands_title_bold": False,
            "brands_title_shadow_enabled": False,
            "brands_title_shadow_color": "#000000",
            "brands_title_shadow_blur": 5,
            "brands_title_shadow_opacity": 50,
            "brands_subtitle_color": "#A1A1AA",
            "brands_subtitle_size": "normal",
            "brands_subtitle_bold": False,
            "brands_subtitle_shadow_enabled": False,
            "brands_subtitle_shadow_color": "#000000",
            "brands_subtitle_shadow_blur": 5,
            "brands_subtitle_shadow_opacity": 50
        }
        
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json=update_data,
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()
        
        # Verify all fields were updated
        for key, value in update_data.items():
            assert data[key] == value, f"Field {key} mismatch: expected {value}, got {data[key]}"
            
        # Verify persistence via public endpoint
        get_response = requests.get(f"{BASE_URL}/api/public/settings")
        assert get_response.status_code == 200
        public_data = get_response.json()
        for key, value in update_data.items():
            assert public_data[key] == value


class TestAuthProtection:
    """Test that admin settings endpoints require authentication"""
    
    def test_admin_settings_requires_auth(self):
        """Test PUT /api/admin/settings returns 401 without auth"""
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_color": "#FF0000"}
        )
        assert response.status_code == 401
        
    def test_admin_get_settings_requires_auth(self):
        """Test GET /api/admin/settings returns 401 without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/settings")
        assert response.status_code == 401


class TestBrandsTextFields:
    """Test brands title/subtitle text fields (TR/EN)"""
    
    def test_public_settings_returns_brands_title_tr_en(self):
        """Verify brands_title_tr and brands_title_en fields are returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_title_tr" in data
        assert "brands_title_en" in data
        
    def test_public_settings_returns_brands_subtitle_tr_en(self):
        """Verify brands_subtitle_tr and brands_subtitle_en fields are returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200
        data = response.json()
        assert "brands_subtitle_tr" in data
        assert "brands_subtitle_en" in data
        
    def test_update_brands_title_tr(self, auth_headers):
        """Test updating brands_title_tr"""
        test_text = "TEST Güvenilir Markalar"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_tr": test_text},
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["brands_title_tr"] == test_text
        
        # Reset to default
        requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_tr": "Güvenilir Markalar"},
            headers=auth_headers
        )
        
    def test_update_brands_title_en(self, auth_headers):
        """Test updating brands_title_en"""
        test_text = "TEST Trusted Brands"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_en": test_text},
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["brands_title_en"] == test_text
        
        # Reset to default
        requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_title_en": "Trusted Brands"},
            headers=auth_headers
        )
        
    def test_update_brands_subtitle_tr(self, auth_headers):
        """Test updating brands_subtitle_tr"""
        test_text = "TEST Dünya liderlerinden IT ekipmanları"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_tr": test_text},
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["brands_subtitle_tr"] == test_text
        
        # Reset to default
        requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_tr": "Dünya liderlerinden IT ekipmanları"},
            headers=auth_headers
        )
        
    def test_update_brands_subtitle_en(self, auth_headers):
        """Test updating brands_subtitle_en"""
        test_text = "TEST IT equipment from world leaders"
        response = requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_en": test_text},
            headers=auth_headers
        )
        assert response.status_code == 200
        assert response.json()["brands_subtitle_en"] == test_text
        
        # Reset to default
        requests.put(
            f"{BASE_URL}/api/admin/settings",
            json={"brands_subtitle_en": "IT equipment from world leaders"},
            headers=auth_headers
        )


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
