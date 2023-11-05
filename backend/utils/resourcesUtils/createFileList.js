// creates a formatted list of files and their details
const createFileList = async (response) => {
    const fileList = [];
    for (const resource of response) {
        try {
          const date = resource.updatedAt;
          const options = { day: 'numeric', month: 'short', year: '2-digit' };
          const formatter = new Intl.DateTimeFormat('en', options);
          const formattedDate = formatter.format(date);
          const fileDetails = {
            [resource.fileUrl]: {
              uploaderUsername: resource.name,
              uploaderId: resource.user,
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