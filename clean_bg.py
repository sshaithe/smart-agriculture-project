import os

pages_dir = r"e:\download\New folder (3)\frontend\smart_agriculture_frontend\src\pages"

for filename in os.listdir(pages_dir):
    if filename.endswith(".jsx"):
        filepath = os.path.join(pages_dir, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        modified = False
        for i, line in enumerate(lines):
            if "min-h-screen" in line:
                if "bg-gray-50" in line:
                    lines[i] = line.replace("bg-gray-50", "bg-transparent")
                    modified = True
                if "bg-white" in line:
                    lines[i] = line.replace("bg-white", "bg-transparent")
                    modified = True
                if "bg-gray-100" in line:
                    lines[i] = line.replace("bg-gray-100", "bg-transparent")
                    modified = True

        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.writelines(lines)
            print(f"Updated {filename}")
