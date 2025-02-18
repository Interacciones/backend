const db = require('../../../models');
const checkVerifiedUser = require('../../authorization/checkVerifiedUser');
const { uploadFile }= require('../../../services/s3');

async function uploadProfilePicture(userId, photo) {
    const  id = userId
    try {
    
        if (!photo) {
            return null;
        }
        const image = photo;

        const image_key =  `tutor_${id}_profile_picture.jpg`

        const img_path = await uploadFile(image_key, image);

        console.log("img: \n\n", img_path);

        return img_path;


      } catch (error) {
        console.error('Error uploading Profile Picture: ', error);
      }
}

module.exports = async(ctx) => {
    try {
        const userToken = await checkVerifiedUser(ctx);
        const {description, priceDescription, courses, contactNumber, subjects} = ctx.request.body;
        const photo = ctx.request.files.photo;

        console.log("description", description);
        console.log("priceDescription", priceDescription);
        console.log("courses", courses);
        console.log("contactNumber", contactNumber);
        console.log("subjects", subjects);


        if (!userToken) {
            ctx.body = {
                message: 'User is not verified',
            };
            ctx.status = 401;
            return;
        }

        const user = await db.User.findOne({
            where : {token: userToken.uid},
        });

        let photoLink = "https://interac-ciones.s3.amazonaws.com/default.jpg" // DEFAULT;
        if(photo){
            console.log("photoLink", photoLink);
            photoLink = await uploadProfilePicture(user.id, photo)
            console.log(photoLink);
        } 

        const tutorProfile = await db.TutorProfile.create({
            userId: user.id,
            description,
            priceDescription,
            photo: photoLink,
            contactMail: user.email,
            isPublished: false,
        });
        ctx.body = {
            message: 'Tutor profile created successfully',
            data: tutorProfile,
        };
        ctx.status = 200;
    } catch (error) {
        console.error(error);
        ctx.body = {
            message: 'Failed to create tutor profile',
            error: error.message,
        };
        ctx.status = 500;
    }
}