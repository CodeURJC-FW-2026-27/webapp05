# Desarrollo de la web: Qvv

## Desarrolladores:
- Marcos Calero Pelayo  (m.calero.2025@alumnos.urjc.es)   (MCalero1950)
- Mario Gastelut Chorro (m.gastelut.2025@alumnos.urjc.es) (gasmarius)
- Samuel Nieto Bautista (s.nietob.2025@alumnos.urjc.es) (SamuelN300)
- Alejandro Bodas Navidad (a.bodas.2025@alumnos.urjc.es) (Boditasssss)

## Idea principal:
  En primer lugar, vamos a explicar cuál es el significado de las siglas QVV. Estas siglas las hemos denominado como: Qué ver un viernes. El concepto nace de la idea de facilitar escoger una peli un viernes por la noche.
  Conociendo la idea principal, vamos a dar los detalles de las entidades y atributos de nuestra página web :
  1. La entidad principal: Película.
  2. La entidad secundaria: Reseña.
  3. El filtrado por género: Acción, comedias, romance, ciencia ficción, terror.
  4. Atributos para las películas:
     - Nombre (string).
     - Carátula (file).
     - Año de publicación (date).
     - Sinopsis (string).
     - Filtro de edad (string).
     - Plataformas de streaming (string).
     - Duración en minutos (number).
     - Director (string)
     - Actores (string)
     - Genero (string).
  5. Atributos reseñas:
     - Autor Reseña (string).
     - Contenido reseña (string).
     - Estrellas (string).
       
## Práctica 1:
### Capturas de la web:
1. **Página principal:**

   <img width="2558" height="1165" alt="image" src="https://github.com/user-attachments/assets/ca22bbeb-2564-4c18-9a2a-7fc1dd4c59e3" />
   <img width="2560" height="1172" alt="image" src="https://github.com/user-attachments/assets/e67b303e-3543-42a8-9350-707903bbd9fc" />
   <img width="2560" height="1163" alt="image" src="https://github.com/user-attachments/assets/7face63f-4e0a-4be4-8d9a-97fac61de197" />
2. **Página de detalle:**

   <img width="2560" height="1170" alt="image" src="https://github.com/user-attachments/assets/4ec6c1b0-5639-4f62-a48e-7e3d0ab2c560" />
   <img width="2560" height="654" alt="image" src="https://github.com/user-attachments/assets/aa6dc0c5-090d-47b1-9c55-5a54fd340448" />
3. **Página formulario:**

   <img width="2560" height="1156" alt="image" src="https://github.com/user-attachments/assets/a57c9e43-1ced-4532-be5e-523f47f7eab8" />
   <img width="2560" height="610" alt="image" src="https://github.com/user-attachments/assets/4a2da4b7-2df0-457f-876d-f0cb26cb6343" />

### Participación de los miembros:
- Mario Gastelut Chorro:
  1. Tareas realizadas:
     - Creación del documento html de la página de detalle
     - Expresar el formato equivalente a la página principal
     - Creación de los elementos de la entidad secundaria y relacionarlos con la entidad principal
     - Dar formato a los textos de la pagina de detalle
     - Crear los botones "Edit" y "Delete" para los elementos de la entidad secundaria 
     - Implementación del formulario para crear elementos de la entidad secundaria (review)
  2. 5 commits más significativos:
     - Implementación entidad secundaria: [Commit c165a268bfa32c1048a3565db7156219dbb9994d] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/c165a268bfa32c1048a3565db7156219dbb9994d)
     - Modificación del nav de la pagina de detalle: [Commit c1eb01cb825b9dcd652d68b14733895d566ab8e4] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/c1eb01cb825b9dcd652d68b14733895d566ab8e4)
     - Formato de colores CSS para la página de detalle: [Commit 230ea13410d98b1cd05de02a8724d3315b56c5d1] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/230ea13410d98b1cd05de02a8724d3315b56c5d1)
     - Adaptación atributos de la entidad principal: [Commit b07713f1d917c000aaf6f841fb66fdfcfd45f947] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/b07713f1d917c000aaf6f841fb66fdfcfd45f947)
     - Pequeños cambios de formato y texto: [Commit 8a0f0cac2804691a27f0d1b83df6f30c4fa4665c; Commit 6bab9899c5690c01ede5788257bbf83e18d61815] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/8a0f0cac2804691a27f0d1b83df6f30c4fa4665c) (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/6bab9899c5690c01ede5788257bbf83e18d61815)
   3. Ficheros en los que se ha participado:
      - secondarypage (https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/startbootstrap-shop-homepage-gh-pages/secondarypage.html)
      - styles (https://github.com/CodeURJC-FW-2026-27/webapp05/tree/main/startbootstrap-shop-homepage-gh-pages/css)
      - README (https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/README.md)

- Samuel Nieto Bautista:
  1. Tareas realizadas:
     - Creación del documento html del index
     - Cambios de estetica en el index.
     - Incorporacion de la entidad principal(peliculas)
     - Hiperenlaces a la pagina de detalles
     - Creacion de los botones "Crear un nuevo elemento",filtro y home.

  2. 5 commits más significativos:
     - CLASE DE HOY: [Commit 79224bf61ba1879fb65a7d690fc993739fb9df86] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/79224bf61ba1879fb65a7d690fc993739fb9df86)
     -Primeros cambios de adaptacion index: [Commit d9175ce10ccc68f12f81b2b6957604b93fa0b666] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/d9175ce10ccc68f12f81b2b6957604b93fa0b666)
     - Parte de las pelis: [Commit bf9dd76b73540ed57425a36749bbb8c1acfe0914] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/bf9dd76b73540ed57425a36749bbb8c1acfe0914)
     -Pelis completas e hiperenlaces: [Commit 9f985d9b865d160b29be1d918b44379163eb8f95] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/9f985d9b865d160b29be1d918b44379163eb8f95)
     - Boton formulario y ajuste de columnas: [Commit 14a589370c563c3aea32585eb231c8e259debda7] (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/14a589370c563c3aea32585eb231c8e259debda7#diff-3514708e5cbbecf35d5173ec7fe0c5833864557b2e10347e1fdbc9c59beefac3)
     
   3. Ficheros en los que se ha participado:
      - index (https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/startbootstrap-shop-homepage-gh-pages/index.html)
      - styles (https://github.com/CodeURJC-FW-2026-27/webapp05/tree/main/startbootstrap-shop-homepage-gh-pages/css)
      - README (https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/README.md)
     
  -  Marcos Calero Pelayo:
  1. Tareas realizadas:
     - Creación del documento html de la página secundaria para el formulario 
     - Creación de la barra de búsqueda
     - Creación del formulario de la entidad principal 
     - Unificar formatos de la cabecera 
     - Cambiar el favicon de la web 
  2. 5 commits más significativos:
     - Implementación de la barra de búsqueda 886ea5bf7470ccc3ee76958ee9a3d64eb0390c31 (https://github.com/CodeURJC-FW-2026-27/webapp05/commit/886ea5bf7470ccc3ee76958ee9a3d64eb0390c31)

     - Creación nueva página con formulario : [Commit 1a8ff3cb2d6469ab1dcbbecd6b21da8b29116ca2] https://github.com/CodeURJC-FW-2026-27/webapp05/commit/1a8ff3cb2d6469ab1dcbbecd6b21da8b29116ca2

     - Cambios en la organización del grid de la cabecera: [Commit df87369a1bfa5849ff00297fc970b2077ba266e1] https://github.com/CodeURJC-FW-2026-27/webapp05/commit/df87369a1bfa5849ff00297fc970b2077ba266e1

     - Validacion de atributos en el formulario de creación: [Commit 7bdf6583d4981e8910b61a5e8d02563ab507b962] https://github.com/CodeURJC-FW-2026-27/webapp05/commit/7bdf6583d4981e8910b61a5e8d02563ab507b962

     - nuevo favicon : [Commit 1864a0216fc04271a314e0b0e81fc77b83cf9a3d] https://github.com/CodeURJC-FW-2026-27/webapp05/commit/1864a0216fc04271a314e0b0e81fc77b83cf9a3d 

   3. Ficheros en los que se ha participado:
      - secondarypage (https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/startbootstrap-shop-homepage-gh-pages/secondarypage.html)
      - index (https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/startbootstrap-shop-homepage-gh-pages/index.html)
      - README (https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/README.md)
      - new-item https://github.com/CodeURJC-FW-2026-27/webapp05/blob/main/startbootstrap-shop-homepage-gh-pages/secondarypage.html


         
            
