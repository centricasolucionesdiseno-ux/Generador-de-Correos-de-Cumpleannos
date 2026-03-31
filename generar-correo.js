// generar-correo.js
document.addEventListener('DOMContentLoaded', function() {
    // Nombres de los meses en español
    const nombresMeses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    // Elementos del DOM
    const generarBtn = document.getElementById('generar-btn');
    const mesSelect = document.getElementById('mesSelect');
    const resultadoWrapper = document.getElementById('resultado-wrapper');
    const correoContainer = document.getElementById('correo-container');
    const copyBtn = document.getElementById('copy-btn');
    const generadoSpan = document.getElementById('generado');

    // Variable para almacenar los datos de empleados
    let empleadosPorMes = {};

    // Función para mostrar mensajes
    function mostrarMensaje(mensaje, tipo) {
        if (generadoSpan) {
            generadoSpan.textContent = mensaje;
            generadoSpan.style.color = tipo === 'error' ? 'red' : (tipo === 'exito' ? 'green' : 'orange');
            generadoSpan.style.fontWeight = 'bold';
            generadoSpan.style.marginLeft = '10px';
            
            setTimeout(() => {
                if (generadoSpan) {
                    generadoSpan.textContent = '';
                }
            }, 5000);
        }
    }

    // Función para seleccionar texto
    function selectText(element) {
        const selection = window.getSelection();
        selection.removeAllRanges();
        const range = document.createRange();
        range.selectNodeContents(element);
        selection.addRange(range);
    }

    // Función para copiar el correo
    function copyEmail(buttonElement) {
        let success = false;
        try {
            if (navigator.clipboard && navigator.clipboard.write) {
                const emailHTML = correoContainer.innerHTML;
                const blob = new Blob([emailHTML], { type: 'text/html' });
                const clipboardItem = new ClipboardItem({ 'text/html': blob });

                navigator.clipboard.write([clipboardItem]).then(() => {
                    buttonElement.textContent = '¡Copiado!';
                    buttonElement.classList.add('copied');
                    success = true;
                }).catch(() => {
                    selectText(correoContainer);
                    success = document.execCommand('copy');
                    if (success) {
                        buttonElement.textContent = '¡Copiado!';
                        buttonElement.classList.add('copied');
                    }
                });
            } else {
                selectText(correoContainer);
                success = document.execCommand('copy');
                if (success) {
                    buttonElement.textContent = '¡Copiado!';
                    buttonElement.classList.add('copied');
                }
            }
        } catch (err) {
            console.error("Error al copiar:", err);
        }
        return success;
    }

    // Función para cargar datos guardados
    function cargarDatosGuardados() {
        const datosGuardados = localStorage.getItem('empleadosPorMes');
        
        if (datosGuardados) {
            try {
                empleadosPorMes = JSON.parse(datosGuardados);
                const totalEmpleados = Object.values(empleadosPorMes).reduce((total, mes) => total + mes.length, 0);
                if (totalEmpleados > 0) {
                    mostrarMensaje(`📊 ${totalEmpleados} empleados cargados en el sistema`, 'info');
                } else {
                    mostrarMensaje('⚠️ No hay datos de cumpleaños cargados. Por favor, carga primero la base de datos.', 'warning');
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                mostrarMensaje('❌ Error al cargar los datos de cumpleaños', 'error');
            }
        } else {
            mostrarMensaje('⚠️ No hay datos de cumpleaños cargados. Ve a "Cargar BD" primero.', 'warning');
        }
    }

    // Función para formatear fecha a dd/mm
    function formatearFecha(fecha) {
        if (!fecha) return '--/--';
        
        if (fecha instanceof Date) {
            const dia = fecha.getDate().toString().padStart(2, '0');
            const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
            return `${dia}/${mes}`;
        }
        
        if (typeof fecha === 'string') {
            // Intentar extraer día y mes
            const partes = fecha.split(/[/-]/);
            if (partes.length >= 2) {
                // Si el formato es DD/MM/YYYY
                if (partes[0].length === 2 && partes[1].length === 2) {
                    return `${partes[0]}/${partes[1]}`;
                }
                // Si el formato es YYYY-MM-DD
                if (partes[0].length === 4) {
                    return `${partes[2]}/${partes[1]}`;
                }
            }
            
            // Intentar parsear fecha
            const fechaParseada = new Date(fecha);
            if (!isNaN(fechaParseada.getTime())) {
                const dia = fechaParseada.getDate().toString().padStart(2, '0');
                const mes = (fechaParseada.getMonth() + 1).toString().padStart(2, '0');
                return `${dia}/${mes}`;
            }
        }
        
        return fecha;
    }

    // Función para generar el correo
    function generarCorreo(mes) {
        const empleados = empleadosPorMes[mes] || [];
        const nombreMes = nombresMeses[mes];
        
        if (empleados.length === 0) {
            correoContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; background: #f8f9fa; border-radius: 12px;">
                    <h3 style="color: #dc3545;">🎂 Sin cumpleañeros</h3>
                    <p style="color: #666; margin-top: 10px;">No hay empleados que cumplan años en ${nombreMes}.</p>
                    <p style="color: #666;">Por favor, selecciona otro mes o carga la base de datos de cumpleaños.</p>
                </div>
            `;
            return;
        }
        
        // Generar tabla HTML de empleados (sin columna #)
        let tablaHTML = `
            <table border="0" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
                <thead>
                    <tr style="background-color: #0E58A9;">
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left; color: white;">Nombre del Empleado</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left; color: white;">Fecha de Cumpleaños</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        empleados.forEach((emp) => {
            const fechaFormateada = formatearFecha(emp.fecha);
            tablaHTML += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px 10px;">${emp.nombre}</td>
                    <td style="border: 1px solid #ddd; padding: 8px 10px;">${fechaFormateada}</td>
                </tr>
            `;
        });
        
        tablaHTML += `
                </tbody>
            </table>
        `;
        
        // Banner de felicitación (similar al logo)
        const bannerHTML = `
            <div style="margin: 20px 0; text-align: center;">
                <img src="https://raw.githubusercontent.com/centricasolucionesdiseno-ux/Generador-de-Correos-de-Cumpleannos/img/banner/tarjeta_Cumple.png" alt="Banner de Cumpleaños" style="max-width: 100%; height: auto;">
            </div>
        `;
        
        // Cuerpo completo del correo (limpio para copiar)
        const cuerpoCorreo = `
            <div style="font-family: Arial, Helvetica, sans-serif; max-width: 800px; margin: 0 auto;">
                <p style="font-size: 14px; line-height: 1.5;">Hola equipo,</p>
                
                <p style="font-size: 14px; line-height: 1.5;">
                    En <strong>Centrica</strong>, no solo celebramos el cumplimiento de nuestras metas y el éxito de nuestros proyectos, sino también la vida de las personas que hacen esto posible.
                </p>
                
                <p style="font-size: 14px; line-height: 1.5;">
                    Queremos compartir con ustedes la lista de los compañeros que estarán celebrando un año más de vida durante este mes de <strong>${nombreMes}</strong>:
                </p>
                
                ${tablaHTML}
                
                ${bannerHTML}

                <p style="font-size: 14px; line-height: 1.5;">
                    Los invitamos a todos a dejarles un mensaje de felicitación o pasar por su puesto (o escribirles por chat) para celebrar juntos.
                </p>
                
                <p style="font-size: 12px; color: #666; margin-top: 20px;">
                    Por favor cuide el medioambiente y no imprima este correo electrónico a no ser que sea necesario.
                </p>
            </div>
        `;
        
        // Mostrar en el contenedor
        correoContainer.innerHTML = cuerpoCorreo;
        
        // Mostrar el wrapper
        resultadoWrapper.style.display = 'block';
        
        // Habilitar el botón de copiar
        if (copyBtn) {
            copyBtn.disabled = false;
        }
        
        // Scroll suave hacia el resultado
        setTimeout(() => {
            resultadoWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        mostrarMensaje(`✅ Correo generado para ${nombreMes} con ${empleados.length} cumpleañero${empleados.length !== 1 ? 's' : ''}`, 'exito');
    }

    // Event Listeners
    if (generarBtn) {
        generarBtn.addEventListener('click', function() {
            const mesSeleccionado = mesSelect.value;
            
            if (!mesSeleccionado || mesSeleccionado === '') {
                mostrarMensaje('⚠️ Por favor, selecciona un mes', 'error');
                return;
            }
            
            // Verificar que hay datos cargados
            const totalEmpleados = Object.values(empleadosPorMes).reduce((total, mes) => total + mes.length, 0);
            if (totalEmpleados === 0) {
                mostrarMensaje('⚠️ No hay datos de cumpleaños. Por favor, carga la base de datos primero.', 'error');
                return;
            }
            
            generarCorreo(parseInt(mesSeleccionado));
        });
    }
    
    // Lógica para el botón de Copiar
    if (copyBtn && correoContainer) {
        copyBtn.addEventListener('click', function() {
            if (copyBtn.disabled) return;
            copyEmail(copyBtn);
            setTimeout(() => {
                copyBtn.textContent = 'Copiar Correo';
                copyBtn.classList.remove('copied');
            }, 5000);
        });
    }
    
    // Al cambiar el mes, ocultar resultado y deshabilitar botón de copiar
    if (mesSelect) {
        mesSelect.addEventListener('change', function() {
            if (resultadoWrapper) {
                resultadoWrapper.style.display = 'none';
            }
            if (copyBtn) {
                copyBtn.disabled = true;
            }
            if (generadoSpan) {
                generadoSpan.textContent = '';
            }
        });
    }
    
    // Deshabilitar botón de copiar al inicio
    if (copyBtn) {
        copyBtn.disabled = true;
    }
    
    // Cargar datos guardados al iniciar
    cargarDatosGuardados();
});
