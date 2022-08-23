import axios from "axios";

const BASE_URL = `http://159.89.3.212:8860/api/v1/file/`;

export const _uploadProfile = async (file, address, type) => {
  const url = BASE_URL + "upload_images/" + address + "?type=" + type;
  try {
    const data = await axios.post(url, file);
    if (data.status === 200) {
      console.log(success);
    }
  } catch (error) {
    console.error(error.message);
  }
};

export const _getProfile = async (address, type) => {
  try {
    const data = await axios.get(
      BASE_URL + "image/" + address + "?type=" + type
    );
    if (data.status === 200) {
      return BASE_URL + "get_file_by_path/" + data.data;
    } else {
      throw data;
    }
  } catch (error) {
    console.error(error.message);
  }
};
