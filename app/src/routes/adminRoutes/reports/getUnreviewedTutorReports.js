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
                attributes: ['id', 'name', 'lastName', 'email'],
            },
            {
                model: db.TutorProfile,
                attributes: ['description', 'photo', 'priceDescription', 'contactNumber'],
                include: [
                    {
                        model: db.User,
                        attributes: ['id', 'name', 'lastName', 'email'],
                    },
                ],
            },
        ],
    });
}

function formatPendingTutorReports(reports) {
    return reports.map(report => ({
        id: report.id,
        userReporting: {
            id: report.User.id,
            name: report.User.name,
            lastName: report.User.lastName,
            email: report.User.email,
        },
        tutor: {
            id: report.TutorProfile.User.id,
            name: report.TutorProfile.User.name,
            lastName: report.TutorProfile.User.lastName,
            email: report.TutorProfile.User.email,
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