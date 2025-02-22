const db = require('../../../models');
const checkAdmin = require('../../authorization/checkAdmin');

async function getPendingTutorReports() {
    return await db.ReportOfTutor.findAll({
        where: { status: 'pending' },
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'userId', 'tutorId', 'description', 'status', 'createdAt'],
        include: [
            {
                model: db.User,
                as: 'User',
                attributes: ['name', 'lastName', 'email'],
            },
            {
                model: db.TutorProfile,
                as: 'TutorProfile',
                attributes: ['description', 'photo', 'priceDescription', 'contactNumber'],
            },
        ],
    });
}

function formatPendingTutorReports(reports) {
    return reports.map(report => ({
        id: report.id,
        userReporting: {
            name: report.User.name,
            lastName: report.User.lastName,
            email: report.User.email,
        },
        tutor: {
            description: report.TutorProfile.description,
            photo: report.TutorProfile.photo,
            priceDescription: report.TutorProfile.priceDescription,
            contactNumber: report.TutorProfile.contactNumber,
        },
        description: report.description,
        status: report.status,
        createdAt: report.createdAt,
    }));
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

        const pendingTutorReports = await getPendingTutorReports();
        const formattedReports = formatPendingTutorReports(pendingTutorReports);

        ctx.body = {
            message: 'Pending tutor reports fetched successfully',
            data: formattedReports,
        };
        ctx.status = 200;

    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch pending tutor reports',
            error: error.message,
        };
        ctx.status = 500;
    }
};