import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const bot_token = '6844885618:AAEtMYQRWmJK5teMpL8AY489J5Dr86B-12I';
const getTelFile = async (req, res) => {
    const filenameAndId = req.params.filename;
    const file_id = filenameAndId.split('+')[0]
    const file_name = filenameAndId.split('+')[1]
    console.log(file_name)
    const base_url = `https://api.telegram.org/bot${bot_token}`;
    try {
        const fileDetails = await axios.get(`${base_url}/getFile?file_id=${file_id}`);
        const file_path = fileDetails.data.result.file_path;
        // const file_path = 'documents/file_9.pdf'
        console.log(fileDetails, file_path)
        if (req?.query?.option === 'view') {
            const response = await axios.get(`https://api.telegram.org/file/bot${bot_token}/${file_path}`, { responseType: 'arraybuffer' })
            if (response.data) {
                res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
                // console.log(response)
                return (Buffer.from(response.data, 'hex'))
            }
        } else {
            const objectUrl = `https://api.telegram.org/file/bot${bot_token}/${file_path}`;
            const response = await axios.get(objectUrl, { responseType: 'arraybuffer' })
            if (response.data) {
                res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
                return(response.data)
        }
        }
    } catch (error) {
        console.log(error)
    }
}   

export default getTelFile;