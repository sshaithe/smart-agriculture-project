"""
seed_db.py
==========
Seeds the Smart Agriculture database with:
  - 7 Turkish regions
  - 81 Turkish cities (all provinces)
  - 22 crops (matching the crop recommendation model)

Run from the /backend directory:
    python seed_db.py

This script drops and recreates the predictions table to fix the
outdated schema, then populates region/city/crop lookup data.
"""

import sys
import os

# Ensure we run inside the backend folder context
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app
from app.extensions import db

app = create_app()

# ── Seed Data ─────────────────────────────────────────────────────

REGIONS = [
    {"id": 1, "name": "Marmara",                "country": "Turkey"},
    {"id": 2, "name": "Aegean",                 "country": "Turkey"},
    {"id": 3, "name": "Mediterranean",          "country": "Turkey"},
    {"id": 4, "name": "Black Sea",              "country": "Turkey"},
    {"id": 5, "name": "Central Anatolia",       "country": "Turkey"},
    {"id": 6, "name": "Eastern Anatolia",       "country": "Turkey"},
    {"id": 7, "name": "Southeastern Anatolia",  "country": "Turkey"},
]

# city_name -> region_id
CITIES = [
    # Marmara (1)
    ("İstanbul", 1), ("Bursa", 1), ("Tekirdağ", 1), ("Kocaeli", 1),
    ("Sakarya", 1), ("Edirne", 1), ("Kırklareli", 1), ("Balıkesir", 1),
    ("Çanakkale", 1), ("Bilecik", 1), ("Yalova", 1),
    # Ege (2)
    ("İzmir", 2), ("Manisa", 2), ("Aydın", 2), ("Denizli", 2),
    ("Muğla", 2), ("Kütahya", 2), ("Afyonkarahisar", 2), ("Uşak", 2),
    # Akdeniz (3)
    ("Antalya", 3), ("Mersin", 3), ("Adana", 3), ("Hatay", 3),
    ("Isparta", 3), ("Burdur", 3), ("Kahramanmaraş", 3),
    # Karadeniz (4)
    ("Samsun", 4), ("Trabzon", 4), ("Ordu", 4), ("Giresun", 4),
    ("Rize", 4), ("Artvin", 4), ("Zonguldak", 4), ("Kastamonu", 4),
    ("Sinop", 4), ("Amasya", 4), ("Tokat", 4), ("Bartın", 4),
    ("Bolu", 4), ("Düzce", 4), ("Karabük", 4), ("Gümüşhane", 4),
    ("Bayburt", 4),
    # İç Anadolu (5)
    ("Ankara", 5), ("Konya", 5), ("Kayseri", 5), ("Eskişehir", 5),
    ("Sivas", 5), ("Yozgat", 5), ("Kırşehir", 5), ("Nevşehir", 5),
    ("Niğde", 5), ("Aksaray", 5), ("Karaman", 5), ("Çorum", 5),
    ("Kırıkkale", 5),
    # Doğu Anadolu (6)
    ("Erzurum", 6), ("Malatya", 6), ("Elazığ", 6), ("Van", 6),
    ("Erzincan", 6), ("Bingöl", 6), ("Tunceli", 6), ("Muş", 6),
    ("Bitlis", 6), ("Hakkari", 6), ("Ağrı", 6), ("Kars", 6),
    ("Iğdır", 6), ("Ardahan", 6),
    # Güneydoğu Anadolu (7)
    ("Gaziantep", 7), ("Şanlıurfa", 7), ("Diyarbakır", 7), ("Mardin", 7),
    ("Batman", 7), ("Siirt", 7), ("Şırnak", 7), ("Adıyaman", 7),
    ("Kilis", 7), ("Osmaniye", 7),
]

# Exactly the 22 classes from crop_rec_classes.json
CROPS = [
    "Apples", "Banana", "Blackgram", "Chick peas", "Coconut",
    "Coffee", "Corn", "Cotton", "Grapes", "Jute",
    "Kidneybeans", "Lentils", "Mango", "Mothbeans", "Mungbean",
    "Muskmelon", "Orange", "Papaya", "Pigeonpeas", "Pomegranate",
    "Rice", "Watermelons",
    # Extra crops used by the yield model
    "Wheat", "Barley", "Sunflower", "Tomato", "Potato", "Soybean",
    "Olive", "Tea", "Hazelnut", "Citrus",
]


def seed():
    with app.app_context():
        from api.entity.region      import Region
        from api.entity.city        import City
        from api.entity.crop        import Crop
        from api.entity.prediction  import Prediction

        # ── 1. Drop & recreate predictions table (schema changed) ──
        print("Dropping outdated predictions table …")
        Prediction.__table__.drop(db.engine, checkfirst=True)
        print("Recreating all tables …")
        db.create_all()

        # ── 2. Regions ─────────────────────────────────────────────
        existing_regions = {r.name for r in Region.query.all()}
        added_r = 0
        for r in REGIONS:
            if r["name"] not in existing_regions:
                db.session.add(Region(id=r["id"], name=r["name"], country=r["country"]))
                added_r += 1
        db.session.commit()
        print(f"Regions: {added_r} added ({Region.query.count()} total)")

        # ── 3. Cities ──────────────────────────────────────────────
        existing_cities = {c.name for c in City.query.all()}
        added_c = 0
        for name, region_id in CITIES:
            if name not in existing_cities:
                db.session.add(City(name=name, region_id=region_id))
                added_c += 1
        db.session.commit()
        print(f"Cities:  {added_c} added ({City.query.count()} total)")

        # ── 4. Crops ───────────────────────────────────────────────
        existing_crops = {c.name for c in Crop.query.all()}
        added_cr = 0
        for name in CROPS:
            if name not in existing_crops:
                db.session.add(Crop(name=name))
                added_cr += 1
        db.session.commit()
        print(f"Crops:   {added_cr} added ({Crop.query.count()} total)")

        print("\nSeed complete -- database is ready.")


if __name__ == "__main__":
    seed()
