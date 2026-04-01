// cargar-bd.js
document.addEventListener('DOMContentLoaded', function() {
    // Nombres de los meses en español
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Variable global para almacenar los datos procesados
    let empleadosPorMes = {};
    
    // Inicializar estructura de meses
    for (let i = 0; i < 12; i++) {
        empleadosPorMes[i] = [];
    }

    // Elementos del DOM
    const generarBtn = document.getElementById('generar-btn');  // Cambiado a generar-btn
    const excelFile = document.getElementById('excelFile');
    const limpiarBtn = document.getElementById('limpiar-btn');
    const tablasWrapper = document.getElementById('tablas-meses-wrapper');
    const tablasContainer = document.getElementById('tablas-container');
    const generadoSpan = document.getElementById('generado');

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
        if (generadoSpan) {
            generadoSpan.textContent = mensaje;
            generadoSpan.style.color = tipo === 'error' ? 'red' : (tipo === 'exito' ? 'green' : 'orange');
            generadoSpan.style.fontWeight = 'bold';
            generadoSpan.style.marginLeft = '10px';
            
            // Limpiar el mensaje después de 5 segundos
            setTimeout(() => {
                if (generadoSpan) {
                    generadoSpan.textContent = '';
                }
            }, 5000);
        }
    }

    // Función para convertir número serial de Excel a fecha
    function excelDateToJSDate(serial) {
        // Excel usa 1/1/1900 como fecha base
        // Pero tiene un bug: considera 1900 como año bisiesto
        const utc_days = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;
        const date_info = new Date(utc_value * 1000);
        
        // Ajustar por el bug de Excel (1900 no fue bisiesto)
        if (serial < 61) {
            return new Date(date_info.getTime());
        }
        return new Date(date_info.getTime());
    }

    // Función para parsear fechas en diferentes formatos
    function parsearFecha(fechaStr) {
        if (!fechaStr) return null;
        
        // Si es un número (serial de Excel)
        if (typeof fechaStr === 'number') {
            // Los números entre 1 y 50000 suelen ser fechas de Excel
            if (fechaStr > 1 && fechaStr < 50000) {
                const fechaExcel = excelDateToJSDate(fechaStr);
                if (!isNaN(fechaExcel.getTime())) {
                    return fechaExcel;
                }
            }
            return null;
        }
        
        // Si ya es un objeto Date
        if (fechaStr instanceof Date) {
            return !isNaN(fechaStr.getTime()) ? fechaStr : null;
        }
        
        // Convertir a string
        let fechaString = String(fechaStr);
        
        // Intentar diferentes formatos
        let fecha = null;
        
        // Formato: DD/MM/YYYY o DD-MM-YYYY
        if (fechaString.includes('/') || fechaString.includes('-')) {
            const partes = fechaString.split(/[/-]/);
            if (partes.length === 3) {
                // Si el año tiene 4 dígitos
                if (partes[2].length === 4) {
                    const dia = parseInt(partes[0]);
                    const mes = parseInt(partes[1]) - 1;
                    const anio = parseInt(partes[2]);
                    fecha = new Date(anio, mes, dia);
                } 
                // Formato MM/DD/YYYY
                else if (partes[0].length === 2 && partes[1].length === 2 && partes[2].length === 4) {
                    const mes = parseInt(partes[0]) - 1;
                    const dia = parseInt(partes[1]);
                    const anio = parseInt(partes[2]);
                    fecha = new Date(anio, mes, dia);
                }
                
                if (fecha && !isNaN(fecha.getTime())) return fecha;
            }
        }
        
        // Formato: YYYY-MM-DD (ISO)
        if (fechaString.match(/^\d{4}-\d{2}-\d{2}/)) {
            fecha = new Date(fechaString);
            if (!isNaN(fecha.getTime())) return fecha;
        }
        
        // Intentar con Date.parse
        fecha = new Date(fechaString);
        if (!isNaN(fecha.getTime())) return fecha;
        
        return null;
    }

    // Función para formatear fecha para mostrar
    function formatearFechaParaMostrar(fecha) {
        if (!fecha) return 'No especificada';
        
        // Si es un número (serial de Excel)
        if (typeof fecha === 'number') {
            const fechaExcel = excelDateToJSDate(fecha);
            if (!isNaN(fechaExcel.getTime())) {
                return `${fechaExcel.getDate()}/${fechaExcel.getMonth() + 1}/${fechaExcel.getFullYear()}`;
            }
            return String(fecha);
        }
        
        if (fecha instanceof Date) {
            return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`;
        }
        
        if (typeof fecha === 'string') {
            const fechaParseada = parsearFecha(fecha);
            if (fechaParseada) {
                return `${fechaParseada.getDate()}/${fechaParseada.getMonth() + 1}/${fechaParseada.getFullYear()}`;
            }
        }
        
        return fecha;
    }

    // Función para procesar los empleados
    function procesarEmpleados(data) {
        // Reiniciar estructura
        for (let i = 0; i < 12; i++) {
            empleadosPorMes[i] = [];
        }
        
        let empleadosValidos = 0;
        let empleadosInvalidos = 0;
        
        data.forEach(row => {
            // Buscar el nombre del empleado
            const nombre = row['Nombre del Empleado'] || 
                          row['Nombre'] || 
                          row['nombre'] || 
                          row['NOMBRE'] || 
                          'Sin nombre';
            
            // Buscar la fecha de cumpleaños
            let fechaCumple = row['Fecha de Cumpleaños'] || 
                             row['Fecha'] || 
                             row['fecha'] || 
                             row['FECHA'];
            
            if (nombre && nombre !== 'Sin nombre' && fechaCumple) {
                let fecha = parsearFecha(fechaCumple);
                
                if (fecha) {
                    const mes = fecha.getMonth();
                    empleadosPorMes[mes].push({
                        nombre: nombre.trim(),
                        fecha: fechaCumple,
                        dia: fecha.getDate(),
                        fechaObj: fecha
                    });
                    empleadosValidos++;
                } else {
                    console.warn('Fecha inválida:', fechaCumple, 'Tipo:', typeof fechaCumple);
                    empleadosInvalidos++;
                }
            } else {
                empleadosInvalidos++;
            }
        });
        
        // Ordenar empleados por día dentro de cada mes
        for (let i = 0; i < 12; i++) {
            empleadosPorMes[i].sort((a, b) => a.dia - b.dia);
        }
        
        // Guardar en localStorage
        guardarEnLocalStorage();
        
        if (empleadosInvalidos > 0) {
            mostrarMensaje(`⚠️ ${empleadosValidos} empleados cargados. ${empleadosInvalidos} registros inválidos.`, 'warning');
        } else {
            mostrarMensaje(`✅ ${empleadosValidos} empleados cargados correctamente`, 'exito');
        }
        
        return empleadosValidos;
    }

    // Función para mostrar las tablas
    function mostrarTablas() {
        if (!tablasContainer) return;
        
        tablasContainer.innerHTML = '';
        let tieneDatos = false;
        
        for (let i = 0; i < 12; i++) {
            if (empleadosPorMes[i] && empleadosPorMes[i].length > 0) {
                tieneDatos = true;
                const mesDiv = document.createElement('div');
                mesDiv.className = 'mes-tabla';
                mesDiv.style.cssText = `
                    background: white;
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                `;
                
                let tablaHTML = `
                    <h3 style="color: #163A73; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #0E58A9;">
                        🎉 ${nombresMeses[i]} (${empleadosPorMes[i].length} empleado${empleadosPorMes[i].length !== 1 ? 's' : ''})
                    </h3>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse; background: white;">
                            <thead>
                                <tr style="background: #0E58A9; color: white;">
                                    <th style="padding: 12px; text-align: left;">#</th>
                                    <th style="padding: 12px; text-align: left;">Nombre del Empleado</th>
                                    <th style="padding: 12px; text-align: left;">Fecha de Cumpleaños</th>
                                </tr>
                            </thead>
                            <tbody>
                `;
                
                empleadosPorMes[i].forEach((emp, index) => {
                    tablaHTML += `
                        <tr style="border-bottom: 1px solid #e0e0e0;">
                            <td style="padding: 10px 12px;">${index + 1}</td>
                            <td style="padding: 10px 12px;"><strong>${emp.nombre}</strong></td>
                            <td style="padding: 10px 12px;">${formatearFechaParaMostrar(emp.fecha)}</td>
                        </tr>
                    `;
                });
                
                tablaHTML += `
                            </tbody>
                        </table>
                    </div>
                `;
                
                mesDiv.innerHTML = tablaHTML;
                tablasContainer.appendChild(mesDiv);
            }
        }
        
        if (!tieneDatos) {
            tablasContainer.innerHTML = '<div style="padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">📭 No hay datos de cumpleaños cargados. Por favor, carga un archivo Excel válido.</div>';
        }
        
        // Mostrar el wrapper con las tablas
        if (tablasWrapper) {
            tablasWrapper.style.display = 'block';
            // Scroll suave hacia las tablas
            setTimeout(() => {
                tablasWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // Función para guardar en localStorage
    function guardarEnLocalStorage() {
        localStorage.setItem('empleadosPorMes', JSON.stringify(empleadosPorMes));
        
        // Guardar también un resumen
        const totalEmpleados = Object.values(empleadosPorMes).reduce((total, mes) => total + mes.length, 0);
        const resumen = {
            totalEmpleados: totalEmpleados,
            fechaActualizacion: new Date().toISOString(),
            mesesConDatos: Object.entries(empleadosPorMes)
                .filter(([_, empleados]) => empleados.length > 0)
                .map(([mes, _]) => parseInt(mes))
        };
        localStorage.setItem('resumenCumpleaños', JSON.stringify(resumen));
    }

    // Función para cargar datos guardados
    function cargarDatosGuardados() {
        const datosGuardados = localStorage.getItem('empleadosPorMes');
        
        if (datosGuardados) {
            try {
                const datos = JSON.parse(datosGuardados);
                if (datos && typeof datos === 'object' && Object.keys(datos).length === 12) {
                    empleadosPorMes = datos;
                    mostrarTablas();
                    const totalEmpleados = Object.values(empleadosPorMes).reduce((total, mes) => total + mes.length, 0);
                    if (totalEmpleados > 0) {
                        mostrarMensaje(`📊 Datos cargados automáticamente: ${totalEmpleados} empleados registrados`, 'info');
                    }
                }
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
            }
        }
    }

    // Función para limpiar datos
    function limpiarDatos() {
        if (confirm('¿Estás seguro de que deseas eliminar todos los datos guardados?')) {
            // Reiniciar estructura
            for (let i = 0; i < 12; i++) {
                empleadosPorMes[i] = [];
            }
            
            // Limpiar localStorage
            localStorage.removeItem('empleadosPorMes');
            localStorage.removeItem('resumenCumpleaños');
            
            // Limpiar input file
            if (excelFile) {
                excelFile.value = '';
            }
            
            // Ocultar y limpiar tablas
            if (tablasContainer) {
                tablasContainer.innerHTML = '';
            }
            if (tablasWrapper) {
                tablasWrapper.style.display = 'none';
            }
            
            mostrarMensaje('🗑️ Todos los datos han sido eliminados', 'exito');
        }
    }

    // Función para procesar archivo Excel
    function procesarArchivoExcel(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                
                // Forzar a que lea todo como texto para preservar los datos
                const jsonData = XLSX.utils.sheet_to_json(firstSheet, { 
                    raw: false,  // Esto fuerza a convertir todo a string
                    defval: ""   // Valor por defecto para celdas vacías
                });
                
                if (jsonData.length === 0) {
                    mostrarMensaje('❌ El archivo está vacío', 'error');
                    return;
                }
                
                // Procesar los datos
                const empleadosValidos = procesarEmpleados(jsonData);
                
                if (empleadosValidos > 0) {
                    mostrarTablas();  // Aquí se muestran las tablas después de procesar
                } else {
                    mostrarMensaje('❌ No se encontraron datos válidos en el archivo', 'error');
                    // Ocultar tablas si no hay datos válidos
                    if (tablasWrapper) {
                        tablasWrapper.style.display = 'none';
                    }
                }
                
            } catch (error) {
                console.error('Error al procesar el archivo:', error);
                mostrarMensaje('❌ Error al procesar el archivo. Verifica el formato.', 'error');
            }
        };
        
        reader.onerror = function() {
            mostrarMensaje('❌ Error al leer el archivo', 'error');
        };
        
        reader.readAsArrayBuffer(file);
    }

    // Event Listeners
    if (generarBtn) {
        generarBtn.addEventListener('click', function() {
            if (excelFile && excelFile.files.length > 0) {
                procesarArchivoExcel(excelFile.files[0]);
            } else {
                mostrarMensaje('⚠️ Por favor, selecciona un archivo Excel primero', 'error');
            }
        });
    }
    
    if (limpiarBtn) {
        limpiarBtn.addEventListener('click', limpiarDatos);
    }
    
    // Cargar datos guardados al iniciar
    cargarDatosGuardados();
});
