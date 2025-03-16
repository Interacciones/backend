const db = require('../../../models');

module.exports = async (ctx) => {
    try {
        const getSubjects = async () => {
            return await db.StudySubjects.findAll({
                attributes: ['id', 'subject'], // Agregar el id del subject
            });
        };

        const subjects = await getSubjects();

        const subjectsList = subjects.map(subject => ({
            id: subject.id,
            subject: subject.subject
        }));

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