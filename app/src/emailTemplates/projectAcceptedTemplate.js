module.exports = (userName, projectName) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .success-icon { font-size: 48px; margin-bottom: 20px; }
        .project-name { background-color: #e8f5e8; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #28a745; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="success-icon">✅</div>
            <h1>¡Proyecto Aprobado!</h1>
        </div>
        <div class="content">
            <p>Estimad@ <strong>${userName}</strong>,</p>
            
            <p>¡Excelentes noticias! Nos complace informarte que tu proyecto ha sido <strong>aprobado</strong> y ya está visible en nuestra plataforma.</p>
            
            <div class="project-name">
                <strong>Proyecto aprobado:</strong> ${projectName}
            </div>
            
            <p>Tu proyecto ahora está disponible para que otros usuarios lo vean, comenten e interactúen contigo. Esto significa que:</p>
            
            <ul>
                <li>✅ Tu proyecto aparece en la lista pública de proyectos</li>
                <li>✅ Los usuarios pueden ver todos los detalles que compartiste</li>
                <li>✅ Pueden contactarte si habilitaste la opción de contacto</li>
                <li>✅ Pueden dejar comentarios y feedback en tu proyecto</li>
            </ul>
            
            <p>Te felicitamos por esta iniciativa emprendedora y esperamos que tengas mucho éxito con tu proyecto.</p>
            
            <p>¡Muchas gracias por ser parte de nuestra comunidad!</p>
            
            <div class="footer">
                <p>Saludos cordiales,<br>
                <strong>Equipo Interacciones</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
`;
