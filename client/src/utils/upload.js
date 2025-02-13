// import axios from "axios";

// const upload = async(file) => {
//     const data = new FormData();
//     data.append("file", file);
//     data.append("upload_preset", "skillbridge");

//     try {
//         console.log.data;
//         const res = await axios.post(

//             import.meta.env.VITE_UPLOAD_LINK, data);

//         const { url } = res.data;
//         return url;
//     } catch (err) {
//         console.log(err);
//     }
// };

// export default upload;
import axios from "axios";

const upload = async(file) => {
    console.log("Upload Preset:",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    console.log("Cloud Name:",
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset",
        import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name",
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
        const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            data
        );

        if (res.data && res.data.secure_url) {
            console.log("File uploaded successfully:", res.data.secure_url);
            return res.data.secure_url;
        } else {
            throw new Error("Upload successful, but no URL returned");
        }
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
    }
};

export default upload;