"""Run headless via Blender CLI to produce a real-time-friendly GLB:
    /Applications/Blender.app/Contents/MacOS/Blender --background \
      src/components/TattooLab/body.blend --python scripts/decimate-body.py

The source sculpt is ~595k vertices, which is excessive for a flat matte-
shaded display mesh with no fine surface detail — this collapses it down to
a fraction of that before exporting, independent of the untouched .blend file.
"""
import bpy
import os

DECIMATE_RATIO = 0.06  # ~595k verts -> ~36k, plenty for a smooth silhouette
OUT_PATH = os.path.join(os.path.dirname(bpy.data.filepath), "..", "..", "..", "public", "tattoo_models", "body.glb")
OUT_PATH = os.path.abspath(OUT_PATH)

mesh_objects = [o for o in bpy.data.objects if o.type == "MESH"]
print(f"Found {len(mesh_objects)} mesh object(s): {[o.name for o in mesh_objects]}")

for obj in mesh_objects:
    verts_before = len(obj.data.vertices)
    mod = obj.modifiers.new(name="Decimate", type="DECIMATE")
    mod.ratio = DECIMATE_RATIO

    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.modifier_apply(modifier=mod.name)

    verts_after = len(obj.data.vertices)
    print(f"{obj.name}: {verts_before} -> {verts_after} vertices")

os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
bpy.ops.export_scene.gltf(filepath=OUT_PATH, export_format="GLB")
print(f"Exported decimated GLB to {OUT_PATH}")
