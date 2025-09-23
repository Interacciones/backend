const db = require('../../../models');

async function getCommentsThread(projectId) {
  const comments = await db.EntrepreneurProjectComment.findAll({
    where: { projectId },
    order: [['createdAt', 'ASC']],
    include: [{ model: db.User, attributes: ['id', 'name', 'lastName'] }]
  });

  const byId = new Map();
  const roots = [];

  for (const comment of comments) {
    const c = comment.toJSON();
    c.replies = [];
    byId.set(c.id, c);
  }

  for (const c of byId.values()) {
    if (c.parentCommentId && byId.has(c.parentCommentId)) {
      byId.get(c.parentCommentId).replies.push(c);
    } else if (!c.parentCommentId) {
      roots.push(c);
    }
  }

  return roots;
}

module.exports = async (ctx) => {
  try {
    const { projectId } = ctx.params;
    if (!projectId || isNaN(projectId)) {
      ctx.body = { message: 'Invalid project ID' };
      ctx.status = 400;
      return;
    }

    const project = await db.EntrepreuneurProject.findOne({ where: { id: projectId, isActive: true } });
    if (!project) {
      ctx.body = { message: 'Project not found or not active' };
      ctx.status = 404;
      return;
    }

    const thread = await getCommentsThread(projectId);
    ctx.body = { message: 'Comments fetched successfully', data: thread };
    ctx.status = 200;
  } catch (error) {
    console.error('Error fetching comments:', error);
    ctx.body = { message: 'Failed to fetch comments', error: error.message };
    ctx.status = 500;
  }
};




