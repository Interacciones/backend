const checkAdmin = require('../../authorization/checkAdmin');
const db = require('../../../models');

module.exports = async (ctx) => {
  try {
    const { email, masterPassword } = ctx.request.body;

    // Validate required fields
    if (!email || !masterPassword) {
      ctx.body = {
        message: 'Email and master password are required',
      };
      ctx.status = 400;
      return;
    }

    // Check master password against environment variable
    const requiredMasterPassword = process.env.ADMIN_PROMOTION_PASSWORD;
    if (!requiredMasterPassword) {
      ctx.body = {
        message: 'Admin promotion is not configured on this server',
      };
      ctx.status = 500;
      return;
    }

    if (masterPassword !== requiredMasterPassword) {
      ctx.body = {
        message: 'Invalid master password',
      };
      ctx.status = 403;
      return;
    }

    // Find the user by email
    const user = await db.User.findOne({
      where: { email: email.toLowerCase().trim() }
    });

    if (!user) {
      ctx.body = {
        message: 'User not found',
      };
      ctx.status = 404;
      return;
    }

    // Check if user is already an admin
    const existingAdmin = await db.Admin.findOne({
      where: { userId: user.id }
    });

    if (existingAdmin) {
      ctx.body = {
        message: 'User is already an admin',
        data: {
          email: user.email,
          name: `${user.name} ${user.lastName}`,
          promotedAt: existingAdmin.createdAt
        }
      };
      ctx.status = 200;
      return;
    }

    // Create admin record
    const newAdmin = await db.Admin.create({
      userId: user.id
    });

    // Return success response
    ctx.body = {
      message: 'User successfully promoted to admin',
      data: {
        adminId: newAdmin.id,
        userId: user.id,
        email: user.email,
        name: `${user.name} ${user.lastName}`,
        promotedAt: newAdmin.createdAt
      }
    };
    ctx.status = 201;

  } catch (error) {
    console.error('Error promoting user to admin:', error);
    ctx.body = {
      message: 'Failed to promote user to admin',
      error: error.message,
    };
    ctx.status = 500;
  }
};
