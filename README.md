# SGRH - Sistema de Gestión de Recursos Humanos

**Proyecto:** SGRH en React  
**Autor:** Alexis Gonzalez Sogamoso  


## Descripción del Proyecto

**SGRH** (Sistema de Gestión de Recursos Humanos) es una aplicación web desarrollada en **React** con un backend en **Node.js**, **Express** y **MongoDB**, diseñada para la **gestión completa del personal de una empresa**.  

El sistema permite:  
- Registro de empresas y creación automática del usuario **Gerente**.  
- Gestión de empleados con roles: **Empleado, RRHH, Gerente, Supervisor**.  
- Registro y control de **asistencia**.  
- Creación y actualización de **nómina** por empleado.  
- Gestión de **permisos** (aprobación o rechazo).  
- Generación y visualización de **reportes internos** con historial.  
- Conexión con **MongoDB** para persistencia de datos.

## Tecnologías Utilizadas

- **Frontend:** React + Bootstrap 5
- **Backend:** Node.js + Express
- **Base de Datos:** MongoDB (Mongoose ODM)
- **Herramientas:** Postman para pruebas de API, npm para gestión de dependencias


## Requisitos para ejecutar el proyecto

1. Tener **Node.js** y **npm** instalados.
2. Tener **MongoDB** instalado y en ejecución local.
3. (Opcional) Tener **Postman** para probar los endpoints de la API.


## Configuración de la base de datos

Para que el proyecto funcione correctamente, debes agregar la base de datos **`sgrh`** a tu instancia de **MongoDB**.  

Para acceder a la base de datos localmente puedes abrir el navegador o un cliente MongoDB y usar:

