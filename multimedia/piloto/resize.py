from PIL import Image

# Abre la imagen
image_path = "joan-mir.jpg"  # Cambia esto por la ruta de tu imagen
img = Image.open(image_path)

# Redimensiona la imagen (por ejemplo, a 800x600 píxeles)
new_width = 360
new_height = 239
resized_img = img.resize((new_width, new_height))

# Guarda la nueva imagen redimensionada
resized_img.save("imagen_redimensionada.jpg")  # El nombre del archivo nuevo