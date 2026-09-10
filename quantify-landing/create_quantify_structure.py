import os

# Structure relative au dossier courant (quantify-landing/)
structure = {
    "app": {
        "(marketing)": [
            "layout.tsx",
            "page.tsx",
            "solution/page.tsx",
            "marche/page.tsx",
            "equipe/page.tsx",
            "contact/page.tsx"
        ],
        "(auth)": [
            "rejoindre/page.tsx",
            "layout.tsx"
        ],
        "dashboard": [
            "layout.tsx",
            "page.tsx"
        ],
        "api": {
            "waitlist": ["route.ts"],
            "webhooks": {
                "clerk": ["route.ts"]
            }
        },
        "layout.tsx": None,
        "globals.css": None
    },
    "components": {
        "ui": {},
        "sections": [
            "hero.tsx",
            "problem.tsx",
            "solution.tsx",
            "features.tsx",
            "market.tsx",
            "innovation.tsx",
            "business-model.tsx",
            "roadmap.tsx",
            "team.tsx",
            "metrics.tsx",
            "impact.tsx",
            "investors.tsx",
            "cta.tsx"
        ],
        "layout": [
            "header.tsx",
            "footer.tsx",
            "mobile-nav.tsx"
        ],
        "forms": ["waitlist-form.tsx"],
        "animations": [
            "fade-in.tsx",
            "counter.tsx",
            "parallax.tsx"
        ]
    },
    "lib": {
        "supabase": [
            "client.ts",
            "server.ts",
            "types.ts"
        ],
        "clerk.ts": None,
        "utils.ts": None,
        "constants.ts": None
    },
    "types": ["index.ts"],
    "public": {
        "images": {},
        "icons": {},
        "animations": {}
    }
}

def create_structure(base_path, struct):
    for name, content in struct.items():
        path = os.path.join(base_path, name)
        
        if isinstance(content, dict):
            if not os.path.exists(path):
                os.makedirs(path)
            create_structure(path, content)
        
        elif isinstance(content, list):
            if not os.path.exists(path):
                os.makedirs(path)
            for f in content:
                file_path = os.path.join(path, f)
                if not os.path.exists(file_path):
                    os.makedirs(os.path.dirname(file_path), exist_ok=True)
                    with open(file_path, "w") as fp:
                        if f.endswith((".ts", ".tsx")):
                            fp.write(f"// {f} - à compléter\n")
                        elif f.endswith(".css"):
                            fp.write(f"/* {f} - à compléter */\n")
        
        elif content is None:
            if os.path.exists(path):
                continue
            if name.endswith((".ts", ".tsx")):
                with open(path, "w") as fp:
                    fp.write(f"// {name} - à compléter\n")
            elif name.endswith(".css"):
                with open(path, "w") as fp:
                    fp.write(f"/* {name} - à compléter */\n")
            else:
                os.makedirs(path, exist_ok=True)

# Exécuter depuis le répertoire courant
create_structure(".", structure)

print("Sous-dossiers et fichiers de 'quantify-landing/' créés avec succès ✅")
