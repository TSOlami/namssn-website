import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const getBotToken = () => (process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_BOT_TOKEN : process.env.BOT_TOKEN) || process.env.BOT_TOKEN;

const getTelFile = async (req, res) => {
  const filenameAndId = req.params.filename;
  if (!filenameAndId) return res.status(400).send('Missing filename');
  const parts = filenameAndId.split('+');
  const file_id = parts[0];
  const file_nameRaw = (parts.slice(1).join('+') || parts[1] || 'resource').trim();
  const file_name = (() => { try { return decodeURIComponent(file_nameRaw); } catch { return file_nameRaw; } })();
  const bot_token = getBotToken();
  if (!bot_token) return res.status(503).send('File service unavailable');
  const base_url = `https://api.telegram.org/bot${bot_token}`;
  try {
    const fileDetails = await axios.get(`${base_url}/getFile?file_id=${file_id}`);
    const file_path = fileDetails.data?.result?.file_path;
    if (!file_path) return res.status(404).send('File not found');
    const fileUrl = `https://api.telegram.org/file/bot${bot_token}/${file_path}`;
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    if (!response.data) return res.status(404).send('File not found');
    const disposition = req?.query?.option === 'view' ? 'inline' : 'attachment';
    res.setHeader('Content-Disposition', `${disposition}; filename="${file_name}"`);
    res.setHeader('Content-Type', response.headers['content-type'] || 'application/octet-stream');
    return res.send(Buffer.from(response.data));
  } catch (error) {
    if (error.response?.status === 404) return res.status(404).send('File not found');
    console.error('getTelFile error:', error.message);
    return res.status(500).send('Failed to fetch file');
  }
};

export default getTelFile;
