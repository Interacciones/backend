module.exports = (action, userName, userEmail, projectName, projectDescription, projectId) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background-color: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
        .action-badge { 
            display: inline-block; 
            padding: 8px 16px; 
            border-radius: 20px; 
            font-weight: bold; 
            margin-bottom: 20px;
        }
        .created { background-color: #d4edda; color: #155724; }
        .updated { background-color: #d1ecf1; color: #0c5460; }
        .deleted { background-color: #f8d7da; color: #721c24; }
        .user-info { background-color: #e9ecef; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .project-info { background-color: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #ffc107; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        .action-icon { font-size: 32px; margin-bottom: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="action-icon">
                ${action === 'CREATED' ? '📝' : action === 'UPDATED' ? '✏️' : '🗑️'}
            </div>
            <h1>Notificación de Proyecto</h1>
        </div>
        <div class="content">
            <div class="action-badge ${action.toLowerCase()}">
                PROYECTO ${action === 'CREATED' ? 'CREADO' : action === 'UPDATED' ? 'ACTUALIZADO' : 'ELIMINADO'}
            </div>
            
            <p>Se ha ${action === 'CREATED' ? 'creado un nuevo' : action === 'UPDATED' ? 'actualizado un' : 'eliminado un'} proyecto en la plataforma.</p>
            
            <div class="user-info">
                <h3>👤 Información del Usuario:</h3>
                <p><strong>Nombre:</strong> ${userName}</p>
                <p><strong>Email:</strong> ${userEmail}</p>
            </div>
            
            <div class="project-info">
                <h3>📋 Información del Proyecto:</h3>
                <p><strong>ID:</strong> #${projectId}</p>
                <p><strong>Nombre:</strong> ${projectName}</p>
                <p><strong>Descripción:</strong></p>
                <p style="font-style: italic; margin-left: 20px;">${projectDescription}</p>
            </div>
            
            ${action === 'CREATED' ? `
            <div style="background-color: #d4edda; padding: 15px; border-radius: 6px; margin: 20px 0;">
                <h4>🔍 Acción Requerida:</h4>
                <p>Este proyecto requiere revisión y aprobación antes de ser visible públicamente. Por favor, revisa el contenido y las imágenes para decidir si cumple con los estándares de la plataforma.</p>
            </div>
            ` : ''}
            
            <div class="footer">
                <p>Fecha: ${new Date().toLocaleDateString('es-ES', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric', 
                    hour: '2-digit', 
                    minute: '2-digit' 
                })}</p>
                <p><strong>Sistema de Administración - Interacciones</strong></p>
            </div>
        </div>
    </div>
</body>
</html>
`;
