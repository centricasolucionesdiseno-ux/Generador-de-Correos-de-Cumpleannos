# Generador de Correos de Cumpleaños
➡️ Accede a la aplicación aquí: https://centricasolucionesdiseno-ux.github.io/Generador-de-Correos-de-Cumpleannos

Este proyecto es una herramienta web interna diseñada para que los equipos de trabajo puedan gestionar y enviar felicitaciones de cumpleaños de manera estandarizada, rápida y sin errores.

## Características Principales

### 📊 Carga de Base de Datos
- **Archivo Excel**: Permite subir un archivo Excel con el formato "Nombre del Empleado" y "Fecha de Cumpleaños"
- **Validación de Datos**: Procesa y valida las fechas en múltiples formatos (DD/MM/YYYY, YYYY-MM-DD, etc.)
- **Organización Automática**: Los empleados se organizan automáticamente por mes de cumpleaños
- **Visualización por Meses**: Muestra tablas separadas para cada mes con los empleados ordenados por día
- **Persistencia de Datos**: Los datos se guardan automáticamente en el navegador usando localStorage

### ✉️ Generador de Correos
- **Selección de Mes**: Dropdown intuitivo para seleccionar el mes deseado
- **Correo Personalizado**: Genera automáticamente un correo con:
  - Mensaje personalizado de felicitación
  - Tabla con nombres y fechas de cumpleaños (formato DD/MM)
  - Banner corporativo de felicitación
  - Mensaje de cuidado ambiental
- **Formato Optimizado**: El correo se genera en formato HTML con estilos inline para mantener el formato al copiar
- **Copia Avanzada**: Sistema de copiado al portapapeles con lógica moderna y fallback para navegadores antiguos

### 🎨 Interfaz de Usuario
- **Diseño Responsive**: Funciona perfectamente en dispositivos de escritorio y móviles
- **Mensajes de Estado**: Feedback visual claro para todas las acciones del usuario
- **Navegación Intuitiva**: Botones de retroceso y flujo lógico entre páginas
- **Estilos Consistentes**: Mantiene la identidad visual corporativa de Centrica Soluciones

## Flujo de Uso

1. **Cargar Base de Datos**
   - Accede a "Cargar BD" desde el inicio
   - Selecciona un archivo Excel con los datos de empleados
   - Haz clic en "Dividir por Meses"
   - Visualiza las tablas organizadas por mes de cumpleaños

2. **Generar Correo**
   - Accede a "Generar Correo" desde el inicio
   - Selecciona el mes deseado del dropdown
   - Haz clic en "Generar Correo"
   - Previsualiza el correo con la lista de cumpleañeros
   - Usa "Copiar Correo" para copiar todo el contenido al portapapeles
   - Pega el contenido en Outlook u otro cliente de correo

## Estructura del Proyecto
- index.html # Página de inicio con botones de navegación
- cargar-bd.html # Página para cargar archivo Excel
- generar-correo.html # Página para generar correos de cumpleaños
- style.css # Hoja de estilos común para todas las páginas
- script.js # Lógica principal de la página de inicio
- cargar-bd.js # Lógica para procesar archivos Excel y mostrar tablas
- generar-correo.js # Lógica para generar correos y copiar al portapapeles


## Formato del Archivo Excel

| Nombre del Empleado | Fecha de Cumpleaños |
|---------------------|---------------------|
| Juan Pérez          | 15/03/1990         |
| María García        | 22/07/1985         |

**Nota**: El archivo debe contener al menos estas dos columnas. Los nombres pueden variar entre:
- "Nombre del Empleado", "Nombre", "nombre", "NOMBRE"
- "Fecha de Cumpleaños", "Fecha", "fecha", "FECHA"

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica de las páginas
- **CSS3**: Estilos modernos con diseño responsive
- **JavaScript (Vanilla)**: Lógica completa sin dependencias externas
- **SheetJS (XLSX)**: Biblioteca para procesar archivos Excel
- **LocalStorage**: Almacenamiento persistente de datos en el navegador

## Funcionalidades Técnicas Destacadas

### Procesamiento de Fechas
- Soporte para múltiples formatos de fecha (DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD)
- Extracción automática de día y mes para ordenamiento
- Formateo unificado a DD/MM para visualización

### Copiado al Portapapeles
- **Método Moderno**: Usa Clipboard API con soporte para HTML
- **Método Fallback**: Usa execCommand para navegadores antiguos
- **Feedback Visual**: Cambia el texto del botón a "¡Copiado!" temporalmente

### Almacenamiento Persistente
- Guardado automático después de cargar datos
- Recuperación de datos al cargar la página
- Opción de limpiar todos los datos guardados

## Despliegue

Este proyecto está desplegado usando **GitHub Pages**. Para desplegar tu propia versión:

1. Crea un repositorio en GitHub
2. Sube todos los archivos del proyecto
3. Ve a Settings > Pages
4. Selecciona la rama `main` como fuente
5. La aplicación estará disponible en `https://[tu-usuario].github.io/[nombre-repo]`

## Compatibilidad

- ✅ Google Chrome (recomendado)
- ✅ Mozilla Firefox
- ✅ Microsoft Edge
- ✅ Safari
- ✅ Outlook (escritorio y web)
- ✅ Dispositivos móviles (iOS y Android)

## Contribuciones

Este proyecto está diseñado para uso interno de Centrica Soluciones. Para sugerencias o mejoras, contacta al equipo de desarrollo.

## Licencia

Todos los derechos reservados. Centrica Soluciones.
