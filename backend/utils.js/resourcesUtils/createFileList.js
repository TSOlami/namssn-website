import getUser from "./getUser.js";
const createFileList = async (response) => {
    const fileList = [];
    for (const resource of response) {
        try {
          var uploaderUsername = await getUser(resource.user.toString());
          uploaderUsername = uploaderUsername.name;
          const date = resource.updatedAt;
          const options = { day: 'numeric', month: 'short', year: '2-digit' };
          const formatter = new Intl.DateTimeFormat('en', options);
          const formattedDate = formatter.format(date);
          const fileDetails = {
            [resource.fileUrl]: {
              uploaderUsername: uploaderUsername,
              title: resource.title,
              description: resource.description,
              date: formattedDate,
              semester: resource.level,
              course: resource.course
            }
          };
          fileList.push(fileDetails);
        } catch (err) {
          console.log(err);
        }
      }
      return fileList;
}

export default createFileList;