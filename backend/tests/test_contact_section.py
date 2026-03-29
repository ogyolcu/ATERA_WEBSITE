"""
Test Contact Section Features:
- Contact title/subtitle TR/EN from settings
- Contact address from settings
- Contact title/subtitle/address colors from settings
- Phone field removed from contact form
- Admin settings for contact section
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestPublicSettings:
    """Test GET /api/public/settings returns contact section fields"""
    
    def test_public_settings_returns_contact_fields(self):
        """Verify all contact section fields are returned"""
        response = requests.get(f"{BASE_URL}/api/public/settings")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        
        # Check contact title fields
        assert "contact_title_tr" in data, "Missing contact_title_tr"
        assert "contact_title_en" in data, "Missing contact_title_en"
        
        # Check contact subtitle fields
        assert "contact_subtitle_tr" in data, "Missing contact_subtitle_tr"
        assert "contact_subtitle_en" in data, "Missing contact_subtitle_en"
        
        # Check contact address
        assert "contact_address" in data, "Missing contact_address"
        
        # Check contact color fields
        assert "contact_title_color" in data, "Missing contact_title_color"
        assert "contact_subtitle_color" in data, "Missing contact_subtitle_color"
        assert "contact_address_color" in data, "Missing contact_address_color"
        
        print(f"✓ All contact section fields present in public settings")
        print(f"  - contact_title_tr: {data['contact_title_tr']}")
        print(f"  - contact_title_en: {data['contact_title_en']}")
        print(f"  - contact_subtitle_tr: {data['contact_subtitle_tr']}")
        print(f"  - contact_subtitle_en: {data['contact_subtitle_en']}")
        print(f"  - contact_address: {data['contact_address']}")
        print(f"  - contact_title_color: {data['contact_title_color']}")
        print(f"  - contact_subtitle_color: {data['contact_subtitle_color']}")
        print(f"  - contact_address_color: {data['contact_address_color']}")


class TestContactForm:
    """Test contact form submission without phone field"""
    
    def test_contact_form_without_phone(self):
        """Submit contact form with only name, email, message (no phone)"""
        payload = {
            "name": "TEST_Contact_User",
            "email": "test_contact@example.com",
            "message": "This is a test message without phone"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["name"] == payload["name"]
        assert data["email"] == payload["email"]
        assert data["message"] == payload["message"]
        assert "id" in data
        
        print(f"✓ Contact form submitted successfully without phone field")
        print(f"  - Message ID: {data['id']}")
    
    def test_contact_form_with_optional_phone(self):
        """Verify phone field is optional (can be null)"""
        payload = {
            "name": "TEST_Contact_User2",
            "email": "test_contact2@example.com",
            "phone": None,
            "message": "Test message with null phone"
        }
        
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        print(f"✓ Contact form accepts null phone field")


class TestAdminSettingsAuth:
    """Test admin settings endpoints with authentication"""
    
    @pytest.fixture
    def auth_token(self):
        """Get authentication token"""
        login_payload = {
            "email": "ozan.yolcu@atera.com.tr",
            "password": "admin123"
        }
        response = requests.post(f"{BASE_URL}/api/auth/login", json=login_payload)
        if response.status_code != 200:
            pytest.skip(f"Login failed: {response.status_code}")
        
        data = response.json()
        return data.get("access_token")
    
    def test_get_admin_settings_with_auth(self, auth_token):
        """GET /api/admin/settings returns contact fields"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        response = requests.get(f"{BASE_URL}/api/admin/settings", headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "contact_title_tr" in data
        assert "contact_title_en" in data
        assert "contact_subtitle_tr" in data
        assert "contact_subtitle_en" in data
        assert "contact_address" in data
        assert "contact_title_color" in data
        assert "contact_subtitle_color" in data
        assert "contact_address_color" in data
        
        print(f"✓ Admin settings endpoint returns all contact fields")
    
    def test_update_contact_title_tr(self, auth_token):
        """PUT /api/admin/settings updates contact_title_tr"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        # Update contact_title_tr
        update_payload = {"contact_title_tr": "TEST_İletişim_Başlık"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["contact_title_tr"] == "TEST_İletişim_Başlık"
        
        # Verify via GET
        get_response = requests.get(f"{BASE_URL}/api/public/settings")
        assert get_response.json()["contact_title_tr"] == "TEST_İletişim_Başlık"
        
        # Restore original
        restore_payload = {"contact_title_tr": "İletişim"}
        requests.put(f"{BASE_URL}/api/admin/settings", json=restore_payload, headers=headers)
        
        print(f"✓ contact_title_tr update and persistence verified")
    
    def test_update_contact_title_en(self, auth_token):
        """PUT /api/admin/settings updates contact_title_en"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {"contact_title_en": "TEST_Contact_Title"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["contact_title_en"] == "TEST_Contact_Title"
        
        # Restore
        requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_title_en": "Contact"}, headers=headers)
        
        print(f"✓ contact_title_en update verified")
    
    def test_update_contact_subtitle_tr(self, auth_token):
        """PUT /api/admin/settings updates contact_subtitle_tr"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {"contact_subtitle_tr": "TEST_Alt_Başlık"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["contact_subtitle_tr"] == "TEST_Alt_Başlık"
        
        # Restore
        requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_subtitle_tr": "Sorularınız için bize ulaşın"}, headers=headers)
        
        print(f"✓ contact_subtitle_tr update verified")
    
    def test_update_contact_subtitle_en(self, auth_token):
        """PUT /api/admin/settings updates contact_subtitle_en"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {"contact_subtitle_en": "TEST_Subtitle_EN"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["contact_subtitle_en"] == "TEST_Subtitle_EN"
        
        # Restore
        requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_subtitle_en": "Get in touch with us"}, headers=headers)
        
        print(f"✓ contact_subtitle_en update verified")
    
    def test_update_contact_address(self, auth_token):
        """PUT /api/admin/settings updates contact_address"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {"contact_address": "TEST_Adres, Ankara, Türkiye"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["contact_address"] == "TEST_Adres, Ankara, Türkiye"
        
        # Restore
        requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_address": "İstanbul, Türkiye"}, headers=headers)
        
        print(f"✓ contact_address update verified")
    
    def test_update_contact_title_color(self, auth_token):
        """PUT /api/admin/settings updates contact_title_color"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {"contact_title_color": "#FF0000"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["contact_title_color"] == "#FF0000"
        
        # Restore
        requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_title_color": "#FFFFFF"}, headers=headers)
        
        print(f"✓ contact_title_color update verified")
    
    def test_update_contact_subtitle_color(self, auth_token):
        """PUT /api/admin/settings updates contact_subtitle_color"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {"contact_subtitle_color": "#00FF00"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["contact_subtitle_color"] == "#00FF00"
        
        # Restore
        requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_subtitle_color": "#A1A1AA"}, headers=headers)
        
        print(f"✓ contact_subtitle_color update verified")
    
    def test_update_contact_address_color(self, auth_token):
        """PUT /api/admin/settings updates contact_address_color"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {"contact_address_color": "#0000FF"}
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        assert response.json()["contact_address_color"] == "#0000FF"
        
        # Restore
        requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_address_color": "#A1A1AA"}, headers=headers)
        
        print(f"✓ contact_address_color update verified")
    
    def test_update_all_contact_fields_at_once(self, auth_token):
        """PUT /api/admin/settings updates all contact fields in one request"""
        headers = {"Authorization": f"Bearer {auth_token}"}
        
        update_payload = {
            "contact_title_tr": "TEST_Bulk_Title_TR",
            "contact_title_en": "TEST_Bulk_Title_EN",
            "contact_subtitle_tr": "TEST_Bulk_Subtitle_TR",
            "contact_subtitle_en": "TEST_Bulk_Subtitle_EN",
            "contact_address": "TEST_Bulk_Address",
            "contact_title_color": "#111111",
            "contact_subtitle_color": "#222222",
            "contact_address_color": "#333333"
        }
        
        response = requests.put(f"{BASE_URL}/api/admin/settings", json=update_payload, headers=headers)
        
        assert response.status_code == 200
        data = response.json()
        
        assert data["contact_title_tr"] == "TEST_Bulk_Title_TR"
        assert data["contact_title_en"] == "TEST_Bulk_Title_EN"
        assert data["contact_subtitle_tr"] == "TEST_Bulk_Subtitle_TR"
        assert data["contact_subtitle_en"] == "TEST_Bulk_Subtitle_EN"
        assert data["contact_address"] == "TEST_Bulk_Address"
        assert data["contact_title_color"] == "#111111"
        assert data["contact_subtitle_color"] == "#222222"
        assert data["contact_address_color"] == "#333333"
        
        # Restore all
        restore_payload = {
            "contact_title_tr": "İletişim",
            "contact_title_en": "Contact",
            "contact_subtitle_tr": "Sorularınız için bize ulaşın",
            "contact_subtitle_en": "Get in touch with us",
            "contact_address": "İstanbul, Türkiye",
            "contact_title_color": "#FFFFFF",
            "contact_subtitle_color": "#A1A1AA",
            "contact_address_color": "#A1A1AA"
        }
        requests.put(f"{BASE_URL}/api/admin/settings", json=restore_payload, headers=headers)
        
        print(f"✓ Bulk update of all contact fields verified")


class TestAdminSettingsUnauth:
    """Test admin settings endpoints without authentication"""
    
    def test_get_admin_settings_without_auth(self):
        """GET /api/admin/settings should fail without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/settings")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Admin settings protected - returns 401 without auth")
    
    def test_put_admin_settings_without_auth(self):
        """PUT /api/admin/settings should fail without auth"""
        response = requests.put(f"{BASE_URL}/api/admin/settings", json={"contact_title_tr": "Hack"})
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print(f"✓ Admin settings update protected - returns 401 without auth")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
