import os
import re

pages_dir = r"e:\download\New folder (3)\frontend\smart_agriculture_frontend\src\pages"

# Define patterns to replace
bg_patterns = [
    r'\bbg-gray-50\b',
    r'\bbg-white\b',
    r'\bbg-gray-100\b',
    r'\bbg-gradient-to-b from-white/70 via-white/50 to-white/80\b',
    r'\bbg-gradient-to-b from-gray-50 via-white to-gray-50\b',
]

for filename in os.listdir(pages_dir):
    if filename.endswith(".jsx"):
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Specific Home.jsx revert
        if filename == "Home.jsx":
            # Revert the image import
            content = re.sub(r'import bgImage from "\.\./assets/bg\.webp";\n', '', content)
            # Revert the background styling wrapper
            content = re.sub(r'<div \s*className="min-h-screen relative bg-fixed bg-center bg-cover"\s*style=\{\{ backgroundImage: url\(\$\{bgImage\}\) \}\}\s*>\s*<div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/80 backdrop-blur-\[2px\] pointer-events-none z-0"></div>\s*<div className="relative z-10">', '<div className="min-h-screen">', content)
            content = re.sub(r'      </div>\n    </div>\n  \);\n};', '    </div>\n  );\n};', content)
        else:
            # General cleanup for other pages
            for pattern in bg_patterns:
                # We only want to remove it if it's part of the main page wrapper
                # A safer approach is to remove these generic bg classes, but some cards might use bg-white!
                # Wait, cards usually use "bg-white/70" or "bg-white", we don't want to break cards.
                pass

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
