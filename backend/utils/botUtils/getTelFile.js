import axios from 'axios';

const getTelFile = async (req, res) => {
    const filenameAndId = req.params.filename;
    const file_id = filenameAndId.split('+')[0]
    const file_name = filenameAndId.split('+')[1]
    console.log(file_name)
    const token = '6844885618:AAEtMYQRWmJK5teMpL8AY489J5Dr86B-12I';
    const base_url = `https://api.telegram.org/bot${token}`;
    try {
        const fileDetails = await axios.get(`${base_url}/getFile?file_id=${file_id}`);
        const file_path = fileDetails.data.result.file_path;
        // const file_path = 'documents/file_9.pdf'
        console.log(fileDetails, file_path)
        if (req?.query?.option === 'view') {
            const response = await axios.get(`https://api.telegram.org/file/bot6844885618:AAEtMYQRWmJK5teMpL8AY489J5Dr86B-12I/${file_path}`, { responseType: 'arraybuffer' })
            if (response.data) {
                res.setHeader('Content-Disposition', `attachment; filename="${file_name}"`);
                // console.log(response)
                return (Buffer.from(response.data, 'hex'))
            }
            // const objectUrl = `https://api.telegram.org/file/bot6844885618:AAEtMYQRWmJK5teMpL8AY489J5Dr86B-12I/${file_path}`;
            // res.setHeader('Content-Disposition', 'inline');
            // res.setHeader('Content-Type', 'application/pdf');
            // res.send(`<iframe src="${objectUrl}" width="100%" height="100%"></iframe>`);
        } else {
            const objectUrl = `https://api.telegram.org/file/bot6844885618:AAEtMYQRWmJK5teMpL8AY489J5Dr86B-12I/${file_path}`;
            console.log(objectUrl, "+++++")
            const response = await axios.get(`https://api.telegram.org/file/bot6844885618:AAEtMYQRWmJK5teMpL8AY489J5Dr86B-12I/${file_path}`, { responseType: 'arraybuffer' })
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