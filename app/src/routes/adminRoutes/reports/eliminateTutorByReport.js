// CAMBIAR
// En el futuro sería bueno crear una tabla adicional para poder guardar los pérfiles de los tutores eliminados
// y poder hacer un seguimiento de los tutores que han sido eliminados por reportes.
// Por ahora, se elimina el tutor de la base de datos.

const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');
const { sendEmailNotification } = require('../../../services/emailService');

async function getAdminUser(token) {
    return await db.User.findOne({
        where: { token },
        attributes: ['id'],
    });
}

async function getReportById(reportId) {
    return await db.ReportOfTutor.findOne({
        where: { id: reportId },
    });
}

async function addReportToHistory({ reportedByUserId, createdByUserId, handlerAdminUserId, decisionArgument }) {
    return await db.ReportHistoryOfTutors.create({
        reportedByUserId: reportedByUserId,
        createdByUserId: createdByUserId,
        handlerAdminUserId: handlerAdminUserId,
        status: 'Tutor eliminado',
        decisionArgument: decisionArgument,
    });
}

async function deleteTutorProfile(tutorId) {
    return await db.TutorProfile.destroy({
        where: { id: tutorId },
    });
}

async function deleteReport(reportId) {
    return await db.ReportOfTutor.destroy({
        where: { id: reportId },
    });
}

async function getUserById(userId) {
    return await db.User.findOne({
        where: { id: userId },
        attributes: ['email'],
    });
}

module.exports = async (ctx) => {
    try {
        const tokenAdmin = await checkAdmin(ctx);
        if (!tokenAdmin) {
            ctx.body = {
                message: 'User is not admin',
            };
            ctx.status = 401;
            return;
        }

        const { reportedByUserId, createdByUserId, reportId, decisionArgument } = ctx.request.body;

        const user = await getAdminUser(tokenAdmin.uid);
        if (!user) {
            ctx.body = {
                message: 'User not found',
            };
            ctx.status = 404;
            return;
        }

        const report = await getReportById(reportId);
        if (!report) {
            ctx.body = {
                message: 'Report not found',
            };
            ctx.status = 404;
            return;
        }

        await addReportToHistory({
            reportedByUserId,
            createdByUserId,
            handlerAdminUserId: user.id,
            status: 'Tutor eliminado',
            decisionArgument,
        });

        await deleteTutorProfile(report.tutorId);
        await deleteReport(reportId);

        const reportedUser = await getUserById(reportedByUserId);
        const createdUser = await getUserById(createdByUserId);

        if (createdUser && createdUser.email) {
            await sendEmailNotification(
                createdUser.email,
                'Perfil de tutor eliminado',
                'Tu perfil de tutor ha sido eliminado debido a un reporte.'
            );
        }

        if (reportedUser && reportedUser.email) {
            await sendEmailNotification(
                reportedUser.email,
                'Reporte manejado',
                'Tu reporte ha sido manejado y el perfil de tutor ha sido eliminado.'
            );
        }

        ctx.body = {
            message: 'Tutor and report handled successfully',
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to handle tutor and report',
            error: error.message,
        };
        ctx.status = 500;
    }
};

