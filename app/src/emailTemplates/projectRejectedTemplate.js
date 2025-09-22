module.exports = (userName, projectName) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .warning-icon { font-size: 48px; margin-bottom: 20px; }
        .project-name { background-color: #f8d7da; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #dc3545; }
        .guidelines { background-color: #e2e3e5; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="warning-icon">❌</div>
            <h1>Proyecto No Aprobado</h1>
        </div>
        <div class="content">
            <p>Estimad@ <strong>${userName}</strong>,</p>
            
            <p>Lamentablemente, debemos informarte que tu proyecto no ha sido aprobado para su publicación en nuestra plataforma.</p>
            
            <div class="project-name">
                <strong>Proyecto evaluado:</strong> ${projectName}
            </div>
            
            <p>Esta decisión puede deberse a diferentes motivos, como:</p>
            
            <ul>
                <li>El contenido no cumple con nuestras políticas de comunidad</li>
                <li>La información proporcionada está incompleta</li>
                <li>Las imágenes no son apropiadas o de calidad suficiente</li>
                <li>El proyecto no se ajusta a los criterios de emprendimiento</li>
            </ul>
            
            <div class="guidelines">
                <h3>💡 Recomendaciones para tu próximo envío:</h3>
                <ul>
                    <li>Revisa nuestras políticas de contenido</li>
                    <li>Asegúrate de completar toda la información solicitada</li>
                    <li>Utiliza imágenes de alta calidad y relevantes</li>
                    <li>Describe claramente tu proyecto emprendedor</li>
                </ul>
            </div>
            
            <p>Te invitamos a crear un nuevo proyecto cuando tengas listo el contenido que cumpla con nuestros estándares. ¡No te desanimes y sigue adelante con tu espíritu emprendedor!</p>
            
            <div class="footer">
                <p>Si tienes preguntas, no dudes en contactarnos.<br>
                <strong>Equipo Interacciones</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
`;
