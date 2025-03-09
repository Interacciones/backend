const db = require('../../../models');

module.exports = async (ctx) => {
    try {
        const getSubjects = async () => {
            return await db.StudySubjects.findAll({
                attributes: ['subject'],
            });
        };

        const subjects = await getSubjects();

        const subjectsList = subjects.map(subject => subject.subject).join(', ');

        ctx.body = {
            message: 'Subjects fetched successfully',
            data: subjectsList,
        };
        ctx.status = 200;

    }
    catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to fetch subjects',
            error: error.message,
        };
        ctx.status = 500;
    }
};