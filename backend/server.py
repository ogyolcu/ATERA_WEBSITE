from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import logging
import bcrypt
import jwt
import secrets
from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import List, Optional
from datetime import datetime, timezone, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Config
JWT_ALGORITHM = "HS256"

def get_jwt_secret() -> str:
    return os.environ.get("JWT_SECRET", "default-secret-change-in-production")

# Password utilities
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))

# Token utilities
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=15),
        "type": "access"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
        "type": "refresh"
    }
    return jwt.encode(payload, get_jwt_secret(), algorithm=JWT_ALGORITHM)

# Auth helper
async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user["id"] = str(user["_id"])
        del user["_id"]
        user.pop("password_hash", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Create the main app
app = FastAPI()

# Create routers
api_router = APIRouter(prefix="/api")
auth_router = APIRouter(prefix="/auth")
admin_router = APIRouter(prefix="/admin")

# Pydantic Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str

class CarouselBanner(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    url: str
    alt: str
    title_tr: str
    title_en: str
    subtitle_tr: str
    subtitle_en: str
    link: Optional[str] = None
    order: int = 0
    active: bool = True

class CarouselBannerCreate(BaseModel):
    url: str
    alt: str
    title_tr: str
    title_en: str
    subtitle_tr: str
    subtitle_en: str
    link: Optional[str] = None
    order: int = 0
    active: bool = True

class BrandLogo(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    url: str
    link: Optional[str] = None
    order: int = 0
    active: bool = True

class BrandLogoCreate(BaseModel):
    name: str
    url: str
    link: Optional[str] = None
    order: int = 0
    active: bool = True

class ContactMessage(BaseModel):
    id: str = Field(default_factory=lambda: str(ObjectId()))
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    read: bool = False

class ContactMessageCreate(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    message: str

class SiteSettings(BaseModel):
    id: str = "site_settings"
    # Colors
    background_color: str = "#0A0A0A"
    surface_color: str = "#141414"
    header_color: str = "#0A0A0A"
    primary_color: str = "#007AFF"
    text_color: str = "#FFFFFF"
    text_secondary_color: str = "#A1A1AA"
    # Logo
    logo_url: str = ""
    logo_text: str = "ATERA"
    # Fonts
    heading_font: str = "Outfit"
    body_font: str = "Manrope"
    heading_size: str = "normal"
    body_size: str = "normal"
    # Brands Section
    brands_title_tr: str = "Güvenilir Markalar"
    brands_title_en: str = "Trusted Brands"
    brands_subtitle_tr: str = "Dünya liderlerinden IT ekipmanları"
    brands_subtitle_en: str = "IT equipment from world leaders"
    # Products Section
    product1_title: str = "Laptops"
    product1_desc_tr: str = "Profesyoneller için yüksek performanslı laptoplar"
    product1_desc_en: str = "High-performance laptops for professionals"
    product2_title: str = "Gaming Desk"
    product2_desc_tr: str = "Oyuncular için ergonomik gaming masaları"
    product2_desc_en: str = "Ergonomic gaming desks for gamers"
    product3_title: str = "Monitor Arms"
    product3_desc_tr: str = "Ayarlanabilir monitör kolları ve standlar"
    product3_desc_en: str = "Adjustable monitor arms and stands"
    # Menu
    menu_products_tr: str = "Ürünler"
    menu_products_en: str = "Products"
    menu_brands_tr: str = "Markalar"
    menu_brands_en: str = "Brands"
    menu_contact_tr: str = "İletişim"
    menu_contact_en: str = "Contact"

class SiteSettingsUpdate(BaseModel):
    background_color: Optional[str] = None
    surface_color: Optional[str] = None
    header_color: Optional[str] = None
    primary_color: Optional[str] = None
    text_color: Optional[str] = None
    text_secondary_color: Optional[str] = None
    logo_url: Optional[str] = None
    logo_text: Optional[str] = None
    heading_font: Optional[str] = None
    body_font: Optional[str] = None
    heading_size: Optional[str] = None
    body_size: Optional[str] = None
    brands_title_tr: Optional[str] = None
    brands_title_en: Optional[str] = None
    brands_subtitle_tr: Optional[str] = None
    brands_subtitle_en: Optional[str] = None
    product1_title: Optional[str] = None
    product1_desc_tr: Optional[str] = None
    product1_desc_en: Optional[str] = None
    product2_title: Optional[str] = None
    product2_desc_tr: Optional[str] = None
    product2_desc_en: Optional[str] = None
    product3_title: Optional[str] = None
    product3_desc_tr: Optional[str] = None
    product3_desc_en: Optional[str] = None
    menu_products_tr: Optional[str] = None
    menu_products_en: Optional[str] = None
    menu_brands_tr: Optional[str] = None
    menu_brands_en: Optional[str] = None
    menu_contact_tr: Optional[str] = None
    menu_contact_en: Optional[str] = None

# Auth Endpoints
@auth_router.post("/login")
async def login(request: LoginRequest, response: Response):
    email = request.email.lower()
    user = await db.users.find_one({"email": email})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not verify_password(request.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user_id = str(user["_id"])
    access_token = create_access_token(user_id, email)
    refresh_token = create_refresh_token(user_id)
    
    # Return tokens in response body for localStorage storage
    return {
        "id": user_id, 
        "email": user["email"], 
        "name": user["name"], 
        "role": user["role"],
        "access_token": access_token,
        "refresh_token": refresh_token
    }

@auth_router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")
    return {"message": "Logged out"}

@auth_router.get("/me")
async def get_me(user: dict = Depends(get_current_user)):
    return user

@auth_router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="No refresh token")
    try:
        payload = jwt.decode(token, get_jwt_secret(), algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        access_token = create_access_token(str(user["_id"]), user["email"])
        response.set_cookie(key="access_token", value=access_token, httponly=True, secure=True, samesite="none", max_age=900, path="/")
        return {"message": "Token refreshed"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Refresh token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Admin Carousel Endpoints
@admin_router.get("/banners", response_model=List[CarouselBanner])
async def get_banners(user: dict = Depends(get_current_user)):
    banners = await db.banners.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return banners

@admin_router.post("/banners", response_model=CarouselBanner)
async def create_banner(banner: CarouselBannerCreate, user: dict = Depends(get_current_user)):
    banner_dict = banner.model_dump()
    banner_dict["id"] = str(ObjectId())
    await db.banners.insert_one(banner_dict)
    return banner_dict

@admin_router.put("/banners/{banner_id}", response_model=CarouselBanner)
async def update_banner(banner_id: str, banner: CarouselBannerCreate, user: dict = Depends(get_current_user)):
    banner_dict = banner.model_dump()
    result = await db.banners.update_one({"id": banner_id}, {"$set": banner_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Banner not found")
    banner_dict["id"] = banner_id
    return banner_dict

@admin_router.delete("/banners/{banner_id}")
async def delete_banner(banner_id: str, user: dict = Depends(get_current_user)):
    result = await db.banners.delete_one({"id": banner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Banner not found")
    return {"message": "Banner deleted"}

# Admin Brand Logos Endpoints
@admin_router.get("/brands", response_model=List[BrandLogo])
async def get_brands(user: dict = Depends(get_current_user)):
    brands = await db.brands.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return brands

@admin_router.post("/brands", response_model=BrandLogo)
async def create_brand(brand: BrandLogoCreate, user: dict = Depends(get_current_user)):
    brand_dict = brand.model_dump()
    brand_dict["id"] = str(ObjectId())
    await db.brands.insert_one(brand_dict)
    return brand_dict

@admin_router.put("/brands/{brand_id}", response_model=BrandLogo)
async def update_brand(brand_id: str, brand: BrandLogoCreate, user: dict = Depends(get_current_user)):
    brand_dict = brand.model_dump()
    result = await db.brands.update_one({"id": brand_id}, {"$set": brand_dict})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Brand not found")
    brand_dict["id"] = brand_id
    return brand_dict

@admin_router.delete("/brands/{brand_id}")
async def delete_brand(brand_id: str, user: dict = Depends(get_current_user)):
    result = await db.brands.delete_one({"id": brand_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Brand not found")
    return {"message": "Brand deleted"}

# Admin Contact Messages
@admin_router.get("/messages", response_model=List[ContactMessage])
async def get_messages(user: dict = Depends(get_current_user)):
    messages = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return messages

@admin_router.put("/messages/{message_id}/read")
async def mark_message_read(message_id: str, user: dict = Depends(get_current_user)):
    result = await db.messages.update_one({"id": message_id}, {"$set": {"read": True}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Marked as read"}

@admin_router.delete("/messages/{message_id}")
async def delete_message(message_id: str, user: dict = Depends(get_current_user)):
    result = await db.messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Message deleted"}

# Site Settings Endpoints
@admin_router.get("/settings", response_model=SiteSettings)
async def get_settings(user: dict = Depends(get_current_user)):
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        default_settings = SiteSettings().model_dump()
        await db.settings.insert_one(default_settings)
        return default_settings
    return settings

@admin_router.put("/settings", response_model=SiteSettings)
async def update_settings(settings: SiteSettingsUpdate, user: dict = Depends(get_current_user)):
    update_data = {k: v for k, v in settings.model_dump().items() if v is not None}
    if update_data:
        await db.settings.update_one(
            {"id": "site_settings"},
            {"$set": update_data},
            upsert=True
        )
    updated = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    return updated

# Public Endpoints
@api_router.get("/")
async def root():
    return {"message": "Atera API"}

@api_router.get("/uptime/ping")
async def uptime_ping():
    return {"status": "ok", "message": "pong"}

@api_router.get("/public/banners", response_model=List[CarouselBanner])
async def get_public_banners():
    banners = await db.banners.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return banners

@api_router.get("/public/brands", response_model=List[BrandLogo])
async def get_public_brands():
    brands = await db.brands.find({"active": True}, {"_id": 0}).sort("order", 1).to_list(100)
    return brands

@api_router.get("/public/settings", response_model=SiteSettings)
async def get_public_settings():
    settings = await db.settings.find_one({"id": "site_settings"}, {"_id": 0})
    if not settings:
        return SiteSettings().model_dump()
    return settings

@api_router.post("/contact", response_model=ContactMessage)
async def submit_contact(contact: ContactMessageCreate):
    contact_dict = contact.model_dump()
    contact_dict["id"] = str(ObjectId())
    contact_dict["created_at"] = datetime.now(timezone.utc).isoformat()
    contact_dict["read"] = False
    await db.messages.insert_one(contact_dict)
    return contact_dict

# Include routers
api_router.include_router(auth_router)
api_router.include_router(admin_router)
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Startup event
@app.on_event("startup")
async def startup_event():
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.banners.create_index("id", unique=True)
    await db.brands.create_index("id", unique=True)
    await db.messages.create_index("id", unique=True)
    
    # Seed admin
    admin_email = os.environ.get("ADMIN_EMAIL", "admin@atera.com.tr")
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        hashed = hash_password(admin_password)
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hashed,
            "name": "Admin",
            "role": "admin",
            "created_at": datetime.now(timezone.utc)
        })
        logger.info(f"Admin user created: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email}, {"$set": {"password_hash": hash_password(admin_password)}})
        logger.info(f"Admin password updated: {admin_email}")
    
    # Seed default banners if none exist
    banner_count = await db.banners.count_documents({})
    if banner_count == 0:
        default_banners = [
            {
                "id": str(ObjectId()),
                "url": "https://images.pexels.com/photos/10948190/pexels-photo-10948190.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "alt": "IT Equipment",
                "title_tr": "Yeni Nesil IT Ekipmanları",
                "title_en": "Next-Gen IT Equipment",
                "subtitle_tr": "Yüksek performanslı teknoloji ile çalışma alanınızı güçlendirin.",
                "subtitle_en": "Empowering your workspace with high-performance tech.",
                "order": 0,
                "active": True
            },
            {
                "id": str(ObjectId()),
                "url": "https://images.unsplash.com/photo-1603481546238-487240415921?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA3MDB8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBkZXNrJTIwc2V0dXAlMjBkYXJrfGVufDB8fHx8MTc3NDcxNzkwN3ww&ixlib=rb-4.1.0&q=85",
                "alt": "Gaming Desk",
                "title_tr": "Profesyonel Gaming Masaları",
                "title_en": "Ultimate Gaming Desks",
                "subtitle_tr": "Konfor için tasarlandı, zafer için üretildi.",
                "subtitle_en": "Built for comfort, designed for victory.",
                "order": 1,
                "active": True
            },
            {
                "id": str(ObjectId()),
                "url": "https://images.pexels.com/photos/2473183/pexels-photo-2473183.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
                "alt": "Premium Laptops",
                "title_tr": "Premium Laptoplar",
                "title_en": "Premium Laptops",
                "subtitle_tr": "Şık, güçlü ve profesyoneller için hazır.",
                "subtitle_en": "Sleek, powerful, and ready for professionals.",
                "order": 2,
                "active": True
            }
        ]
        await db.banners.insert_many(default_banners)
        logger.info("Default banners seeded")
    
    # Seed default brands if none exist
    brand_count = await db.brands.count_documents({})
    if brand_count == 0:
        default_brands = [
            {"id": str(ObjectId()), "name": "HP", "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/HP_logo_2012.svg/200px-HP_logo_2012.svg.png", "order": 0, "active": True},
            {"id": str(ObjectId()), "name": "Lenovo", "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Lenovo_logo_2015.svg/200px-Lenovo_logo_2015.svg.png", "order": 1, "active": True},
            {"id": str(ObjectId()), "name": "Dell", "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Dell_Logo.svg/200px-Dell_Logo.svg.png", "order": 2, "active": True},
            {"id": str(ObjectId()), "name": "VIYERO", "url": "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=200", "order": 3, "active": True}
        ]
        await db.brands.insert_many(default_brands)
        logger.info("Default brands seeded")
    
    # Log credentials (skip file write on Render)
    logger.info(f"Admin credentials - Email: {admin_email}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
