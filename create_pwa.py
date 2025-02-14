import os
import argparse

def create_pwa_structure(project_name, use_js=False, use_ts=False, framework=None):
    """Creates a directory structure for a Progressive Web App.

    Args:
        project_name: The name of the PWA project.
        use_js: Whether to include JavaScript files and directories.
        use_ts: Whether to include TypeScript files and directories (overrides use_js).
        framework:  Optional.  Name of a framework ('react', 'vue', 'angular').  Adds framework-specific folders.
    """

    base_dir = project_name
    os.makedirs(base_dir, exist_ok=True)  # Create the main project directory

    # --- Core Files ---
    with open(os.path.join(base_dir, "index.html"), "w") as f:
        f.write("<!DOCTYPE html>\n<html>\n<head>\n  <title>My PWA</title>\n</head>\n<body>\n  <h1>Hello PWA!</h1>\n</body>\n</html>")
    with open(os.path.join(base_dir, "manifest.json"), "w") as f:
        f.write("{\n  \"name\": \"My PWA\",\n  \"short_name\": \"PWA\",\n  \"start_url\": \"/\",\n  \"display\": \"standalone\",\n  \"background_color\": \"#fff\",\n  \"theme_color\": \"#fff\",\n  \"icons\": []\n}")
    with open(os.path.join(base_dir, "sw.js"), "w") as f:  # Minimal Service Worker
        f.write("// Service Worker (sw.js)\n")


    # --- CSS ---
    css_dir = os.path.join(base_dir, "css")
    os.makedirs(css_dir, exist_ok=True)
    with open(os.path.join(css_dir, "style.css"), "w") as f:
        f.write("/* styles.css */\n")


    # --- JavaScript / TypeScript ---
    if use_ts:
        js_dir = os.path.join(base_dir, "src")  # Use 'src' for TS
        os.makedirs(js_dir, exist_ok=True)
        with open(os.path.join(js_dir, "app.ts"), "w") as f:
            f.write("// app.ts\n")
        # tsconfig.json (basic)
        with open(os.path.join(base_dir, "tsconfig.json"), "w") as f:
            f.write("{\n  \"compilerOptions\": {\n    \"target\": \"es6\",\n    \"module\": \"commonjs\",\n    \"outDir\": \"dist\",\n    \"strict\": true\n  }\n}")

    elif use_js:
        js_dir = os.path.join(base_dir, "js")
        os.makedirs(js_dir, exist_ok=True)
        with open(os.path.join(js_dir, "app.js"), "w") as f:
            f.write("// app.js\n")

    # --- Images ---
    images_dir = os.path.join(base_dir, "images")
    os.makedirs(images_dir, exist_ok=True)

    # --- Framework-Specific Folders ---
    if framework:
        framework = framework.lower()
        if framework == "react":
            # Basic React component structure
            components_dir = os.path.join(js_dir if use_ts or use_js else base_dir, "components")
            os.makedirs(components_dir, exist_ok=True)
            with open(os.path.join(components_dir, "App.jsx" if use_js else "App.tsx"), "w") as f:
                f.write("// App component\n")

        elif framework == "vue":
             # Basic Vue component structure
            components_dir = os.path.join(js_dir if use_ts or use_js else base_dir, "components")
            os.makedirs(components_dir, exist_ok=True)
            with open(os.path.join(components_dir, "App.vue"), "w") as f:
                f.write("\n<template>\n</template>\n<script>\nexport default {\n};\n</script>\n")
        elif framework == "angular":
            # Very basic Angular structure (Angular projects are more complex)
            app_dir = os.path.join(js_dir if use_ts or use_js else base_dir, "app")  # 'app' within 'src'
            os.makedirs(app_dir, exist_ok=True)
            with open(os.path.join(app_dir, "app.component.ts"), "w") as f:
                f.write("// app.component.ts\n")
            with open(os.path.join(app_dir, "app.module.ts"), "w") as f:
                f.write("// app.module.ts\n")

    # --- Optional: Data Directory ---
    data_dir = os.path.join(base_dir, "data")
    os.makedirs(data_dir, exist_ok=True)  # for JSON files, etc.



def main():
    parser = argparse.ArgumentParser(description="Create a PWA project structure.")
    parser.add_argument("project_name", help="The name of the PWA project.")
    parser.add_argument("--js", action="store_true", help="Include JavaScript files and directories.")
    parser.add_argument("--ts", action="store_true", help="Include TypeScript files and directories.")
    parser.add_argument("--framework", choices=["react", "vue", "angular"], help="Add framework-specific folders (react, vue, or angular).")

    args = parser.parse_args()

    create_pwa_structure(args.project_name, args.js, args.ts, args.framework)
    print(f"PWA project structure created for '{args.project_name}'")


if __name__ == "__main__":
    main()