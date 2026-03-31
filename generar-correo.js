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

    // Función para formatear fecha
    function formatearFecha(fecha) {
        if (!fecha) return 'No especificada';
        
        if (fecha instanceof Date) {
            return `${fecha.getDate()}/${fecha.getMonth() + 1}`;
        }
        
        if (typeof fecha === 'string') {
            // Intentar extraer día y mes
            const partes = fecha.split(/[/-]/);
            if (partes.length >= 2) {
                return `${partes[0]}/${partes[1]}`;
            }
        }
        
        return fecha;
    }

    // Función para generar el correo
    function generarCorreo(mes) {
        const empleados = empleadosPorMes[mes] || [];
        
        if (empleados.length === 0) {
            correoContainer.innerHTML = `
                <div style="padding: 40px; text-align: center; background: #f8f9fa; border-radius: 12px;">
                    <h3 style="color: #dc3545;">🎂 Sin cumpleañeros</h3>
                    <p style="color: #666; margin-top: 10px;">No hay empleados que cumplan años en ${nombresMeses[mes]}.</p>
                    <p style="color: #666;">Por favor, selecciona otro mes o carga la base de datos de cumpleaños.</p>
                </div>
            `;
            return;
        }
        
        // Generar tabla HTML de empleados
        let tablaHTML = `
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: white; border-radius: 8px; overflow: hidden;">
                <thead>
                    <tr style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                        <th style="padding: 12px; text-align: left; border: 1px solid #e0e0e0;">#</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #e0e0e0;">Nombre del Empleado</th>
                        <th style="padding: 12px; text-align: left; border: 1px solid #e0e0e0;">Fecha de Cumpleaños</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        empleados.forEach((emp, index) => {
            tablaHTML += `
                <tr style="border-bottom: 1px solid #e0e0e0;">
                    <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">${index + 1}</td>
                    <td style="padding: 10px 12px; border: 1px solid #e0e0e0;"><strong>${emp.nombre}</strong></td>
                    <td style="padding: 10px 12px; border: 1px solid #e0e0e0;">🎈 ${formatearFecha(emp.fecha)}</td>
                </tr>
            `;
        });
        
        tablaHTML += `
                </tbody>
            </table>
        `;
        
        // Imagen de felicitación (usando emojis y estilo)
        const imagenHTML = `
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: linear-gradient(135deg, #ffe6f0 0%, #ffd9e6 100%); border-radius: 12px;">
                <div style="font-size: 48px;">🎂🎉🎈</div>
                <h3 style="color: #f5576c; margin-top: 10px;">¡Feliz Cumpleaños!</h3>
                <p style="color: #666;">Que tengan un día maravilloso lleno de alegría y celebraciones</p>
            </div>
        `;
        
        // Cuerpo completo del correo
        const cuerpoCorreo = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <div style="padding: 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">🎂 Feliz Cumpleaños 🎂</h1>
                </div>
                
                <div style="padding: 30px;">
                    <h2 style="color: #333; margin-top: 0;">Hola a todos,</h2>
                    
                    <p style="font-size: 16px; line-height: 1.6; color: #555;">
                        Queremos celebrar a los cumpleañeros de <strong style="color: #f5576c; font-size: 18px;">${nombresMeses[mes]}</strong>:
                    </p>
                    
                    ${tablaHTML}
                    
                    ${imagenHTML}
                    
                    <div style="margin-top: 30px; padding: 20px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #f5576c;">
                        <p style="margin: 0; color: #666; font-style: italic;">
                            🎈 ¡Acompáñanos a felicitarlos y hacerles sentir especiales en su día! 🎈
                        </p>
                    </div>
                    
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;">
                    
                    <div style="text-align: center; margin-top: 20px;">
                        <img src="https://raw.githubusercontent.com/centricasolucionesdiseno-ux/Firma-CentricaSoluciones/main/img/logo.png" alt="Centrica Soluciones" style="max-width: 150px;">
                        <p style="color: #999; font-size: 12px; margin-top: 10px;">
                            Este es un mensaje automático generado por el sistema de cumpleaños.<br>
                            Por favor cuide el medioambiente y no imprima este correo electrónico a no ser que sea necesario.
                        </p>
                    </div>
                </div>
            </div>
        `;
        
        // Mostrar en el contenedor
        correoContainer.innerHTML = cuerpoCorreo;
        
        // Mostrar el wrapper
        resultadoWrapper.style.display = 'block';
        
        // Scroll suave hacia el resultado
        setTimeout(() => {
            resultadoWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
        
        mostrarMensaje(`✅ Correo generado para ${nombresMeses[mes]} con ${empleados.length} cumpleañero${empleados.length !== 1 ? 's' : ''}`, 'exito');
    }

    // Función para copiar al portapapeles
    function copiarCorreo() {
        if (!correoContainer || !correoContainer.innerHTML) {
            mostrarMensaje('❌ No hay correo para copiar', 'error');
            return;
        }
        
        try {
            // Crear un elemento temporal para copiar el HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = correoContainer.innerHTML;
            
            // Seleccionar el contenido
            const range = document.createRange();
            range.selectNodeContents(tempDiv);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
            
            // Intentar copiar
            let success = false;
            try {
                success = document.execCommand('copy');
            } catch (err) {
                console.error('Error al copiar:', err);
            }
            
            selection.removeAllRanges();
            
            if (success) {
                mostrarMensaje('✅ Correo copiado al portapapeles', 'exito');
                if (copyBtn) {
                    copyBtn.textContent = '¡Copiado!';
                    copyBtn.classList.add('copied');
                    setTimeout(() => {
                        copyBtn.textContent = 'Copiar Correo';
                        copyBtn.classList.remove('copied');
                    }, 3000);
                }
            } else {
                mostrarMensaje('❌ Error al copiar. Selecciona manualmente el texto.', 'error');
            }
        } catch (error) {
            console.error('Error en copiarCorreo:', error);
            mostrarMensaje('❌ Error al copiar el correo', 'error');
        }
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
    
    if (copyBtn) {
        copyBtn.addEventListener('click', copiarCorreo);
    }
    
    // Al cambiar el mes, limpiar el resultado anterior
    if (mesSelect) {
        mesSelect.addEventListener('change', function() {
            if (resultadoWrapper) {
                resultadoWrapper.style.display = 'none';
            }
            if (generadoSpan) {
                generadoSpan.textContent = '';
            }
        });
    }
    
    // Cargar datos guardados al iniciar
    cargarDatosGuardados();
});
